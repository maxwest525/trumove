import { useState } from 'react';
import { Phone, MapPin, Truck, Shield, AlertTriangle, CheckCircle2, XCircle, Calendar, FileWarning, X, ChevronDown, ChevronUp, ExternalLink, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RedFlagBadge, generateRedFlags, type CarrierData as BaseCarrierData } from './RedFlagBadge';
import { cn } from '@/lib/utils';

// Extended type with full crashes data
interface ExtendedCarrierData extends BaseCarrierData {
  carrier: {
    legalName: string;
    dbaName: string;
    dotNumber: string;
    mcNumber: string;
    address: {
      city: string;
      state: string;
    };
    phone: string;
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

interface CarrierSnapshotCardProps {
  data: ExtendedCarrierData;
  onRemove?: () => void;
  className?: string;
}

// Calculate risk grade based on carrier data
function calculateRiskGrade(data: ExtendedCarrierData): { grade: string; label: string; color: string; isTruMoveVerified: boolean } {
  let score = 100;
  
  // Authority status (-40 for inactive/revoked)
  if (data.authority.commonStatus === 'REVOKED') score -= 50;
  else if (data.authority.commonStatus === 'INACTIVE' || data.authority.commonStatus === 'NOT AUTHORIZED') score -= 40;
  
  // Insurance gaps
  const bipdAmount = parseInt(data.authority.bipdInsurance?.replace(/[^0-9]/g, '') || '0');
  const cargoAmount = parseInt(data.authority.cargoInsurance?.replace(/[^0-9]/g, '') || '0');
  if (bipdAmount < 750000) score -= 15;
  if (cargoAmount < 100000) score -= 10;
  
  // BASIC scores (higher percentile = worse)
  const basicScores = [
    data.basics.unsafeDriving?.percentile,
    data.basics.hoursOfService?.percentile,
    data.basics.vehicleMaintenance?.percentile,
    data.basics.crashIndicator?.percentile,
    data.basics.driverFitness?.percentile,
  ].filter(s => s !== null && s !== undefined) as number[];
  
  const hasRedFlags = basicScores.some(p => p >= 65);
  
  basicScores.forEach(percentile => {
    if (percentile >= 75) score -= 8;
    else if (percentile >= 65) score -= 4;
  });
  
  // Crashes (-15 for fatal, -5 for injury)
  if (data.crashes.fatal > 0) score -= 15 * data.crashes.fatal;
  if (data.crashes.injury > 0) score -= 5 * Math.min(data.crashes.injury, 3);
  
  // Safety rating
  if (data.safety.rating === 'UNSATISFACTORY') score -= 25;
  else if (data.safety.rating === 'CONDITIONAL') score -= 15;
  
  // TruMove Verified: A+ or A grade, active authority, no red flags
  const isActive = data.authority.commonStatus === 'ACTIVE' || data.authority.commonStatus === 'AUTHORIZED';
  const isTruMoveVerified = score >= 80 && isActive && !hasRedFlags && data.crashes.fatal === 0;
  
  // Determine grade
  if (score >= 90) return { grade: 'A+', label: 'Excellent', color: 'text-green-500 bg-green-500/10 border-green-500/30', isTruMoveVerified };
  if (score >= 80) return { grade: 'A', label: 'Very Good', color: 'text-green-500 bg-green-500/10 border-green-500/30', isTruMoveVerified };
  if (score >= 70) return { grade: 'B', label: 'Good', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', isTruMoveVerified: false };
  if (score >= 60) return { grade: 'C', label: 'Moderate', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30', isTruMoveVerified: false };
  if (score >= 45) return { grade: 'D', label: 'Concerning', color: 'text-orange-500 bg-orange-500/10 border-orange-500/30', isTruMoveVerified: false };
  return { grade: 'F', label: 'High Risk', color: 'text-red-500 bg-red-500/10 border-red-500/30', isTruMoveVerified: false };
}

function AuthorityBadge({ status }: { status: string }) {
  const isActive = status === 'ACTIVE' || status === 'AUTHORIZED';
  const isInactive = status === 'INACTIVE' || status === 'NOT AUTHORIZED';
  const isRevoked = status === 'REVOKED';

  if (isActive) {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-semibold">ACTIVE</span>
      </div>
    );
  }

  if (isRevoked) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <XCircle className="w-5 h-5" />
        <span className="font-semibold">REVOKED</span>
      </div>
    );
  }

  if (isInactive) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <XCircle className="w-5 h-5" />
        <span className="font-semibold">INACTIVE</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <AlertTriangle className="w-5 h-5" />
      <span className="font-semibold">{status || 'UNKNOWN'}</span>
    </div>
  );
}

function BasicScoreBar({ name, percentile, threshold = 65 }: { name: string; percentile: number | null; threshold?: number }) {
  if (percentile === null) {
    return (
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-muted-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">N/A</span>
      </div>
    );
  }

  const getColor = () => {
    if (percentile >= 75) return 'bg-red-500';
    if (percentile >= threshold) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{name}</span>
        <span className={cn(
          'text-xs font-medium',
          percentile >= 75 ? 'text-red-500' : 
          percentile >= threshold ? 'text-amber-500' : 'text-green-500'
        )}>
          {percentile}%
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all', getColor())}
          style={{ width: `${Math.min(percentile, 100)}%` }}
        />
      </div>
    </div>
  );
}

