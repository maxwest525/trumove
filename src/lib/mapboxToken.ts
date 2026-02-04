// Centralized Mapbox token management
// Uses VITE_MAPBOX_ACCESS_TOKEN from environment, falls back to public token
export const MAPBOX_TOKEN = 
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
  'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldHJ3b2YwYXF4M2tvajNsbTFpNTdjIn0.DXcMYHvBRP8vJQM8KKdRLg';

// Custom Mapbox styles
export const MAPBOX_STYLES = {
  // Custom "Default" style - for tracking and main maps
  default: 'mapbox://styles/maxwest525/cml8lh7do009501s4b0qvd2jy',
  // Custom "Warm" style - for overview and accent maps
  warm: 'mapbox://styles/maxwest525/cml8lir04008101s48yx391a3',
  // Fallback Mapbox styles
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  dark: 'mapbox://styles/mapbox/dark-v11',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
  light: 'mapbox://styles/mapbox/light-v11',
};

// Validate token exists
export function validateMapboxToken(): boolean {
  return !!MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.');
}
