import { useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface Checkpoint {
  percent: number;
  label: string;
  icon: string;
  sound?: 'success' | 'milestone' | 'arrival';
}

// Enhanced checkpoint definitions with sound types
const CHECKPOINTS: Checkpoint[] = [
  { percent: 0, label: "Pickup Complete", icon: "🚚", sound: 'success' },
  { percent: 25, label: "25% Complete", icon: "📍", sound: 'milestone' },
  { percent: 50, label: "Halfway There!", icon: "🎯", sound: 'milestone' },
  { percent: 75, label: "Almost There!", icon: "🏁", sound: 'milestone' },
  { percent: 100, label: "Delivered!", icon: "✅", sound: 'arrival' },
];

interface UseCheckpointNotificationsOptions {
  isTracking: boolean;
  progress: number;
  destinationName?: string;
  totalDistance?: number;
  onCheckpointReached?: (checkpoint: Checkpoint) => void;
}

/**
 * Hook to manage checkpoint notifications during truck tracking
 * Shows toast notifications with visual effects at key milestones
 */
export function useCheckpointNotifications({
  isTracking,
  progress,
  destinationName,
  totalDistance,
  onCheckpointReached,
}: UseCheckpointNotificationsOptions) {
  const passedCheckpoints = useRef<Set<number>>(new Set());
  const notificationQueue = useRef<Checkpoint[]>([]);
  const isProcessing = useRef(false);

  // Play notification sound (browser audio)
  const playNotificationSound = useCallback((type: 'success' | 'milestone' | 'arrival') => {
    try {
      // Create audio context for notification sounds
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Different frequencies for different notification types
      switch (type) {
        case 'success':
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
          break;
        case 'milestone':
          oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
          oscillator.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1); // C#5
          break;
        case 'arrival':
          oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
          oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
          break;
      }
      
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Silently fail if audio isn't available
    }
  }, []);

  // Process notification queue with staggered display
  const processQueue = useCallback(async () => {
    if (isProcessing.current || notificationQueue.current.length === 0) return;
    
    isProcessing.current = true;
    
    while (notificationQueue.current.length > 0) {
      const checkpoint = notificationQueue.current.shift();
      if (!checkpoint) continue;
      
      // Play sound
      if (checkpoint.sound) {
        playNotificationSound(checkpoint.sound);
      }
      
      // Show toast with enhanced styling
      const isDelivered = checkpoint.percent === 100;
      const description = isDelivered
        ? `Your shipment has arrived at ${destinationName || 'destination'}! 🎉`
        : totalDistance
          ? `${Math.round((checkpoint.percent / 100) * totalDistance)} of ${Math.round(totalDistance)} miles complete`
          : `Shipment progress: ${checkpoint.percent}%`;
      
      toast.success(`${checkpoint.icon} ${checkpoint.label}`, {
        description,
        duration: isDelivered ? 6000 : 4000,
      });
      
      // Callback for external handling
      onCheckpointReached?.(checkpoint);
      
      // Stagger notifications
      if (notificationQueue.current.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    isProcessing.current = false;
  }, [destinationName, totalDistance, playNotificationSound, onCheckpointReached]);

  // Check for checkpoint triggers
  useEffect(() => {
    if (!isTracking) return;
    
    CHECKPOINTS.forEach((checkpoint) => {
      if (progress >= checkpoint.percent && !passedCheckpoints.current.has(checkpoint.percent)) {
        passedCheckpoints.current.add(checkpoint.percent);
        notificationQueue.current.push(checkpoint);
      }
    });
    
    processQueue();
  }, [progress, isTracking, processQueue]);

  // Reset when tracking stops
  const resetCheckpoints = useCallback(() => {
    passedCheckpoints.current = new Set();
    notificationQueue.current = [];
    isProcessing.current = false;
  }, []);

  return {
    passedCheckpoints: passedCheckpoints.current,
    resetCheckpoints,
    checkpointCount: CHECKPOINTS.length,
    passedCount: passedCheckpoints.current.size,
  };
}
