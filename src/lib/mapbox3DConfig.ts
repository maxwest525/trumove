import mapboxgl from 'mapbox-gl';

/**
 * Mapbox 3D Configuration Utilities
 * 
 * Provides reusable 3D map configurations for terrain, buildings, fog/atmosphere,
 * and cinematic camera presets across all map components.
 */

// ============================================
// TERRAIN CONFIGURATION
// ============================================

/**
 * Add 3D terrain with DEM (Digital Elevation Model)
 */
export function addTerrain(map: mapboxgl.Map, exaggeration: number = 1.2): void {
  if (map.getSource('mapbox-dem')) return;
  
  map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14
  });
  
  map.setTerrain({ source: 'mapbox-dem', exaggeration });
}

/**
 * Remove terrain
 */
export function removeTerrain(map: mapboxgl.Map): void {
  map.setTerrain(null);
}

// ============================================
// 3D BUILDINGS CONFIGURATION
// ============================================

/**
 * Add 3D extruded buildings layer
 */
export function add3DBuildings(
  map: mapboxgl.Map, 
  options: {
    color?: string;
    opacity?: number;
    minZoom?: number;
    lightPreset?: 'day' | 'dusk' | 'night';
  } = {}
): void {
  const { 
    color = '#242424', 
    opacity = 0.85, 
    minZoom = 14,
    lightPreset = 'day'
  } = options;

  // Check if layer already exists
  if (map.getLayer('3d-buildings')) return;

  // Color presets based on time of day
  const colorPresets = {
    day: color,
    dusk: '#3a3535',
    night: '#1a1a2e'
  };

  // Ensure we insert after existing layers if any
  const layers = map.getStyle()?.layers;
  let labelLayerId: string | undefined;
  
  if (layers) {
    for (const layer of layers) {
      if (layer.type === 'symbol' && layer.layout?.['text-field']) {
        labelLayerId = layer.id;
        break;
      }
    }
  }

  map.addLayer(
    {
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': minZoom,
      'paint': {
        'fill-extrusion-color': colorPresets[lightPreset],
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height']
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height']
        ],
        'fill-extrusion-opacity': opacity
      }
    },
    labelLayerId
  );
}

/**
 * Add 3D buildings with ambient occlusion effect (shadows)
 */
export function add3DBuildingsWithShadows(
  map: mapboxgl.Map,
  options: {
    baseColor?: string;
    highlightColor?: string;
    opacity?: number;
    minZoom?: number;
  } = {}
): void {
  const {
    baseColor = '#1a1a2e',
    highlightColor = '#2a2a4e',
    opacity = 0.9,
    minZoom = 14
  } = options;

  if (map.getLayer('3d-buildings')) return;

  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': minZoom,
    'paint': {
      // Gradient from dark at bottom to lighter at top
      'fill-extrusion-color': [
        'interpolate',
        ['linear'],
        ['get', 'height'],
        0, baseColor,
        50, highlightColor,
        200, highlightColor
      ],
      'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15, 0,
        15.05, ['get', 'height']
      ],
      'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15, 0,
        15.05, ['get', 'min_height']
      ],
      'fill-extrusion-opacity': opacity,
      // Vertical gradient for ambient occlusion effect
      'fill-extrusion-vertical-gradient': true
    }
  });
}

/**
 * Remove 3D buildings layer
 */
export function remove3DBuildings(map: mapboxgl.Map): void {
  if (map.getLayer('3d-buildings')) {
    map.removeLayer('3d-buildings');
  }
}

// ============================================
// FOG/ATMOSPHERE CONFIGURATION
// ============================================

export type FogPreset = 'day' | 'dusk' | 'night' | 'dramatic' | 'satellite';

