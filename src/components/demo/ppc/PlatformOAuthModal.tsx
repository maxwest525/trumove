import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ExternalLink, Shield, AlertTriangle } from "lucide-react";

interface PlatformOAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: {
    id: string;
    name: string;
    logo: string;
  };
  onConnect: (accountData: {
    accountId: string;
    accountName: string;
  }) => void;
}

type OAuthStep = 'intro' | 'authorizing' | 'selecting' | 'connected';

// Simulated accounts for demo
const DEMO_ACCOUNTS: Record<string, { id: string; name: string; spend: string }[]> = {
  google: [
    { id: 'gads_123456', name: 'TruMove - Main Account', spend: '$12,450/mo' },
    { id: 'gads_789012', name: 'TruMove - Test Account', spend: '$890/mo' },
  ],
  meta: [
    { id: 'meta_234567', name: 'TruMove Moving Services', spend: '$6,780/mo' },
    { id: 'meta_345678', name: 'TruMove Remarketing', spend: '$2,340/mo' },
  ],
  microsoft: [
    { id: 'msads_456789', name: 'TruMove Microsoft Ads', spend: '$1,890/mo' },
  ],
  tiktok: [
    { id: 'tt_567890', name: 'TruMove TikTok Business', spend: '$3,450/mo' },
  ],
};

export function PlatformOAuthModal({ open, onOpenChange, platform, onConnect }: PlatformOAuthModalProps) {
  const [step, setStep] = useState<OAuthStep>('intro');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setStep('intro');
      setSelectedAccount(null);
      setProgress(0);
    }
  }, [open]);

  const handleStartOAuth = async () => {
    setStep('authorizing');
    
    // Simulate OAuth authorization process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setProgress(i);
    }
    
    setStep('selecting');
  };

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccount(accountId);
  };

  const handleConfirmConnection = () => {
    if (!selectedAccount) return;
    
    const account = DEMO_ACCOUNTS[platform.id]?.find(a => a.id === selectedAccount);
    if (account) {
      setStep('connected');
      setTimeout(() => {
        onConnect({
          accountId: account.id,
          accountName: account.name,
        });
        onOpenChange(false);
      }, 1500);
    }
  };

  const accounts = DEMO_ACCOUNTS[platform.id] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{platform.logo}</span>
            Connect {platform.name}
          </DialogTitle>
        </DialogHeader>

        {step === 'intro' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your {platform.name} account to sync campaign data, track conversions, and optimize performance automatically.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Real-time performance data</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>Automated conversion tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500" />
                <span>AI-powered optimization suggestions</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                We use OAuth 2.0 for secure authentication. Your credentials are never stored on our servers.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleStartOAuth} 
                className="flex-1 gap-2"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
              >
                <ExternalLink className="w-4 h-4" />
                Connect with {platform.name.split(' ')[0]}
              </Button>
            </div>
          </div>
        )}

        {step === 'authorizing' && (
          <div className="py-8 space-y-4 text-center">
            <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
            <div>
              <p className="font-medium">Connecting to {platform.name}...</p>
              <p className="text-sm text-muted-foreground">Please wait while we authorize your account</p>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-200 rounded-full"
                style={{ 
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #7C3AED 0%, #A855F7 100%)'
                }}
              />
            </div>
          </div>
        )}

        {step === 'selecting' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the account you want to connect:
            </p>

            <div className="space-y-2">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleSelectAccount(account.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedAccount === account.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.id}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {account.spend}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('intro')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleConfirmConnection}
                disabled={!selectedAccount}
                className="flex-1"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' }}
              >
                Connect Account
              </Button>
            </div>
          </div>
        )}

        {step === 'connected' && (
          <div className="py-8 space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-lg">Connected Successfully!</p>
              <p className="text-sm text-muted-foreground">Syncing your campaign data...</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
