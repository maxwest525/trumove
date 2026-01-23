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

// Trust Strip content - expanded for better visual distribution
const DATA_SOURCES = [
  {
    icon: Database,
    title: 'SAFER Web Services',
    description: 'Official FMCSA database'
  },
  {
    icon: FileCheck,
    title: 'Real-Time Updates',
    description: 'Continuous data refresh'
  },
  {
    icon: TrendingUp,
    title: 'CSA BASIC Scores',
    description: 'Safety accountability metrics'
  },
  {
    icon: Shield,
    title: 'Authority Verification',
    description: 'Operating status confirmed'
  },
  {
    icon: Truck,
    title: 'Insurance Coverage',
    description: 'BIPD & cargo verified'
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
        {/* Government-style Header - LOCKED */}
        <div className="fmcsa-header sticky top-0 z-50 bg-slate-900">
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

        {/* Trust Strip - LOCKED below header */}
        <div className="bg-muted/95 border-b border-border/50 sticky top-[72px] z-40 backdrop-blur-md">
          <div className="container max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {DATA_SOURCES.map((source) => (
                <div key={source.title} className="flex items-center gap-2">
                  <source.icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-medium text-foreground">{source.title}</p>
                  </div>
                </div>
              ))}
              <a 
                href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 underline font-medium"
              >
                Official FMCSA Source
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Compact Hero Section - Only show when no carriers */}
          {carriers.length === 0 && (
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Verify Any Carrier in Seconds
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time FMCSA safety data • Insurance verification • DOT lookup
              </p>
            </div>
          )}

          {/* FMCSA Terminal - Always Visible */}
          <div className="fmcsa-terminal max-w-2xl mx-auto mb-6">
            <div className="fmcsa-terminal-header">
              <div className="fmcsa-terminal-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="fmcsa-terminal-title">SAFER DATABASE QUERY</span>
              <div className="ml-auto flex items-center gap-2">
                <img src="https://www.fmcsa.dot.gov/themes/custom/fmcsa/logo.svg" alt="FMCSA" className="h-5 brightness-0 invert opacity-70" />
              </div>
            </div>
            <div className="fmcsa-terminal-body">
              <div className="mb-5 text-center">
                <h3 
                  className="text-xl md:text-2xl font-bold tracking-wide text-white/80"
                  style={{ 
                    textShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.3)',
                    letterSpacing: '0.05em'
                  }}
                >
                  FMCSA-Verified Carrier Safety Records
                </h3>
              </div>
              <CarrierSearch onSelect={handleAddCarrier} isLoading={isLoading} />
              <p className="text-xs text-white/60 leading-relaxed mt-4 text-center">
                All carriers are filtered and continuously monitored per official FMCSA Safety Measurement System (SMS) criteria and federal compliance standards. Click any card for detailed report including Behavior Analysis and Safety Improvement Categories (BASICs), roadside inspection results, crash involvement, and safety fitness evaluation.
              </p>
            </div>
          </div>

          {/* Compact Benefits Strip - Only show when no carriers */}
          {carriers.length === 0 && (
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-primary" />
                Live FMCSA Data
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Red Flag Alerts
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary" />
                Side-by-Side Compare
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-primary" />
                Fleet Intelligence
              </span>
            </div>
          )}

          {/* Results Header - Only when carriers exist */}
          {carriers.length > 0 && (
            <div className="mt-10 mb-8 max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Carrier Safety Comparison
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Side-by-side analysis of FMCSA safety records, compliance scores, and risk indicators
              </p>
              <div className="w-24 h-1 bg-primary/60 mx-auto mt-4 rounded-full" />
            </div>
          )}

          {/* Results Section */}
          {carriers.length > 0 && (
            <div className="flex gap-6">
              {/* Main Content */}
              <div className="flex-1 min-w-0">
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
                <div className="sticky top-36 space-y-4">
                  {/* Add Carrier */}
                  {carriers.length < 4 && (
                    <div className="p-3 rounded-xl border border-border bg-card">
                      <h3 className="text-xs font-semibold text-foreground mb-2">Add Carrier</h3>
                      <CarrierSearch 
                        onSelect={handleAddCarrier} 
                        isLoading={isLoading}
                        className="sidebar-search"
                      />
                      {/* Clear All - Pill button with border */}
                      {carriers.length > 0 && (
                        <button 
                          onClick={clearAll}
                          className="w-full mt-2 text-[10px] text-muted-foreground hover:text-destructive bg-muted/50 hover:bg-destructive/10 border border-border text-center py-1 px-2 rounded-full transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  )}

                  {/* Risk Grade Legend */}
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-3">Safety Grade Legend</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-green-500/10 text-green-600 font-bold">A+</span>
                        <span className="text-muted-foreground">Excellent - Top-tier</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-green-500/10 text-green-600 font-bold">A</span>
                        <span className="text-muted-foreground">Very Good</span>
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
                        <span className="text-muted-foreground">Concerning</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 flex items-center justify-center rounded bg-red-500/10 text-red-600 font-bold">F</span>
                        <span className="text-muted-foreground">High Risk - Avoid</span>
                      </div>
                    </div>
                  </div>

                  {/* CSA BASIC Scores Legend */}
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      CSA BASIC Safety Scores
                    </h3>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-foreground w-16 shrink-0">Unsafe</span>
                        <span>Speeding, reckless driving</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-foreground w-16 shrink-0">HOS</span>
                        <span>Hours of Service fatigue</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-foreground w-16 shrink-0">Vehicle</span>
                        <span>Brake, equipment defects</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-foreground w-16 shrink-0">Fitness</span>
                        <span>Licensing, medical certs</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-foreground w-16 shrink-0">Crash</span>
                        <span>Crash involvement</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-medium text-foreground w-16 shrink-0">Drugs</span>
                        <span>Substance violations</span>
                      </div>
                      <p className="pt-2 text-[11px] border-t border-border/50 mt-2">
                        Higher percentiles indicate worse performance relative to peers. Scores ≥65% may trigger FMCSA intervention.
                      </p>
                    </div>
                  </div>
                  
                  {/* Insurance Coverage Analysis */}
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Insurance Coverage Analysis
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Federal minimums: $750K BIPD for general freight, $5M for hazmat. Cargo insurance varies by commodity.
                    </p>
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
