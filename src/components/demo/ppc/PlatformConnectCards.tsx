 import { useState } from "react";
 import { Card, CardContent } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { 
   Check, Link2, AlertCircle, TrendingUp, TrendingDown,
   RefreshCw, ExternalLink, Settings
 } from "lucide-react";
 import { toast } from "sonner";
 
 interface Platform {
   id: string;
   name: string;
   logo: string;
   connected: boolean;
   roas?: number;
   spend?: number;
   conversions?: number;
   status: 'connected' | 'disconnected' | 'error' | 'syncing';
   lastSync?: string;
   trend?: 'up' | 'down' | 'stable';
 }
 
 const PLATFORMS: Platform[] = [
   {
     id: 'google',
     name: 'Google Ads',
     logo: '🔍',
     connected: true,
     roas: 4.2,
     spend: 12450,
     conversions: 892,
     status: 'connected',
     lastSync: '2 min ago',
     trend: 'up'
   },
   {
     id: 'meta',
     name: 'Meta Ads',
     logo: '📘',
     connected: true,
     roas: 3.1,
     spend: 6780,
     conversions: 412,
     status: 'connected',
     lastSync: '5 min ago',
     trend: 'up'
   },
   {
     id: 'microsoft',
     name: 'Microsoft Ads',
     logo: '🪟',
     connected: false,
     status: 'disconnected'
   },
   {
     id: 'tiktok',
     name: 'TikTok Ads',
     logo: '🎵',
     connected: false,
     status: 'disconnected'
   },
 ];
 
 interface PlatformConnectCardsProps {
   compact?: boolean;
 }
 
 export function PlatformConnectCards({ compact = false }: PlatformConnectCardsProps) {
   const [platforms, setPlatforms] = useState<Platform[]>(PLATFORMS);
   const [connecting, setConnecting] = useState<string | null>(null);
 
   const handleConnect = async (platformId: string) => {
     setConnecting(platformId);
     setPlatforms(prev => prev.map(p => 
       p.id === platformId ? { ...p, status: 'syncing' as const } : p
     ));
 
     // Simulate connection
     await new Promise(resolve => setTimeout(resolve, 2000));
 
     setPlatforms(prev => prev.map(p => 
       p.id === platformId ? {
         ...p,
         connected: true,
         status: 'connected' as const,
         roas: 2.4,
         spend: 1890,
         conversions: 89,
         lastSync: 'Just now',
         trend: 'stable' as const
       } : p
     ));
     setConnecting(null);
 
     const platform = platforms.find(p => p.id === platformId);
     toast.success(`${platform?.name} connected!`, {
       description: 'Syncing campaign data...'
     });
   };
 
   const handleRefresh = async (platformId: string) => {
     setPlatforms(prev => prev.map(p => 
       p.id === platformId ? { ...p, status: 'syncing' as const } : p
     ));
 
     await new Promise(resolve => setTimeout(resolve, 1500));
 
     setPlatforms(prev => prev.map(p => 
       p.id === platformId ? { ...p, status: 'connected' as const, lastSync: 'Just now' } : p
     ));
 
     toast.success('Data refreshed');
   };
 
   if (compact) {
     return (
       <div className="grid grid-cols-4 gap-2">
         {platforms.map(platform => (
           <div
             key={platform.id}
             className={`p-2 rounded-lg border text-center transition-all ${
               platform.connected
                 ? 'border-green-500/30 bg-green-500/5'
                 : 'border-border bg-muted/30 hover:border-primary/50'
             }`}
           >
             <span className="text-xl">{platform.logo}</span>
             <p className="text-[10px] font-medium mt-1">{platform.name}</p>
             {platform.connected ? (
               <Badge className="text-[8px] h-4 mt-1 bg-green-500/10 text-green-600">
                 {platform.roas}x ROAS
               </Badge>
             ) : (
               <Button
                 variant="ghost"
                 size="sm"
                 className="h-5 text-[9px] mt-1 text-primary"
                 onClick={() => handleConnect(platform.id)}
                 disabled={connecting === platform.id}
               >
                 {connecting === platform.id ? 'Connecting...' : 'Connect'}
               </Button>
             )}
           </div>
         ))}
       </div>
     );
   }
 
   return (
     <div className="space-y-3">
       <div className="flex items-center justify-between">
         <h3 className="font-semibold text-sm flex items-center gap-2">
           <Link2 className="w-4 h-4 text-primary" />
           Connected Platforms
         </h3>
         <Badge variant="secondary" className="text-[10px]">
           {platforms.filter(p => p.connected).length}/{platforms.length} Active
         </Badge>
       </div>
 
       <div className="grid grid-cols-2 gap-3">
         {platforms.map(platform => (
           <Card 
             key={platform.id}
             className={`overflow-hidden transition-all ${
               platform.connected
                 ? 'border-green-500/30'
                 : 'border-dashed border-muted-foreground/30 hover:border-primary/50'
             }`}
           >
             <CardContent className="p-3">
               <div className="flex items-start justify-between mb-2">
                 <div className="flex items-center gap-2">
                   <span className="text-2xl">{platform.logo}</span>
                   <div>
                     <p className="font-medium text-sm">{platform.name}</p>
                     {platform.connected && (
                       <p className="text-[10px] text-muted-foreground">
                         Synced {platform.lastSync}
                       </p>
                     )}
                   </div>
                 </div>
                 
                 {platform.status === 'connected' && (
                   <Badge className="bg-green-500/10 text-green-600 text-[10px]">
                     <Check className="w-3 h-3 mr-1" />
                     Live
                   </Badge>
                 )}
                 {platform.status === 'syncing' && (
                   <Badge className="bg-blue-500/10 text-blue-600 text-[10px]">
                     <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                     Syncing
                   </Badge>
                 )}
                 {platform.status === 'error' && (
                   <Badge className="bg-red-500/10 text-red-600 text-[10px]">
                     <AlertCircle className="w-3 h-3 mr-1" />
                     Error
                   </Badge>
                 )}
               </div>
 
               {platform.connected ? (
                 <>
                   <div className="grid grid-cols-3 gap-2 mb-2">
                     <div className="text-center p-1.5 rounded bg-muted/50">
                       <p className="text-xs font-bold flex items-center justify-center gap-1">
                         {platform.roas}x
                         {platform.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                         {platform.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                       </p>
                       <p className="text-[9px] text-muted-foreground">ROAS</p>
                     </div>
                     <div className="text-center p-1.5 rounded bg-muted/50">
                       <p className="text-xs font-bold">${(platform.spend! / 1000).toFixed(1)}K</p>
                       <p className="text-[9px] text-muted-foreground">Spend</p>
                     </div>
                     <div className="text-center p-1.5 rounded bg-muted/50">
                       <p className="text-xs font-bold">{platform.conversions}</p>
                       <p className="text-[9px] text-muted-foreground">Conv</p>
                     </div>
                   </div>
                   <div className="flex gap-1">
                     <Button
                       variant="ghost"
                       size="sm"
                       className="flex-1 h-7 text-xs"
                       onClick={() => handleRefresh(platform.id)}
                       disabled={platform.status === 'syncing'}
                     >
                       <RefreshCw className={`w-3 h-3 mr-1 ${platform.status === 'syncing' ? 'animate-spin' : ''}`} />
                       Refresh
                     </Button>
                     <Button variant="ghost" size="sm" className="h-7 text-xs">
                       <Settings className="w-3 h-3" />
                     </Button>
                     <Button variant="ghost" size="sm" className="h-7 text-xs">
                       <ExternalLink className="w-3 h-3" />
                     </Button>
                   </div>
                 </>
               ) : (
                 <Button
                   className="w-full gap-2 h-8 text-xs"
                   onClick={() => handleConnect(platform.id)}
                   disabled={connecting === platform.id}
                   style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
                 >
                   {connecting === platform.id ? (
                     <>
                       <RefreshCw className="w-3 h-3 animate-spin" />
                       Connecting...
                     </>
                   ) : (
                     <>
                       <Link2 className="w-3 h-3" />
                       Connect {platform.name}
                     </>
                   )}
                 </Button>
               )}
             </CardContent>
           </Card>
         ))}
       </div>
     </div>
   );
 }