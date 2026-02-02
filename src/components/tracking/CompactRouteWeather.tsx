import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Snowflake, CloudFog, Loader2, ArrowRight, Wind, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface CompactRouteWeatherProps {
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
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

export function CompactRouteWeather({ 
  originCoords, 
  destCoords, 
  originName,
  destName 
}: CompactRouteWeatherProps) {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!originCoords || !destCoords) return;

    const fetchWeather = async () => {
      setLoading(true);

      try {
        // Build points array - origin, midpoint, and destination
        const points = [
          { lat: originCoords[1], lon: originCoords[0], name: originName || 'Origin' },
        ];

        // Calculate midpoint
        const midLat = (originCoords[1] + destCoords[1]) / 2;
        const midLon = (originCoords[0] + destCoords[0]) / 2;
        points.push({ lat: midLat, lon: midLon, name: 'En Route' });

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
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [originCoords, destCoords, originName, destName]);

  if (!originCoords || !destCoords) return null;

  if (loading && weather.length === 0) {
    return (
      <div className="tracking-map-weather-compact">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (weather.length === 0) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="tracking-map-weather-compact">
        {weather.map((w, index) => {
          const WeatherIcon = getWeatherIcon(w.icon);
          const isLast = index === weather.length - 1;
          
          return (
            <div key={index} className="tracking-map-weather-point-wrapper">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="tracking-map-weather-point">
                    <WeatherIcon className="w-4 h-4 text-primary" />
                    <span className="tracking-map-weather-temp">{w.temp}°F</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="tracking-weather-tooltip">
                  <div className="tracking-weather-tooltip-header">
                    <WeatherIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="tracking-weather-tooltip-location">{w.location}</div>
                      <div className="tracking-weather-tooltip-desc">{w.description}</div>
                    </div>
                  </div>
                  <div className="tracking-weather-tooltip-grid">
                    <div className="tracking-weather-tooltip-item">
                      <span className="tracking-weather-tooltip-label">Temp</span>
                      <span className="tracking-weather-tooltip-value">{w.temp}°F</span>
                    </div>
                    <div className="tracking-weather-tooltip-item">
                      <span className="tracking-weather-tooltip-label">Feels Like</span>
                      <span className="tracking-weather-tooltip-value">{w.feels_like}°F</span>
                    </div>
                    <div className="tracking-weather-tooltip-item">
                      <Droplets className="w-3 h-3 text-primary" />
                      <span className="tracking-weather-tooltip-label">Humidity</span>
                      <span className="tracking-weather-tooltip-value">{w.humidity}%</span>
                    </div>
                    <div className="tracking-weather-tooltip-item">
                      <Wind className="w-3 h-3 text-muted-foreground" />
                      <span className="tracking-weather-tooltip-label">Wind</span>
                      <span className="tracking-weather-tooltip-value">{w.wind_speed} mph</span>
                    </div>
                  </div>
                  <div className="tracking-weather-tooltip-vis">
                    Visibility: {w.visibility} mi
                  </div>
                </TooltipContent>
              </Tooltip>
              {!isLast && <ArrowRight className="w-3 h-3 text-muted-foreground mx-1" />}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
