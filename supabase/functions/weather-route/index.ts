import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherPoint {
  lat: number;
  lon: number;
  name?: string;
}

interface WeatherData {
  location: string;
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  visibility: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');
    
    if (!OPENWEATHER_API_KEY) {
      console.error('OPENWEATHER_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Weather API not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { points } = await req.json() as { points: WeatherPoint[] };

    if (!points || !Array.isArray(points) || points.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Points array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching weather for ${points.length} points`);

    // Fetch weather for each point
    const weatherPromises = points.map(async (point): Promise<WeatherData | null> => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${point.lat}&lon=${point.lon}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`Weather API error for point ${point.lat},${point.lon}: ${response.status}`);
          return null;
        }

        const data = await response.json();
        
        return {
          location: point.name || data.name || `${point.lat.toFixed(2)}, ${point.lon.toFixed(2)}`,
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          description: data.weather[0]?.description || 'Unknown',
          icon: data.weather[0]?.icon || '01d',
          wind_speed: Math.round(data.wind.speed),
          visibility: Math.round((data.visibility || 10000) / 1609.34), // Convert to miles
        };
      } catch (error) {
        console.error(`Error fetching weather for ${point.lat},${point.lon}:`, error);
        return null;
      }
    });

    const weatherResults = await Promise.all(weatherPromises);
    const validResults = weatherResults.filter((r): r is WeatherData => r !== null);

    console.log(`Successfully fetched weather for ${validResults.length}/${points.length} points`);

    return new Response(
      JSON.stringify({ weather: validResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Weather route error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch weather data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
