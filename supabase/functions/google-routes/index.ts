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
}

interface RouteStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Google Maps API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { origin, destination, departureTime, avoidTolls, avoidHighways } = await req.json() as RouteRequest;

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
    const routeRequest = {
      origin: formatWaypoint(origin),
      destination: formatWaypoint(destination),
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE_OPTIMAL',
      computeAlternativeRoutes: false,
      routeModifiers: Object.keys(routeModifiers).length > 0 ? routeModifiers : undefined,
      departureTime: departureTime || new Date().toISOString(),
      languageCode: 'en-US',
      units: 'IMPERIAL',
    };

    const response = await fetch(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline,routes.legs,routes.travelAdvisory,routes.routeLabels',
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
            details: 'Please enable the Routes API in Google Cloud Console'
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to calculate route' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No route found between locations' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const route = data.routes[0];
    const leg = route.legs?.[0];

    // Parse duration (format: "XXXs" where XXX is seconds)
    const durationSeconds = parseInt(route.duration?.replace('s', '') || '0');
    const distanceMeters = route.distanceMeters || 0;
    const distanceMiles = distanceMeters / 1609.34;

    // Extract toll info if available
    const travelAdvisory = route.travelAdvisory || {};
    const tollInfo = travelAdvisory.tollInfo || null;

    // Calculate ETA
    const departureDate = departureTime ? new Date(departureTime) : new Date();
    const etaDate = new Date(departureDate.getTime() + durationSeconds * 1000);

    // Get route labels (e.g., "FUEL_EFFICIENT", "TOLL_FREE")
    const routeLabels = route.routeLabels || [];

    console.log(`Route calculated: ${distanceMiles.toFixed(1)} miles, ${Math.round(durationSeconds / 60)} minutes`);

    return new Response(
      JSON.stringify({
        success: true,
        route: {
          distanceMeters,
          distanceMiles: Math.round(distanceMiles * 10) / 10,
          durationSeconds,
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
          hasTolls: tollInfo !== null,
          tollInfo: tollInfo ? {
            estimatedPrice: tollInfo.estimatedPrice,
            currency: tollInfo.estimatedPrice?.[0]?.currencyCode || 'USD',
          } : null,
        },
        leg: leg ? {
          startAddress: leg.startLocation?.latLng ? 
            `${leg.startLocation.latLng.latitude.toFixed(4)}, ${leg.startLocation.latLng.longitude.toFixed(4)}` : null,
          endAddress: leg.endLocation?.latLng ?
            `${leg.endLocation.latLng.latitude.toFixed(4)}, ${leg.endLocation.latLng.longitude.toFixed(4)}` : null,
        } : null,
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
