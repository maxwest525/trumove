import { Shield, AlertTriangle, Truck, Car, DollarSign } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface CarrierData {
  carrier: {
    legalName: string;
    dbaName: string;
    dotNumber: string;
  };
  authority: {
    commonStatus: string;
    bipdInsurance: string;
    cargoInsurance: string;
  };
  safety: {
    rating: string;
  };
  basics: {
    unsafeDriving: { percentile: number } | null;
    hoursOfService: { percentile: number } | null;
    vehicleMaintenance: { percentile: number } | null;
    crashIndicator: { percentile: number } | null;
    driverFitness: { percentile: number } | null;
    controlledSubstances: { percentile: number } | null;
  };
  fleet: {
    powerUnits: number;
    drivers: number;
  };
  crashes: {
    fatal: number;
    injury: number;
    towAway: number;
    total: number;
  };
}

interface ComparisonSummaryTableProps {
  carriers: CarrierData[];
  className?: string;
}

// Calculate risk grade - must match logic in CarrierSnapshotCard
function calculateRiskGrade(data: CarrierData): { grade: string; color: string } {
  let score = 100;
  
  if (data.authority.commonStatus === 'REVOKED') score -= 50;
  else if (data.authority.commonStatus === 'INACTIVE' || data.authority.commonStatus === 'NOT AUTHORIZED') score -= 40;
  
  const bipdAmount = parseInt(data.authority.bipdInsurance?.replace(/[^0-9]/g, '') || '0');
  const cargoAmount = parseInt(data.authority.cargoInsurance?.replace(/[^0-9]/g, '') || '0');
  if (bipdAmount < 750000) score -= 15;
  if (cargoAmount < 100000) score -= 10;
  
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
  
  if (data.crashes.fatal > 0) score -= 15 * data.crashes.fatal;
  if (data.crashes.injury > 0) score -= 5 * Math.min(data.crashes.injury, 3);
  
  if (data.safety.rating === 'UNSATISFACTORY') score -= 25;
  else if (data.safety.rating === 'CONDITIONAL') score -= 15;
  
  if (score >= 90) return { grade: 'A+', color: 'text-green-600 bg-green-500/10' };
  if (score >= 80) return { grade: 'A', color: 'text-green-600 bg-green-500/10' };
  if (score >= 70) return { grade: 'B', color: 'text-emerald-600 bg-emerald-500/10' };
  if (score >= 60) return { grade: 'C', color: 'text-amber-600 bg-amber-500/10' };
  if (score >= 45) return { grade: 'D', color: 'text-orange-600 bg-orange-500/10' };
  return { grade: 'F', color: 'text-red-600 bg-red-500/10' };
}

function getAuthorityStatusStyle(status: string) {
  const upper = status?.toUpperCase();
  if (upper === 'ACTIVE') return 'text-green-600 font-semibold';
  if (upper === 'INACTIVE' || upper === 'NOT AUTHORIZED') return 'text-amber-600 font-semibold';
  if (upper === 'REVOKED' || upper === 'OUT OF SERVICE') return 'text-red-600 font-semibold';
  return 'text-muted-foreground';
}

function getCrashStyle(crashes: CarrierData['crashes']) {
  if (crashes.fatal > 0) return 'text-red-600 font-semibold';
  if (crashes.injury > 2 || crashes.total > 5) return 'text-amber-600 font-semibold';
  return 'text-foreground';
}

export function ComparisonSummaryTable({ carriers, className }: ComparisonSummaryTableProps) {
  if (carriers.length === 0) return null;

  return (
    <div className={cn('mb-8 overflow-x-auto', className)}>
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold text-slate-900 dark:text-foreground whitespace-nowrap">
                Carrier
              </TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-foreground text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-900 dark:text-foreground" />
                  Grade
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-foreground text-center whitespace-nowrap">
                Authority
              </TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-foreground text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-900 dark:text-foreground" />
                  BIPD
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-foreground text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-900 dark:text-foreground" />
                  Fleet
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-foreground text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-900 dark:text-foreground" />
                  Crashes (24mo)
                </div>
              </TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-foreground text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-slate-900 dark:text-foreground" />
                  Fatal
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carriers.map((carrier) => {
              const riskGrade = calculateRiskGrade(carrier);
              return (
                <TableRow key={carrier.carrier.dotNumber} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div>
                      <span className="text-slate-900 dark:text-foreground font-semibold">
                        {carrier.carrier.dbaName || carrier.carrier.legalName}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        DOT {carrier.carrier.dotNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn('inline-flex items-center justify-center w-9 h-7 rounded font-bold text-sm', riskGrade.color)}>
                      {riskGrade.grade}
                    </span>
                  </TableCell>
                  <TableCell className={cn('text-center text-sm', getAuthorityStatusStyle(carrier.authority.commonStatus))}>
                    {carrier.authority.commonStatus || 'N/A'}
                  </TableCell>
                  <TableCell className="text-center text-sm text-foreground">
                    {carrier.authority.bipdInsurance || 'N/A'}
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {carrier.fleet.powerUnits} units / {carrier.fleet.drivers} drivers
                  </TableCell>
                  <TableCell className={cn('text-center text-sm', getCrashStyle(carrier.crashes))}>
                    {carrier.crashes.total}
                  </TableCell>
                  <TableCell className="text-center">
                    {carrier.crashes.fatal > 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-600 font-bold text-sm">
                        {carrier.crashes.fatal}
                      </span>
                    ) : (
                      <span className="text-sm text-green-600 font-medium">0</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
