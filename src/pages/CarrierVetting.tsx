import { useState, useCallback } from 'react';
import { Shield, Database, Radio, AlertTriangle, Users, Scale, Zap, Search, Info, ChevronDown, ExternalLink, FileCheck, TrendingUp, Truck } from 'lucide-react';

import SiteShell from '@/components/layout/SiteShell';
import { Button } from '@/components/ui/button';
import { ComparisonGrid } from '@/components/vetting/ComparisonGrid';
import { CarrierSearch } from '@/components/vetting/CarrierSearch';
import { useToast } from '@/hooks/use-toast';
import { MOCK_CARRIERS, MOCK_CARRIER_GOOD, MOCK_CARRIER_BAD, MOCK_CARRIER_MIXED, type MockCarrierData } from '@/data/mockCarriers';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

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
    description: 'Real-time authority status, insurance verification, and safety ratings',
    detail: 'Connects directly to the SAFER Web Services database for up-to-the-minute carrier information.'
  },
  {
    icon: AlertTriangle,
    title: 'Red Flag Detection',
    description: 'Automatic warnings for high-risk carriers based on safety metrics',
    detail: 'Flags: Revoked authority, lapsed insurance, high crash rates, CSA BASIC scores above intervention thresholds.'
  },
  {
    icon: Users,
    title: 'Side-by-Side Compare',
    description: 'Compare up to 4 carriers simultaneously',
    detail: 'View safety grades, insurance coverage, and compliance records in a comparison grid.'
  },
  {
    icon: Scale,
    title: 'Fleet Intelligence',
    description: 'Fleet size, crash history, and out-of-service rates',
    detail: 'Power units, drivers, MCS-150 filing date, OOS percentages vs national averages.'
  }
];

// Trust Strip content
const DATA_SOURCES = [
  {
    icon: Database,
    title: 'SAFER Web Services',
    description: 'Federal Motor Carrier Safety Administration database'
  },
  {
    icon: FileCheck,
    title: 'Real-Time Updates',
    description: 'Authority and insurance data refreshed continuously'
  },
  {
    icon: TrendingUp,
    title: 'CSA BASIC Scores',
    description: 'Compliance, Safety, Accountability metrics'
  }
];

export default function CarrierVetting() {
  const [carriers, setCarriers] = useState<CarrierData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load individual demo carrier
  const loadDemoCarrier = useCallback((carrier: MockCarrierData) => {
    // Check if already added
    if (carriers.some(c => c.carrier.dotNumber === carrier.carrier.dotNumber)) {
      toast({
        title: 'Already added',
        description: `${carrier.carrier.legalName} is already in your comparison.`,
        variant: 'destructive'
      });
      return;
    }

    // Check max limit
    if (carriers.length >= 4) {
      toast({
        title: 'Maximum reached',
        description: 'You can compare up to 4 carriers at once. Remove one to add another.',
        variant: 'destructive'
      });
      return;
    }

    setCarriers(prev => [...prev, carrier as CarrierData]);
    toast({
      title: 'Carrier Added',
      description: `${carrier.carrier.legalName} added to comparison.`,
    });
  }, [carriers, toast]);

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

  const clearAll = useCallback(() => {
    setCarriers([]);
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

        {/* Trust Strip - Data Source Explanation */}
        <div className="bg-muted/30 border-b border-border/50">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {DATA_SOURCES.map((source) => (
                <div key={source.title} className="flex items-center gap-3">
                  <source.icon className="w-5 h-5 text-primary shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{source.title}</p>
                    <p className="text-xs text-muted-foreground">{source.description}</p>
                  </div>
                </div>
              ))}
              <a 
                href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                Official FMCSA Source
                <ExternalLink className="w-3 h-3" />
              </a>
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
                  <div className="mt-3 flex items-center gap-2 text-sm text-white/60">
                    <Info className="w-3.5 h-3.5" />
                    <span>For best results, search by DOT# or MC#</span>
                  </div>
                </div>
              </div>

              {/* Features Grid - Horizontal Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {FEATURES.map((feature) => (
                  <div 
                    key={feature.title} 
                    className="fmcsa-feature-card group flex items-start gap-4"
                  >
                    <div className="shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                      <p className="text-xs text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity">
                        {feature.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Section */}
          {carriers.length > 0 && (
            <div className="flex gap-6">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Action Bar */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-foreground">
                      Carrier Comparison
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {carriers.length} of 4 carriers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={clearAll}>
                      Clear All
                    </Button>
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
              </div>

              {/* Right Sidebar */}
              <div className="hidden lg:block w-72 shrink-0">
                <div className="sticky top-24 space-y-4">
                  {/* Add Carrier */}
                  {carriers.length < 4 && (
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Add Carrier</h3>
                      <CarrierSearch onSelect={handleAddCarrier} className="text-sm" />
                    </div>
                  )}

                  {/* Risk Grade Legend */}
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Safety Grade Legend</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-green-500/10 text-green-600 font-bold">A+</span>
                        <span className="text-muted-foreground">Excellent - Top-tier safety</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-green-500/10 text-green-600 font-bold">A</span>
                        <span className="text-muted-foreground">Very Good - Minor concerns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-emerald-500/10 text-emerald-600 font-bold">B</span>
                        <span className="text-muted-foreground">Good - Generally safe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-amber-500/10 text-amber-600 font-bold">C</span>
                        <span className="text-muted-foreground">Moderate - Some issues</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-orange-500/10 text-orange-600 font-bold">D</span>
                        <span className="text-muted-foreground">Concerning - Review needed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-red-500/10 text-red-600 font-bold">F</span>
                        <span className="text-muted-foreground">High Risk - Avoid</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Comparison Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Carriers</span>
                        <span className="font-medium">{carriers.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Fleet</span>
                        <span className="font-medium font-mono">
                          {carriers.reduce((sum, c) => sum + c.fleet.powerUnits, 0)} units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Dropdown - Fixed position */}
        <div className="fixed bottom-6 right-6 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-background shadow-lg border-border"
              >
                <Truck className="w-4 h-4 mr-2" />
                Demo
                <ChevronDown className="w-3 h-3 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => loadDemoCarrier(MOCK_CARRIER_GOOD)}>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-5 flex items-center justify-center rounded bg-green-500/10 text-green-600 text-xs font-bold">A+</span>
                  <span>Sunrise Moving (Good)</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => loadDemoCarrier(MOCK_CARRIER_BAD)}>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-5 flex items-center justify-center rounded bg-red-500/10 text-red-600 text-xs font-bold">F</span>
                  <span>Fast & Cheap (Bad)</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => loadDemoCarrier(MOCK_CARRIER_MIXED)}>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-5 flex items-center justify-center rounded bg-amber-500/10 text-amber-600 text-xs font-bold">C</span>
                  <span>Regional Van Lines (Mixed)</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                MOCK_CARRIERS.forEach(c => loadDemoCarrier(c));
              }}>
                <span className="text-muted-foreground">Load All Demo Carriers</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </SiteShell>
  );
}
