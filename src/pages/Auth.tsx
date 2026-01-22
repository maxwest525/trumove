import { useState, useEffect } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";
import { Check, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const { toast } = useToast();
  const [typedName, setTypedName] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Prevent auto-scroll
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const refNumber = `TM-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

  const handleSign = () => {
    if (typedName.length >= 2 && agreedToTerms) {
      setIsSigned(true);
    }
  };

  const handleSubmit = () => {
    if (isSigned && agreedToTerms) {
      toast({
        title: "Authorization Submitted",
        description: "Your signed authorization has been received. You will receive a confirmation email shortly.",
      });
    }
  };

  const canSign = typedName.length >= 2 && agreedToTerms;
  const canSubmit = isSigned && agreedToTerms;

  return (
    <SiteShell>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-[800px] mx-auto">
          {/* Document Container */}
          <Card className="shadow-xl border border-border bg-white">
            <CardContent className="p-0">
              {/* Document Header */}
              <div className="border-b border-border px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                  <img src={logo} alt="TruMove" className="h-8 w-auto" />
                  <div className="text-right text-xs text-muted-foreground">
                    <div>Document Ref: <span className="font-mono font-medium text-foreground">{refNumber}</span></div>
                    <div>Date: {today}</div>
                  </div>
                </div>

                <div className="text-center">
                  <h1 className="text-lg font-bold tracking-wide text-foreground uppercase mb-1">
                    Estimate Consent & Authorization
                  </h1>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    Short Form Agreement
                  </p>
                </div>
              </div>

              {/* Quick Signature Notice */}
              <div className="bg-muted/40 border-b border-border px-8 py-4">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">To complete this authorization:</span> Type your full legal name below, 
                  review the terms, then click the signature field to apply your electronic signature.
                </p>
                <div className="mt-3 max-w-sm">
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Your Full Legal Name
                  </label>
                  <Input
                    placeholder="Enter your full legal name"
                    value={typedName}
                    onChange={(e) => {
                      setTypedName(e.target.value);
                      if (isSigned) setIsSigned(false);
                    }}
                    className="bg-white border-foreground/20"
                  />
                </div>
              </div>

              {/* Document Body */}
              <div className="px-8 py-6 space-y-6 text-sm leading-relaxed text-foreground">
                
                {/* Important Notice */}
                <section>
                  <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Important Notice Regarding Your Moving Estimate
                  </h2>
                  <p className="mb-4">
                    TruMove LLC is a federally licensed household goods transportation broker and is not a motor carrier. 
                    TruMove arranges transportation services through independent, federally licensed and insured motor carriers. 
                    The performing motor carrier will issue the bill of lading and be responsible for transportation services.
                  </p>
                </section>

                <Separator className="my-4" />

                {/* Estimate Basis */}
                <section>
                  <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Estimate Basis & Acknowledgment
                  </h2>
                  <p className="mb-4">
                    The customer acknowledges that the pricing provided is an estimate only and is not a guaranteed or fixed 
                    price unless expressly stated in writing as a binding estimate.
                  </p>
                  <p className="mb-4">
                    The estimate is based on information provided by the customer regarding shipment inventory, dwelling type, 
                    access conditions, mileage, and move date. Final charges may increase or decrease based on actual certified 
                    shipment weight, services performed, access conditions encountered, and items transported in accordance 
                    with carrier tariffs and federal regulations.
                  </p>
                  <p>
                    The customer acknowledges that the estimate is generated using TruMove's pricing engine, which incorporates 
                    customer-provided data, route variables, and historical pricing and weight data from federally regulated 
                    household goods shipments reported through the U.S. Department of Transportation and FMCSA.
                  </p>
                </section>

                <Separator className="my-4" />

                {/* Variable Charges */}
                <section>
                  <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Variable Charges Notice
                  </h2>
                  <p className="mb-3">Final charges may increase or decrease based on:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Actual certified shipment weight</li>
                    <li>Services performed</li>
                    <li>Access conditions encountered</li>
                    <li>Items transported</li>
                    <li>Carrier tariffs and federal regulations</li>
                  </ul>
                  <p className="mt-4 text-muted-foreground">
                    Additional services such as stairs, elevators, long carries, shuttle service, packing, specialty handling, 
                    waiting time, or parking restrictions may result in additional charges.
                  </p>
                </section>

                <Separator className="my-4" />

                {/* Customer Acknowledgments */}
                <section>
                  <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Customer Acknowledgments
                  </h2>
                  <p className="mb-3">Unless expressly designated as binding, this estimate is a <strong>non-binding estimate</strong>.</p>
                  <p className="mb-3">By accepting, the customer acknowledges and agrees that:</p>
                  <ul className="space-y-2 ml-2">
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>TruMove is a broker, not a carrier</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Final charges may differ from the estimate</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>Pricing depends on actual weight, services, and conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>TruMove is authorized to arrange transportation services on the customer's behalf</span>
                    </li>
                  </ul>
                </section>

                <Separator className="my-4" />

                {/* Estimated Price Range */}
                <section className="bg-muted/30 border border-border rounded-md p-5">
                  <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-4 text-center">
                    Estimated Price Range
                  </h2>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">$2,450</div>
                      <div className="text-xs text-muted-foreground uppercase">Low Estimate</div>
                    </div>
                    <div className="text-muted-foreground text-lg">—</div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">$3,100</div>
                      <div className="text-xs text-muted-foreground uppercase">High Estimate</div>
                    </div>
                  </div>
                </section>

                <Separator className="my-4" />

                {/* Agreement Checkbox */}
                <section>
                  <div className="flex items-start gap-3 p-4 border border-border rounded-md bg-background">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-foreground cursor-pointer leading-relaxed">
                      I understand and agree to the Estimate Consent & Authorization. I acknowledge that I have read, 
                      understand, and agree to the terms outlined above.
                    </label>
                  </div>
                </section>

                <Separator className="my-4" />

                {/* Signature Block */}
                <section className="space-y-4">
                  <h2 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">
                    Customer Signature
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Name Display */}
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                        Customer Name
                      </label>
                      <div className="h-12 border-b-2 border-foreground/30 flex items-end pb-1 px-1">
                        <span className="text-base font-medium">
                          {typedName || <span className="text-muted-foreground italic">Enter name above</span>}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                        Date
                      </label>
                      <div className="h-12 border-b-2 border-foreground/30 flex items-end pb-1 px-1">
                        <span className="text-base">{today}</span>
                      </div>
                    </div>
                  </div>

                  {/* Signature Field */}
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Signature / Acceptance
                    </label>
                    <div
                      onClick={handleSign}
                      className={`
                        relative h-20 border-2 border-dashed rounded flex items-center justify-center
                        transition-all cursor-pointer
                        ${isSigned 
                          ? "border-foreground/40 bg-muted/20" 
                          : canSign 
                            ? "border-foreground/30 bg-muted/10 hover:border-foreground/50 hover:bg-muted/20" 
                            : "border-border bg-muted/5 cursor-not-allowed"
                        }
                      `}
                    >
                      {isSigned ? (
                        <div className="flex items-center gap-3">
                          <span 
                            className="text-3xl text-foreground"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                          >
                            {typedName}
                          </span>
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background">
                            <Check className="h-3 w-3" />
                          </span>
                        </div>
                      ) : (
                        <span className={`text-sm ${canSign ? "text-foreground" : "text-muted-foreground"}`}>
                          {canSign ? "Click here to apply your electronic signature" : "Complete name and agreement above to sign"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Document Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                    <div>
                      <span className="uppercase tracking-wide">Date Signed: </span>
                      <span className="font-medium text-foreground">{isSigned ? today : "—"}</span>
                    </div>
                    <div>
                      <span className="uppercase tracking-wide">IP Address: </span>
                      <span className="font-mono text-foreground">192.168.xxx.xxx</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Action Footer */}
              <div className="border-t border-border px-8 py-5 bg-muted/20">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="gap-2 px-6"
                  >
                    <Check className="h-4 w-4" />
                    Submit Authorization
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-6 max-w-md mx-auto">
            This document is encrypted with TLS 1.3 and stored securely. 
            A copy will be emailed to you upon submission.
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
