import { AlertTriangle, XCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RedFlagSeverity = 'critical' | 'warning' | 'info';

interface RedFlagBadgeProps {
  message: string;
  severity: RedFlagSeverity;
  className?: string;
}

export function RedFlagBadge({ message, severity, className }: RedFlagBadgeProps) {
  const iconMap = {
    critical: XCircle,
    warning: AlertTriangle,
    info: Info
  };

  // Bright, bold icon colors
  const iconColorMap = {
    critical: 'text-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.5)]',
    warning: 'text-amber-500 drop-shadow-[0_0_3px_rgba(245,158,11,0.5)]',
    info: 'text-blue-500 drop-shadow-[0_0_3px_rgba(59,130,246,0.5)]'
  };

  const Icon = iconMap[severity];

  return (
    <div className={cn(
      'flex items-center gap-1.5 text-xs',
      className
    )}>
      <Icon className={cn("w-4 h-4 shrink-0 stroke-[2.5]", iconColorMap[severity])} />
      <span className="font-semibold text-slate-900 dark:text-slate-100">{message}</span>
    </div>
  );
}

// Helper function to generate red flags from carrier data
export interface CarrierData {
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
    controlledSubstances: { percentile: number } | null;
    driverFitness: { percentile: number } | null;
    crashIndicator: { percentile: number } | null;
  };
  oos: {
    vehicleOosRate: number;
    vehicleOosRateNationalAvg: number;
    driverOosRate: number;
    driverOosRateNationalAvg: number;
  };
  fleet: {
    mcs150Date: string;
  };
  crashes: {
    fatal: number;
    total: number;
  };
}

export interface RedFlag {
  message: string;
  severity: RedFlagSeverity;
}

export function generateRedFlags(data: CarrierData): RedFlag[] {
  const flags: RedFlag[] = [];

  // Authority status checks
  if (data.authority.commonStatus === 'INACTIVE' || data.authority.commonStatus === 'NOT AUTHORIZED') {
    flags.push({ message: 'Authority INACTIVE', severity: 'critical' });
  }
  if (data.authority.commonStatus === 'REVOKED') {
    flags.push({ message: 'Authority REVOKED', severity: 'critical' });
  }

  // Insurance checks
  const parseInsurance = (value: string) => {
    const num = parseInt(value.replace(/[^0-9]/g, ''));
    return isNaN(num) ? 0 : num;
  };
  
  const bipdAmount = parseInsurance(data.authority.bipdInsurance);
  if (bipdAmount < 750000) {
    flags.push({ message: 'Liability below $750K minimum', severity: 'critical' });
  }

  // Safety rating
  if (data.safety.rating === 'UNSATISFACTORY') {
    flags.push({ message: 'Unsatisfactory Safety Rating', severity: 'critical' });
  }
  if (data.safety.rating === 'CONDITIONAL') {
    flags.push({ message: 'Conditional Safety Rating', severity: 'warning' });
  }

  // BASIC scores (above 65 = concerning)
  const basicChecks = [
    { name: 'Unsafe Driving', data: data.basics.unsafeDriving },
    { name: 'HOS Compliance', data: data.basics.hoursOfService },
    { name: 'Vehicle Maintenance', data: data.basics.vehicleMaintenance },
    { name: 'Controlled Substances', data: data.basics.controlledSubstances },
    { name: 'Driver Fitness', data: data.basics.driverFitness },
    { name: 'Crash Indicator', data: data.basics.crashIndicator }
  ];

  basicChecks.forEach(({ name, data: basicData }) => {
    if (basicData && basicData.percentile >= 75) {
      flags.push({ message: `High ${name} score (${basicData.percentile}%)`, severity: 'critical' });
    } else if (basicData && basicData.percentile >= 65) {
      flags.push({ message: `Elevated ${name} (${basicData.percentile}%)`, severity: 'warning' });
    }
  });

  // OOS rates
  if (data.oos.vehicleOosRate > data.oos.vehicleOosRateNationalAvg * 1.5) {
    flags.push({ message: `Vehicle OOS rate ${data.oos.vehicleOosRate.toFixed(1)}% (above avg)`, severity: 'warning' });
  }
  if (data.oos.driverOosRate > data.oos.driverOosRateNationalAvg * 1.5) {
    flags.push({ message: `Driver OOS rate ${data.oos.driverOosRate.toFixed(1)}% (above avg)`, severity: 'warning' });
  }

  // MCS-150 freshness
  if (data.fleet.mcs150Date) {
    const mcsDate = new Date(data.fleet.mcs150Date);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    if (mcsDate < twoYearsAgo) {
      flags.push({ message: 'MCS-150 outdated (2+ years)', severity: 'warning' });
    }
  }

  // Fatal crashes
  if (data.crashes.fatal > 0) {
    flags.push({ message: `${data.crashes.fatal} fatal crash(es) recorded`, severity: 'critical' });
  }

  return flags;
}
