import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, zoom = 18 } = await req.json();
    
    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'lat and lng are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!apiKey) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching aerial view for coordinates: ${lat}, ${lng}`);

    // Try the Aerial View API - lookupVideo endpoint
    // Docs: https://developers.google.com/maps/documentation/aerial-view
    const aerialViewUrl = `https://aerialview.googleapis.com/v1/videos:lookupVideo?key=${apiKey}`;
    
    let aerialResult = null;
    
    try {
      const lookupResponse = await fetch(aerialViewUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: `${lat},${lng}`
        })
      });

      // Check if response is JSON
      const contentType = lookupResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const lookupData = await lookupResponse.json();
        console.log('Aerial View API response:', JSON.stringify(lookupData));

        // Check if we have aerial video available
        if (lookupData.state === 'ACTIVE' && lookupData.uris) {
          aerialResult = {
            type: 'video',
            videoUrl: lookupData.uris.MP4_HIGH || lookupData.uris.MP4_MEDIUM,
            thumbnailUrl: lookupData.uris.IMAGE,
            metadata: lookupData.metadata
          };
        } else if (lookupData.error) {
          console.log('Aerial View API error:', lookupData.error.message);
        }
      } else {
        const text = await lookupResponse.text();
        console.log('Aerial View API returned non-JSON:', text.substring(0, 200));
      }
    } catch (aerialError) {
      console.log('Aerial View API not available:', aerialError);
    }

    // If we got aerial video, return it
    if (aerialResult) {
      return new Response(
        JSON.stringify(aerialResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Try Map Tiles API for high-quality satellite tiles
    try {
      const sessionUrl = `https://tile.googleapis.com/v1/createSession?key=${apiKey}`;
      const sessionResponse = await fetch(sessionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapType: 'satellite',
          language: 'en-US',
          region: 'US',
          imageFormat: 'jpeg',
          scale: 'scaleFactor2x',
          highDpi: true
        })
      });

      const contentType = sessionResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const sessionData = await sessionResponse.json();
        console.log('Session response:', JSON.stringify(sessionData));

        if (sessionData.session) {
          // Calculate tile coordinates from lat/lng
          const tileCoords = latLngToTile(lat, lng, zoom);
          
          const tileUrl = `https://tile.googleapis.com/v1/2dtiles/${zoom}/${tileCoords.x}/${tileCoords.y}?session=${sessionData.session}&key=${apiKey}`;
          
          return new Response(
            JSON.stringify({
              type: 'tile',
              tileUrl: tileUrl,
              session: sessionData.session,
              zoom: zoom,
              tileCoords: tileCoords,
              expiry: sessionData.expiry
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } else {
        const text = await sessionResponse.text();
        console.log('Tile API returned non-JSON:', text.substring(0, 200));
      }
    } catch (tileError) {
      console.log('Tile API error:', tileError);
    }

    // Fallback: Return info for client to use Mapbox satellite
    console.log('Returning fallback for:', lat, lng);
    return new Response(
      JSON.stringify({
        type: 'fallback',
        message: 'Aerial view not available for this location - using Mapbox satellite',
        lat,
        lng
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in google-aerial-view:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, type: 'fallback' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Convert lat/lng to tile coordinates
function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = Math.floor((lng + 180) / 360 * n);
  const latRad = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}
