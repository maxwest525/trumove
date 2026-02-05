// Centralized Mapbox token management
// Uses VITE_MAPBOX_ACCESS_TOKEN from environment, falls back to public token
export const MAPBOX_TOKEN = 
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
  'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtuZTY0cTgwcGIzM2VweTN2MTgzeHc3In0.nlM6XCog7Y0nrPt-5v-E2g';

// Validate token exists
export function validateMapboxToken(): boolean {
  return !!MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.');
}
