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
  vehicleStartLocation?: { lat: number; lng: number };
  vehicleEndLocation?: { lat: number; lng: number };
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
        JSON.stringify({ 
          error: 'Google Maps API not configured', 
          fallback: true,
          code: 'API_NOT_CONFIGURED' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { waypoints, vehicleStartLocation, vehicleEndLocation } = await req.json() as OptimizationRequest;

    if (!waypoints || waypoints.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 waypoints are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Route Optimization: ${waypoints.length} waypoints`);

    // For simple optimization (up to ~10 waypoints), we can use the Directions API
    // with optimizeWaypoints=true. For larger problems, we'd need Cloud Fleet Routing.
    
    if (waypoints.length <= 10) {
      // Use Google Directions API with waypoint optimization
      const origin = waypoints[0];
      const destination = waypoints[waypoints.length - 1];
      const intermediateWaypoints = waypoints.slice(1, -1);
      
      const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
      url.searchParams.set('origin', `${origin.lat},${origin.lng}`);
      url.searchParams.set('destination', `${destination.lat},${destination.lng}`);
      url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      url.searchParams.set('optimize', 'true');
      
      if (intermediateWaypoints.length > 0) {
        const waypointStr = intermediateWaypoints
          .map(w => `${w.lat},${w.lng}`)
          .join('|');
        url.searchParams.set('waypoints', `optimize:true|${waypointStr}`);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.error(`Google Directions API error: ${response.status}`);
        return new Response(
          JSON.stringify({ error: 'Route optimization failed', fallback: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      
      if (data.status !== 'OK' || !data.routes?.[0]) {
        console.error('Google Directions API returned:', data.status);
        return new Response(
          JSON.stringify({ error: data.status, fallback: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const route = data.routes[0];
      
      // Get the optimized waypoint order
      const waypointOrder = route.waypoint_order || [];
      
      // Build the full optimized order including origin (0) and destination (last)
      const optimizedOrder = [0, ...waypointOrder.map((i: number) => i + 1), waypoints.length - 1];
      
      // Calculate total distance and duration
      let totalDistance = 0;
      let totalDuration = 0;
      const legs: Array<{ from: number; to: number; distance: number; duration: number }> = [];
      
      route.legs.forEach((leg: any, index: number) => {
        totalDistance += leg.distance.value;
        totalDuration += leg.duration.value;
        legs.push({
          from: optimizedOrder[index],
          to: optimizedOrder[index + 1],
          distance: leg.distance.value,
          duration: leg.duration.value,
        });
      });

      // Calculate savings by comparing to original order
      // Fetch the unoptimized route for comparison
      const unoptimizedUrl = new URL('https://maps.googleapis.com/maps/api/directions/json');
      unoptimizedUrl.searchParams.set('origin', `${origin.lat},${origin.lng}`);
      unoptimizedUrl.searchParams.set('destination', `${destination.lat},${destination.lng}`);
      unoptimizedUrl.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      
      if (intermediateWaypoints.length > 0) {
        const waypointStr = intermediateWaypoints
          .map(w => `${w.lat},${w.lng}`)
          .join('|');
        unoptimizedUrl.searchParams.set('waypoints', waypointStr); // No optimize flag
      }

      let originalDistance = totalDistance;
      let originalDuration = totalDuration;
      
      try {
        const unoptimizedResponse = await fetch(unoptimizedUrl.toString());
        const unoptimizedData = await unoptimizedResponse.json();
        
        if (unoptimizedData.status === 'OK' && unoptimizedData.routes?.[0]) {
          originalDistance = unoptimizedData.routes[0].legs.reduce(
            (sum: number, leg: any) => sum + leg.distance.value, 0
          );
          originalDuration = unoptimizedData.routes[0].legs.reduce(
            (sum: number, leg: any) => sum + leg.duration.value, 0
          );
        }
      } catch (e) {
        console.log('Could not calculate savings, using default');
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
      };

      console.log(`Optimization complete: ${result.savings.distancePercent}% distance saved, ${result.savings.durationPercent}% time saved`);

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // For more than 10 waypoints, we'd need Cloud Fleet Routing API
      // For now, return an error with guidance
      return new Response(
        JSON.stringify({ 
          error: 'Too many waypoints for basic optimization. Maximum 10 waypoints supported.',
          fallback: true,
          code: 'TOO_MANY_WAYPOINTS'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Route optimization error:', error);
    return new Response(
      JSON.stringify({ error: 'Route optimization failed', fallback: true, code: 'EXCEPTION' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
