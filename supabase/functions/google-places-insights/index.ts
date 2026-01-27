import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlacesInsightRequest {
  routePoints: Array<{ lat: number; lng: number; name?: string }>;
  limit?: number;
}

interface PlaceInsight {
  name: string;
  type: string;
  location: { lat: number; lng: number };
  rating?: number;
  description: string;
  funFact?: string;
  photo?: string;
  vicinity?: string;
}

// Curated fun facts for different place types and cities
const FUN_FACTS: Record<string, string[]> = {
  'Jacksonville': [
    'Jacksonville is the largest city by area in the contiguous United States at 875 square miles!',
    'Jacksonville has more than 20 miles of beaches along the Atlantic Ocean.',
    'The city is named after Andrew Jackson, the 7th President of the United States.',
  ],
  'Miami': [
    'Miami is the only major US city founded by a woman - Julia Tuttle!',
    'Miami Beach was actually a mangrove swamp until the 1910s.',
    'Over 70% of Miami\'s population speaks Spanish as their first language.',
  ],
  'Orlando': [
    'Orlando is home to more than 100 theme parks and attractions!',
    'Before Disney arrived in 1971, Orlando was known as the "Serape Capital of the World".',
    'Over 75 million tourists visit Orlando each year.',
  ],
  'Tampa': [
    'Tampa is known as the "Lightning Capital of North America" due to frequent thunderstorms.',
    'The city hosts the world\'s longest continuously-running Halloween event at Busch Gardens.',
    'Tampa\'s Gasparilla Pirate Festival is one of the largest parades in the United States.',
  ],
  'Atlanta': [
    'Atlanta is home to the world\'s busiest airport - Hartsfield-Jackson!',
    'Coca-Cola was invented in Atlanta in 1886.',
    'Atlanta is the only major American city destroyed during the Civil War.',
  ],
  'Savannah': [
    'Savannah is one of the largest National Historic Landmark Districts in the US!',
    'The famous "Forrest Gump" bench scenes were filmed in Savannah\'s Chippewa Square.',
    'Savannah\'s city plan with 22 squares was designed in 1733 and is still intact today.',
  ],
  'New Orleans': [
    'New Orleans is the birthplace of jazz music!',
    'The city is actually built 6 feet below sea level on average.',
    'New Orleans has the oldest streetcar line in the world - the St. Charles line from 1835.',
  ],
  'default': [
    'This route passes through some of America\'s most scenic highways!',
    'Road trips on US interstates cover over 48,000 miles of highway.',
    'The US Interstate Highway System was started in 1956 under President Eisenhower.',
  ],
};

// Get fun fact for a city or default
function getFunFact(cityName: string): string {
  const facts = FUN_FACTS[cityName] || FUN_FACTS['default'];
  return facts[Math.floor(Math.random() * facts.length)];
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

    const { routePoints, limit = 5 } = await req.json() as PlacesInsightRequest;

    if (!routePoints || !Array.isArray(routePoints) || routePoints.length < 2) {
      return new Response(
        JSON.stringify({ error: 'At least 2 route points are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Finding places along route with ${routePoints.length} points`);

    const insights: PlaceInsight[] = [];
    const processedCities = new Set<string>();

    // For each route point, find nearby points of interest
    for (const point of routePoints) {
      if (insights.length >= limit) break;
      
      // Skip if we already have insight for this city
      if (point.name && processedCities.has(point.name)) continue;
      if (point.name) processedCities.add(point.name);

      try {
        // Use Google Places Nearby Search to find interesting places
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${point.lat},${point.lng}&radius=10000&type=tourist_attraction|point_of_interest&rankby=prominence&key=${GOOGLE_MAPS_API_KEY}`;
        
        const placesResponse = await fetch(placesUrl);
        
        if (!placesResponse.ok) {
          console.warn(`Places API error for point ${point.lat},${point.lng}: ${placesResponse.status}`);
          continue;
        }

        const placesData = await placesResponse.json();
        
        if (placesData.status !== 'OK' || !placesData.results?.length) {
          // Add a fun fact for the city even if no places found
          if (point.name) {
            insights.push({
              name: point.name,
              type: 'city',
              location: { lat: point.lat, lng: point.lng },
              description: `Major city along your route`,
              funFact: getFunFact(point.name),
            });
          }
          continue;
        }

        // Get the top place
        const topPlace = placesData.results[0];
        
        insights.push({
          name: topPlace.name,
          type: topPlace.types?.[0] || 'point_of_interest',
          location: {
            lat: topPlace.geometry?.location?.lat || point.lat,
            lng: topPlace.geometry?.location?.lng || point.lng,
          },
          rating: topPlace.rating,
          description: topPlace.vicinity || `Near ${point.name || 'your route'}`,
          funFact: point.name ? getFunFact(point.name) : getFunFact('default'),
          vicinity: topPlace.vicinity,
        });

      } catch (error) {
        console.warn(`Error fetching places for point:`, error);
        // Add city fun fact on error
        if (point.name) {
          insights.push({
            name: point.name,
            type: 'city',
            location: { lat: point.lat, lng: point.lng },
            description: `Major city along your route`,
            funFact: getFunFact(point.name),
          });
        }
      }
    }

    // If we have origin and destination names, ensure we have facts for them
    const originPoint = routePoints[0];
    const destPoint = routePoints[routePoints.length - 1];
    
    // Add route summary insight
    const routeSummary: PlaceInsight = {
      name: 'Route Overview',
      type: 'route_info',
      location: {
        lat: (originPoint.lat + destPoint.lat) / 2,
        lng: (originPoint.lng + destPoint.lng) / 2,
      },
      description: `${originPoint.name || 'Origin'} to ${destPoint.name || 'Destination'}`,
      funFact: getFunFact('default'),
    };

    console.log(`Found ${insights.length} insights along route`);

    return new Response(
      JSON.stringify({
        success: true,
        insights: [routeSummary, ...insights].slice(0, limit),
        origin: originPoint.name || null,
        destination: destPoint.name || null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Places insight error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch place insights' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
