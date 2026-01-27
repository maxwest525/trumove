import { useState, useEffect, ReactNode } from "react";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CollapsibleDashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  defaultOpen?: boolean;
  storageKey?: string;
  badge?: string | number;
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning';
  /** If true, only renders the header without wrapping in a card (for children that already have card styling) */
  headerOnly?: boolean;
}

export function CollapsibleDashboardCard({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  storageKey,
  badge,
  badgeVariant = 'default',
  headerOnly = false,
}: CollapsibleDashboardCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Persist state to localStorage if storageKey provided
  useEffect(() => {
    if (storageKey) {
      const stored = localStorage.getItem(`collapsible-${storageKey}`);
      if (stored !== null) {
        setIsOpen(stored === 'true');
      }
    }
  }, [storageKey]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (storageKey) {
      localStorage.setItem(`collapsible-${storageKey}`, String(open));
    }
  };

  const badgeColors = {
    default: 'bg-white/10 text-white/60',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
  };

  // Header-only mode: just a collapsible header, content renders as-is
  if (headerOnly) {
    return (
      <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
        <div className="tracking-info-card collapsible-card">
          <CollapsibleTrigger className="w-full flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md flex items-center justify-center bg-primary/20 text-primary">
                <Icon className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 group-hover:text-white/70 transition-colors">
                {title}
              </span>
              {badge !== undefined && (
                <span className={cn(
                  "text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                  badgeColors[badgeVariant]
                )}>
                  {badge}
                </span>
              )}
            </div>
            
            <div className="text-white/40 group-hover:text-white/60 transition-colors">
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-3">
            {children}
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  }

  // Full card mode (default)
  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <div className="tracking-info-card collapsible-card">
        <CollapsibleTrigger className="w-full flex items-center justify-between group">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center bg-primary/20 text-primary">
              <Icon className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/50 group-hover:text-white/70 transition-colors">
              {title}
            </span>
            {badge !== undefined && (
              <span className={cn(
                "text-[9px] font-semibold px-1.5 py-0.5 rounded-full",
                badgeColors[badgeVariant]
              )}>
                {badge}
              </span>
            )}
          </div>
          
          <div className="text-white/40 group-hover:text-white/60 transition-colors">
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-3">
          {children}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
