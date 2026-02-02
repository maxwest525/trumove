import { useState, useEffect } from "react";
import { Cloud, CloudRain, Sun, Snowflake, CloudFog, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WeatherData {
  location: string;
  temp: number;
  description: string;
  icon: string;
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
    <div className="tracking-map-weather-compact">
      {weather.map((w, index) => {
        const WeatherIcon = getWeatherIcon(w.icon);
        const isLast = index === weather.length - 1;
        
        return (
          <div key={index} className="tracking-map-weather-point">
            <WeatherIcon className="w-4 h-4 text-primary" />
            <span className="tracking-map-weather-temp">{w.temp}°F</span>
            {!isLast && <ArrowRight className="w-3 h-3 text-muted-foreground mx-1" />}
          </div>
        );
      })}
    </div>
  );
}
