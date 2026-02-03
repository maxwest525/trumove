import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Users, Phone, Mail, MapPin, ChevronRight, Sparkles, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalMoves: number;
  lifetimeValue: number;
  lastMove: string;
  status: "active" | "pending" | "completed";
}

const DEMO_CUSTOMERS: Customer[] = [
  {
    id: "CUS-001",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    address: "1234 Oak Street, Tampa, FL 33601",
    totalMoves: 2,
    lifetimeValue: 5200,
    lastMove: "2026-01-15",
    status: "active",
  },
  {
    id: "CUS-002",
    name: "Michael Chen",
    email: "m.chen@techcorp.com",
    phone: "(555) 987-6543",
    address: "456 Palm Ave, Miami, FL 33101",
    totalMoves: 1,
    lifetimeValue: 3800,
    lastMove: "2025-11-10",
    status: "completed",
  },
  {
    id: "CUS-003",
    name: "Emily Rodriguez",
    email: "emily.r@gmail.com",
    phone: "(555) 456-7890",
    address: "789 Sunset Blvd, Orlando, FL 32801",
    totalMoves: 3,
    lifetimeValue: 8500,
    lastMove: "2026-01-28",
    status: "pending",
  },
];

export interface ClientData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ClientSearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (client: ClientData) => void;
}

export function ClientSearchModal({ open, onClose, onSelect }: ClientSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Enter a name, email, or phone to search");
      return;
    }
    const results = DEMO_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );
    setCustomers(results);
    if (results.length === 0) {
      toast.info("No customers found");
    } else {
      toast.success(`Found ${results.length} customer(s)`);
    }
  };

  const loadAllDemo = () => {
    setCustomers(DEMO_CUSTOMERS);
    setSearchQuery("");
    toast.success("Loaded all demo customers");
  };

  const handleSelect = (customer: Customer) => {
    onSelect({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    onClose();
    toast.success(`Imported ${customer.name}'s information`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary/10 text-primary border-primary/30";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="w-5 h-5 text-primary" />
            Import Client Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by name, email, or phone..."
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button onClick={loadAllDemo} variant="outline" size="sm" className="gap-1">
              <Sparkles className="w-4 h-4" />
              Demo
            </Button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px] max-h-[400px]">
            {customers.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Search for customers or load demo data</p>
              </div>
            ) : (
              customers.map((customer) => (
                <Card
                  key={customer.id}
                  className="cursor-pointer transition-all hover:border-primary/50 hover:bg-accent/50"
                  onClick={() => handleSelect(customer)}
                >
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{customer.name}</h3>
                          <Badge variant="outline" className={`text-[10px] ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {customer.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {customer.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Click a customer to import their information into the form
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
