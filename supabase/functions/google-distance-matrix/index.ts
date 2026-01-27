import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DistanceMatrixRequest {
  origins: Array<{ lat: number; lng: number } | string>;
  destinations: Array<{ lat: number; lng: number } | string>;
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
  departureTime?: string;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: DistanceMatrixRequest = await req.json();
    const { origins, destinations, mode = 'driving', departureTime, avoidTolls, avoidHighways } = body;

    if (!origins || !destinations || origins.length === 0 || destinations.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Origins and destinations are required' }),
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

    // Format locations for the API
    const formatLocation = (loc: { lat: number; lng: number } | string): string => {
      if (typeof loc === 'string') return loc;
      return `${loc.lat},${loc.lng}`;
    };

    const originsStr = origins.map(formatLocation).join('|');
    const destinationsStr = destinations.map(formatLocation).join('|');

    // Build URL with parameters
    const params = new URLSearchParams({
      origins: originsStr,
      destinations: destinationsStr,
      mode,
      key: apiKey,
    });

    if (departureTime) {
      params.set('departure_time', departureTime === 'now' ? 'now' : new Date(departureTime).getTime().toString());
    }

    if (avoidTolls || avoidHighways) {
      const avoid = [];
      if (avoidTolls) avoid.push('tolls');
      if (avoidHighways) avoid.push('highways');
      params.set('avoid', avoid.join('|'));
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`;
    console.log('Calling Distance Matrix API...');

    const response = await fetch(url);
    const data = await response.json();

    console.log('Distance Matrix API response status:', data.status);

    if (data.status !== 'OK') {
      console.error('Distance Matrix API error:', data.status, data.error_message);
      return new Response(
        JSON.stringify({ 
          error: data.error_message || data.status,
          status: data.status,
          fallback: true 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and format results
    const results = data.rows.map((row: any, originIndex: number) => ({
      origin: data.origin_addresses[originIndex],
      destinations: row.elements.map((element: any, destIndex: number) => ({
        destination: data.destination_addresses[destIndex],
        status: element.status,
        distance: element.status === 'OK' ? {
          text: element.distance.text,
          meters: element.distance.value,
          miles: Math.round(element.distance.value / 1609.34 * 10) / 10
        } : null,
        duration: element.status === 'OK' ? {
          text: element.duration.text,
          seconds: element.duration.value,
          minutes: Math.round(element.duration.value / 60)
        } : null,
        durationInTraffic: element.duration_in_traffic ? {
          text: element.duration_in_traffic.text,
          seconds: element.duration_in_traffic.value,
          minutes: Math.round(element.duration_in_traffic.value / 60)
        } : null
      }))
    }));

    return new Response(
      JSON.stringify({
        success: true,
        results,
        originAddresses: data.origin_addresses,
        destinationAddresses: data.destination_addresses
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in google-distance-matrix:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, fallback: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
