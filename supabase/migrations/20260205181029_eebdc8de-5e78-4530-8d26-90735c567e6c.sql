-- Create profiles table for agent/manager info
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('agent', 'manager', 'admin')),
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  is_group BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Conversation memberships
CREATE TABLE public.conversation_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Read receipts
CREATE TABLE public.read_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(message_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.read_receipts ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is member of a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_member(conv_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_memberships
    WHERE conversation_id = conv_id AND user_id = auth.uid()
  )
$$;

-- Helper function: Check if user is conversation creator
CREATE OR REPLACE FUNCTION public.is_conversation_creator(conv_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = conv_id AND created_by = auth.uid()
  )
$$;

-- Profiles policies (public read for team directory)
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Conversations policies
CREATE POLICY "Users can view conversations they are members of"
ON public.conversations FOR SELECT TO authenticated
USING (public.is_conversation_member(id));

CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Members can update conversation"
ON public.conversations FOR UPDATE TO authenticated
USING (public.is_conversation_member(id));

CREATE POLICY "Creator can delete conversation"
ON public.conversations FOR DELETE TO authenticated
USING (created_by = auth.uid());

-- Conversation memberships policies
CREATE POLICY "Members can view memberships"
ON public.conversation_memberships FOR SELECT TO authenticated
USING (public.is_conversation_member(conversation_id));

CREATE POLICY "Creator can add members"
ON public.conversation_memberships FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.created_by = auth.uid())
  OR user_id = auth.uid()
);

CREATE POLICY "Users can leave conversations"
ON public.conversation_memberships FOR DELETE TO authenticated
USING (user_id = auth.uid() OR public.is_conversation_creator(conversation_id));

-- Messages policies
CREATE POLICY "Members can view messages"
ON public.messages FOR SELECT TO authenticated
USING (public.is_conversation_member(conversation_id));

CREATE POLICY "Members can send messages"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
  public.is_conversation_member(conversation_id) 
  AND sender_id = auth.uid()
);

CREATE POLICY "Sender can update message"
ON public.messages FOR UPDATE TO authenticated
USING (sender_id = auth.uid());

CREATE POLICY "Sender can delete message"
ON public.messages FOR DELETE TO authenticated
USING (sender_id = auth.uid());

-- Read receipts policies
CREATE POLICY "Members can view read receipts"
ON public.read_receipts FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.messages m 
    WHERE m.id = message_id 
    AND public.is_conversation_member(m.conversation_id)
  )
);

CREATE POLICY "Users can create own read receipts"
ON public.read_receipts FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own read receipts"
ON public.read_receipts FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- Enable realtime for messages and conversations
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_memberships;

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();