const fogPresets: Record<FogPreset, mapboxgl.FogSpecification> = {
  day: {
    color: 'rgb(220, 230, 240)',
    'high-color': 'rgb(180, 200, 230)',
    'horizon-blend': 0.1,
    'space-color': 'rgb(200, 220, 240)',
    'star-intensity': 0
  },
  dusk: {
    color: 'rgb(240, 180, 140)',
    'high-color': 'rgb(180, 120, 140)',
    'horizon-blend': 0.2,
    'space-color': 'rgb(40, 30, 60)',
    'star-intensity': 0.2
  },
  night: {
    color: 'rgb(30, 35, 50)',
    'high-color': 'rgb(15, 20, 35)',
    'horizon-blend': 0.15,
    'space-color': 'rgb(10, 15, 25)',
    'star-intensity': 0.5
  },
  dramatic: {
    color: 'rgb(186, 210, 235)',
    'high-color': 'rgb(36, 92, 223)',
    'horizon-blend': 0.4,
    'space-color': 'rgb(11, 11, 25)',
    'star-intensity': 0.8
  },
  satellite: {
    color: 'rgb(255, 255, 255)',
    'high-color': 'rgb(200, 210, 230)',
    'horizon-blend': 0.1,
    'space-color': 'rgb(200, 210, 230)',
    'star-intensity': 0
  }
};

/**
 * Apply atmospheric fog/haze effect
 */
export function setFogPreset(map: mapboxgl.Map, preset: FogPreset): void {
  map.setFog(fogPresets[preset]);
}

/**
 * Apply custom fog configuration
 */
export function setCustomFog(map: mapboxgl.Map, fog: mapboxgl.FogSpecification): void {
  map.setFog(fog);
}

/**
 * Remove fog
 */
export function removeFog(map: mapboxgl.Map): void {
  map.setFog(undefined as unknown as mapboxgl.FogSpecification);
}

// ============================================
// SKY LAYER CONFIGURATION
// ============================================

/**
 * Add sky layer for realistic horizon
 */
export function addSkyLayer(
  map: mapboxgl.Map,
  options: {
    preset?: 'day' | 'dusk' | 'night';
    sunPosition?: [number, number];
  } = {}
): void {
  const { preset = 'day' } = options;
  
  if (map.getLayer('sky')) return;

  const skyColors = {
    day: { atmosphere: 'rgb(135, 206, 235)', sun: 'rgb(255, 255, 200)' },
    dusk: { atmosphere: 'rgb(255, 150, 100)', sun: 'rgb(255, 100, 50)' },
    night: { atmosphere: 'rgb(20, 20, 40)', sun: 'rgb(50, 50, 80)' }
  };

  map.addLayer({
    id: 'sky',
    type: 'sky',
    paint: {
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun': options.sunPosition || [0, 90],
      'sky-atmosphere-sun-intensity': preset === 'night' ? 2 : 15,
      'sky-atmosphere-color': skyColors[preset].atmosphere
    }
  });
}

/**
 * Remove sky layer
 */
export function removeSkyLayer(map: mapboxgl.Map): void {
  if (map.getLayer('sky')) {
    map.removeLayer('sky');
  }
}

// ============================================
// CAMERA PRESETS
// ============================================

export interface CameraPreset {
  pitch: number;
  bearing: number;
  zoom: number;
  duration?: number;
}

export const cameraPresets: Record<string, CameraPreset> = {
  // Flat overview for continental routes
  overview: {
    pitch: 0,
    bearing: 0,
    zoom: 4,
    duration: 1500
  },
  // Tilted view for route analysis
  routeAnalysis: {
    pitch: 40,
    bearing: -17,
    zoom: 8,
    duration: 1500
  },
  // City-level with buildings visible
  cityLevel: {
    pitch: 45,
    bearing: -17,
    zoom: 15,
    duration: 1500
  },
  // Street-level for truck following
  streetLevel: {
    pitch: 60,
    bearing: 0, // Will be set dynamically to truck heading
    zoom: 17,
    duration: 800
  },
  // Dramatic cinematic angle
  cinematic: {
    pitch: 55,
    bearing: -30,
    zoom: 16,
    duration: 2000
  },
  // Property preview
  property: {
    pitch: 50,
    bearing: 0,
    zoom: 16,
    duration: 1500
  }
};

