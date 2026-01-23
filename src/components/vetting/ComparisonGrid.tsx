import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CarrierSnapshotCard } from './CarrierSnapshotCard';
import { CarrierSearch } from './CarrierSearch';
import { cn } from '@/lib/utils';

interface CarrierData {
  carrier: {
    legalName: string;
    dbaName: string;
    dotNumber: string;
    mcNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    phone: string;
  };
  authority: {
    commonStatus: string;
    contractStatus: string;
    brokerStatus: string;
    bipdInsurance: string;
    cargoInsurance: string;
    bondInsurance: string;
  };
  safety: {
    rating: string;
    ratingDate: string;
    reviewDate: string;
    reviewType: string;
  };
  basics: {
    unsafeDriving: { measure: number; percentile: number } | null;
    hoursOfService: { measure: number; percentile: number } | null;
    vehicleMaintenance: { measure: number; percentile: number } | null;
    controlledSubstances: { measure: number; percentile: number } | null;
    driverFitness: { measure: number; percentile: number } | null;
    crashIndicator: { measure: number; percentile: number } | null;
  };
  oos: {
    vehicleOosRate: number;
    vehicleOosRateNationalAvg: number;
    driverOosRate: number;
    driverOosRateNationalAvg: number;
    vehicleInspections: number;
    driverInspections: number;
  };
  fleet: {
    powerUnits: number;
    drivers: number;
    mcs150Date: string;
  };
  crashes: {
    fatal: number;
    injury: number;
    towAway: number;
    total: number;
  };
}

interface ComparisonGridProps {
  carriers: CarrierData[];
  onRemove: (index: number) => void;
  onAdd: (dotNumber: string) => void;
  isLoading?: boolean;
  maxCarriers?: number;
  className?: string;
}

export function ComparisonGrid({ 
  carriers, 
  onRemove, 
  onAdd, 
  isLoading,
  maxCarriers = 4,
  className 
}: ComparisonGridProps) {
  const [showSearch, setShowSearch] = useState(false);
  
  const canAddMore = carriers.length < maxCarriers;

  const handleAdd = (dotNumber: string) => {
    onAdd(dotNumber);
    setShowSearch(false);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Section */}
      {canAddMore && (
        <div className="space-y-3">
          {showSearch ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Search for a carrier to compare</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearch(false)}
                >
                  Cancel
                </Button>
              </div>
              <CarrierSearch onSelect={handleAdd} />
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full border-dashed h-14"
              onClick={() => setShowSearch(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Carrier to Compare ({carriers.length}/{maxCarriers})
            </Button>
          )}
        </div>
      )}

      {/* Carriers Grid */}
      {carriers.length > 0 ? (
        <div className={cn(
          'grid gap-4',
          carriers.length === 1 && 'grid-cols-1 max-w-xl',
          carriers.length === 2 && 'grid-cols-1 lg:grid-cols-2',
          carriers.length >= 3 && 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
          carriers.length >= 4 && 'grid-cols-1 lg:grid-cols-2'
        )}>
          {carriers.map((carrier, index) => (
            <CarrierSnapshotCard
              key={carrier.carrier.dotNumber}
              data={carrier}
              onRemove={() => onRemove(index)}
            />
          ))}
        </div>
      ) : (
        !showSearch && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No carriers to display</p>
            <p className="text-sm">Search for a carrier above to view their safety snapshot</p>
          </div>
        )
      )}
    </div>
  );
}
