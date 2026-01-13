import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { geocodeZip, generateArcPoints } from "@/lib/geocoding";

interface MoveMapProps {
  fromZip: string;
  toZip: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function MoveMap({ fromZip, toZip }: MoveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const fromMarker = useRef<mapboxgl.Marker | null>(null);
  const toMarker = useRef<mapboxgl.Marker | null>(null);
  const [fromCoords, setFromCoords] = useState<Coordinates | null>(null);
  const [toCoords, setToCoords] = useState<Coordinates | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    return localStorage.getItem("mapbox_token") || "";
  });
  const [showTokenInput, setShowTokenInput] = useState(!mapboxToken);

  // Geocode ZIP codes
  useEffect(() => {
    if (fromZip.length === 5) {
      geocodeZip(fromZip).then(setFromCoords);
    } else {
      setFromCoords(null);
    }
  }, [fromZip]);

  useEffect(() => {
    if (toZip.length === 5) {
      geocodeZip(toZip).then(setToCoords);
    } else {
      setToCoords(null);
    }
  }, [toZip]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [-98.5795, 39.8283], // Center of US
        zoom: 3,
        interactive: false,
        attributionControl: false,
      });

      map.current.on("error", () => {
        setShowTokenInput(true);
        localStorage.removeItem("mapbox_token");
      });
    } catch (error) {
      setShowTokenInput(true);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers and arc
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    fromMarker.current?.remove();
    toMarker.current?.remove();

    // Add from marker
    if (fromCoords) {
      const el = document.createElement("div");
      el.className = "move-map-marker move-map-marker-from";
      fromMarker.current = new mapboxgl.Marker(el)
        .setLngLat([fromCoords.lng, fromCoords.lat])
        .addTo(map.current);
    }

    // Add to marker
    if (toCoords) {
      const el = document.createElement("div");
      el.className = "move-map-marker move-map-marker-to";
      toMarker.current = new mapboxgl.Marker(el)
        .setLngLat([toCoords.lng, toCoords.lat])
        .addTo(map.current);
    }

    // Draw arc if both coordinates exist
    if (fromCoords && toCoords) {
      const arcPoints = generateArcPoints(fromCoords, toCoords);

      // Remove existing arc layer
      if (map.current.getLayer("arc-line")) {
        map.current.removeLayer("arc-line");
      }
      if (map.current.getSource("arc-source")) {
        map.current.removeSource("arc-source");
      }

      // Add arc line
      map.current.addSource("arc-source", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: arcPoints,
          },
        },
      });

      map.current.addLayer({
        id: "arc-line",
        type: "line",
        source: "arc-source",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#f59e0b",
          "line-width": 3,
          "line-dasharray": [2, 1],
        },
      });

      // Fit bounds to show both points
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([fromCoords.lng, fromCoords.lat]);
      bounds.extend([toCoords.lng, toCoords.lat]);
      map.current.fitBounds(bounds, { padding: 40, duration: 500 });
    } else if (fromCoords) {
      map.current.flyTo({ center: [fromCoords.lng, fromCoords.lat], zoom: 5 });
    } else if (toCoords) {
      map.current.flyTo({ center: [toCoords.lng, toCoords.lat], zoom: 5 });
    } else {
      // Reset to US view
      map.current.flyTo({ center: [-98.5795, 39.8283], zoom: 3 });
    }
  }, [fromCoords, toCoords]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector("input");
    const token = input?.value.trim();
    if (token) {
      localStorage.setItem("mapbox_token", token);
      setMapboxToken(token);
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <div className="move-map-token-prompt">
        <div className="move-map-token-content">
          <div className="move-map-token-icon">🗺️</div>
          <p className="move-map-token-title">Enter Mapbox Token</p>
          <p className="move-map-token-desc">
            Get your free token at{" "}
            <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer">
              mapbox.com
            </a>
          </p>
          <form onSubmit={handleTokenSubmit} className="move-map-token-form">
            <input
              type="text"
              placeholder="pk.eyJ1..."
              className="move-map-token-input"
            />
            <button type="submit" className="move-map-token-btn">
              Save
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="move-map-container">
      <div ref={mapContainer} className="move-map" />
      {!fromCoords && !toCoords && (
        <div className="move-map-placeholder">
          <span>Enter locations to see your route</span>
        </div>
      )}
    </div>
  );
}
