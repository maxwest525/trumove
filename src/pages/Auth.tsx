import { useState, useEffect, useRef } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";
import { Check, Download, Printer, FileText, CreditCard, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type SignatureField = "initial1" | "initial2" | "initial3" | "signature";

export default function Auth() {
  const { toast } = useToast();
  const [typedName, setTypedName] = useState("");
  const [typedInitials, setTypedInitials] = useState("");
  const [signatures, setSignatures] = useState<Record<SignatureField, boolean>>({
    initial1: false,
    initial2: false,
    initial3: false,
    signature: false,
  });
  const [currentField, setCurrentField] = useState<SignatureField>("initial1");

  const fieldRefs = {
    initial1: useRef<HTMLDivElement>(null),
    initial2: useRef<HTMLDivElement>(null),
    initial3: useRef<HTMLDivElement>(null),
    signature: useRef<HTMLDivElement>(null),
  };

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

  const handleSign = (field: SignatureField) => {
    if (field === "signature" && typedName.length < 2) return;
    if (field !== "signature" && typedInitials.length < 1) return;
    
    setSignatures(prev => ({ ...prev, [field]: true }));
    
    // Move to next field
    const fieldOrder: SignatureField[] = ["initial1", "initial2", "initial3", "signature"];
    const currentIndex = fieldOrder.indexOf(field);
    if (currentIndex < fieldOrder.length - 1) {
      const nextField = fieldOrder[currentIndex + 1];
      setCurrentField(nextField);
      setTimeout(() => {
        fieldRefs[nextField].current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  };

  const handleSubmit = () => {
    if (Object.values(signatures).every(Boolean)) {
      toast({
        title: "Authorization Submitted",
        description: "Your signed authorization has been received. You will receive a confirmation email shortly.",
      });
    }
  };

  const allSigned = Object.values(signatures).every(Boolean);
  const canInitial = typedInitials.length >= 1;
  const canSign = typedName.length >= 2;

  const InitialBox = ({ field, label }: { field: SignatureField; label: string }) => {
    const isSigned = signatures[field];
    const isActive = currentField === field;
    const canApply = field === "signature" ? canSign : canInitial;

    return (
      <div 
        ref={fieldRefs[field]}
        onClick={() => canApply && handleSign(field)}
        className={`
          inline-flex items-center justify-center w-16 h-10 border-2 rounded
          transition-all cursor-pointer ml-2
          ${isSigned 
            ? "border-foreground/40 bg-muted/30" 
            : isActive && canApply
              ? "border-foreground bg-muted/20 ring-2 ring-foreground/20 animate-pulse" 
              : canApply
                ? "border-foreground/30 hover:border-foreground/50" 
                : "border-border bg-muted/10 cursor-not-allowed"
          }
        `}
        title={isSigned ? "Signed" : canApply ? `Click to ${label}` : "Enter name/initials first"}
      >
        {isSigned ? (
          <span 
            className="text-sm font-medium text-foreground"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            {field === "signature" ? typedName : typedInitials}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {isActive && canApply ? "Click" : label}
          </span>
        )}
      </div>
    );
  };

  return (
    <SiteShell>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-[1200px] mx-auto flex gap-6">
          
          {/* Left Sidebar */}
          <div className="w-72 flex-shrink-0 space-y-6">
            {/* Instructions Card */}
            <Card className="border border-border bg-background shadow-sm">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                  How to Sign
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>1. Enter your full legal name and initials below</p>
                  <p>2. Click each highlighted box in the document to apply your signature</p>
                  <p>3. Submit when all fields are complete</p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Your Full Legal Name
                    </label>
                    <Input
                      placeholder="e.g. John Smith"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="bg-background border-foreground/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Your Initials
                    </label>
                    <Input
                      placeholder="e.g. JS"
                      value={typedInitials}
                      onChange={(e) => setTypedInitials(e.target.value.toUpperCase())}
                      maxLength={4}
                      className="bg-background border-foreground/20 uppercase"
                    />
                  </div>
                </div>

                {(canInitial || canSign) && (
                  <div className="pt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Preview: </span>
                    {canSign && (
                      <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-base">
                        {typedName}
                      </span>
                    )}
                    {canInitial && canSign && <span className="mx-2">|</span>}
                    {canInitial && (
                      <span style={{ fontFamily: "'Dancing Script', cursive" }} className="text-base">
                        {typedInitials}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Document Navigation */}
            <Card className="border border-border bg-background shadow-sm">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground">
                  Documents
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full justify-start gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Estimate Authorization
                    {allSigned && <Check className="h-3 w-3 ml-auto" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-2 text-muted-foreground"
                    onClick={() => toast({ title: "Coming Soon", description: "CC/ACH Authorization document will be available shortly." })}
                  >
                    <CreditCard className="h-4 w-4" />
                    CC/ACH Authorization
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start gap-2 text-muted-foreground"
                    onClick={() => toast({ title: "Coming Soon", description: "Bill of Lading document will be available shortly." })}
                  >
                    <Receipt className="h-4 w-4" />
                    Bill of Lading
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="border border-border bg-background shadow-sm">
              <CardContent className="p-5">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-foreground mb-3">
                  Signature Progress
                </h3>
                <div className="space-y-2">
                  {(["initial1", "initial2", "initial3", "signature"] as SignatureField[]).map((field, i) => (
                    <div key={field} className="flex items-center gap-2 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        signatures[field] ? "bg-foreground text-background" : "border border-border"
                      }`}>
                        {signatures[field] ? <Check className="h-3 w-3" /> : i + 1}
                      </div>
                      <span className={signatures[field] ? "text-foreground" : "text-muted-foreground"}>
                        {field === "signature" ? "Final Signature" : `Initial ${i + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Container - Paper Size */}
          <div className="flex-1">
            <Card className="shadow-xl border border-border bg-white" style={{ minHeight: "11in" }}>
              <CardContent className="p-0">
                {/* Document Header */}
                <div className="border-b border-foreground/20 px-12 py-8">
                  <div className="flex items-start justify-between mb-8">
                    <img src={logo} alt="TruMove" className="h-10 w-auto" />
                    <div className="text-right text-xs text-muted-foreground">
                      <div className="font-mono text-foreground font-medium">{refNumber}</div>
                      <div>{today}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h1 className="text-xl font-bold tracking-wide text-foreground uppercase mb-1">
                      Estimate Consent & Authorization
                    </h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                      Short Form Agreement
                    </p>
                  </div>
                </div>

                {/* Document Body */}
                <div className="px-12 py-8 space-y-8 text-sm leading-relaxed text-foreground">
                  
                  {/* Section 1: Important Notice */}
                  <section>
                    <h2 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4 border-b border-foreground/20 pb-2">
                      Section 1 — Important Notice Regarding Your Moving Estimate
                    </h2>
                    <p className="mb-4 text-justify">
                      TruMove LLC is a federally licensed household goods transportation broker and is not a motor carrier. 
                      TruMove arranges transportation services through independent, federally licensed and insured motor carriers. 
                      The performing motor carrier will issue the bill of lading and be responsible for transportation services.
                    </p>
                    <div className="flex items-center justify-end">
                      <span className="text-xs text-muted-foreground mr-2">Initial here:</span>
                      <InitialBox field="initial1" label="initial" />
                    </div>
                  </section>

                  <Separator className="border-foreground/10" />

                  {/* Section 2: Estimate Basis */}
                  <section>
                    <h2 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4 border-b border-foreground/20 pb-2">
                      Section 2 — Estimate Basis & Acknowledgment
                    </h2>
                    <p className="mb-4 text-justify">
                      The customer acknowledges that the pricing provided is an estimate only and is not a guaranteed or fixed 
                      price unless expressly stated in writing as a binding estimate.
                    </p>
                    <p className="mb-4 text-justify">
                      The estimate is based on information provided by the customer regarding shipment inventory, dwelling type, 
                      access conditions, mileage, and move date. Final charges may increase or decrease based on actual certified 
                      shipment weight, services performed, access conditions encountered, and items transported in accordance 
                      with carrier tariffs and federal regulations.
                    </p>
                    <p className="text-justify">
                      The customer acknowledges that the estimate is generated using TruMove's pricing engine, which incorporates 
                      customer-provided data, route variables, and historical pricing and weight data from federally regulated 
                      household goods shipments reported through the U.S. Department of Transportation and FMCSA.
                    </p>
                    <div className="flex items-center justify-end mt-4">
                      <span className="text-xs text-muted-foreground mr-2">Initial here:</span>
                      <InitialBox field="initial2" label="initial" />
                    </div>
                  </section>

                  <Separator className="border-foreground/10" />

                  {/* Section 3: Variable Charges */}
                  <section>
                    <h2 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4 border-b border-foreground/20 pb-2">
                      Section 3 — Variable Charges Notice
                    </h2>
                    <p className="mb-3 text-justify">Final charges may increase or decrease based on:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground mb-4">
                      <li>Actual certified shipment weight</li>
                      <li>Services performed</li>
                      <li>Access conditions encountered</li>
                      <li>Items transported</li>
                      <li>Carrier tariffs and federal regulations</li>
                    </ul>
                    <p className="text-muted-foreground text-justify">
                      Additional services such as stairs, elevators, long carries, shuttle service, packing, specialty handling, 
                      waiting time, or parking restrictions may result in additional charges.
                    </p>
                    <div className="flex items-center justify-end mt-4">
                      <span className="text-xs text-muted-foreground mr-2">Initial here:</span>
                      <InitialBox field="initial3" label="initial" />
                    </div>
                  </section>

                  <Separator className="border-foreground/10" />

                  {/* Estimate Display */}
                  <section className="border-2 border-foreground/20 p-6">
                    <div className="text-center mb-4">
                      <h2 className="font-bold text-xs uppercase tracking-wider text-foreground mb-1">
                        Estimated Total
                      </h2>
                      <div className="text-4xl font-bold text-foreground tracking-tight">
                        $2,850.00
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center italic">
                      This estimate is subject to change based on actual shipment weight, services rendered, and conditions 
                      encountered at origin and destination. Final charges will be calculated in accordance with applicable 
                      carrier tariffs and federal regulations governing household goods transportation.
                    </p>
                  </section>

                  <Separator className="border-foreground/10" />

                  {/* Customer Acknowledgments */}
                  <section>
                    <h2 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4 border-b border-foreground/20 pb-2">
                      Customer Acknowledgments
                    </h2>
                    <p className="mb-3">Unless expressly designated as binding, this estimate is a <strong>non-binding estimate</strong>.</p>
                    <p className="mb-3">By signing below, the customer acknowledges and agrees that:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-3">
                        <span className="text-foreground font-bold">•</span>
                        <span>TruMove is a broker, not a carrier</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-foreground font-bold">•</span>
                        <span>Final charges may differ from the estimate</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-foreground font-bold">•</span>
                        <span>Pricing depends on actual weight, services, and conditions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-foreground font-bold">•</span>
                        <span>TruMove is authorized to arrange transportation services on the customer's behalf</span>
                      </li>
                    </ul>
                  </section>

                  <Separator className="border-foreground/10" />

                  {/* Signature Block */}
                  <section className="space-y-6 pt-4">
                    <h2 className="font-bold text-xs uppercase tracking-wider text-foreground mb-4 border-b border-foreground/20 pb-2">
                      Execution
                    </h2>

                    <div className="grid grid-cols-2 gap-8">
                      {/* Customer Name */}
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">
                          Customer Name (Print)
                        </label>
                        <div className="h-10 border-b-2 border-foreground/40 flex items-end pb-1">
                          <span className="text-base font-medium">
                            {typedName || <span className="text-muted-foreground italic text-sm">Enter name in sidebar</span>}
                          </span>
                        </div>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">
                          Date
                        </label>
                        <div className="h-10 border-b-2 border-foreground/40 flex items-end pb-1">
                          <span className="text-base">{today}</span>
                        </div>
                      </div>
                    </div>

                    {/* Signature Field */}
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">
                        Customer Signature
                      </label>
                      <div
                        ref={fieldRefs.signature}
                        onClick={() => canSign && handleSign("signature")}
                        className={`
                          relative h-20 border-2 rounded flex items-center justify-center
                          transition-all cursor-pointer
                          ${signatures.signature 
                            ? "border-foreground/40 bg-muted/10" 
                            : currentField === "signature" && canSign
                              ? "border-foreground bg-muted/10 ring-2 ring-foreground/20 animate-pulse" 
                              : canSign 
                                ? "border-dashed border-foreground/30 hover:border-foreground/50" 
                                : "border-dashed border-border bg-muted/5 cursor-not-allowed"
                          }
                        `}
                      >
                        {signatures.signature ? (
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
                          <span className={`text-sm ${currentField === "signature" && canSign ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {currentField === "signature" && canSign 
                              ? "Click here to apply your signature" 
                              : canSign 
                                ? "Complete initials above first"
                                : "Enter your name in the sidebar to sign"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Document Metadata */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-foreground/10">
                      <div>
                        <span className="uppercase tracking-wide">Date Signed: </span>
                        <span className="font-medium text-foreground">{signatures.signature ? today : "—"}</span>
                      </div>
                      <div>
                        <span className="uppercase tracking-wide">Document ID: </span>
                        <span className="font-mono text-foreground">{refNumber}</span>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Action Footer */}
                <div className="border-t border-foreground/20 px-12 py-6 bg-muted/10">
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
                      disabled={!allSigned}
                      className="gap-2 px-8"
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
      </div>
    </SiteShell>
  );
}
