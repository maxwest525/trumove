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

  // Auto-generate initials from name
  const typedInitials = typedName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

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

  const InitialBox = ({ field, style }: { field: SignatureField; style?: React.CSSProperties }) => {
    const isSigned = signatures[field];
    const isActive = currentField === field;
    const canApply = field === "signature" ? canSign : canInitial;

    return (
      <span 
        ref={fieldRefs[field]}
        onClick={() => canApply && handleSign(field)}
        style={{
          ...style,
          ...(isActive && canApply && !isSigned ? { borderColor: '#d97706', backgroundColor: '#fef3c7' } : {})
        }}
        className={`
          inline-flex items-center justify-center px-3 py-1 border-2 rounded
          transition-all cursor-pointer align-middle relative
          ${isSigned 
            ? "border-foreground bg-foreground/5" 
            : isActive && canApply
              ? "shadow-lg" 
              : canApply
                ? "border-foreground/70 hover:border-foreground hover:bg-muted/20" 
                : "border-muted-foreground/30 bg-muted/10 cursor-not-allowed"
          }
        `}
        title={isSigned ? "Signed" : canApply ? "Click to sign" : "Enter name first"}
      >
        {isSigned ? (
          <span 
            className="text-base font-semibold text-foreground whitespace-nowrap"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            {typedInitials}
          </span>
        ) : isActive && canApply ? (
          <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap" style={{ color: '#b45309' }}>
            SIGN
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide whitespace-nowrap">
            initial
          </span>
        )}
      </span>
    );
  };

  return (
    <SiteShell>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-[1200px] mx-auto flex gap-6">
          
          {/* Left Sidebar */}
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Instructions Card */}
            <Card className="border border-border bg-background shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2 font-medium">
                      Your Full Legal Name
                    </label>
                    <Input
                      placeholder="e.g. John Smith"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="bg-background border-foreground/20 h-10 text-base"
                    />
                  </div>
                  
                  {/* Always show signature/initials preview */}
                  <div className="flex gap-3 pt-1">
                    <div className="flex-1 border border-foreground/20 rounded px-3 py-2 bg-muted/10">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Signature</span>
                      <div 
                        className="text-lg text-foreground truncate min-h-[1.5rem]"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                      >
                        {typedName || <span className="text-muted-foreground/50 text-sm">—</span>}
                      </div>
                    </div>
                    
                    <div className="w-16 border border-foreground/20 rounded px-3 py-2 bg-muted/10">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-1">Initials</span>
                      <div 
                        className="text-lg text-foreground min-h-[1.5rem]"
                        style={{ fontFamily: "'Dancing Script', cursive" }}
                      >
                        {typedInitials || <span className="text-muted-foreground/50 text-sm">—</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground text-xs uppercase tracking-wide">How to Sign</p>
                  <p>1. Enter your full legal name above</p>
                  <p>2. Click each highlighted <span className="font-mono text-xs border px-1 rounded">initial</span> box</p>
                  <p>3. Sign and submit at the bottom</p>
                </div>
              </CardContent>
            </Card>

            {/* Document Navigation */}
            <Card className="border border-border bg-background shadow-sm">
              <CardContent className="p-4 space-y-2">
                <h3 className="font-medium text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  Documents
                </h3>
                <div className="space-y-1.5">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full justify-start gap-2 h-8 text-xs font-medium"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Estimate Authorization
                    {allSigned && <Check className="h-3 w-3 ml-auto" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start gap-2 h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => toast({ title: "Coming Soon", description: "CC/ACH Authorization document will be available shortly." })}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    CC/ACH Authorization
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start gap-2 h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => toast({ title: "Coming Soon", description: "Bill of Lading document will be available shortly." })}
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    Bill of Lading
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="border border-border bg-background shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-medium text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                  Progress
                </h3>
                <div className="space-y-1.5">
                  {(["initial1", "initial2", "initial3", "signature"] as SignatureField[]).map((field, i) => (
                    <div key={field} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        signatures[field] ? "bg-foreground text-background" : "border border-muted-foreground/40"
                      }`}>
                        {signatures[field] ? <Check className="h-2.5 w-2.5" /> : i + 1}
                      </div>
                      <span className={signatures[field] ? "text-foreground" : "text-muted-foreground"}>
                        {field === "signature" ? "Signature" : `Section ${i + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Container - Paper Size */}
          <div className="flex-1 max-w-[8.5in]">
            <Card className="shadow-xl border border-border bg-white">
              <CardContent className="p-0">
                {/* Document Header */}
                <div className="border-b border-foreground/10 px-10 py-6">
                  <div className="flex items-start justify-between">
                    <img src={logo} alt="TruMove" className="h-8 w-auto" />
                    <div className="text-right">
                      <div className="font-mono text-xs text-foreground font-semibold tracking-wide">{refNumber}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{today}</div>
                    </div>
                  </div>

                  <div className="mt-6 mb-2">
                    <h1 className="text-lg font-bold tracking-tight text-foreground">
                      ESTIMATE CONSENT & AUTHORIZATION
                    </h1>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mt-1">
                      TruMove LLC • FMCSA Licensed Broker • MC-XXXXXXX
                    </p>
                  </div>
                </div>

                {/* Document Body */}
                <div className="px-10 py-6 space-y-6 text-sm leading-relaxed text-foreground">
                  
                  {/* Section 1 */}
                  <section>
                    <h2 className="font-bold text-xs text-foreground mb-2 uppercase tracking-wide">
                      Section 1. Broker Disclosure
                    </h2>
                    
                    <div className="space-y-3 pl-4">
                      <p className="text-justify">
                        <span className="font-semibold">1.1</span> TruMove LLC ("TruMove") is a federally licensed household goods transportation broker 
                        (FMCSA Broker License MC-XXXXXXX) and is not a motor carrier. TruMove arranges transportation services 
                        through independent, federally licensed and insured motor carriers and does not perform the physical 
                        transportation of goods.
                      </p>
                      
                      <p className="text-justify">
                        <span className="font-semibold">1.2</span> The performing motor carrier shall issue the bill of lading and assume full responsibility 
                        for transportation services rendered.
                      </p>

                      <p className="text-justify">
                        I <InitialBox field="initial1" style={{ marginLeft: '2px', marginRight: '4px' }} /> acknowledge 
                        that TruMove LLC operates as a broker, not a motor carrier, and that an independent 
                        carrier will perform the actual transportation services.
                      </p>
                    </div>
                  </section>

                  {/* Section 2 */}
                  <section>
                    <h2 className="font-bold text-xs text-foreground mb-2 uppercase tracking-wide">
                      Section 2. Estimate Terms
                    </h2>
                    
                    <div className="space-y-3 pl-4">
                      <p className="text-justify">
                        <span className="font-semibold">2.1</span> The pricing provided herein constitutes a <em>non-binding estimate</em> unless expressly 
                        designated in writing as a binding estimate. This estimate is based on information provided by the 
                        customer regarding shipment inventory, dwelling type, access conditions, mileage, and move date.
                      </p>
                      
                      <p className="text-justify">
                        <span className="font-semibold">2.2</span> The estimate is generated using TruMove's proprietary pricing engine, which incorporates 
                        customer-provided shipment data, route variables, and historical pricing and weight data from federally 
                        regulated household goods shipments as reported through the U.S. Department of Transportation and FMCSA.
                      </p>

                      <p className="text-justify">
                        <span className="font-semibold">2.3</span> Final charges may increase or decrease based on: (a) actual certified shipment weight; 
                        (b) services performed; (c) access conditions encountered; (d) items transported; and (e) carrier 
                        tariffs and applicable federal regulations.
                      </p>

                      <p className="text-justify">
                        I understand that this is a non-binding estimate <InitialBox field="initial2" style={{ marginLeft: '4px', marginRight: '2px' }} /> and 
                        that final charges may differ based on actual shipment weight, services rendered, and conditions encountered.
                      </p>
                    </div>
                  </section>

                  {/* Section 3 */}
                  <section>
                    <h2 className="font-bold text-xs text-foreground mb-2 uppercase tracking-wide">
                      Section 3. Additional Services & Charges
                    </h2>
                    
                    <div className="space-y-3 pl-4">
                      <p className="text-justify">
                        <span className="font-semibold">3.1</span> Additional services not included in this estimate may result in supplemental charges. 
                        Such services include, but are not limited to: stair carries, elevator usage, long carries (&gt;75 ft), 
                        shuttle service, packing materials, specialty item handling (pianos, safes, antiques), 
                        waiting time, storage, and parking or access restrictions.
                      </p>
                      
                      <p className="text-justify">
                        <span className="font-semibold">3.2</span> All additional charges shall be calculated in accordance with the performing carrier's 
                        published tariffs and applicable federal regulations governing the interstate transportation of 
                        household goods.
                      </p>

                      <p className="text-justify">
                        I acknowledge that additional services may incur <InitialBox field="initial3" style={{ marginLeft: '4px', marginRight: '4px' }} /> charges 
                        beyond the estimated amount.
                      </p>
                    </div>
                  </section>

                  {/* Estimate Display - Compact */}
                  <section className="border border-foreground/15 rounded px-5 py-4 bg-muted/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Estimated Total</span>
                        <div className="text-2xl font-bold text-foreground tracking-tight mt-0.5">
                          $2,850<span className="text-lg">.00</span>
                        </div>
                      </div>
                      <div className="text-right max-w-[280px]">
                        <p className="text-[10px] text-muted-foreground leading-snug">
                          *Estimate subject to change based on actual shipment weight, services rendered, 
                          and conditions at origin/destination per carrier tariffs and federal regulations.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Signature Block */}
                  <section className="space-y-3 pt-2">
                    <h2 className="font-bold text-xs text-foreground uppercase tracking-wide">
                      Section 4. Authorization & Execution
                    </h2>

                    <div className="pl-4 space-y-3">
                      <p className="text-justify">
                        By signing below, Customer authorizes TruMove LLC to arrange transportation services on Customer's 
                        behalf and acknowledges having read, understood, and agreed to all terms contained herein.
                      </p>

                      <div className="grid grid-cols-2 gap-6 pt-2">
                        {/* Customer Name */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                            Customer Name (Print)
                          </label>
                          <div className="h-8 border-b border-foreground/30 flex items-end pb-1">
                            <span className="text-sm font-medium">
                              {typedName || <span className="text-muted-foreground italic text-xs">Enter name in sidebar</span>}
                            </span>
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                            Date
                          </label>
                          <div className="h-8 border-b border-foreground/30 flex items-end pb-1">
                            <span className="text-sm">{today}</span>
                          </div>
                        </div>
                      </div>

                      {/* Signature Field */}
                      <div className="pt-2">
                        <label className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                          Customer Signature
                        </label>
                        <div
                          ref={fieldRefs.signature}
                          onClick={() => canSign && handleSign("signature")}
                          className={`
                            relative h-14 border rounded flex items-center justify-center
                            transition-all cursor-pointer
                            ${signatures.signature 
                              ? "border-foreground/30 bg-muted/10" 
                              : currentField === "signature" && canSign
                                ? "border-foreground bg-muted/5 ring-1 ring-foreground/20" 
                                : canSign 
                                  ? "border-dashed border-foreground/30 hover:border-foreground/50" 
                                  : "border-dashed border-border bg-muted/5 cursor-not-allowed"
                            }
                          `}
                        >
                          {signatures.signature ? (
                            <div className="flex items-center gap-2">
                              <span 
                                className="text-2xl text-foreground"
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                              >
                                {typedName}
                              </span>
                              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-foreground text-background">
                                <Check className="h-2.5 w-2.5" />
                              </span>
                            </div>
                          ) : (
                            <span className={`text-xs ${currentField === "signature" && canSign ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                              {currentField === "signature" && canSign 
                                ? "Click here to apply your signature" 
                                : canSign 
                                  ? "Complete initials above first"
                                  : "Enter your name in the sidebar to sign"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Document Footer */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-4 border-t border-foreground/5 mt-4">
                      <span>Document ID: <span className="font-mono">{refNumber}</span></span>
                      <span>Date Executed: {signatures.signature ? today : "—"}</span>
                    </div>
                  </section>
                </div>

                {/* Action Footer */}
                <div className="border-t border-foreground/10 px-10 py-4 bg-muted/5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 h-8 text-xs">
                        <Printer className="h-3.5 w-3.5" />
                        Print
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 h-8 text-xs">
                        <Download className="h-3.5 w-3.5" />
                        Download PDF
                      </Button>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={!allSigned}
                      variant="outline"
                      size="sm"
                      className="gap-1.5 px-6 h-8 border-foreground/30 hover:bg-foreground hover:text-background"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Submit Authorization
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <p className="text-center text-[10px] text-muted-foreground mt-4 max-w-md mx-auto">
              This document is encrypted with TLS 1.3 and stored securely. 
              A copy will be emailed to you upon submission.
            </p>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
