import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for',
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60000;

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('cf-connecting-ip') || 
         'unknown';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }

    const { lat, lng, address } = await req.json();
    
    // Accept either lat/lng or a full address string
    const lookupAddress = address || (lat && lng ? `${lat},${lng}` : null);
    
    if (!lookupAddress) {
      return new Response(
        JSON.stringify({ error: 'lat/lng or address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!apiKey) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured', type: 'fallback' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching aerial view for: ${lookupAddress}`);

    // Build URL with query parameters (as per official sample)
    const urlParams = new URLSearchParams();
    
    // Check if it's a videoId or address
    const videoIdRegex = /^[0-9a-zA-Z-_]{22}$/;
    const parameterKey = lookupAddress.match(videoIdRegex) ? 'videoId' : 'address';
    
    urlParams.set(parameterKey, lookupAddress);
    urlParams.set('key', apiKey);
    
    const aerialViewUrl = `https://aerialview.googleapis.com/v1/videos:lookupVideo?${urlParams.toString()}`;
    console.log('Calling Aerial View API with:', parameterKey);
    
    const response = await fetch(aerialViewUrl);
    const videoResult = await response.json();
    
    console.log('Aerial View API response:', JSON.stringify(videoResult));

    // Handle different response states
    if (videoResult.state === 'PROCESSING') {
      console.log('Video still processing');
      return new Response(
        JSON.stringify({
          type: 'processing',
          message: 'Aerial video is still being generated for this location',
          state: 'PROCESSING'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (videoResult.state === 'ACTIVE' && videoResult.uris) {
      // Extract video URLs - prefer landscape orientation
      const mp4High = videoResult.uris.MP4_HIGH;
      const mp4Medium = videoResult.uris.MP4_MEDIUM;
      const image = videoResult.uris.IMAGE;
      
      return new Response(
        JSON.stringify({
          type: 'video',
          videoUrl: mp4High?.landscapeUri || mp4Medium?.landscapeUri || mp4High?.portraitUri || mp4Medium?.portraitUri,
          thumbnailUrl: image?.landscapeUri || image?.portraitUri,
          metadata: videoResult.metadata,
          state: 'ACTIVE'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (videoResult.error) {
      console.log('Aerial View API error:', videoResult.error.message);
      
      // 404 means no video exists - could trigger renderVideo to generate one
      if (videoResult.error.code === 404) {
        return new Response(
          JSON.stringify({
            type: 'not_found',
            message: 'No aerial video available for this location',
            canRender: true // Flag that we could call renderVideo
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({
          type: 'error',
          message: videoResult.error.message,
          code: videoResult.error.code
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback for unexpected response
    return new Response(
      JSON.stringify({
        type: 'fallback',
        message: 'Aerial view not available - using satellite imagery',
        raw: videoResult
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
