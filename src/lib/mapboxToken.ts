import mapboxgl from 'mapbox-gl';

// Centralized Mapbox token management
// Uses VITE_MAPBOX_ACCESS_TOKEN from environment, falls back to public token
export const MAPBOX_TOKEN = 
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
  'pk.eyJ1IjoibWF4d2VzdDUyNSIsImEiOiJjbWtldHJ3b2YwYXF4M2tvajNsbTFpNTdjIn0.DXcMYHvBRP8vJQM8KKdRLg';

// Custom Mapbox styles
export const MAPBOX_STYLES = {
  // Mapbox Standard styles (v3) - built-in 3D buildings, lighting presets, landmarks
  standard: 'mapbox://styles/mapbox/standard',
  standardSatellite: 'mapbox://styles/mapbox/standard-satellite',
  // Custom styles
  default: 'mapbox://styles/maxwest525/cml8lh7do009501s4b0qvd2jy',
  warm: 'mapbox://styles/maxwest525/cml8lir04008101s48yx391a3',
  // Classic Mapbox styles
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
  dark: 'mapbox://styles/mapbox/dark-v11',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1',
  light: 'mapbox://styles/mapbox/light-v11',
};

// Standard style light presets
export type LightPreset = 'day' | 'dusk' | 'dawn' | 'night';

// Standard style configuration options
export interface StandardStyleConfig {
  lightPreset?: LightPreset;
  showPlaceLabels?: boolean;
  showRoadLabels?: boolean;
  showPointOfInterestLabels?: boolean;
  showTransitLabels?: boolean;
  show3dObjects?: boolean;
  theme?: 'default' | 'faded' | 'monochrome';
}

// Helper to apply Standard style config
export function applyStandardStyleConfig(
  map: mapboxgl.Map,
  config: StandardStyleConfig
): void {
  if (config.lightPreset) {
    map.setConfigProperty('basemap', 'lightPreset', config.lightPreset);
  }
  if (config.showPlaceLabels !== undefined) {
    map.setConfigProperty('basemap', 'showPlaceLabels', config.showPlaceLabels);
  }
  if (config.showRoadLabels !== undefined) {
    map.setConfigProperty('basemap', 'showRoadLabels', config.showRoadLabels);
  }
  if (config.showPointOfInterestLabels !== undefined) {
    map.setConfigProperty('basemap', 'showPointOfInterestLabels', config.showPointOfInterestLabels);
  }
  if (config.showTransitLabels !== undefined) {
    map.setConfigProperty('basemap', 'showTransitLabels', config.showTransitLabels);
  }
  if (config.show3dObjects !== undefined) {
    map.setConfigProperty('basemap', 'show3dObjects', config.show3dObjects);
  }
  if (config.theme) {
    map.setConfigProperty('basemap', 'theme', config.theme);
  }
}

// Validate token exists
export function validateMapboxToken(): boolean {
  return !!MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.');
}
