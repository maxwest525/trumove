import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Waypoint {
  lat: number;
  lng: number;
  label?: string;
}

interface OptimizationRequest {
  waypoints: Waypoint[];
  profile?: 'driving' | 'driving-traffic' | 'walking' | 'cycling';
  roundtrip?: boolean;
  source?: 'first' | 'any';
  destination?: 'last' | 'any';
}

interface OptimizationResponse {
  optimizedOrder: number[];
  totalDistance: number; // meters
  totalDuration: number; // seconds
  savings: {
    distancePercent: number;
    durationPercent: number;
  };
  legs: Array<{
    from: number;
    to: number;
    distance: number;
    duration: number;
  }>;
  geometry?: string; // Encoded polyline for the optimized route
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Mapbox Optimization API requires a secret token with proper scopes
    // The public token won't work for this API
    const MAPBOX_TOKEN = Deno.env.get('MAPBOX_SECRET_TOKEN') || Deno.env.get('MAPBOX_ACCESS_TOKEN');
    
    if (!MAPBOX_TOKEN) {
      console.error('MAPBOX_SECRET_TOKEN not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Mapbox Optimization API not configured. Please add MAPBOX_SECRET_TOKEN.', 
          fallback: true,
          code: 'API_NOT_CONFIGURED' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { 
      waypoints, 
      profile = 'driving-traffic',
      roundtrip = false,
      source = 'first',
      destination = 'last'
    } = await req.json() as OptimizationRequest;

    if (!waypoints || waypoints.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 waypoints are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (waypoints.length > 12) {
      return new Response(
        JSON.stringify({ 
          error: 'Maximum 12 waypoints supported for Mapbox Optimization API',
          code: 'TOO_MANY_WAYPOINTS'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Mapbox Optimization: ${waypoints.length} waypoints, profile: ${profile}`);

    // Build coordinates string: lon,lat;lon,lat;...
    const coordinates = waypoints
      .map(w => `${w.lng.toFixed(6)},${w.lat.toFixed(6)}`)
      .join(';');

    // Build the Optimization API URL
    const url = new URL(`https://api.mapbox.com/optimized-trips/v1/mapbox/${profile}/${coordinates}`);
    url.searchParams.set('access_token', MAPBOX_TOKEN);
    url.searchParams.set('geometries', 'polyline6');
    url.searchParams.set('overview', 'full');
    url.searchParams.set('steps', 'false');
    url.searchParams.set('roundtrip', String(roundtrip));
    url.searchParams.set('source', source);
    url.searchParams.set('destination', destination);
    url.searchParams.set('annotations', 'distance,duration');

    console.log('Calling Mapbox Optimization API...');
    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error(`Mapbox API error: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return new Response(
        JSON.stringify({ error: 'Route optimization failed', fallback: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.trips?.[0]) {
      console.error('Mapbox Optimization API returned:', data.code, data.message);
      return new Response(
        JSON.stringify({ error: data.message || data.code, fallback: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trip = data.trips[0];
    const waypointsResult = data.waypoints;

    // Extract the optimized order from waypoint_index
    const optimizedOrder = waypointsResult.map((wp: any) => wp.waypoint_index);
    
    // Calculate total distance and duration
    const totalDistance = trip.distance; // meters
    const totalDuration = trip.duration; // seconds

    // Build legs array
    const legs: Array<{ from: number; to: number; distance: number; duration: number }> = [];
    if (trip.legs) {
      trip.legs.forEach((leg: any, index: number) => {
        legs.push({
          from: optimizedOrder[index],
          to: optimizedOrder[index + 1] ?? optimizedOrder[0], // Handle roundtrip
          distance: leg.distance,
          duration: leg.duration,
        });
      });
    }

    // Calculate savings by comparing to original order
    // Make a request with the original order to compare
    let originalDistance = totalDistance;
    let originalDuration = totalDuration;
    
    try {
      // Only calculate savings if order was actually changed
      const orderChanged = optimizedOrder.some((idx: number, pos: number) => idx !== pos);
      
      if (orderChanged) {
        const originalUrl = new URL(`https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}`);
        originalUrl.searchParams.set('access_token', MAPBOX_TOKEN);
        originalUrl.searchParams.set('overview', 'false');
        
        const originalResponse = await fetch(originalUrl.toString());
        if (originalResponse.ok) {
          const originalData = await originalResponse.json();
          if (originalData.routes?.[0]) {
            originalDistance = originalData.routes[0].distance;
            originalDuration = originalData.routes[0].duration;
          }
        }
      }
    } catch (e) {
      console.log('Could not calculate savings comparison');
    }

    const result: OptimizationResponse = {
      optimizedOrder,
      totalDistance,
      totalDuration,
      savings: {
        distancePercent: originalDistance > 0 
          ? Math.round((1 - totalDistance / originalDistance) * 100 * 10) / 10 
          : 0,
        durationPercent: originalDuration > 0 
          ? Math.round((1 - totalDuration / originalDuration) * 100 * 10) / 10 
          : 0,
      },
      legs,
      geometry: trip.geometry, // Encoded polyline for map display
    };

    console.log(`Optimization complete: ${result.savings.distancePercent}% distance saved, ${result.savings.durationPercent}% time saved`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Mapbox optimization error:', error);
    return new Response(
      JSON.stringify({ error: 'Route optimization failed', fallback: true, code: 'EXCEPTION' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
