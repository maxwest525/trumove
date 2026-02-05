import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CallData {
  id: string;
  agent_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  call_type: string;
  status: 'active' | 'completed' | 'missed' | 'transferred';
  outcome: 'booked' | 'follow_up' | 'lost' | 'no_answer' | 'callback_scheduled' | null;
  duration_seconds: number;
  started_at: string;
  ended_at: string | null;
  notes: string | null;
  transcript: string | null;
  detected_keywords: string[];
  coaching_prompts_shown: string[];
  talk_tracks_used: string[];
  sentiment_score: number | null;
}

export interface CoachingEvent {
  id?: string;
  call_id: string;
  event_type: string;
  keyword_detected?: string;
  prompt_shown?: string;
  talk_track_id?: string;
  agent_action?: string;
  timestamp: Date;
}

export function useCallTracking() {
  const [currentCall, setCurrentCall] = useState<CallData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [callHistory, setCallHistory] = useState<CallData[]>([]);

  // Start a new call
  const startCall = useCallback(async (customerName?: string, customerPhone?: string): Promise<CallData | null> => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const newCall = {
        agent_id: userData.user?.id || null,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        call_type: 'inbound',
        status: 'active' as const,
        started_at: new Date().toISOString(),
        detected_keywords: [],
        coaching_prompts_shown: [],
        talk_tracks_used: [],
      };

      const { data, error } = await supabase
        .from('calls')
        .insert(newCall)
        .select()
        .single();

      if (error) {
        console.error('Error starting call:', error);
        return null;
      }

      const callData: CallData = {
        ...data,
        status: data.status as CallData['status'],
        outcome: data.outcome as CallData['outcome'],
        detected_keywords: data.detected_keywords || [],
        coaching_prompts_shown: data.coaching_prompts_shown || [],
        talk_tracks_used: data.talk_tracks_used || [],
      };

      setCurrentCall(callData);
      return callData;
    } catch (err) {
      console.error('Error starting call:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // End the current call
  const endCall = useCallback(async (
    outcome: CallData['outcome'],
    notes?: string
  ): Promise<boolean> => {
    if (!currentCall) return false;

    setIsLoading(true);
    try {
      const endedAt = new Date();
      const startedAt = new Date(currentCall.started_at);
      const durationSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);

      const { error } = await supabase
        .from('calls')
        .update({
          status: 'completed' as const,
          outcome,
          ended_at: endedAt.toISOString(),
          duration_seconds: durationSeconds,
          notes,
        })
        .eq('id', currentCall.id);

      if (error) {
        console.error('Error ending call:', error);
        return false;
      }

      setCurrentCall(null);
      return true;
    } catch (err) {
      console.error('Error ending call:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentCall]);

  // Record a detected keyword
  const recordKeyword = useCallback(async (keyword: string): Promise<boolean> => {
    if (!currentCall) return false;

    try {
      const updatedKeywords = [...currentCall.detected_keywords, keyword];
      
      const { error } = await supabase
        .from('calls')
        .update({ detected_keywords: updatedKeywords })
        .eq('id', currentCall.id);

      if (error) {
        console.error('Error recording keyword:', error);
        return false;
      }

      setCurrentCall(prev => prev ? { ...prev, detected_keywords: updatedKeywords } : null);
      return true;
    } catch (err) {
      console.error('Error recording keyword:', err);
      return false;
    }
  }, [currentCall]);

  // Record coaching prompt shown
  const recordCoachingPrompt = useCallback(async (promptId: string): Promise<boolean> => {
    if (!currentCall) return false;

    try {
      const updatedPrompts = [...currentCall.coaching_prompts_shown, promptId];
      
      const { error } = await supabase
        .from('calls')
        .update({ coaching_prompts_shown: updatedPrompts })
        .eq('id', currentCall.id);

      if (error) {
        console.error('Error recording prompt:', error);
        return false;
      }

      setCurrentCall(prev => prev ? { ...prev, coaching_prompts_shown: updatedPrompts } : null);
      return true;
    } catch (err) {
      console.error('Error recording prompt:', err);
      return false;
    }
  }, [currentCall]);

  // Record talk track used
  const recordTalkTrackUsed = useCallback(async (talkTrackId: string): Promise<boolean> => {
    if (!currentCall) return false;

    try {
      const updatedTracks = [...currentCall.talk_tracks_used, talkTrackId];
      
      const { error } = await supabase
        .from('calls')
        .update({ talk_tracks_used: updatedTracks })
        .eq('id', currentCall.id);

      if (error) {
        console.error('Error recording talk track:', error);
        return false;
      }

      setCurrentCall(prev => prev ? { ...prev, talk_tracks_used: updatedTracks } : null);
      return true;
    } catch (err) {
      console.error('Error recording talk track:', err);
      return false;
    }
  }, [currentCall]);

  // Log a coaching event
  const logCoachingEvent = useCallback(async (event: Omit<CoachingEvent, 'id'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('call_coaching_events')
        .insert({
          call_id: event.call_id,
          event_type: event.event_type,
          keyword_detected: event.keyword_detected,
          prompt_shown: event.prompt_shown,
          talk_track_id: event.talk_track_id,
          agent_action: event.agent_action,
          timestamp: event.timestamp.toISOString(),
        });

      if (error) {
        console.error('Error logging coaching event:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error logging coaching event:', err);
      return false;
    }
  }, []);

  // Fetch call history
  const fetchCallHistory = useCallback(async (limit = 50): Promise<CallData[]> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching call history:', error);
        return [];
      }

      const calls: CallData[] = (data || []).map(call => ({
        ...call,
        status: call.status as CallData['status'],
        outcome: call.outcome as CallData['outcome'],
        detected_keywords: call.detected_keywords || [],
        coaching_prompts_shown: call.coaching_prompts_shown || [],
        talk_tracks_used: call.talk_tracks_used || [],
      }));

      setCallHistory(calls);
      return calls;
    } catch (err) {
      console.error('Error fetching call history:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentCall,
    isLoading,
    callHistory,
    startCall,
    endCall,
    recordKeyword,
    recordCoachingPrompt,
    recordTalkTrackUsed,
    logCoachingEvent,
    fetchCallHistory,
  };
}
