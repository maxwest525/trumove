import { useState, useCallback } from 'react';
import { Shield, Truck, AlertTriangle, Users, TrendingUp, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SiteShell from '@/components/layout/SiteShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ComparisonGrid } from '@/components/vetting/ComparisonGrid';
import { CarrierSearch } from '@/components/vetting/CarrierSearch';
import { useToast } from '@/hooks/use-toast';

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

const FEATURES = [
  {
    icon: Shield,
    title: 'Live FMCSA Data',
    description: 'Real-time authority status, insurance verification, and safety ratings'
  },
  {
    icon: AlertTriangle,
    title: 'Red Flag Detection',
    description: 'Automatic warnings for high-risk carriers based on safety metrics'
  },
  {
    icon: TrendingUp,
    title: 'Side-by-Side Compare',
    description: 'Compare up to 4 carriers simultaneously to find the safest option'
  },
  {
    icon: Truck,
    title: 'Fleet Intelligence',
    description: 'View fleet size, crash history, and out-of-service rates'
  }
];

export default function CarrierLookup() {
  const [carriers, setCarriers] = useState<CarrierData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCarrierDetails = useCallback(async (dotNumber: string): Promise<CarrierData | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/carrier-lookup?dot=${dotNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Carrier not found');
        }
        throw new Error('Failed to fetch carrier details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching carrier:', error);
      throw error;
    }
  }, []);

  const handleAddCarrier = useCallback(async (dotNumber: string) => {
    // Check if already added
    if (carriers.some(c => c.carrier.dotNumber === dotNumber)) {
      toast({
        title: 'Already added',
        description: 'This carrier is already in your comparison.',
        variant: 'destructive'
      });
      return;
    }

    // Check max limit
    if (carriers.length >= 4) {
      toast({
        title: 'Maximum reached',
        description: 'You can compare up to 4 carriers at once.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchCarrierDetails(dotNumber);
      if (data) {
        setCarriers(prev => [...prev, data]);
        toast({
          title: 'Carrier added',
          description: `${data.carrier.legalName} has been added to comparison.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load carrier data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [carriers, fetchCarrierDetails, toast]);

  const handleRemoveCarrier = useCallback((index: number) => {
    setCarriers(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <SiteShell>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/vetting">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Vetting
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">Carrier Lookup</h1>
                  <p className="text-xs text-muted-foreground">Real-time FMCSA data & comparison</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live Data
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section - Show when no carriers */}
          {carriers.length === 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Instant Carrier Intelligence
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Search any moving company to view their FMCSA safety data, insurance status, 
                  and compare multiple carriers side-by-side.
                </p>
              </div>

              {/* Search */}
              <div className="max-w-2xl mx-auto mb-12">
                <CarrierSearch onSelect={handleAddCarrier} />
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {FEATURES.map((feature) => (
                  <Card key={feature.title} className="bg-card/50 border-border/50">
                    <CardContent className="p-5">
                      <feature.icon className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Grid */}
          <ComparisonGrid
            carriers={carriers}
            onRemove={handleRemoveCarrier}
            onAdd={handleAddCarrier}
            isLoading={isLoading}
            maxCarriers={4}
          />

          {/* Tips Section */}
          {carriers.length > 0 && carriers.length < 2 && (
            <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">Pro Tip</p>
                  <p className="text-sm text-muted-foreground">
                    Add another carrier to compare their safety metrics side-by-side. 
                    This helps customers see why TruMove partners are the safer choice.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
