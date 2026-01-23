import { Phone, MapPin, Truck, Shield, AlertTriangle, CheckCircle2, XCircle, Calendar, FileWarning, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RedFlagBadge, generateRedFlags, type CarrierData } from './RedFlagBadge';
import { cn } from '@/lib/utils';

interface CarrierSnapshotCardProps {
  data: CarrierData & {
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
  };
  onRemove?: () => void;
  className?: string;
}

function AuthorityBadge({ status }: { status: string }) {
  const isActive = status === 'ACTIVE' || status === 'AUTHORIZED';
  const isInactive = status === 'INACTIVE' || status === 'NOT AUTHORIZED';
  const isRevoked = status === 'REVOKED';

  if (isActive) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-semibold">ACTIVE</span>
      </div>
    );
  }

  if (isRevoked) {
    return (
      <div className="flex items-center gap-2 text-red-400">
        <XCircle className="w-5 h-5" />
        <span className="font-semibold">REVOKED</span>
      </div>
    );
  }

  if (isInactive) {
    return (
      <div className="flex items-center gap-2 text-red-400">
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
          percentile >= 75 ? 'text-red-400' : 
          percentile >= threshold ? 'text-amber-400' : 'text-green-400'
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
          isSufficient ? 'text-green-400' : 'text-red-400'
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

export function CarrierSnapshotCard({ data, onRemove, className }: CarrierSnapshotCardProps) {
  const redFlags = generateRedFlags(data);
  const criticalFlags = redFlags.filter(f => f.severity === 'critical');
  const warningFlags = redFlags.filter(f => f.severity === 'warning');

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

  return (
    <Card className={cn(
      'bg-card/50 backdrop-blur border-border/50 overflow-hidden',
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
        
        <div className="space-y-2 pr-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-foreground leading-tight">
                {data.carrier.legalName}
              </h3>
              {data.carrier.dbaName && data.carrier.dbaName !== data.carrier.legalName && (
                <p className="text-sm text-muted-foreground">DBA: {data.carrier.dbaName}</p>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              DOT# {data.carrier.dotNumber}
            </Badge>
            {data.carrier.mcNumber && (
              <Badge variant="outline" className="text-xs">
                {data.carrier.mcNumber}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{data.carrier.address.city}, {data.carrier.address.state}</span>
            </div>
            {data.carrier.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{data.carrier.phone}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Authority Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span className="text-sm font-medium">Operating Authority</span>
          <AuthorityBadge status={data.authority.commonStatus} />
        </div>

        {/* Red Flags */}
        {redFlags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileWarning className="w-4 h-4" />
              <span>Red Flags ({redFlags.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {redFlags.slice(0, 4).map((flag, i) => (
                <RedFlagBadge key={i} message={flag.message} severity={flag.severity} />
              ))}
              {redFlags.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{redFlags.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Insurance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Insurance Coverage</span>
          </div>
          <div className="space-y-3">
            <InsuranceBar 
              label="Liability (BIPD)" 
              amount={data.authority.bipdInsurance} 
              required={750000} 
            />
            <InsuranceBar 
              label="Cargo" 
              amount={data.authority.cargoInsurance} 
              required={100000} 
            />
          </div>
        </div>

        {/* BASIC Scores */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <AlertTriangle className="w-4 h-4" />
            <span>CSA BASIC Scores</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <BasicScoreBar 
              name="Unsafe Driving" 
              percentile={data.basics.unsafeDriving?.percentile ?? null} 
            />
            <BasicScoreBar 
              name="HOS Compliance" 
              percentile={data.basics.hoursOfService?.percentile ?? null} 
            />
            <BasicScoreBar 
              name="Vehicle Maint." 
              percentile={data.basics.vehicleMaintenance?.percentile ?? null} 
            />
            <BasicScoreBar 
              name="Controlled Sub." 
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
          <div className="space-y-2 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Truck className="w-3.5 h-3.5" />
              <span>Fleet</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Power Units</span>
                <span className="font-medium">{data.fleet.powerUnits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Drivers</span>
                <span className="font-medium">{data.fleet.drivers}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Crashes (24mo)</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fatal</span>
                <span className={cn('font-medium', data.crashes.fatal > 0 && 'text-red-400')}>
                  {data.crashes.fatal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">{data.crashes.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>MCS-150: {formatDate(data.fleet.mcs150Date)}</span>
          </div>
          <span>Safety Rating: {data.safety.rating || 'Not Rated'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
