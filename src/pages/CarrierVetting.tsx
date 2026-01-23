import { useState, useCallback, useEffect } from 'react';
import { Shield, Database, Radio, AlertTriangle, Users, Scale, Zap, Search, Info } from 'lucide-react';

import SiteShell from '@/components/layout/SiteShell';
import { Button } from '@/components/ui/button';
import { ComparisonGrid } from '@/components/vetting/ComparisonGrid';
import { CarrierSearch } from '@/components/vetting/CarrierSearch';
import { useToast } from '@/hooks/use-toast';
import { MOCK_CARRIERS, type MockCarrierData } from '@/data/mockCarriers';
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

const FEATURES = [
  {
    icon: Radio,
    title: 'Live FMCSA Data',
    description: 'Real-time authority status, insurance verification, and safety ratings from federal databases'
  },
  {
    icon: AlertTriangle,
    title: 'Red Flag Detection',
    description: 'Automatic warnings for high-risk carriers based on CSA BASIC scores and compliance history'
  },
  {
    icon: Users,
    title: 'Side-by-Side Compare',
    description: 'Compare up to 4 carriers simultaneously to identify the safest, most compliant option'
  },
  {
    icon: Scale,
    title: 'Fleet Intelligence',
    description: 'View fleet size, crash history, out-of-service rates, and inspection records'
  }
];

export default function CarrierVetting() {
  const [carriers, setCarriers] = useState<CarrierData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const { toast } = useToast();

  // Load demo carriers
  const loadDemoCarriers = useCallback(() => {
    setCarriers(MOCK_CARRIERS as CarrierData[]);
    setDemoMode(true);
    toast({
      title: 'Demo Mode Active',
      description: '3 sample carriers loaded for demonstration.',
    });
  }, [toast]);

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
        setDemoMode(false);
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
    setCarriers(prev => {
      const newCarriers = prev.filter((_, i) => i !== index);
      if (newCarriers.length === 0) setDemoMode(false);
      return newCarriers;
    });
  }, []);

  const clearAll = useCallback(() => {
    setCarriers([]);
    setDemoMode(false);
  }, []);

  return (
    <SiteShell>
      <div className="min-h-screen bg-background">
        {/* Government-style Header */}
        <div className="fmcsa-header">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="fmcsa-shield">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                    FMCSA Carrier Vetting
                  </h1>
                  <p className="text-xs text-white/60">
                    Safety & Fitness Electronic Records System (SAFER)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="fmcsa-badge">
                  <Database className="w-3.5 h-3.5" />
                  <span>SAFER Web Services</span>
                </div>
                <div className="fmcsa-live-indicator">
                  <div className="fmcsa-live-dot" />
                  <span>Live Data</span>
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Zap className="w-4 h-4" />
                  Instant Carrier Intelligence
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Verify Any Moving Company in Seconds
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
                  Access real-time FMCSA safety data, insurance status, and compliance records 
                  for any DOT-registered carrier in the United States.
                </p>
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  Search by DOT#, MC#, or company name • Compare up to 4 carriers side-by-side
                </p>
              </div>

              {/* Search Section - Dark Terminal Style */}
              <div className="fmcsa-terminal max-w-2xl mx-auto mb-8">
                <div className="fmcsa-terminal-header">
                  <div className="fmcsa-terminal-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="fmcsa-terminal-title">SAFER DATABASE QUERY</span>
                </div>
                <div className="fmcsa-terminal-body">
                  <CarrierSearch onSelect={handleAddCarrier} />
                  <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
                    <Info className="w-3 h-3" />
                    <span>For best results, search by DOT# or MC#</span>
                  </div>
                </div>
              </div>

              {/* Demo Button */}
              <div className="text-center mb-12">
                <Button 
                  variant="outline" 
                  onClick={loadDemoCarriers}
                  className="border-dashed"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Load Demo Carriers
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  See how it works with sample data
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {FEATURES.map((feature) => (
                  <div key={feature.title} className="fmcsa-feature-card">
                    <feature.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Section */}
          {carriers.length > 0 && (
            <>
              {/* Action Bar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-foreground">
                    Carrier Comparison
                  </h2>
                  {demoMode && (
                    <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-600 text-xs font-medium">
                      Demo Mode
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                  {demoMode && (
                    <Button variant="outline" size="sm" onClick={() => {
                      setCarriers([]);
                      setDemoMode(false);
                    }}>
                      <Search className="w-4 h-4 mr-2" />
                      Search Real Carriers
                    </Button>
                  )}
                </div>
              </div>

              {/* Comparison Grid */}
              <ComparisonGrid
                carriers={carriers}
                onRemove={handleRemoveCarrier}
                onAdd={handleAddCarrier}
                isLoading={isLoading}
                maxCarriers={4}
              />

              {/* Tips Section */}
              {carriers.length < 2 && (
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
            </>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
