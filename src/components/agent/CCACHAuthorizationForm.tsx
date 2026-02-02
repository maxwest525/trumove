import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Building, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const DEMO_DATA = {
  customerName: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "(555) 123-4567",
  address: "1234 Oak Street, Tampa, FL 33601",
  cardNumber: "4532 •••• •••• 7821",
  expiry: "08/27",
  cvv: "•••",
  bankName: "Chase Bank",
  routingNumber: "021000021",
  accountNumber: "•••••4589",
  amount: "2,450.00",
};

export function CCACHAuthorizationForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    amount: "",
    authorized: false,
  });

  const fillDemo = () => {
    setFormData({
      ...DEMO_DATA,
      paymentMethod: "card",
      authorized: true,
    });
    toast.success("Demo data loaded");
  };

  const handleSubmit = () => {
    if (!formData.authorized) {
      toast.error("Customer must authorize payment");
      return;
    }
    toast.success("Payment authorization saved!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CC/ACH Authorization</h2>
        <Button onClick={fillDemo} variant="outline" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Fill Demo
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Customer full name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Billing Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full billing address"
              />
            </div>
            <div className="space-y-2">
              <Label>Authorization Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={formData.paymentMethod}
              onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="ach">ACH Bank Transfer</SelectItem>
              </SelectContent>
            </Select>

            {formData.paymentMethod === "card" ? (
              <>
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      type="password"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      placeholder="•••"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Bank Name
                  </Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Bank name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Routing Number</Label>
                    <Input
                      value={formData.routingNumber}
                      onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                      placeholder="9 digits"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Account number"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="authorize"
                  checked={formData.authorized}
                  onCheckedChange={(c) => setFormData({ ...formData, authorized: !!c })}
                />
                <label htmlFor="authorize" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  I authorize TruMove to charge the above payment method for the specified amount for moving services.
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSubmit} className="gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Save Authorization
        </Button>
      </div>
    </div>
  );
}
