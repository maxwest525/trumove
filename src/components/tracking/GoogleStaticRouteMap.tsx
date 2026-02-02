import { useState, useEffect, useMemo } from "react";
import { Loader2, MapPin, AlertTriangle, RefreshCw, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWebGLDiagnostics, getWebGLStatusMessage, type WebGLDiagnostics } from "@/lib/webglDiagnostics";

interface GoogleStaticRouteMapProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  progress?: number;
  isTracking?: boolean;
  googleApiKey: string;
  routePolyline?: string; // Encoded polyline from Google Routes API
  truckPosition?: [number, number] | null;
  originName?: string;
  destName?: string;
}

export function GoogleStaticRouteMap({
  originCoords,
  destCoords,
  progress = 0,
  isTracking = false,
  googleApiKey,
  routePolyline,
  truckPosition,
  originName,
  destName
}: GoogleStaticRouteMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [diagnostics, setDiagnostics] = useState<WebGLDiagnostics | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    setDiagnostics(getWebGLDiagnostics());
  }, []);

  // Build Google Static Maps URL
  const mapUrl = useMemo(() => {
    if (!originCoords || !destCoords) return null;

    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    const params = new URLSearchParams({
      size: '800x600',
      scale: '2', // Retina display
      maptype: 'roadmap',
      key: googleApiKey,
      style: 'feature:all|saturation:-30' // Slightly desaturated for modern look
    });

    // Calculate center and zoom to fit both points
    const centerLat = (originCoords[1] + destCoords[1]) / 2;
    const centerLng = (originCoords[0] + destCoords[0]) / 2;

    let url = `${baseUrl}?${params.toString()}`;
    url += `&center=${centerLat},${centerLng}`;

    // Origin marker (green)
    url += `&markers=color:0x22c55e|label:A|${originCoords[1]},${originCoords[0]}`;
    
    // Destination marker (red)
    url += `&markers=color:0xef4444|label:B|${destCoords[1]},${destCoords[0]}`;
    
    // Truck position marker (blue)
    if (truckPosition && isTracking) {
      url += `&markers=color:0x3b82f6|label:T|${truckPosition[1]},${truckPosition[0]}`;
    }

    // Add route path
    if (routePolyline) {
      // Use encoded polyline from Google Routes API
      url += `&path=color:0x22c55e80|weight:5|enc:${encodeURIComponent(routePolyline)}`;
    } else {
      // Fallback: straight line between origin and destination
      url += `&path=color:0x22c55e80|weight:5|${originCoords[1]},${originCoords[0]}|${destCoords[1]},${destCoords[0]}`;
    }

    return url;
  }, [originCoords, destCoords, googleApiKey, routePolyline, truckPosition, isTracking, retryCount]);
  
  // Handle retry
  const handleRetry = () => {
    setImageError(false);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
  };

  // Empty state when no coordinates
  if (!originCoords || !destCoords) {
    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-muted to-muted/70">
        {/* Empty state skeleton */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{ 
            backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
          
          {/* Placeholder route */}
          <svg className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="none">
            <path 
              d="M 80 400 Q 200 250 350 220 T 600 120" 
              fill="none" 
              stroke="hsl(var(--primary))" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="12 8"
            />
          </svg>
        </div>
        
        {/* Centered prompt */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-background/60 backdrop-blur-sm rounded-xl px-8 py-6 border border-border">
            <MapPin className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Enter origin and destination</p>
            <p className="text-xs text-muted-foreground mt-1">to view the route map</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-background">
      {/* Loading skeleton overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/70 z-10 overflow-hidden">
          {/* Animated skeleton elements mimicking a map */}
          <div className="absolute inset-0">
            {/* Grid pattern skeleton */}
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
            
            {/* Fake route path */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path 
                d="M 80 420 Q 200 300 350 280 T 600 150" 
                fill="none" 
                stroke="hsl(var(--primary) / 0.25)" 
                strokeWidth="6" 
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
            
            {/* Origin marker skeleton */}
            <div className="absolute top-[70%] left-[10%] flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-primary/30 animate-pulse" />
              <div className="w-16 h-3 rounded bg-muted-foreground/20 animate-pulse" />
            </div>
            
            {/* Destination marker skeleton */}
            <div className="absolute top-[25%] right-[15%] flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-destructive/30 animate-pulse delay-100" />
              <div className="w-20 h-3 rounded bg-muted-foreground/20 animate-pulse delay-100" />
            </div>
          </div>
          
          {/* Center loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-background/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-border shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">Loading map</p>
              <p className="text-xs text-muted-foreground mt-1">Fetching route data...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
          <div className="text-center p-6">
            <AlertTriangle className="w-12 h-12 text-destructive/60 mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground mb-2">Unable to load map</p>
            <p className="text-xs text-muted-foreground mb-4">Please check your connection</p>
            <button 
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        </div>
      )}
      
      {/* WebGL Warning Banner */}
      {diagnostics && diagnostics.warnings.length > 0 && (
        <div className="absolute top-3 left-3 right-3 z-20 bg-destructive text-destructive-foreground px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="flex-1">{getWebGLStatusMessage()}</span>
        </div>
      )}
      
      {/* Status chips */}
      <div className={cn(
        "absolute z-20 flex gap-2",
        diagnostics?.warnings.length ? "top-14 left-3" : "top-3 left-3"
      )}>
        {isTracking && (
          <>
            <span className="px-2.5 py-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
              LIVE
            </span>
            <span className="px-2.5 py-1.5 rounded-full bg-foreground text-background text-[10px] font-bold shadow-lg">
              STATIC MODE
            </span>
          </>
        )}
      </div>

      {/* Route info overlay */}
      {(originName || destName) && (
        <div className="absolute top-3 right-3 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg max-w-xs">
          <div className="flex items-start gap-2 text-xs">
            <Navigation className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{originName || 'Origin'}</p>
              <p className="text-muted-foreground">→</p>
              <p className="font-medium text-foreground truncate">{destName || 'Destination'}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      {isTracking && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="px-5 py-2.5 bg-foreground text-background backdrop-blur-md border border-border rounded-full shadow-lg">
            <span className="text-sm font-bold">{Math.round(progress)}% Complete</span>
          </div>
        </div>
      )}

      {/* Google attribution */}
      <div className="absolute bottom-3 left-3 z-20">
        <span className="text-[9px] text-foreground/40 bg-background/60 px-2 py-1 rounded">
          © Google Maps
        </span>
      </div>
      
      {/* Static map image */}
      {mapUrl && (
        <img
          src={mapUrl}
          alt="Route map"
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setImageError(true); }}
        />
      )}
    </div>
  );
}
