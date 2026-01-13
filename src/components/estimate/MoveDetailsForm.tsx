import { type MoveDetails } from "@/lib/priceCalculator";

interface MoveDetailsFormProps {
  moveDetails: MoveDetails;
  onUpdate: (updates: Partial<MoveDetails>) => void;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onContactUpdate: (updates: Partial<{ name: string; email: string; phone: string }>) => void;
  onSubmit: () => void;
}

export default function MoveDetailsForm({ 
  moveDetails, 
  onUpdate, 
  contactInfo, 
  onContactUpdate,
  onSubmit 
}: MoveDetailsFormProps) {
  return (
    <div className="space-y-6">
      {/* Route Section */}
      <div>
        <div className="text-[10px] font-black tracking-[0.24em] uppercase text-muted-foreground mb-4">
          Route, Distance, Move Type
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Your inventory is ready. Add where you are moving from and to, when you are moving, and your distance and move type so TruMove can refine your price and route you to a call or video consult.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Moving from (city or ZIP)
            </label>
            <input
              type="text"
              value={moveDetails.fromLocation}
              onChange={(e) => onUpdate({ fromLocation: e.target.value })}
              placeholder="Example: Oakland Park, FL"
              className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Moving to (city or ZIP)
            </label>
            <input
              type="text"
              value={moveDetails.toLocation}
              onChange={(e) => onUpdate({ toLocation: e.target.value })}
              placeholder="Example: Atlanta, GA"
              className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Move Type */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-2">
          Move type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onUpdate({ moveType: 'local' })}
            className={`flex-1 h-11 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-150
              ${moveDetails.moveType === 'local'
                ? 'bg-foreground text-background shadow-lg'
                : 'border border-border/60 bg-card text-foreground/70 hover:bg-muted/50'
              }`}
          >
            Local (usually under 150 miles)
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ moveType: 'long-distance' })}
            className={`flex-1 h-11 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-150
              ${moveDetails.moveType === 'long-distance'
                ? 'bg-foreground text-background shadow-lg'
                : 'border border-border/60 bg-card text-foreground/70 hover:bg-muted/50'
              }`}
          >
            Long distance
          </button>
        </div>
      </div>

      {/* Distance & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
            Approx distance in miles
          </label>
          <input
            type="number"
            min={0}
            value={moveDetails.distance || ''}
            onChange={(e) => onUpdate({ distance: parseInt(e.target.value) || 0 })}
            placeholder="Example: 600"
            className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
            Target move date
          </label>
          <input
            type="date"
            value={moveDetails.moveDate}
            onChange={(e) => onUpdate({ moveDate: e.target.value })}
            className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="pt-4 border-t border-border/40">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Full name
            </label>
            <input
              type="text"
              value={contactInfo.name}
              onChange={(e) => onContactUpdate({ name: e.target.value })}
              placeholder="Your full name"
              className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">
                Email
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) => onContactUpdate({ email: e.target.value })}
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => onContactUpdate({ phone: e.target.value })}
                placeholder="(555) 555-5555"
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-card text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div>
        <button
          type="button"
          onClick={onSubmit}
          className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_hsl(var(--primary)/0.3)] flex items-center justify-center gap-2"
        >
          Finalize My Estimate
          <span className="text-lg">→</span>
        </button>
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Clicking "Finalize My Estimate" will create an email to TruMove with your rough estimate and a representative will reach out. By finalizing your estimate you authorize TruMove LLC to contact you.
        </p>
      </div>
    </div>
  );
}
