import { Link } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import { FileText, Receipt, CreditCard, Truck, Users, BarChart3 } from "lucide-react";

const AGENT_TOOLS = [
  {
    title: "Estimate Authorization",
    description: "Sign and authorize customer estimates",
    icon: FileText,
    href: "/auth",
    available: true,
  },
  {
    title: "Bill of Lading",
    description: "Generate and manage shipping documents",
    icon: Receipt,
    href: null,
    available: false,
  },
  {
    title: "CC/ACH Authorization",
    description: "Payment authorization forms",
    icon: CreditCard,
    href: null,
    available: false,
  },
  {
    title: "Carrier Dashboard",
    description: "View and manage carrier assignments",
    icon: Truck,
    href: null,
    available: false,
  },
  {
    title: "Customer Lookup",
    description: "Search customer records and move history",
    icon: Users,
    href: null,
    available: false,
  },
  {
    title: "Reports & Analytics",
    description: "View performance metrics and reports",
    icon: BarChart3,
    href: null,
    available: false,
  },
];

export default function AgentLogin() {
  return (
    <SiteShell centered>
      <div className="agent-dashboard-page">
        <div className="agent-dashboard-header">
          <h1 className="agent-dashboard-title">Agent Tools</h1>
          <p className="agent-dashboard-subtitle">
            Access your carrier management and authorization tools
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
                {!tool.available && (
                  <span className="agent-tool-badge">Coming Soon</span>
                )}
              </>
            );

            if (tool.available && tool.href) {
              return (
                <Link
                  key={tool.title}
                  to={tool.href}
                  className="agent-tool-card agent-tool-card-active"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={tool.title} className="agent-tool-card agent-tool-card-disabled">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
