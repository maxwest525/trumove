import { useState } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryItemImageProps {
  src?: string;
  alt: string;
  fallbackIcon: LucideIcon;
  className?: string;
  iconClassName?: string;
}

export function InventoryItemImage({ 
  src, 
  alt, 
  fallbackIcon: FallbackIcon,
  className,
  iconClassName
}: InventoryItemImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // No image URL or error loading - show icon fallback
  if (!src || error) {
    return <FallbackIcon className={cn("w-12 h-12", iconClassName)} />;
  }

  return (
    <div className={cn("relative", className)}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted/60 animate-pulse rounded-md" />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-contain transition-opacity duration-200 mix-blend-multiply scale-125",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
}
