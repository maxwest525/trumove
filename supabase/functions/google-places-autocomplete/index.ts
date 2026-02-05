import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-forwarded-for',
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 60; // Higher limit for autocomplete
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

interface PlaceSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface AutocompleteRequest {
  query: string;
  sessionToken?: string;
  types?: string[]; // 'address', 'geocode', etc.
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

    const { query, sessionToken, types = ['address'] } = await req.json() as AutocompleteRequest;

    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Google Places Autocomplete: query="${query}", types=${types.join(',')}`);

    // Use Google Places Autocomplete (New) API
    // https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
    url.searchParams.set('input', query);
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
    url.searchParams.set('components', 'country:us'); // Restrict to US
    url.searchParams.set('types', types.includes('address') ? 'address' : types.join('|'));
    url.searchParams.set('language', 'en');
    
    // Session token for billing optimization
    if (sessionToken) {
      url.searchParams.set('sessiontoken', sessionToken);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error(`Google Places API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: 'Google Places API error', 
          fallback: true,
          code: 'API_ERROR' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    if (data.status === 'REQUEST_DENIED') {
      console.error('Google Places API request denied:', data.error_message);
      return new Response(
        JSON.stringify({ 
          error: data.error_message || 'Request denied', 
          fallback: true,
          code: 'REQUEST_DENIED' 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (data.status === 'ZERO_RESULTS') {
      return new Response(
        JSON.stringify({ suggestions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse predictions into our format
    const suggestions: PlaceSuggestion[] = (data.predictions || []).map((prediction: any) => {
      const mainText = prediction.structured_formatting?.main_text || '';
      const secondaryText = prediction.structured_formatting?.secondary_text || '';
      
      // Try to parse address components from the description
      // Format is usually: "123 Main St, City, ST, USA"
      const parts = prediction.description.split(', ');
      const streetAddress = parts[0] || '';
      const city = parts[1] || '';
      
      // Parse "ST 12345" or just "ST" from parts
      let state = '';
      let zip = '';
      if (parts.length >= 3) {
        const stateZipPart = parts[parts.length - 2];
        const stateZipMatch = stateZipPart.match(/^([A-Z]{2})(?:\s+(\d{5}))?$/);
        if (stateZipMatch) {
          state = stateZipMatch[1];
          zip = stateZipMatch[2] || '';
        } else {
          state = stateZipPart;
        }
      }
      
      return {
        placeId: prediction.place_id,
        description: prediction.description.replace(', USA', ''),
        mainText,
        secondaryText: secondaryText.replace(', USA', ''),
        types: prediction.types || [],
        streetAddress,
        city,
        state,
        zip,
      };
    });

    console.log(`Google Places returned ${suggestions.length} suggestions`);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Google Places Autocomplete error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch suggestions', 
        fallback: true,
        code: 'EXCEPTION' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
