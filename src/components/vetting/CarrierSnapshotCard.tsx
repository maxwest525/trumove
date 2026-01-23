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
function calculateRiskGrade(data: ExtendedCarrierData): { grade: string; label: string; color: string } {
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
  
  // Determine grade
  if (score >= 90) return { grade: 'A+', label: 'Excellent', color: 'text-green-500 bg-green-500/10 border-green-500/30' };
  if (score >= 80) return { grade: 'A', label: 'Very Good', color: 'text-green-500 bg-green-500/10 border-green-500/30' };
  if (score >= 70) return { grade: 'B', label: 'Good', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
  if (score >= 60) return { grade: 'C', label: 'Moderate', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
  if (score >= 45) return { grade: 'D', label: 'Concerning', color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' };
  return { grade: 'F', label: 'High Risk', color: 'text-red-500 bg-red-500/10 border-red-500/30' };
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

// Generate external review links
function ExternalLinks({ companyName, dotNumber }: { companyName: string; dotNumber: string }) {
  const encodedName = encodeURIComponent(companyName);
  
  return (
    <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
      <a
        href={`https://www.bbb.org/search?find_text=${encodedName}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <Star className="w-3 h-3" />
        BBB Profile
        <ExternalLink className="w-3 h-3" />
      </a>
      <a
        href={`https://www.google.com/search?q=${encodedName}+reviews`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <Star className="w-3 h-3" />
        Google Reviews
        <ExternalLink className="w-3 h-3" />
      </a>
      <a
        href={`https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${dotNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <Shield className="w-3 h-3" />
        FMCSA SAFER
        <ExternalLink className="w-3 h-3" />
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
        
        {/* Risk Grade Badge */}
        <div className="flex items-start justify-between pr-8 mb-3">
          <div className={cn(
            'flex items-center gap-3 px-4 py-2 rounded-xl border',
            riskGrade.color
          )}>
            <span className="text-3xl font-black">{riskGrade.grade}</span>
            <div className="text-left">
              <span className="text-xs font-semibold uppercase tracking-wide">{riskGrade.label}</span>
              <p className="text-[10px] opacity-75">Safety Score</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-lg text-foreground leading-tight">
              {data.carrier.legalName}
            </h3>
            {data.carrier.dbaName && data.carrier.dbaName !== data.carrier.legalName && (
              <p className="text-sm text-muted-foreground">DBA: {data.carrier.dbaName}</p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              DOT# {data.carrier.dotNumber}
            </Badge>
            {data.carrier.mcNumber && (
              <Badge variant="outline" className="text-xs font-mono">
                {data.carrier.mcNumber}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats - Always visible */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground">Authority</span>
            <AuthorityBadge status={data.authority.commonStatus} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-xs font-medium text-muted-foreground">Liability</span>
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
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
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
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Crash History (24 months)</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fatal</span>
                    <span className={cn('font-medium font-mono', data.crashes.fatal > 0 && 'text-red-500')}>
                      {data.crashes.fatal}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Injury</span>
                    <span className={cn('font-medium font-mono', data.crashes.injury > 0 && 'text-amber-500')}>
                      {data.crashes.injury}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tow-Away</span>
                    <span className="font-medium font-mono">{data.crashes.towAway}</span>
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
  );
}
