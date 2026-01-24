import { MapPin, Route, Radar, Truck, CheckCircle } from "lucide-react";

interface RouteAnalysisSectionProps {
  fromCity: string;
  toCity: string;
  distance: number;
  isAnalyzing?: boolean;
}

export default function RouteAnalysisSection({ 
  fromCity, 
  toCity, 
  distance, 
  isAnalyzing = false 
}: RouteAnalysisSectionProps) {
  const hasRoute = fromCity && toCity && distance > 0;

  if (!hasRoute && !isAnalyzing) return null;

  return (
    <section className="tru-route-analysis-section">
      <div className="tru-route-analysis-inner">
        <div className="tru-route-analysis-header">
          <Radar className={`w-5 h-5 ${isAnalyzing ? 'tru-analyzing-spin' : ''}`} />
          <h3 className="tru-route-analysis-title">
            {isAnalyzing ? "Analyzing your move in real time" : "Building your personalized move profile"}
          </h3>
        </div>

        <p className="tru-route-analysis-desc">
          We validate cities, analyze distance and access, prepare carrier matching, and estimate weight and volume.
        </p>

        <div className="tru-route-analysis-grid">
          {/* Origin */}
          <div className={`tru-route-analysis-location ${fromCity ? 'is-validated' : ''}`}>
            <div className="tru-route-location-icon">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="tru-route-location-content">
              <span className="tru-route-location-label">Origin</span>
              <span className="tru-route-location-value">
                {fromCity || "Enter origin..."}
              </span>
            </div>
            {fromCity && <CheckCircle className="w-4 h-4 tru-route-check" />}
          </div>

          {/* Route Line */}
          <div className="tru-route-analysis-connector">
            <div className={`tru-route-line ${hasRoute ? 'is-active' : ''}`} />
            {distance > 0 && (
              <span className="tru-route-distance-badge">{distance.toLocaleString()} mi</span>
            )}
          </div>

          {/* Destination */}
          <div className={`tru-route-analysis-location ${toCity ? 'is-validated' : ''}`}>
            <div className="tru-route-location-icon">
              <Truck className="w-4 h-4" />
            </div>
            <div className="tru-route-location-content">
              <span className="tru-route-location-label">Destination</span>
              <span className="tru-route-location-value">
                {toCity || "Enter destination..."}
              </span>
            </div>
            {toCity && <CheckCircle className="w-4 h-4 tru-route-check" />}
          </div>
        </div>

        {hasRoute && (
          <div className="tru-route-analysis-status">
            <div className="tru-route-status-item">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Cities validated</span>
            </div>
            <div className="tru-route-status-item">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Distance calculated</span>
            </div>
            <div className="tru-route-status-item">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Carrier matching ready</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
