import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Phone, Mail, MapPin, Calendar, Package, DollarSign, FileText, ChevronRight, Sparkles } from "lucide-react";
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
  moves: {
    id: string;
    date: string;
    from: string;
    to: string;
    status: string;
    amount: number;
  }[];
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
    moves: [
      { id: "TM-001", date: "2026-02-15", from: "Tampa, FL", to: "Orlando, FL", status: "Scheduled", amount: 2450 },
      { id: "TM-002", date: "2025-06-20", from: "Miami, FL", to: "Tampa, FL", status: "Completed", amount: 2750 },
    ],
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
    moves: [
      { id: "TM-003", date: "2025-11-10", from: "Fort Lauderdale, FL", to: "Miami, FL", status: "Completed", amount: 3800 },
    ],
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
    moves: [
      { id: "TM-004", date: "2026-03-01", from: "Orlando, FL", to: "Jacksonville, FL", status: "Pending", amount: 2200 },
      { id: "TM-005", date: "2025-08-15", from: "Gainesville, FL", to: "Orlando, FL", status: "Completed", amount: 3100 },
      { id: "TM-006", date: "2024-12-01", from: "Tallahassee, FL", to: "Gainesville, FL", status: "Completed", amount: 3200 },
    ],
  },
];

export function CustomerLookup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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
    setSelectedCustomer(null);
    toast.success(`Found ${results.length} customer(s)`);
  };

  const loadAllDemo = () => {
    setCustomers(DEMO_CUSTOMERS);
    setSelectedCustomer(null);
    setSearchQuery("");
    toast.success("Loaded all demo customers");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "Scheduled":
        return "bg-primary/10 text-primary border-primary/30";
      case "pending":
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "completed":
      case "Completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Customer Lookup
        </h2>
        <Button onClick={loadAllDemo} variant="outline" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Load Demo Data
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
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
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-1 space-y-3">
          {customers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Search for customers or load demo data</p>
              </CardContent>
            </Card>
          ) : (
            customers.map((customer) => (
              <Card
                key={customer.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selectedCustomer?.id === customer.id ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{customer.totalMoves} moves</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Customer Details */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedCustomer.name}</span>
                    <Badge variant="outline" className={getStatusColor(selectedCustomer.status)}>
                      {selectedCustomer.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <Package className="w-5 h-5 text-primary" />
                        {selectedCustomer.totalMoves}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Moves</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                        {selectedCustomer.lifetimeValue.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Lifetime Value</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        {new Date(selectedCustomer.lastMove).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <p className="text-xs text-muted-foreground">Last Move</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Move History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCustomer.moves.map((move) => (
                      <div
                        key={move.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-medium">{move.id}</span>
                            <Badge variant="outline" className={getStatusColor(move.status)}>
                              {move.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {move.from} → {move.to}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${move.amount.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">{move.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button className="flex-1 gap-2">
                  <Mail className="w-4 h-4" />
                  Email Customer
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  Call Customer
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Select a customer to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
