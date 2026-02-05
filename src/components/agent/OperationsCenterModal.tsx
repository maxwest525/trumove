 import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import { Truck, Users, Mail } from "lucide-react";
 import { CarrierDashboard } from "./CarrierDashboard";
 import { CustomerLookup } from "./CustomerLookup";
 import { ClientMessaging } from "./ClientMessaging";
 
 interface OperationsCenterModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }
 
 export function OperationsCenterModal({ open, onOpenChange }: OperationsCenterModalProps) {
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
         <DialogHeader className="pb-2">
           <DialogTitle className="text-xl font-semibold">Operations Center</DialogTitle>
         </DialogHeader>
         
         <Tabs defaultValue="carrier" className="flex-1 flex flex-col overflow-hidden">
           <TabsList className="grid w-full grid-cols-3 mb-4">
             <TabsTrigger value="carrier" className="gap-2">
               <Truck className="h-4 w-4" />
               Carrier Dashboard
             </TabsTrigger>
             <TabsTrigger value="customer" className="gap-2">
               <Users className="h-4 w-4" />
               Customer Lookup
             </TabsTrigger>
             <TabsTrigger value="messaging" className="gap-2">
               <Mail className="h-4 w-4" />
               Client Messaging
             </TabsTrigger>
           </TabsList>
           
           <div className="flex-1 overflow-y-auto">
             <TabsContent value="carrier" className="mt-0 h-full">
               <CarrierDashboard />
             </TabsContent>
             <TabsContent value="customer" className="mt-0 h-full">
               <CustomerLookup />
             </TabsContent>
             <TabsContent value="messaging" className="mt-0 h-full">
               <ClientMessaging />
             </TabsContent>
           </div>
         </Tabs>
       </DialogContent>
     </Dialog>
   );
 }