/**
 * Apply a camera preset to the map
 */
export function applyCameraPreset(
  map: mapboxgl.Map,
  preset: keyof typeof cameraPresets,
  center?: [number, number]
): void {
  const config = cameraPresets[preset];
  
  map.easeTo({
    pitch: config.pitch,
    bearing: config.bearing,
    zoom: config.zoom,
    center,
    duration: config.duration || 1500,
    easing: (t) => t * (2 - t) // Ease out quad
  });
}

/**
 * Cinematic fly-to with rotation
 */
export function cinematicFlyTo(
  map: mapboxgl.Map,
  center: [number, number],
  options: {
    zoom?: number;
    pitch?: number;
    bearing?: number;
    duration?: number;
    curve?: number;
  } = {}
): void {
  const {
    zoom = 16,
    pitch = 55,
    bearing = -30,
    duration = 3000,
    curve = 1.5
  } = options;

  map.flyTo({
    center,
    zoom,
    pitch,
    bearing,
    duration,
    curve,
    essential: true,
    easing: (t) => {
      // Custom easing: slow start, fast middle, slow end
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  });
}

/**
 * Orbit animation around a point
 */
export function startOrbitAnimation(
  map: mapboxgl.Map,
  center: [number, number],
  options: {
    speed?: number; // degrees per frame
    pitch?: number;
    zoom?: number;
  } = {}
): () => void {
  const { speed = 0.3, pitch = 55, zoom = 16 } = options;
  let animationId: number;
  let bearing = map.getBearing();

  const rotateCamera = () => {
    bearing = (bearing + speed) % 360;
    map.rotateTo(bearing, { duration: 0 });
    animationId = requestAnimationFrame(rotateCamera);
  };

  // Set initial view
  map.jumpTo({
    center,
    pitch,
    zoom,
    bearing
  });

  animationId = requestAnimationFrame(rotateCamera);

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
  };
}

// ============================================
// COMPLETE 3D SCENE SETUP
// ============================================

export interface Scene3DOptions {
  terrain?: boolean;
  terrainExaggeration?: number;
  buildings?: boolean;
  buildingOptions?: {
    color?: string;
    opacity?: number;
    withShadows?: boolean;
  };
  fog?: FogPreset | false;
  sky?: 'day' | 'dusk' | 'night' | false;
  camera?: keyof typeof cameraPresets;
}

/**
 * Apply complete 3D scene configuration
 */
export function apply3DScene(
  map: mapboxgl.Map,
  options: Scene3DOptions = {}
): void {
  const {
    terrain = true,
    terrainExaggeration = 1.2,
    buildings = true,
    buildingOptions = {},
    fog = 'satellite',
    sky = false,
    camera
  } = options;

  // Apply terrain
  if (terrain) {
    addTerrain(map, terrainExaggeration);
  }

  // Apply fog/atmosphere
  if (fog) {
    setFogPreset(map, fog);
  }

  // Apply sky
  if (sky) {
    addSkyLayer(map, { preset: sky });
  }

  // Apply buildings (must be done after style is fully loaded)
  if (buildings) {
    if (buildingOptions.withShadows) {
      add3DBuildingsWithShadows(map, {
        baseColor: buildingOptions.color,
        opacity: buildingOptions.opacity
      });
    } else {
      add3DBuildings(map, {
        color: buildingOptions.color,
        opacity: buildingOptions.opacity
      });
    }
  }

  // Apply camera preset
  if (camera) {
    applyCameraPreset(map, camera);
  }
}

/**
 * Wait for style to load before applying 3D features
 */
export function on3DReady(map: mapboxgl.Map, callback: () => void): void {
  if (map.isStyleLoaded()) {
    // Small delay to ensure all sources are ready
    setTimeout(callback, 100);
  } else {
    map.once('style.load', () => {
      setTimeout(callback, 100);
    });
  }
}
