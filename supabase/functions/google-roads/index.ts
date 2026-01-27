import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoadsRequest {
  path: Array<{ lat: number; lng: number }>;
  interpolate?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RoadsRequest = await req.json();
    const { path, interpolate = true } = body;

    if (!path || path.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Path coordinates are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Roads API has a limit of 100 points per request
    if (path.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Maximum 100 points per request allowed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured', fallback: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format path for the API
    const pathStr = path.map(p => `${p.lat},${p.lng}`).join('|');

    // Build URL with parameters
    const params = new URLSearchParams({
      path: pathStr,
      interpolate: interpolate.toString(),
      key: apiKey,
    });

    const url = `https://roads.googleapis.com/v1/snapToRoads?${params.toString()}`;
    console.log(`Calling Roads API for ${path.length} points...`);

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Roads API error:', data.error.message);
      return new Response(
        JSON.stringify({ 
          error: data.error.message,
          code: data.error.code,
          fallback: true 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!data.snappedPoints || data.snappedPoints.length === 0) {
      console.log('No snapped points returned');
      return new Response(
        JSON.stringify({ 
          success: true,
          snappedPoints: [],
          message: 'No roads found near the provided coordinates'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format the response
    const snappedPoints = data.snappedPoints.map((point: any) => ({
      location: {
        lat: point.location.latitude,
        lng: point.location.longitude
      },
      originalIndex: point.originalIndex,
      placeId: point.placeId
    }));

    console.log(`Snapped ${snappedPoints.length} points to roads`);

    return new Response(
      JSON.stringify({
        success: true,
        snappedPoints,
        originalPointCount: path.length,
        snappedPointCount: snappedPoints.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in google-roads:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, fallback: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
