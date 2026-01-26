import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { Video, Phone, Calendar, Clock, Shield, Zap, FileText, CheckCircle2, ExternalLink } from "lucide-react";
import { format, addDays } from "date-fns";

const TIME_SLOTS = [
  "10:00 AM", "11:30 AM", "1:00 PM",
  "3:00 PM", "4:30 PM", "6:00 PM"
];

export default function Book() {
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
      const date = addDays(today, i);
      return {
        index: i,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(date, 'EEE'),
        date: format(date, 'MMM d'),
        slots: Math.floor(Math.random() * 6) + 3, // Random slots 3-8
      };
    });
  }, []);

  const handleConfirm = () => {
    const dateInfo = dates[selectedDate];
    const subject = encodeURIComponent(`TruMove Video Consult Request - ${dateInfo.label} ${dateInfo.date} at ${selectedTime}`);
    const body = encodeURIComponent(`
I would like to schedule a video consultation.

Date: ${dateInfo.label}, ${dateInfo.date}
Time: ${selectedTime}

Please send me a calendar invite with the video link.

Thank you!
    `.trim());
    window.location.href = `mailto:consult@trumove.com?subject=${subject}&body=${body}`;
  };

  return (
    <SiteShell>
      <div className="max-w-[1480px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Booking */}
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="text-[10px] font-black tracking-[0.24em] uppercase text-muted-foreground mb-3">
                Video Consult
              </div>
              <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">
                Book a live TruMove session.
              </h1>
              <p className="text-lg text-muted-foreground">
                Pick a time that works for you and meet face to face with a TruMove client advocate to review quotes and plan your move.
              </p>
            </div>

            {/* Date Selection */}
            <div className="mb-8">
              <div className="text-xs font-bold text-foreground mb-3">Choose a day</div>
              <div className="flex flex-wrap gap-3">
                {dates.map((day) => (
                  <button
                    key={day.index}
                    type="button"
                    onClick={() => setSelectedDate(day.index)}
                    className={`flex flex-col items-center px-5 py-3 rounded-xl transition-all duration-150
                      ${selectedDate === day.index
                        ? 'bg-foreground text-background shadow-lg'
                        : 'border border-border/60 bg-card text-foreground hover:bg-muted/50'
                      }`}
                  >
                    <span className="text-sm font-bold">{day.label}</span>
                    <span className={`text-xs ${selectedDate === day.index ? 'text-background/70' : 'text-muted-foreground'}`}>
                      {day.slots} slots
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <div className="text-xs font-bold text-foreground mb-3">Available times (local)</div>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`h-12 rounded-xl text-sm font-semibold transition-all duration-150
                      ${selectedTime === time
                        ? 'bg-foreground text-background shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]'
                        : 'border border-border/60 bg-card text-foreground hover:bg-muted/50'
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {!selectedTime && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Select a day and time to continue.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-8">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedTime}
                className="w-full h-14 rounded-xl bg-foreground text-background text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                Confirm Video Consult
                <span className="text-lg">→</span>
              </button>
              <a
                href="https://calendly.com/trumove"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-border/60 bg-card text-foreground text-sm font-semibold transition-all hover:bg-muted/50"
              >
                Choose another date and time
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <p className="text-sm text-muted-foreground mb-8">
              You will receive a calendar invite with a secure video link. No downloads required.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>More availability:</strong> Click Choose another date and time to see every open slot.
            </p>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-8">
            {/* Live Preview Card */}
            <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card to-muted/20 overflow-hidden shadow-xl">
              <div className="p-6 border-b border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-lg font-black">T</div>
                  <div>
                    <div className="text-sm font-bold text-foreground">TruMove • Live session preview</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 text-xs font-bold text-foreground/70">
                  <Shield className="w-3.5 h-3.5" />
                  Secure
                  <span className="text-muted-foreground">00:15</span>
                </div>
              </div>
              
              <div className="p-6 bg-gradient-to-b from-muted/20 to-muted/40 min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-foreground/10 flex items-center justify-center">
                    <Video className="w-8 h-8 text-foreground/50" />
                  </div>
                  <p className="text-sm text-muted-foreground">Video preview will appear here</p>
                </div>
              </div>
            </div>

            {/* What Happens */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-foreground">What happens on your video consult</h3>
              <p className="text-sm text-muted-foreground">
                We compare quotes, vet movers, and map next steps.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border/60 bg-card">
                  <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Quote Comparison
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We break down your quote line by line. No pressure, just clarity and a clean plan.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl border border-border/60 bg-card">
                  <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Mover Credibility Check
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">FMCSA record</div>
                        <p className="text-xs text-muted-foreground">We verify status, authority, and safety basics.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">Reviews and patterns</div>
                        <p className="text-xs text-muted-foreground">We look for red flags, not just stars.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-card">
                  <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    Live Walkthrough
                  </div>
                  <p className="text-sm text-muted-foreground">
                    After you book, you will get an email and calendar invite with a secure video link.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Call */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="text-[10px] font-black tracking-[0.2em] uppercase text-primary mb-2">
                Prefer a Quick Call?
              </div>
              <a
                href="tel:+16097277647"
                className="flex items-center gap-3 text-foreground font-semibold hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>Click to reach the support team now or dial 609-727-7647</span>
                <span className="text-lg">→</span>
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                Support team available now → Same day help, no pressure
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-border/60 bg-card text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xs font-bold text-foreground">Secure booking</div>
                <p className="text-[10px] text-muted-foreground mt-1">No pressure. Calendar invite and video link sent after you confirm.</p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-card text-center">
                <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xs font-bold text-foreground">Fast clarity</div>
                <p className="text-[10px] text-muted-foreground mt-1">Walk away with next steps and what to ask the mover.</p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-card text-center">
                <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-xs font-bold text-foreground">Summary after</div>
                <p className="text-[10px] text-muted-foreground mt-1">We can send a quick recap of what we reviewed.</p>
              </div>
            </div>

            {/* Mini FAQ */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border/60 bg-card">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-semibold text-foreground">Do I need to download anything?</div>
                  <span className="text-xs font-bold text-primary">No</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Your link opens in a browser, phone, or computer.</p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-card">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-semibold text-foreground">Can you help even if I already booked a mover?</div>
                  <span className="text-xs font-bold text-primary">Yes</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">We can sanity check the estimate, paperwork, and what to confirm before move day.</p>
              </div>
              <div className="p-4 rounded-xl border border-border/60 bg-card">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-semibold text-foreground">What should I bring to the call?</div>
                  <span className="text-xs font-bold text-primary">Easy</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Any quotes you have and your move date, plus a quick list of big items.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
