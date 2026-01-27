import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouteRequest {
  origin: { lat: number; lng: number } | string;
  destination: { lat: number; lng: number } | string;
  departureTime?: string; // ISO 8601 format
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  computeAlternatives?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use dedicated Routes API key if available, fallback to general Maps key
    const GOOGLE_ROUTES_API_KEY = Deno.env.get('GOOGLE_ROUTES_API_KEY') || Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_ROUTES_API_KEY) {
      console.error('GOOGLE_ROUTES_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Google Routes API not configured', fallback: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { origin, destination, departureTime, avoidTolls, avoidHighways, computeAlternatives } = await req.json() as RouteRequest;

    if (!origin || !destination) {
      return new Response(
        JSON.stringify({ error: 'Origin and destination are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calculating route: ${JSON.stringify(origin)} → ${JSON.stringify(destination)}`);

    // Format waypoints for Routes API
    const formatWaypoint = (point: { lat: number; lng: number } | string) => {
      if (typeof point === 'string') {
        return { address: point };
      }
      return {
        location: {
          latLng: {
            latitude: point.lat,
            longitude: point.lng,
          },
        },
      };
    };

    // Build route modifiers
    const routeModifiers: Record<string, boolean> = {};
    if (avoidTolls) routeModifiers.avoidTolls = true;
    if (avoidHighways) routeModifiers.avoidHighways = true;

    // Call Google Routes API (v2)
    // Note: departureTime must be in the future for traffic-aware routing
    const now = new Date();
    const futureTime = new Date(now.getTime() + 60000); // 1 minute in future
    const routeDepartureTime = departureTime ? new Date(departureTime) : futureTime;
    // Ensure it's in the future
    const validDepartureTime = routeDepartureTime > now ? routeDepartureTime : futureTime;
    
    const routeRequest = {
      origin: formatWaypoint(origin),
      destination: formatWaypoint(destination),
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
      computeAlternativeRoutes: computeAlternatives || false,
      routeModifiers: Object.keys(routeModifiers).length > 0 ? routeModifiers : undefined,
      departureTime: validDepartureTime.toISOString(),
      languageCode: 'en-US',
      units: 'IMPERIAL',
    };

    const response = await fetch(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_ROUTES_API_KEY,
          'X-Goog-FieldMask': 'routes.duration,routes.staticDuration,routes.distanceMeters,routes.polyline,routes.legs,routes.travelAdvisory,routes.routeLabels,routes.description',
        },
        body: JSON.stringify(routeRequest),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Routes API error: ${response.status}`, errorText);
      
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ 
            error: 'Routes API not enabled', 
            details: 'Please enable the Routes API in Google Cloud Console',
            fallback: true
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to calculate route', fallback: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No route found between locations' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process all routes (primary + alternates)
    const processRoute = (route: any, index: number) => {
      const leg = route.legs?.[0];
      
      // Parse durations (format: "XXXs" where XXX is seconds)
      const durationSeconds = parseInt(route.duration?.replace('s', '') || '0');
      const staticDurationSeconds = parseInt(route.staticDuration?.replace('s', '') || '0');
      const distanceMeters = route.distanceMeters || 0;
      const distanceMiles = distanceMeters / 1609.34;

      // Calculate traffic delay
      const trafficDelaySeconds = durationSeconds - staticDurationSeconds;
      const hasTrafficDelay = trafficDelaySeconds > 120; // More than 2 min delay

      // Extract toll info if available
      const travelAdvisory = route.travelAdvisory || {};
      const tollInfo = travelAdvisory.tollInfo || null;

      // Calculate ETA
      const departureDate = departureTime ? new Date(departureTime) : new Date();
      const etaDate = new Date(departureDate.getTime() + durationSeconds * 1000);

      // Get route labels (e.g., "FUEL_EFFICIENT", "TOLL_FREE")
      const routeLabels = route.routeLabels || [];

      return {
        index,
        description: route.description || `Route ${index + 1}`,
        distanceMeters,
        distanceMiles: Math.round(distanceMiles * 10) / 10,
        durationSeconds,
        staticDurationSeconds,
        durationMinutes: Math.round(durationSeconds / 60),
        durationFormatted: formatDuration(durationSeconds),
        polyline: route.polyline?.encodedPolyline || null,
        eta: etaDate.toISOString(),
        etaFormatted: etaDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        labels: routeLabels,
        traffic: {
          delaySeconds: trafficDelaySeconds,
          delayMinutes: Math.round(trafficDelaySeconds / 60),
          delayFormatted: trafficDelaySeconds > 60 ? formatDuration(trafficDelaySeconds) : 'No delay',
          hasDelay: hasTrafficDelay,
          severity: trafficDelaySeconds > 1800 ? 'high' : trafficDelaySeconds > 600 ? 'medium' : 'low',
        },
        tolls: tollInfo ? {
          hasTolls: true,
          estimatedPrice: tollInfo.estimatedPrice?.[0]?.units 
            ? `$${tollInfo.estimatedPrice[0].units}.${String(tollInfo.estimatedPrice[0].nanos || 0).padStart(2, '0').slice(0, 2)}`
            : null,
          currency: tollInfo.estimatedPrice?.[0]?.currencyCode || 'USD',
        } : {
          hasTolls: false,
          estimatedPrice: null,
          currency: 'USD',
        },
        isFuelEfficient: routeLabels.includes('FUEL_EFFICIENT'),
        isTollFree: routeLabels.includes('TOLL_FREE') || !tollInfo,
      };
    };

    const routes = data.routes.map((route: any, index: number) => processRoute(route, index));
    const primaryRoute = routes[0];
    const alternateRoutes = routes.slice(1);

    console.log(`Route calculated: ${primaryRoute.distanceMiles} miles, ${primaryRoute.durationMinutes} min, traffic delay: ${primaryRoute.traffic.delayMinutes} min`);

    return new Response(
      JSON.stringify({
        success: true,
        route: primaryRoute,
        alternateRoutes: alternateRoutes,
        hasAlternates: alternateRoutes.length > 0,
        summary: {
          totalRoutes: routes.length,
          fastestRoute: routes.reduce((min: any, r: any) => r.durationSeconds < min.durationSeconds ? r : min, routes[0]).index,
          shortestRoute: routes.reduce((min: any, r: any) => r.distanceMeters < min.distanceMeters ? r : min, routes[0]).index,
          cheapestRoute: routes.reduce((min: any, r: any) => !r.tolls.hasTolls ? r : min, routes[0]).index,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Route calculation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Format duration to human-readable string
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}
