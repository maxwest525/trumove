// Geocoding utility for converting ZIP codes to coordinates

interface Coordinates {
  lat: number;
  lng: number;
}

// Cache for geocoding results
const geocodeCache: Record<string, Coordinates> = {};

// Known coordinates for major US cities (fallback)
const ZIP_COORDS: Record<string, Coordinates> = {
  // California
  "90210": { lat: 34.0901, lng: -118.4065 },
  "90001": { lat: 33.9425, lng: -118.2551 },
  "94102": { lat: 37.7749, lng: -122.4194 },
  "92101": { lat: 32.7157, lng: -117.1611 },
  // New York
  "10001": { lat: 40.7484, lng: -73.9967 },
  "11201": { lat: 40.6943, lng: -73.9898 },
  // Texas
  "77001": { lat: 29.7604, lng: -95.3698 },
  "75201": { lat: 32.7767, lng: -96.7970 },
  "78701": { lat: 30.2672, lng: -97.7431 },
  // Florida
  "33101": { lat: 25.7617, lng: -80.1918 },
  "32801": { lat: 28.5383, lng: -81.3792 },
  // Illinois
  "60601": { lat: 41.8781, lng: -87.6298 },
  // Other major
  "85001": { lat: 33.4484, lng: -112.0740 },
  "98101": { lat: 47.6062, lng: -122.3321 },
  "80201": { lat: 39.7392, lng: -104.9903 },
  "02101": { lat: 42.3601, lng: -71.0589 },
  "20001": { lat: 38.9072, lng: -77.0369 },
  "30301": { lat: 33.7490, lng: -84.3880 },
  "89101": { lat: 36.1699, lng: -115.1398 },
};

export async function geocodeZip(zip: string): Promise<Coordinates | null> {
  // Check cache first
  if (geocodeCache[zip]) {
    return geocodeCache[zip];
  }

  // Check local lookup
  if (ZIP_COORDS[zip]) {
    geocodeCache[zip] = ZIP_COORDS[zip];
    return ZIP_COORDS[zip];
  }

  // Try Zippopotam API for coordinates
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (res.ok) {
      const data = await res.json();
      const place = data.places[0];
      const coords: Coordinates = {
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude),
      };
      geocodeCache[zip] = coords;
      return coords;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }

  return null;
}

// Calculate distance between two coordinates in miles
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Generate arc points between two coordinates
export function generateArcPoints(from: Coordinates, to: Coordinates, numPoints: number = 50): [number, number][] {
  const points: [number, number][] = [];
  
  // Calculate the midpoint and arc height based on distance
  const midLat = (from.lat + to.lat) / 2;
  const midLng = (from.lng + to.lng) / 2;
  
  // Arc height proportional to distance (more distance = higher arc)
  const distance = Math.sqrt(
    Math.pow(to.lat - from.lat, 2) + Math.pow(to.lng - from.lng, 2)
  );
  const arcHeight = distance * 0.15; // 15% of distance for arc height
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    
    // Quadratic bezier curve
    const lat = (1 - t) * (1 - t) * from.lat + 
                2 * (1 - t) * t * (midLat + arcHeight) + 
                t * t * to.lat;
    const lng = (1 - t) * (1 - t) * from.lng + 
                2 * (1 - t) * t * midLng + 
                t * t * to.lng;
    
    points.push([lng, lat]);
  }
  
  return points;
}
