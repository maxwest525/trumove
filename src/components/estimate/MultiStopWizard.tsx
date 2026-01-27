import { useState, useCallback, useMemo, useEffect } from "react";
import { MapPin, Truck, ArrowRight, ChevronLeft, Route, Sparkles } from "lucide-react";
import MultiStopLocationList, { type StopLocation } from "./MultiStopLocationList";
import RouteOptimizationCard from "./RouteOptimizationCard";
import { useRouteOptimization, type Waypoint } from "@/hooks/useRouteOptimization";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MultiStopMoveDetails {
  pickupLocations: StopLocation[];
  dropoffLocations: StopLocation[];
  optimizedRoute: {
    totalDistance: number;
    totalDuration: number;
    savings: { distancePercent: number; durationPercent: number };
    optimizedOrder: number[];
  } | null;
}

interface MultiStopWizardProps {
  onComplete: (details: MultiStopMoveDetails) => void;
  onBack: () => void;
  initialPickups?: StopLocation[];
  initialDropoffs?: StopLocation[];
}

const createInitialLocation = (type: 'pickup' | 'dropoff'): StopLocation => ({
  id: crypto.randomUUID(),
  address: '',
  coords: null,
  validated: false,
  order: 0,
});

export default function MultiStopWizard({
  onComplete,
  onBack,
  initialPickups,
  initialDropoffs,
}: MultiStopWizardProps) {
  const [pickupLocations, setPickupLocations] = useState<StopLocation[]>(
    initialPickups?.length ? initialPickups : [createInitialLocation('pickup')]
  );
  const [dropoffLocations, setDropoffLocations] = useState<StopLocation[]>(
    initialDropoffs?.length ? initialDropoffs : [createInitialLocation('dropoff')]
  );

  const { optimize, isOptimizing, result, error, clearResult } = useRouteOptimization();

  // Combine all locations into waypoints for optimization
  const allWaypoints = useMemo((): Waypoint[] => {
    const pickups: Waypoint[] = pickupLocations
      .filter((l) => l.validated && l.coords)
      .map((l) => ({
        lat: l.coords![0],
        lng: l.coords![1],
        label: `Pickup: ${l.address.split(',')[0]}`,
        address: l.address,
        type: 'pickup' as const,
      }));

    const dropoffs: Waypoint[] = dropoffLocations
      .filter((l) => l.validated && l.coords)
      .map((l) => ({
        lat: l.coords![0],
        lng: l.coords![1],
        label: `Drop-off: ${l.address.split(',')[0]}`,
        address: l.address,
        type: 'dropoff' as const,
      }));

    return [...pickups, ...dropoffs];
  }, [pickupLocations, dropoffLocations]);

  const waypointLabels = useMemo(() => 
    allWaypoints.map((w) => w.label || w.address.split(',')[0]),
    [allWaypoints]
  );

  const validPickups = pickupLocations.filter((l) => l.validated).length;
  const validDropoffs = dropoffLocations.filter((l) => l.validated).length;
  const canOptimize = validPickups >= 1 && validDropoffs >= 1 && allWaypoints.length >= 2;
  const canContinue = validPickups >= 1 && validDropoffs >= 1;

  // Clear optimization result when locations change
  useEffect(() => {
    clearResult();
  }, [pickupLocations, dropoffLocations, clearResult]);

  const handleOptimize = useCallback(async () => {
    if (!canOptimize) return;
    await optimize(allWaypoints);
  }, [canOptimize, optimize, allWaypoints]);

  const handleContinue = useCallback(() => {
    onComplete({
      pickupLocations,
      dropoffLocations,
      optimizedRoute: result
        ? {
            totalDistance: result.totalDistance,
            totalDuration: result.totalDuration,
            savings: result.savings,
            optimizedOrder: result.optimizedOrder,
          }
        : null,
    });
  }, [onComplete, pickupLocations, dropoffLocations, result]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-foreground">Multi-Stop Move</h2>
          <p className="text-sm text-muted-foreground">Add multiple pickup and drop-off locations</p>
        </div>
      </div>

      {/* Pickup Locations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Pickup Locations</h3>
            <p className="text-xs text-muted-foreground">Where we'll collect your items</p>
          </div>
        </div>
        
        <MultiStopLocationList
          locations={pickupLocations}
          onLocationsChange={setPickupLocations}
          type="pickup"
          maxLocations={5}
          minLocations={1}
        />
      </div>

      {/* Drop-off Locations */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center">
            <Truck className="w-4 h-4 text-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Drop-off Locations</h3>
            <p className="text-xs text-muted-foreground">Where we'll deliver your items</p>
          </div>
        </div>
        
        <MultiStopLocationList
          locations={dropoffLocations}
          onLocationsChange={setDropoffLocations}
          type="dropoff"
          maxLocations={5}
          minLocations={1}
        />
      </div>

      {/* Route Optimization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Route Optimization</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleOptimize}
            disabled={!canOptimize || isOptimizing}
            className="gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
          </Button>
        </div>
        
        <RouteOptimizationCard
          result={result}
          isOptimizing={isOptimizing}
          error={error}
          waypointLabels={waypointLabels}
        />
      </div>

      {/* Continue Button */}
      <div className="pt-4 border-t border-border/40">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full gap-2"
          size="lg"
        >
          <span>Continue to Move Details</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        
        {!canContinue && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Add at least one valid pickup and one drop-off location
          </p>
        )}
      </div>
    </div>
  );
}