function InsuranceBar({ label, amount, required }: { label: string; amount: string; required: number }) {
  const parseAmount = (value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  const amountNum = parseAmount(amount);
  const percentage = Math.min((amountNum / required) * 100, 100);
  const isSufficient = amountNum >= required;

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num}`;
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn(
          'text-xs font-medium',
          isSufficient ? 'text-green-500' : 'text-red-500'
        )}>
          {formatCurrency(amountNum)}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full transition-all',
            isSufficient ? 'bg-green-500' : 'bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-[10px] text-muted-foreground text-right">
        Required: {formatCurrency(required)}
      </div>
    </div>
  );
}

// Generate external review links with logos
function ExternalLinks({ companyName, dotNumber }: { companyName: string; dotNumber: string }) {
  const encodedName = encodeURIComponent(companyName);
  
  return (
    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
      <a
        href={`https://www.bbb.org/search?find_text=${encodedName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        title="Check BBB Profile"
      >
        <img 
          src="https://www.bbb.org/TerminusContent/dist/img/business-profile/accreditation/ab-seal-horizontal.svg" 
          alt="BBB" 
          className="h-6 object-contain"
          onError={(e) => { e.currentTarget.outerHTML = '<span class="font-bold text-blue-600">BBB</span>'; }}
        />
      </a>
      <a
        href={`https://www.google.com/search?q=${encodedName}+reviews`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        title="Google Reviews"
      >
        <img 
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
          alt="Google" 
          className="h-5 object-contain"
          onError={(e) => { e.currentTarget.outerHTML = '<span class="font-bold text-amber-600">Google</span>'; }}
        />
      </a>
      <a
        href={`https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${dotNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        title="Official FMCSA SAFER"
      >
        <img 
          src="https://www.fmcsa.dot.gov/themes/custom/fmcsa/logo.svg" 
          alt="FMCSA" 
          className="h-5 object-contain dark:invert"
          onError={(e) => { e.currentTarget.outerHTML = '<span class="font-bold text-slate-600">FMCSA</span>'; }}
        />
      </a>
    </div>
  );
}

export function CarrierSnapshotCard({ data, onRemove, className }: CarrierSnapshotCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const redFlags = generateRedFlags(data);
  const criticalFlags = redFlags.filter(f => f.severity === 'critical');
  const riskGrade = calculateRiskGrade(data);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  // Format insurance for summary
  const formatInsurance = () => {
    const bipdAmount = parseInt(data.authority.bipdInsurance?.replace(/[^0-9]/g, '') || '0');
    if (bipdAmount >= 1000000) return `$${(bipdAmount / 1000000).toFixed(1)}M Insured`;
    if (bipdAmount >= 1000) return `$${(bipdAmount / 1000).toFixed(0)}K Insured`;
    return 'Insurance Unknown';
  };

  // Get the worst BASIC score for summary
  const getWorstBasic = () => {
    const scores = [
      { name: 'Crash', value: data.basics.crashIndicator?.percentile },
      { name: 'Unsafe', value: data.basics.unsafeDriving?.percentile },
      { name: 'HOS', value: data.basics.hoursOfService?.percentile },
    ].filter(s => s.value !== null && s.value !== undefined);
    
    if (scores.length === 0) return null;
    return scores.reduce((worst, current) => 
      (current.value! > (worst.value || 0)) ? current : worst
    );
  };

  const worstBasic = getWorstBasic();

  return (
    <div className="relative">

      <Card className={cn(
        'bg-card/80 backdrop-blur border-border/50 overflow-hidden transition-all',
        criticalFlags.length > 0 && 'border-red-500/50',
        className
      )}>
        <CardHeader className="pb-3 relative">
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {/* Carrier Identity - DBA, DOT, MC at TOP */}
          <div className="space-y-2 pr-8">
            <div>
              <h3 className="font-semibold text-lg text-foreground leading-tight">
                {data.carrier.dbaName || data.carrier.legalName}
              </h3>
              {data.carrier.dbaName && data.carrier.dbaName !== data.carrier.legalName && (
                <p className="text-xs text-muted-foreground">Legal: {data.carrier.legalName}</p>
              )}
            </div>
            
            {/* DOT & MC Numbers - Prominent */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs font-mono font-semibold">
                DOT {data.carrier.dotNumber}
              </Badge>
              {data.carrier.mcNumber && (
                <Badge variant="outline" className="text-xs font-mono">
                  {data.carrier.mcNumber}
                </Badge>
              )}
              {/* Risk Grade - Small inline badge */}
              <div className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded border text-xs ml-auto',
                riskGrade.color
              )}>
                <span className="font-bold">{riskGrade.grade}</span>
              </div>
            </div>
            
            {/* TruMove Verified - Inline subtle */}
            {riskGrade.isTruMoveVerified && (
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-slate-600 dark:text-slate-400">TruMove Verified Partner</span>
              </div>
            )}
          </div>
        </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats - Always visible */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-xs font-medium text-muted-foreground mb-1">Authority Status</div>
            <AuthorityBadge status={data.authority.commonStatus} />
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="text-xs font-medium text-muted-foreground mb-1">BIPD Liability</div>
            <span className="text-sm font-semibold text-foreground">{formatInsurance()}</span>
          </div>
        </div>

        {/* Technical Quick Stats */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2 py-1 rounded bg-muted/50 font-mono text-muted-foreground">
            {data.fleet.powerUnits} Power Units
          </span>
          <span className="px-2 py-1 rounded bg-muted/50 font-mono text-muted-foreground">
            {data.fleet.drivers} Drivers
          </span>
          {worstBasic && (
            <span className={cn(
              'px-2 py-1 rounded font-mono',
              worstBasic.value! >= 65 ? 'bg-amber-500/10 text-amber-600' : 'bg-muted/50 text-muted-foreground'
            )}>
              {worstBasic.name} Index: {worstBasic.value}%
            </span>
          )}
          <span className={cn(
            'px-2 py-1 rounded font-mono',
            data.crashes.fatal > 0 ? 'bg-red-500/10 text-red-600' : 'bg-muted/50 text-muted-foreground'
          )}>
            {data.crashes.total} Crashes (24mo)
          </span>
        </div>

        {/* Red Flags Summary */}
        {redFlags.length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <FileWarning className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-sm font-medium text-red-600">
              {redFlags.length} Red Flag{redFlags.length > 1 ? 's' : ''} Detected
            </span>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between group"
            >
              <span className="text-sm font-medium">
                {isExpanded ? 'Hide Full Report' : 'View Full Report'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-4">
            {/* Red Flags Detail */}
            {redFlags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <FileWarning className="w-4 h-4" />
                  <span>Red Flag Details</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {redFlags.map((flag, i) => (
                    <RedFlagBadge key={i} message={flag.message} severity={flag.severity} />
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Insurance Coverage Analysis</span>
              </div>
              <div className="space-y-3 p-3 rounded-lg bg-muted/20">
                <InsuranceBar 
                  label="Bodily Injury & Property Damage (BIPD)" 
                  amount={data.authority.bipdInsurance} 
                  required={750000} 
                />
                <InsuranceBar 
                  label="Cargo Insurance" 
                  amount={data.authority.cargoInsurance} 
                  required={100000} 
                />
              </div>
            </div>

            {/* BASIC Scores */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>CSA BASIC Safety Scores</span>
              </div>
              <p className="text-xs text-muted-foreground -mt-1">
                Higher percentiles indicate worse performance relative to peers. Scores ≥65% may trigger FMCSA intervention.
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 rounded-lg bg-muted/20">
                <BasicScoreBar 
                  name="Unsafe Driving" 
                  percentile={data.basics.unsafeDriving?.percentile ?? null} 
                />
                <BasicScoreBar 
                  name="HOS Compliance" 
                  percentile={data.basics.hoursOfService?.percentile ?? null} 
                />
                <BasicScoreBar 
                  name="Vehicle Maintenance" 
                  percentile={data.basics.vehicleMaintenance?.percentile ?? null} 
                />
                <BasicScoreBar 
                  name="Controlled Substances" 
                  percentile={data.basics.controlledSubstances?.percentile ?? null} 
                />
                <BasicScoreBar 
                  name="Driver Fitness" 
                  percentile={data.basics.driverFitness?.percentile ?? null} 
                />
                <BasicScoreBar 
                  name="Crash Indicator" 
                  percentile={data.basics.crashIndicator?.percentile ?? null} 
                />
              </div>
            </div>

            {/* Fleet & Crashes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Fleet Details</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Power Units</span>
                    <span className="font-medium font-mono">{data.fleet.powerUnits}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Drivers</span>
                    <span className="font-medium font-mono">{data.fleet.drivers}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Crash History (24 months)</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Fatal</span>
                    <span className={cn('font-medium font-mono', data.crashes.fatal > 0 ? 'text-red-700 dark:text-red-400' : 'text-foreground')}>
                      {data.crashes.fatal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Injury</span>
                    <span className={cn('font-medium font-mono', data.crashes.injury > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-foreground')}>
                      {data.crashes.injury}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Tow-Away</span>
                    <span className="font-medium font-mono text-foreground">{data.crashes.towAway}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted/20">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{data.carrier.address.city}, {data.carrier.address.state}</span>
              </div>
              {data.carrier.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span>{data.carrier.phone}</span>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>MCS-150: {formatDate(data.fleet.mcs150Date)}</span>
              </div>
              <span>Safety Rating: {data.safety.rating || 'Not Rated'}</span>
            </div>

            {/* External Links */}
            <ExternalLinks 
              companyName={data.carrier.legalName} 
              dotNumber={data.carrier.dotNumber} 
            />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
    </div>
  );
}
