import { useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import logo from "@/assets/logo.png";
import { Check, FileText, Download, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const { toast } = useToast();
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    originAddress: "",
    destinationAddress: "",
    moveDate: "",
  });
  const [typedName, setTypedName] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
  };

  const canSign = typedName.length >= 2 && agreedToTerms;
  const canSubmit = isSigned && agreedToTerms;

  return (
    <SiteShell>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-[850px] mx-auto">
          {/* Document Container */}
          <Card className="shadow-xl border-0 bg-white">
            {/* Document Header */}
            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="TruMove" className="h-10 w-auto" />
                  <div>
                    <div className="text-xs text-muted-foreground tracking-wider uppercase">
                      Moving Services
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Reference</div>
                  <div className="font-mono text-sm font-semibold text-foreground">
                    {refNumber}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-bold tracking-wide text-foreground uppercase">
                    Estimate Authorization Agreement
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Date: {today}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              {/* Customer Information Section */}
              <section>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                  Customer Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Full Name
                    </label>
                    <Input
                      placeholder="Enter your full name"
                      value={customerInfo.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Estimated Move Date
                    </label>
                    <Input
                      type="date"
                      value={customerInfo.moveDate}
                      onChange={(e) => handleInputChange("moveDate", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Origin Address
                    </label>
                    <Input
                      placeholder="123 Main St, City, State ZIP"
                      value={customerInfo.originAddress}
                      onChange={(e) => handleInputChange("originAddress", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Destination Address
                    </label>
                    <Input
                      placeholder="456 Oak Ave, City, State ZIP"
                      value={customerInfo.destinationAddress}
                      onChange={(e) => handleInputChange("destinationAddress", e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                </div>
              </section>

              <Separator />

              {/* Estimate Details Section */}
              <section>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                  Estimate Summary
                </h2>
                <div className="bg-muted/30 rounded-lg p-5 border border-border/50">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground uppercase">Estimated Total</div>
                      <div className="text-2xl font-bold text-primary mt-1">$2,450</div>
                      <div className="text-xs text-muted-foreground">– $3,100</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground uppercase">Service Type</div>
                      <div className="text-sm font-semibold text-foreground mt-1">Full Service</div>
                      <div className="text-xs text-muted-foreground">Pack & Move</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground uppercase">Est. Weight</div>
                      <div className="text-sm font-semibold text-foreground mt-1">4,200 lbs</div>
                      <div className="text-xs text-muted-foreground">Approx.</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-md shadow-sm">
                      <div className="text-xs text-muted-foreground uppercase">Distance</div>
                      <div className="text-sm font-semibold text-foreground mt-1">847 mi</div>
                      <div className="text-xs text-muted-foreground">Interstate</div>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Terms & Conditions Section */}
              <section>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                  Terms & Conditions
                </h2>
                <ScrollArea className="h-[200px] rounded-md border border-border/50 p-4 bg-muted/20">
                  <div className="text-sm text-muted-foreground space-y-4 pr-4">
                    <p className="font-semibold text-foreground">AUTHORIZATION TO PROCEED</p>
                    <p>
                      By signing this document, I authorize TruMove and its affiliated carriers to proceed with the 
                      transportation of my household goods as detailed in the estimate provided. I understand that 
                      this authorization constitutes a binding agreement to utilize the services described herein.
                    </p>
                    
                    <p className="font-semibold text-foreground">BINDING ESTIMATE ACKNOWLEDGMENT</p>
                    <p>
                      I acknowledge that the estimate provided is based on the inventory and services I have requested. 
                      The final cost may vary if additional items or services are requested at the time of the move, 
                      or if the actual weight/volume exceeds the estimate by more than 10%.
                    </p>
                    
                    <p className="font-semibold text-foreground">CANCELLATION POLICY</p>
                    <p>
                      Cancellations made more than 7 business days prior to the scheduled move date will receive a 
                      full refund of any deposit. Cancellations made within 7 business days may be subject to a 
                      cancellation fee of up to 25% of the estimated total.
                    </p>
                    
                    <p className="font-semibold text-foreground">LIABILITY & VALUATION</p>
                    <p>
                      Basic liability coverage is included at $0.60 per pound per article. Full replacement value 
                      protection is available for an additional fee. I understand that I should review and select 
                      appropriate coverage before the move date.
                    </p>
                    
                    <p className="font-semibold text-foreground">INSURANCE OPTIONS</p>
                    <p>
                      I acknowledge that I have been informed of available insurance options and understand that 
                      it is my responsibility to ensure adequate coverage for my belongings during transit.
                    </p>

                    <p className="font-semibold text-foreground">CARRIER VETTING</p>
                    <p>
                      All carriers affiliated with TruMove are verified against FMCSA safety records and must 
                      maintain active operating authority, proper insurance, and satisfactory safety ratings.
                    </p>
                  </div>
                </ScrollArea>

                <div className="mt-4 flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <label htmlFor="terms" className="text-sm text-foreground cursor-pointer leading-tight">
                    I have read, understand, and agree to the terms and conditions outlined above. I acknowledge 
                    that this constitutes a legally binding agreement.
                  </label>
                </div>
              </section>

              <Separator />

              {/* Signature Section */}
              <section>
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">4</span>
                  Electronic Signature
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Type Your Full Legal Name
                    </label>
                    <Input
                      placeholder="Enter your full legal name to sign"
                      value={typedName}
                      onChange={(e) => {
                        setTypedName(e.target.value);
                        if (isSigned) setIsSigned(false);
                      }}
                      className="bg-muted/50 text-lg"
                      disabled={isSigned}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Signature
                    </label>
                    <div
                      onClick={handleSign}
                      className={`
                        relative h-24 rounded-lg border-2 border-dashed flex items-center justify-center
                        transition-all cursor-pointer
                        ${isSigned 
                          ? "border-primary/50 bg-primary/5" 
                          : canSign 
                            ? "border-primary/30 bg-muted/30 hover:border-primary/50 hover:bg-primary/5" 
                            : "border-border bg-muted/20 cursor-not-allowed"
                        }
                      `}
                    >
                      {isSigned ? (
                        <div className="flex items-center gap-3">
                          <span 
                            className="text-3xl text-primary"
                            style={{ fontFamily: "'Dancing Script', cursive" }}
                          >
                            {typedName}
                          </span>
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                            <Check className="h-4 w-4" />
                          </span>
                        </div>
                      ) : (
                        <span className={`text-sm ${canSign ? "text-primary" : "text-muted-foreground"}`}>
                          {canSign ? "Click here to apply your signature" : "Complete the fields above to sign"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 rounded-md px-4 py-2">
                    <div>
                      <span className="uppercase tracking-wide">Date Signed: </span>
                      <span className="font-medium text-foreground">{isSigned ? today : "—"}</span>
                    </div>
                    <div>
                      <span className="uppercase tracking-wide">IP Address: </span>
                      <span className="font-mono text-foreground">192.168.xxx.xxx</span>
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Action Buttons */}
              <section className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Request Changes
                </Button>

                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="gap-2 px-6"
                  >
                    <Check className="h-4 w-4" />
                    Submit Authorization
                  </Button>
                </div>
              </section>
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
