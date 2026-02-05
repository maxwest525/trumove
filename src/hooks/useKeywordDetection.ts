import { useState, useCallback, useMemo } from "react";
import { TalkTrack, DEMO_TALK_TRACKS } from "@/components/coaching/types";

export interface KeywordPattern {
  id: string;
  keywords: string[];
  talkTrackId: string;
  priority: 'high' | 'medium' | 'low';
  category: 'objection' | 'upsell' | 'compliance' | 'closing';
}

export interface DetectedKeyword {
  pattern: KeywordPattern;
  matchedKeyword: string;
  timestamp: Date;
  talkTrack: TalkTrack | undefined;
}

// Keyword patterns that map to talk tracks
export const KEYWORD_PATTERNS: KeywordPattern[] = [
  // Price objections
  {
    id: 'price-objection',
    keywords: ['too expensive', 'too much', 'can\'t afford', 'cheaper', 'lower price', 'discount', 'better deal', 'cost too much', 'out of budget', 'over budget'],
    talkTrackId: 'obj-1',
    priority: 'high',
    category: 'objection'
  },
  // Delay objections
  {
    id: 'delay-objection',
    keywords: ['think about it', 'not sure', 'need time', 'call back later', 'get back to you', 'need to discuss', 'talk to spouse', 'talk to partner', 'let me think'],
    talkTrackId: 'obj-2',
    priority: 'high',
    category: 'objection'
  },
  // Competition objections
  {
    id: 'competition-objection',
    keywords: ['comparing quotes', 'other quotes', 'other companies', 'shopping around', 'different mover', 'another estimate', 'competitors', 'other options'],
    talkTrackId: 'obj-3',
    priority: 'high',
    category: 'objection'
  },
  // Packing interest
  {
    id: 'packing-interest',
    keywords: ['packing service', 'pack my stuff', 'help packing', 'professional packing', 'pack for me', 'fragile items', 'delicate items', 'how do you pack'],
    talkTrackId: 'up-1',
    priority: 'medium',
    category: 'upsell'
  },
  // Insurance/valuation interest
  {
    id: 'insurance-interest',
    keywords: ['insurance', 'coverage', 'protection', 'damaged', 'if something breaks', 'valuable items', 'antiques', 'expensive furniture', 'heirlooms'],
    talkTrackId: 'up-2',
    priority: 'medium',
    category: 'upsell'
  },
  // Compliance triggers
  {
    id: 'binding-estimate',
    keywords: ['final price', 'guaranteed price', 'price change', 'additional charges', 'hidden fees', 'extra costs', 'binding', 'estimate'],
    talkTrackId: 'comp-1',
    priority: 'high',
    category: 'compliance'
  },
  // Trust concerns
  {
    id: 'trust-concerns',
    keywords: ['scam', 'trust', 'reliable', 'reviews', 'reputation', 'how long in business', 'licensed', 'insured', 'legitimate', 'rip off', 'bbb'],
    talkTrackId: 'obj-3',
    priority: 'high',
    category: 'objection'
  },
  // Timeline urgency
  {
    id: 'timeline-urgency',
    keywords: ['rush', 'urgent', 'asap', 'last minute', 'next week', 'soon as possible', 'emergency move', 'quick'],
    talkTrackId: 'obj-2',
    priority: 'medium',
    category: 'closing'
  },
];

export function useKeywordDetection() {
  const [detectedKeywords, setDetectedKeywords] = useState<DetectedKeyword[]>([]);
  const [dismissedPatterns, setDismissedPatterns] = useState<Set<string>>(new Set());

  const talkTracksMap = useMemo(() => {
    return new Map(DEMO_TALK_TRACKS.map(track => [track.id, track]));
  }, []);

  const detectKeywords = useCallback((text: string): DetectedKeyword[] => {
    const lowerText = text.toLowerCase();
    const newDetections: DetectedKeyword[] = [];

    for (const pattern of KEYWORD_PATTERNS) {
      // Skip if already dismissed in this session
      if (dismissedPatterns.has(pattern.id)) continue;

      for (const keyword of pattern.keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
          const talkTrack = talkTracksMap.get(pattern.talkTrackId);
          newDetections.push({
            pattern,
            matchedKeyword: keyword,
            timestamp: new Date(),
            talkTrack
          });
          break; // Only one detection per pattern
        }
      }
    }

    if (newDetections.length > 0) {
      setDetectedKeywords(prev => {
        // Avoid duplicates - only add if pattern not already detected
        const existingPatternIds = new Set(prev.map(d => d.pattern.id));
        const uniqueNew = newDetections.filter(d => !existingPatternIds.has(d.pattern.id));
        return [...prev, ...uniqueNew];
      });
    }

    return newDetections;
  }, [dismissedPatterns, talkTracksMap]);

  const dismissKeyword = useCallback((patternId: string) => {
    setDismissedPatterns(prev => new Set([...prev, patternId]));
    setDetectedKeywords(prev => prev.filter(d => d.pattern.id !== patternId));
  }, []);

  const clearDetections = useCallback(() => {
    setDetectedKeywords([]);
    setDismissedPatterns(new Set());
  }, []);

  const activeDetections = useMemo(() => {
    return detectedKeywords.filter(d => !dismissedPatterns.has(d.pattern.id));
  }, [detectedKeywords, dismissedPatterns]);

  const highPriorityDetections = useMemo(() => {
    return activeDetections.filter(d => d.pattern.priority === 'high');
  }, [activeDetections]);

  return {
    detectedKeywords: activeDetections,
    highPriorityDetections,
    detectKeywords,
    dismissKeyword,
    clearDetections,
    allPatterns: KEYWORD_PATTERNS
  };
}
