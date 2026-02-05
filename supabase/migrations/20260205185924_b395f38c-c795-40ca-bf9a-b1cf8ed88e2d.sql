-- Create call status enum
CREATE TYPE public.call_status AS ENUM ('active', 'completed', 'missed', 'transferred');

-- Create call outcome enum
CREATE TYPE public.call_outcome AS ENUM ('booked', 'follow_up', 'lost', 'no_answer', 'callback_scheduled');

-- Create calls table for tracking agent performance
CREATE TABLE public.calls (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT,
    customer_phone TEXT,
    call_type TEXT DEFAULT 'inbound',
    status call_status DEFAULT 'active',
    outcome call_outcome,
    duration_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ended_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    transcript TEXT,
    detected_keywords TEXT[],
    coaching_prompts_shown TEXT[],
    talk_tracks_used TEXT[],
    sentiment_score NUMERIC(3,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create call_coaching_events table for granular coaching tracking
CREATE TABLE public.call_coaching_events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id UUID REFERENCES public.calls(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    keyword_detected TEXT,
    prompt_shown TEXT,
    talk_track_id TEXT,
    agent_action TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent_coaching_stats table for aggregate performance
CREATE TABLE public.agent_coaching_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_calls INTEGER DEFAULT 0,
    avg_call_duration INTEGER DEFAULT 0,
    conversion_rate NUMERIC(5,2) DEFAULT 0,
    avg_sentiment_score NUMERIC(3,2),
    keywords_handled INTEGER DEFAULT 0,
    talk_tracks_used INTEGER DEFAULT 0,
    coaching_score NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(agent_id, period_start, period_end)
);

-- Enable RLS on all tables
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_coaching_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_coaching_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for calls
CREATE POLICY "Agents can view their own calls"
ON public.calls FOR SELECT
USING (agent_id = auth.uid());

CREATE POLICY "Agents can insert their own calls"
ON public.calls FOR INSERT
WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update their own calls"
ON public.calls FOR UPDATE
USING (agent_id = auth.uid());

-- RLS policies for call_coaching_events
CREATE POLICY "Users can view coaching events for their calls"
ON public.call_coaching_events FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.calls
    WHERE calls.id = call_coaching_events.call_id
    AND calls.agent_id = auth.uid()
));

CREATE POLICY "Users can insert coaching events for their calls"
ON public.call_coaching_events FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.calls
    WHERE calls.id = call_coaching_events.call_id
    AND calls.agent_id = auth.uid()
));

-- RLS policies for agent_coaching_stats
CREATE POLICY "Agents can view their own stats"
ON public.agent_coaching_stats FOR SELECT
USING (agent_id = auth.uid());

CREATE POLICY "Agents can insert their own stats"
ON public.agent_coaching_stats FOR INSERT
WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Agents can update their own stats"
ON public.agent_coaching_stats FOR UPDATE
USING (agent_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_calls_updated_at
BEFORE UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_coaching_stats_updated_at
BEFORE UPDATE ON public.agent_coaching_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for calls table
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;