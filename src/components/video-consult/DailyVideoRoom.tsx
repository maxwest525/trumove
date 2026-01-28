import { useEffect, useRef, useState, useCallback } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { Loader2, Video, VideoOff, Mic, MicOff, PhoneOff, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DailyVideoRoomProps {
  roomUrl: string | null;
  userName?: string;
  onLeave?: () => void;
  className?: string;
}

export function DailyVideoRoom({ roomUrl, userName = "Guest", onLeave, className }: DailyVideoRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callRef = useRef<DailyCall | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinRoom = useCallback(async () => {
    if (!roomUrl || !containerRef.current) return;
    
    setIsJoining(true);
    setError(null);

    try {
      // Destroy any existing call
      if (callRef.current) {
        await callRef.current.destroy();
      }

      // Create new Daily call with embedded iframe
      const call = DailyIframe.createFrame(containerRef.current, {
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "0",
          borderRadius: "12px",
        },
        showLeaveButton: false,
        showFullscreenButton: false,
      });

      callRef.current = call;

      // Set up event listeners
      call.on("joined-meeting", () => {
        setIsJoining(false);
        setIsJoined(true);
      });

      call.on("left-meeting", () => {
        setIsJoined(false);
        onLeave?.();
      });

      call.on("error", (e) => {
        console.error("Daily error:", e);
        setError("Failed to connect to video room");
        setIsJoining(false);
      });

      // Join the room
      await call.join({
        url: roomUrl,
        userName,
      });
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Failed to join video room");
      setIsJoining(false);
    }
  }, [roomUrl, userName, onLeave]);

  const leaveRoom = useCallback(async () => {
    if (callRef.current) {
      await callRef.current.leave();
      await callRef.current.destroy();
      callRef.current = null;
    }
    setIsJoined(false);
    onLeave?.();
  }, [onLeave]);

  const toggleCamera = useCallback(() => {
    if (callRef.current) {
      callRef.current.setLocalVideo(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  }, [isCameraOn]);

  const toggleMic = useCallback(() => {
    if (callRef.current) {
      callRef.current.setLocalAudio(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  }, [isMicOn]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callRef.current) {
        callRef.current.destroy();
      }
    };
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!roomUrl) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-gradient-to-b from-muted/30 to-muted/50 min-h-[400px]",
        className
      )}>
        <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Your video room will appear here once the session is scheduled and confirmed.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-border/60 bg-card", className)}>
      {/* Video container */}
      <div 
        ref={containerRef} 
        className="w-full aspect-video bg-gradient-to-b from-muted/40 to-muted/60 min-h-[400px]"
      >
        {!isJoined && !isJoining && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
              <Video className="w-8 h-8 text-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Ready to join your video consult?</p>
            <Button onClick={joinRoom} className="gap-2">
              <Video className="w-4 h-4" />
              Join Video Room
            </Button>
          </div>
        )}

        {isJoining && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Connecting to video room...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-sm text-destructive mb-4">{error}</p>
            <Button onClick={joinRoom} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Controls overlay */}
      {isJoined && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 shadow-lg">
          <Button
            size="icon"
            variant={isCameraOn ? "ghost" : "destructive"}
            onClick={toggleCamera}
            className="rounded-full h-10 w-10"
          >
            {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </Button>
          
          <Button
            size="icon"
            variant={isMicOn ? "ghost" : "destructive"}
            onClick={toggleMic}
            className="rounded-full h-10 w-10"
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </Button>

          <div className="w-px h-6 bg-border/60" />

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFullscreen}
            className="rounded-full h-10 w-10"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={leaveRoom}
            className="rounded-full h-10 w-10"
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
