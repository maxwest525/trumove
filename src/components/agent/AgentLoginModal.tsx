import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface AgentLoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AgentLoginModal({ open, onClose, onLogin }: AgentLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back, Agent!");
      onLogin();
    }, 800);
  };

  const handleDemo = () => {
    setUsername("demo.agent");
    setPassword("••••••••");
    setTimeout(() => {
      toast.success("Demo login - Welcome, Agent!");
      onLogin();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Lock className="w-5 h-5 text-primary" />
            Agent Login
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleLogin}
              className="flex-1 bg-foreground text-background hover:bg-primary hover:text-foreground shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button
              onClick={handleDemo}
              variant="outline"
              className="gap-2 border-2 hover:border-primary/50 hover:bg-primary/10"
            >
              <Sparkles className="w-4 h-4" />
              Demo
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            For demo purposes, click Demo to bypass login
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
