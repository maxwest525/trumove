import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { FileText, Receipt, CreditCard, Truck, Users, BarChart3, Mail, ArrowLeft, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentLoginModal } from "@/components/agent/AgentLoginModal";
 import { ESignHub } from "@/components/agent/ESignHub";
import { CustomerLookup } from "@/components/agent/CustomerLookup";
import { CarrierDashboard } from "@/components/agent/CarrierDashboard";
import { ClientMessaging } from "@/components/agent/ClientMessaging";
import { IntegrationModal } from "@/components/integrations/IntegrationModals";
import PPCDemoModal from "@/components/demo/PPCDemoModal";

type ActiveTool = null | "esign" | "carrier" | "customer" | "messaging" | "granot" | "ringcentral" | "ppc";

const AGENT_TOOLS = [
  {
    id: "esign" as const,
    title: "E-Sign Hub",
    description: "Send, track & assist with document signing",
    icon: FileText,
    external: false,
  },
  {
    id: "carrier" as const,
    title: "Carrier Dashboard",
    description: "View scheduled jobs and follow-ups",
    icon: Truck,
    external: false,
  },
  {
    id: "customer" as const,
    title: "Customer Lookup",
    description: "Search customer records and history",
    icon: Users,
    external: false,
  },
  {
    id: "messaging" as const,
    title: "Client Messaging",
    description: "Email & SMS templates for clients",
    icon: Mail,
    external: false,
  },
  {
    id: "ppc" as const,
    title: "AI Marketing Suite",
    description: "PPC, SEO, A/B testing & conversions",
    icon: Sparkles,
    external: false,
    isIntegration: true,
  },
  {
    id: "granot" as const,
    title: "Granot CRM",
    description: "Moving industry CRM for brokers",
    icon: BarChart3,
    external: false,
    isIntegration: true,
  },
  {
    id: "ringcentral" as const,
    title: "RingCentral",
    description: "Cloud phone & video communications",
    icon: Phone,
    external: false,
    isIntegration: true,
  },
];
export default function AgentLogin() {
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [granotOpen, setGranotOpen] = useState(false);
  const [ringcentralOpen, setRingcentralOpen] = useState(false);
  const [ppcOpen, setPpcOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleToolClick = (toolId: ActiveTool) => {
    if (toolId === "granot") {
      setGranotOpen(true);
    } else if (toolId === "ringcentral") {
      setRingcentralOpen(true);
    } else if (toolId === "ppc") {
      setPpcOpen(true);
    } else {
      setActiveTool(toolId);
    }
  };
  const renderActiveTool = () => {
    switch (activeTool) {
      case "esign":
        return <ESignHub />;
      case "carrier":
        return <CarrierDashboard />;
      case "customer":
        return <CustomerLookup />;
      case "messaging":
        return <ClientMessaging />;
      default:
        return null;
    }
  };

  return (
    <SiteShell centered>
      <AgentLoginModal 
        open={showLoginModal && !isLoggedIn} 
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {/* Integration Modals */}
      <IntegrationModal 
        open={granotOpen} 
        onOpenChange={setGranotOpen} 
        integration="granot" 
      />
      <IntegrationModal 
        open={ringcentralOpen} 
        onOpenChange={setRingcentralOpen} 
        integration="ringcentral" 
      />
      <PPCDemoModal 
        open={ppcOpen} 
        onOpenChange={setPpcOpen} 
      />
      <div className="agent-dashboard-page">
        {activeTool ? (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setActiveTool(null)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Button>
            {renderActiveTool()}
          </div>
        ) : (
          <>
            <div className="agent-dashboard-header">
              <h1 className="agent-dashboard-title">Agent Tools</h1>
              <p className="agent-dashboard-subtitle">
                {isLoggedIn 
                  ? "Access your carrier management and authorization tools" 
                  : "Please log in to access agent tools"}
              </p>
            </div>

            <div className="agent-tools-grid">
              {AGENT_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const content = (
                  <>
                    <div className="agent-tool-icon">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="agent-tool-title">{tool.title}</h3>
                    <p className="agent-tool-description">{tool.description}</p>
                  </>
                );

                if (!isLoggedIn) {
                  return (
                    <div 
                      key={tool.id} 
                      className="agent-tool-card agent-tool-card-disabled"
                      onClick={() => setShowLoginModal(true)}
                    >
                      {content}
                      <span className="agent-tool-badge">Login Required</span>
                    </div>
                  );
                }

                if (tool.external && 'href' in tool && tool.href) {
                  return (
                    <Link
                      key={tool.id}
                      to={tool.href}
                      className="agent-tool-card agent-tool-card-active"
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div
                    key={tool.id}
                    className="agent-tool-card agent-tool-card-active"
                    onClick={() => handleToolClick(tool.id)}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </SiteShell>
  );
}
