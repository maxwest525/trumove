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
}

interface RouteResult {
  distance: number;
  duration: number;
  geometry: string;
}

interface OptimizationResponse {
  optimizedOrder: number[];
  totalDistance: number;
  totalDuration: number;
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
  geometry?: string;
}

// Generate all permutations of an array
function* permutations<T>(arr: T[]): Generator<T[]> {
  if (arr.length <= 1) {
    yield arr;
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      yield [arr[i], ...perm];
    }
  }
}

// Nearest neighbor heuristic for larger sets
function nearestNeighborOrder(
  waypoints: Waypoint[],
  fixedStart: number,
  fixedEnd: number
): number[] {
  const n = waypoints.length;
  const order: number[] = [fixedStart];
  
  // Get intermediate indices
  const intermediate: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i !== fixedStart && i !== fixedEnd) {
      intermediate.push(i);
    }
  }
  
  // Greedy nearest neighbor
  let current = fixedStart;
  while (intermediate.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;
    
    for (let i = 0; i < intermediate.length; i++) {
      const idx = intermediate[i];
      const dist = haversineDistance(
        waypoints[current].lat, waypoints[current].lng,
        waypoints[idx].lat, waypoints[idx].lng
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }
    
    const nextIdx = intermediate[nearestIdx];
    order.push(nextIdx);
    intermediate.splice(nearestIdx, 1);
    current = nextIdx;
  }
  
  order.push(fixedEnd);
  return order;
}

// Haversine distance in meters
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Call Mapbox Directions API
async function getRoute(
  waypoints: Waypoint[],
  order: number[],
  profile: string,
  token: string
): Promise<RouteResult | null> {
  const coordinates = order
    .map(i => `${waypoints[i].lng.toFixed(6)},${waypoints[i].lat.toFixed(6)}`)
    .join(';');
  
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?access_token=${token}&geometries=polyline6&overview=full&annotations=distance,duration`;
  
  console.log('Calling Mapbox Directions API for profile:', profile);
  
  try {
    const response = await fetch(url);
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`Directions API error: ${response.status}`, responseText.substring(0, 200));
      return null;
    }
    
    const data = JSON.parse(responseText);
    if (data.code !== 'Ok' || !data.routes?.[0]) {
      console.error('Directions API returned:', data.code, data.message);
      return null;
    }
    
    const route = data.routes[0];
    return {
      distance: route.distance,
      duration: route.duration,
      geometry: route.geometry,
    };
  } catch (error) {
    console.error('Directions API exception:', error);
    return null;
  }
}

// Extract leg details from a route
async function getRouteLegs(
  waypoints: Waypoint[],
  order: number[],
  profile: string,
  token: string
): Promise<Array<{ from: number; to: number; distance: number; duration: number }>> {
  const coordinates = order
    .map(i => `${waypoints[i].lng.toFixed(6)},${waypoints[i].lat.toFixed(6)}`)
    .join(';');
  
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?access_token=${token}&geometries=polyline6&overview=full`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes?.[0]?.legs) return [];
    
    return data.routes[0].legs.map((leg: any, i: number) => ({
      from: order[i],
      to: order[i + 1],
      distance: leg.distance,
      duration: leg.duration,
    }));
  } catch {
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Use the public token - Directions API works with public tokens
    const MAPBOX_TOKEN = Deno.env.get('MAPBOX_ACCESS_TOKEN');
    
    if (!MAPBOX_TOKEN) {
      console.error('MAPBOX_ACCESS_TOKEN not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Mapbox API not configured',
          fallback: true,
          code: 'API_NOT_CONFIGURED' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Token prefix:', MAPBOX_TOKEN.substring(0, 10));
    
    const { 
      waypoints, 
      profile = 'driving-traffic',
    } = await req.json() as OptimizationRequest;

    if (!waypoints || waypoints.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 waypoints are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (waypoints.length > 25) {
      return new Response(
        JSON.stringify({ 
          error: 'Maximum 25 waypoints supported',
          code: 'TOO_MANY_WAYPOINTS'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Mapbox Directions Optimization: ${waypoints.length} waypoints, profile: ${profile}`);

    const n = waypoints.length;
    const fixedStart = 0;
    const fixedEnd = n - 1;
    
    // Get original route for comparison
    const originalOrder = Array.from({ length: n }, (_, i) => i);
    const originalRoute = await getRoute(waypoints, originalOrder, profile, MAPBOX_TOKEN);
    
    if (!originalRoute) {
      return new Response(
        JSON.stringify({ error: 'Failed to calculate route', fallback: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let bestOrder = originalOrder;
    let bestDistance = originalRoute.distance;
    let bestDuration = originalRoute.duration;
    let bestGeometry = originalRoute.geometry;
    
    // Only optimize if we have intermediate waypoints
    if (n > 2) {
      const intermediateIndices: number[] = [];
      for (let i = 1; i < n - 1; i++) {
        intermediateIndices.push(i);
      }
      
      const intermediateCount = intermediateIndices.length;
      
      // Use permutations for small sets (up to 5 intermediate = 120 permutations max)
      // Use nearest neighbor for larger sets
      if (intermediateCount <= 5) {
        console.log(`Testing ${factorial(intermediateCount)} permutations...`);
        
        for (const perm of permutations(intermediateIndices)) {
          const order = [fixedStart, ...perm, fixedEnd];
          const route = await getRoute(waypoints, order, profile, MAPBOX_TOKEN);
          
          if (route && route.duration < bestDuration) {
            bestOrder = order;
            bestDistance = route.distance;
            bestDuration = route.duration;
            bestGeometry = route.geometry;
          }
        }
      } else {
        console.log('Using nearest neighbor heuristic...');
        const nnOrder = nearestNeighborOrder(waypoints, fixedStart, fixedEnd);
        const nnRoute = await getRoute(waypoints, nnOrder, profile, MAPBOX_TOKEN);
        
        if (nnRoute && nnRoute.duration < bestDuration) {
          bestOrder = nnOrder;
          bestDistance = nnRoute.distance;
          bestDuration = nnRoute.duration;
          bestGeometry = nnRoute.geometry;
        }
      }
    }
    
    // Get leg details for the best route
    const legs = await getRouteLegs(waypoints, bestOrder, profile, MAPBOX_TOKEN);
    
    // Calculate savings
    const distanceSavings = originalRoute.distance > 0
      ? Math.round((1 - bestDistance / originalRoute.distance) * 100 * 10) / 10
      : 0;
    const durationSavings = originalRoute.duration > 0
      ? Math.round((1 - bestDuration / originalRoute.duration) * 100 * 10) / 10
      : 0;

    const result: OptimizationResponse = {
      optimizedOrder: bestOrder,
      totalDistance: bestDistance,
      totalDuration: bestDuration,
      savings: {
        distancePercent: Math.max(0, distanceSavings),
        durationPercent: Math.max(0, durationSavings),
      },
      legs,
      geometry: bestGeometry,
    };

    console.log(`Optimization complete: ${result.savings.distancePercent}% distance saved, ${result.savings.durationPercent}% time saved`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Mapbox directions optimization error:', error);
    return new Response(
      JSON.stringify({ error: 'Route optimization failed', fallback: true, code: 'EXCEPTION' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
