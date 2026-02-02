import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Receipt, Truck, MapPin, Package, Calendar, FileText, Sparkles, Printer, Download } from "lucide-react";
import { toast } from "sonner";

const DEMO_DATA = {
  bolNumber: "BOL-2026-001247",
  bookingRef: "TM-20260131-8472",
  moveDate: "2026-02-15",
  originName: "Sarah Johnson",
  originAddress: "1234 Oak Street, Tampa, FL 33601",
  originPhone: "(555) 123-4567",
  destName: "Sarah Johnson",
  destAddress: "789 Pine Avenue, Orlando, FL 32801",
  destPhone: "(555) 123-4567",
  carrierName: "ABC Moving Co.",
  carrierMC: "MC-123456",
  driverName: "John Smith",
  truckNumber: "TRK-4521",
  weight: "4,250",
  pieces: "127",
  specialInstructions: "Fragile items marked with red tape. Piano requires extra care. Customer will meet at destination.",
};

export function BillOfLadingForm() {
  const [formData, setFormData] = useState({
    bolNumber: "",
    bookingRef: "",
    moveDate: "",
    originName: "",
    originAddress: "",
    originPhone: "",
    destName: "",
    destAddress: "",
    destPhone: "",
    carrierName: "",
    carrierMC: "",
    driverName: "",
    truckNumber: "",
    weight: "",
    pieces: "",
    specialInstructions: "",
  });

  const fillDemo = () => {
    setFormData(DEMO_DATA);
    toast.success("Demo data loaded");
  };

  const handlePrint = () => {
    toast.success("Preparing document for print...");
  };

  const handleDownload = () => {
    toast.success("Downloading BOL as PDF...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Receipt className="w-6 h-6" />
          Bill of Lading
        </h2>
        <div className="flex gap-2">
          <Button onClick={fillDemo} variant="outline" size="sm" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Fill Demo
          </Button>
          <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button onClick={handleDownload} size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* BOL Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>BOL Number</Label>
            <Input
              value={formData.bolNumber}
              onChange={(e) => setFormData({ ...formData, bolNumber: e.target.value })}
              placeholder="BOL-YYYY-XXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label>Booking Reference</Label>
            <Input
              value={formData.bookingRef}
              onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
              placeholder="TM-XXXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Move Date
            </Label>
            <Input
              type="date"
              value={formData.moveDate}
              onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Origin */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Origin (Shipper)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.originName}
                onChange={(e) => setFormData({ ...formData, originName: e.target.value })}
                placeholder="Shipper name"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.originAddress}
                onChange={(e) => setFormData({ ...formData, originAddress: e.target.value })}
                placeholder="Full pickup address"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.originPhone}
                onChange={(e) => setFormData({ ...formData, originPhone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </CardContent>
        </Card>

        {/* Destination */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Destination (Consignee)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.destName}
                onChange={(e) => setFormData({ ...formData, destName: e.target.value })}
                placeholder="Consignee name"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.destAddress}
                onChange={(e) => setFormData({ ...formData, destAddress: e.target.value })}
                placeholder="Full delivery address"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.destPhone}
                onChange={(e) => setFormData({ ...formData, destPhone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Carrier Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Carrier Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Carrier Name</Label>
                <Input
                  value={formData.carrierName}
                  onChange={(e) => setFormData({ ...formData, carrierName: e.target.value })}
                  placeholder="Carrier company"
                />
              </div>
              <div className="space-y-2">
                <Label>MC Number</Label>
                <Input
                  value={formData.carrierMC}
                  onChange={(e) => setFormData({ ...formData, carrierMC: e.target.value })}
                  placeholder="MC-XXXXXX"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver Name</Label>
                <Input
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  placeholder="Driver full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Truck Number</Label>
                <Input
                  value={formData.truckNumber}
                  onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                  placeholder="TRK-XXXX"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Shipment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Weight (lbs)</Label>
                <Input
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Total Pieces</Label>
                <Input
                  value={formData.pieces}
                  onChange={(e) => setFormData({ ...formData, pieces: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                placeholder="Any special handling instructions..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button className="gap-2">
          <Receipt className="w-4 h-4" />
          Generate BOL
        </Button>
      </div>
    </div>
  );
}
