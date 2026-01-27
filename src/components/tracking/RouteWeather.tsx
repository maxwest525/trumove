import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Wind, Snowflake, CloudFog, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

interface RouteWeatherProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  currentPosition?: [number, number] | null;
  originName?: string;
  destName?: string;
}

// Get weather icon component based on OpenWeather icon code
function getWeatherIcon(iconCode: string) {
  const code = iconCode.slice(0, 2);
  switch (code) {
    case '01': return Sun;
    case '02':
    case '03':
    case '04': return Cloud;
    case '09':
    case '10': return CloudRain;
    case '11': return CloudRain;
    case '13': return Snowflake;
    case '50': return CloudFog;
    default: return Cloud;
  }
}

export function RouteWeather({ 
  originCoords, 
  destCoords, 
  currentPosition,
  originName,
  destName 
}: RouteWeatherProps) {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originCoords || !destCoords) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build points array - origin, current position (if available), and destination
        const points = [
          { lat: originCoords[1], lon: originCoords[0], name: originName || 'Origin' },
        ];

        // Add midpoint or current position for "along the route" weather
        if (currentPosition) {
          points.push({ 
            lat: currentPosition[1], 
            lon: currentPosition[0], 
            name: 'Current Location' 
          });
        } else {
          // Calculate midpoint
          const midLat = (originCoords[1] + destCoords[1]) / 2;
          const midLon = (originCoords[0] + destCoords[0]) / 2;
          points.push({ lat: midLat, lon: midLon, name: 'En Route' });
        }

        points.push({ 
          lat: destCoords[1], 
          lon: destCoords[0], 
          name: destName || 'Destination' 
        });

        const { data, error: fnError } = await supabase.functions.invoke('weather-route', {
          body: { points }
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data?.weather) {
          setWeather(data.weather);
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to load weather');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [originCoords, destCoords, currentPosition, originName, destName]);

  if (!originCoords || !destCoords) return null;

  if (loading && weather.length === 0) {
    return (
      <div className="tracking-weather-strip">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span className="text-xs text-white/50">Loading weather...</span>
      </div>
    );
  }

  if (error || weather.length === 0) {
    return null;
  }

  return (
    <div className="tracking-weather-strip">
      <div className="tracking-weather-label">
        <Cloud className="w-3.5 h-3.5" />
        <span>ROUTE CONDITIONS</span>
      </div>
      
      <div className="tracking-weather-cards">
        {weather.map((w, index) => {
          const WeatherIcon = getWeatherIcon(w.icon);
          return (
            <div key={index} className="tracking-weather-card">
              <div className="tracking-weather-location">{w.location}</div>
              <div className="tracking-weather-main">
                <WeatherIcon className="w-5 h-5 text-primary" />
                <span className="tracking-weather-temp">{w.temp}°F</span>
              </div>
              <div className="tracking-weather-desc">{w.description}</div>
              <div className="tracking-weather-details">
                <span><Wind className="w-3 h-3" /> {w.wind_speed} mph</span>
                <span>{w.visibility} mi vis</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
