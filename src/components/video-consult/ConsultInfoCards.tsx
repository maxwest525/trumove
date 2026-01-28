import { Shield, Zap, FileText, CheckCircle2, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WhatHappensCard() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-foreground">What happens on your video consult</h3>
      <p className="text-sm text-muted-foreground">
        We compare quotes, vet movers, and map next steps.
      </p>
      
      <div className="space-y-4">
        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Quote Comparison
            </div>
            <p className="text-sm text-muted-foreground">
              We break down your quote line by line. No pressure, just clarity and a clean plan.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/60">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-4">
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Live Walkthrough
            </div>
            <p className="text-sm text-muted-foreground">
              After you book, you will get an email and calendar invite with a secure video link.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function QuickCallCard() {
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-5">
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
      </CardContent>
    </Card>
  );
}

export function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="border-border/60">
        <CardContent className="p-4 text-center">
          <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-xs font-bold text-foreground">Secure booking</div>
          <p className="text-[10px] text-muted-foreground mt-1">No pressure. Calendar invite and video link sent after you confirm.</p>
        </CardContent>
      </Card>
      <Card className="border-border/60">
        <CardContent className="p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-xs font-bold text-foreground">Fast clarity</div>
          <p className="text-[10px] text-muted-foreground mt-1">Walk away with next steps and what to ask the mover.</p>
        </CardContent>
      </Card>
      <Card className="border-border/60">
        <CardContent className="p-4 text-center">
          <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-xs font-bold text-foreground">Summary after</div>
          <p className="text-[10px] text-muted-foreground mt-1">We can send a quick recap of what we reviewed.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function MiniFAQ() {
  const faqs = [
    {
      question: "Do I need to download anything?",
      answer: "Your link opens in a browser, phone, or computer.",
      short: "No"
    },
    {
      question: "Can you help even if I already booked a mover?",
      answer: "We can sanity check the estimate, paperwork, and what to confirm before move day.",
      short: "Yes"
    },
    {
      question: "What should I bring to the call?",
      answer: "Any quotes you have and your move date, plus a quick list of big items.",
      short: "Easy"
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <Card key={i} className="border-border/60">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="text-sm font-semibold text-foreground">{faq.question}</div>
              <span className="text-xs font-bold text-primary">{faq.short}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{faq.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
