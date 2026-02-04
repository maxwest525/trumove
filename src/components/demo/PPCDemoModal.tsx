import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, Search, Globe, TrendingUp, Target, 
  BarChart3, DollarSign, MousePointer,
  FileText, Layout, RefreshCw, 
  CheckCircle2, AlertTriangle, ArrowUp, ArrowDown,
  Copy, ExternalLink, Lightbulb,
  Type, Play, Pause, FlaskConical, LineChart,
  ArrowRight, Percent, Timer, Eye, Users, Layers,
  Plus, Trophy, Zap, Activity
} from "lucide-react";

interface PPCDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Demo data
const DEMO_KEYWORDS = [
  { keyword: "long distance moving", volume: 12400, cpc: "$4.82", competition: "High", score: 92, trend: "up" },
  { keyword: "interstate movers near me", volume: 8200, cpc: "$5.15", competition: "High", score: 88, trend: "up" },
  { keyword: "cross country moving companies", volume: 6800, cpc: "$4.20", competition: "Medium", score: 85, trend: "stable" },
  { keyword: "affordable long distance movers", volume: 4500, cpc: "$3.90", competition: "Medium", score: 82, trend: "up" },
  { keyword: "best moving company reviews", volume: 3200, cpc: "$2.85", competition: "Low", score: 78, trend: "stable" },
  { keyword: "moving cost calculator", volume: 9100, cpc: "$2.40", competition: "Medium", score: 75, trend: "down" },
];

const DEMO_ADS = [
  { 
    id: 1,
    headline: "TruMove - AI-Powered Moving Quotes",
    description: "Get accurate quotes in 60 seconds. Compare verified movers. No hidden fees.",
    status: "active",
    clicks: 1247,
    impressions: 28450,
    ctr: 4.38,
    spend: 892.40,
    conversions: 34
  },
  { 
    id: 2,
    headline: "Compare Top Movers & Save 30%",
    description: "Trusted by 50,000+ families. Real-time tracking. Damage protection included.",
    status: "active",
    clicks: 892,
    impressions: 21340,
    ctr: 4.18,
    spend: 654.20,
    conversions: 28
  },
  { 
    id: 3,
    headline: "Free Moving Estimate in Minutes",
    description: "AI inventory scanner. Transparent pricing. Book online 24/7.",
    status: "paused",
    clicks: 234,
    impressions: 8920,
    ctr: 2.62,
    spend: 189.60,
    conversions: 8
  },
];

const SEO_ISSUES = [
  { type: "error", message: "Missing meta description on /services page", impact: "High" },
  { type: "warning", message: "H1 tag too long (72 chars) on homepage", impact: "Medium" },
  { type: "warning", message: "Images missing alt text (3 found)", impact: "Medium" },
  { type: "success", message: "All pages have unique title tags", impact: "Passed" },
  { type: "success", message: "Mobile-friendly design detected", impact: "Passed" },
  { type: "success", message: "SSL certificate valid", impact: "Passed" },
];

const LANDING_PAGE_TEMPLATES = [
  { id: 1, name: "Quote Request", conversion: "12.4%", thumbnail: "quote" },
  { id: 2, name: "Service Comparison", conversion: "8.7%", thumbnail: "compare" },
  { id: 3, name: "Contact Form", conversion: "6.2%", thumbnail: "contact" },
  { id: 4, name: "Calculator Tool", conversion: "15.8%", thumbnail: "calculator" },
];

const AB_TESTS = [
  {
    id: 1,
    name: "Homepage Hero CTA",
    status: "running",
    startDate: "Jan 28",
    variants: [
      { name: "Control", visitors: 4521, conversions: 312, rate: 6.9 },
      { name: "Variant A", visitors: 4489, conversions: 387, rate: 8.6 },
    ],
    winner: "Variant A",
    confidence: 94,
    lift: "+24.6%"
  },
  {
    id: 2,
    name: "Quote Form Layout",
    status: "running",
    startDate: "Jan 25",
    variants: [
      { name: "Single Step", visitors: 3212, conversions: 198, rate: 6.2 },
      { name: "Multi Step", visitors: 3198, conversions: 256, rate: 8.0 },
    ],
    winner: "Multi Step",
    confidence: 89,
    lift: "+29.0%"
  },
  {
    id: 3,
    name: "Pricing Display",
    status: "completed",
    startDate: "Jan 15",
    variants: [
      { name: "Range", visitors: 5840, conversions: 321, rate: 5.5 },
      { name: "Starting At", visitors: 5812, conversions: 412, rate: 7.1 },
    ],
    winner: "Starting At",
    confidence: 98,
    lift: "+28.4%"
  },
];

const CONVERSION_EVENTS = [
  { event: "Quote Requested", count: 847, trend: "+12%", value: "$42.35", source: "Google Ads" },
  { event: "Phone Call", count: 234, trend: "+8%", value: "$68.20", source: "Direct" },
  { event: "Form Submitted", count: 1203, trend: "+18%", value: "$28.50", source: "Organic" },
  { event: "Chat Started", count: 456, trend: "+24%", value: "$15.80", source: "Facebook" },
  { event: "Booking Completed", count: 89, trend: "+6%", value: "$285.00", source: "Google Ads" },
];

const FUNNEL_STAGES = [
  { stage: "Landing Page Views", count: 28450, rate: 100 },
  { stage: "Quote Started", count: 8234, rate: 28.9 },
  { stage: "Inventory Added", count: 4521, rate: 15.9 },
  { stage: "Quote Completed", count: 2847, rate: 10.0 },
  { stage: "Booking Made", count: 847, rate: 3.0 },
];

export default function PPCDemoModal({ open, onOpenChange }: PPCDemoModalProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [showNewTest, setShowNewTest] = useState(false);
  const [newTestName, setNewTestName] = useState("");

  const handleGenerateContent = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedContent("Get Your Free Moving Quote in 60 Seconds\n\nTrusted by 50,000+ families nationwide. Our AI-powered system gives you accurate, binding quotes without the runaround.\n\n✓ Compare verified movers instantly\n✓ Real-time shipment tracking\n✓ Price-match guarantee\n✓ $0 deposit to book");
    }, 2000);
  };

  const handleCreateTest = () => {
    setShowNewTest(false);
    setNewTestName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-hidden p-0 gap-0">
        {/* Header */}
        <DialogHeader 
          className="px-6 pt-6 pb-4"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)" }}
        >
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block text-white font-bold">AI Marketing Suite</span>
              <span className="text-sm font-normal text-white/80">PPC • SEO • A/B Testing • Conversion Tracking</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Navigation */}
        <div className="flex gap-1 px-4 py-2 overflow-x-auto" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "ads", label: "Google Ads", icon: Target },
            { id: "keywords", label: "Keywords", icon: Search },
            { id: "seo", label: "SEO Audit", icon: Globe },
            { id: "landing", label: "Landing Pages", icon: Layout },
            { id: "abtest", label: "A/B Tests", icon: FlaskConical },
            { id: "conversions", label: "Conversions", icon: LineChart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={{
                background: activeTab === tab.id ? "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" : "transparent",
                color: activeTab === tab.id ? "white" : "#64748B",
              }}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
          <div className="p-4">
            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Total Spend", value: "$1,736", change: "+12%", icon: DollarSign, color: "#7C3AED" },
                    { label: "Clicks", value: "2,373", change: "+18%", icon: MousePointer, color: "#EC4899" },
                    { label: "Conversions", value: "70", change: "+24%", icon: Target, color: "#10B981" },
                    { label: "Cost/Conv.", value: "$24.80", change: "-8%", icon: TrendingUp, color: "#F59E0B" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                          <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                        </div>
                        <span className="text-xs font-medium text-green-600">
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Performance Chart Placeholder */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Campaign Performance</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Last 7 days</Badge>
                    </div>
                  </div>
                  <div className="h-40 flex items-end gap-1">
                    {[35, 45, 30, 60, 75, 55, 80, 65, 90, 70, 85, 95, 75, 88].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div 
                          className="w-full rounded-t transition-all hover:opacity-80"
                          style={{ 
                            height: `${h}%`, 
                            background: i === 13 ? "linear-gradient(180deg, #7C3AED 0%, #A855F7 100%)" : "#E2E8F0"
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-3">
                  <button onClick={() => setActiveTab("ads")} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left">
                    <Sparkles className="w-5 h-5 mb-2" style={{ color: "#7C3AED" }} />
                    <div className="font-medium text-sm text-foreground">Generate Ad Copy</div>
                    <div className="text-xs text-muted-foreground">AI-powered headlines</div>
                  </button>
                  <button onClick={() => setActiveTab("keywords")} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left">
                    <Search className="w-5 h-5 mb-2" style={{ color: "#EC4899" }} />
                    <div className="font-medium text-sm text-foreground">Keyword Research</div>
                    <div className="text-xs text-muted-foreground">Find opportunities</div>
                  </button>
                  <button onClick={() => setActiveTab("abtest")} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left">
                    <FlaskConical className="w-5 h-5 mb-2" style={{ color: "#10B981" }} />
                    <div className="font-medium text-sm text-foreground">New A/B Test</div>
                    <div className="text-xs text-muted-foreground">Optimize conversions</div>
                  </button>
                  <button onClick={() => setActiveTab("conversions")} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-left">
                    <LineChart className="w-5 h-5 mb-2" style={{ color: "#F59E0B" }} />
                    <div className="font-medium text-sm text-foreground">View Funnel</div>
                    <div className="text-xs text-muted-foreground">Track drop-offs</div>
                  </button>
                </div>
              </div>
            )}

            {/* Google Ads */}
            {activeTab === "ads" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Active Campaigns</h3>
                  <Button size="sm" className="gap-2" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
                    <Sparkles className="w-4 h-4" />
                    Generate New Ad
                  </Button>
                </div>

                <div className="space-y-3">
                  {DEMO_ADS.map((ad) => (
                    <div key={ad.id} className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{ad.headline}</h4>
                            <Badge 
                              className="text-[10px]"
                              style={{ 
                                background: ad.status === "active" ? "#10B98120" : "#F59E0B20",
                                color: ad.status === "active" ? "#10B981" : "#F59E0B"
                              }}
                            >
                              {ad.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{ad.description}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {ad.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="grid grid-cols-5 gap-4 pt-3 border-t border-border">
                        <div>
                          <div className="text-lg font-bold text-foreground">{ad.clicks.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Clicks</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">{ad.impressions.toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Impressions</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold" style={{ color: "#7C3AED" }}>{ad.ctr}%</div>
                          <div className="text-[10px] text-muted-foreground uppercase">CTR</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-foreground">${ad.spend.toFixed(2)}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Spend</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold" style={{ color: "#10B981" }}>{ad.conversions}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Conversions</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {activeTab === "keywords" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Enter seed keyword to discover opportunities..." className="pl-9" />
                  </div>
                  <Button style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze
                  </Button>
                </div>

                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#F8FAFC" }}>
                    <span className="font-semibold text-sm text-foreground">Keyword Opportunities</span>
                    <Badge variant="secondary">{DEMO_KEYWORDS.length} keywords</Badge>
                  </div>
                  <div className="divide-y divide-border">
                    {DEMO_KEYWORDS.map((kw, i) => (
                      <div key={i} className="px-4 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground">{kw.keyword}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{kw.volume.toLocaleString()} monthly</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs font-medium" style={{ color: "#7C3AED" }}>{kw.cpc}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {kw.trend === "up" && <ArrowUp className="w-3 h-3 text-green-500" />}
                          {kw.trend === "down" && <ArrowDown className="w-3 h-3 text-red-500" />}
                        </div>
                        <Badge 
                          className="text-[10px]"
                          style={{ 
                            background: kw.competition === "High" ? "#EF444420" : kw.competition === "Medium" ? "#F59E0B20" : "#10B98120",
                            color: kw.competition === "High" ? "#EF4444" : kw.competition === "Medium" ? "#F59E0B" : "#10B981"
                          }}
                        >
                          {kw.competition}
                        </Badge>
                        <div className="w-16">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">Score</span>
                            <span className="font-medium" style={{ color: "#7C3AED" }}>{kw.score}</span>
                          </div>
                          <Progress value={kw.score} className="h-1.5" />
                        </div>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SEO Audit */}
            {activeTab === "seo" && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-border bg-card text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: "#10B981" }}>87</div>
                    <div className="text-xs text-muted-foreground">SEO Score</div>
                    <Progress value={87} className="h-1.5 mt-2" />
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: "#7C3AED" }}>92</div>
                    <div className="text-xs text-muted-foreground">Performance</div>
                    <Progress value={92} className="h-1.5 mt-2" />
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: "#EC4899" }}>78</div>
                    <div className="text-xs text-muted-foreground">Accessibility</div>
                    <Progress value={78} className="h-1.5 mt-2" />
                  </div>
                </div>

                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#F8FAFC" }}>
                    <span className="font-semibold text-sm text-foreground">Audit Results</span>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Re-scan
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {SEO_ISSUES.map((issue, i) => (
                      <div key={i} className="px-4 py-3 flex items-center gap-3">
                        {issue.type === "error" && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                        {issue.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                        {issue.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-foreground">{issue.message}</div>
                        </div>
                        <Badge 
                          className="text-[10px]"
                          style={{ 
                            background: issue.impact === "High" ? "#EF444420" : issue.impact === "Medium" ? "#F59E0B20" : "#10B98120",
                            color: issue.impact === "High" ? "#EF4444" : issue.impact === "Medium" ? "#F59E0B" : "#10B981"
                          }}
                        >
                          {issue.impact}
                        </Badge>
                        {issue.type !== "success" && (
                          <Button variant="ghost" size="sm" className="gap-1 text-xs" style={{ color: "#7C3AED" }}>
                            <Sparkles className="w-3 h-3" />
                            Fix with AI
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Landing Pages */}
            {activeTab === "landing" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Landing Page Builder</h3>
                  <Button size="sm" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
                    <Layout className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>

                {/* Templates */}
                <div className="grid grid-cols-4 gap-3">
                  {LANDING_PAGE_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        selectedTemplate === template.id 
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" 
                          : "border-border bg-card hover:border-purple-300"
                      }`}
                    >
                      <div className="aspect-video rounded-lg mb-2 flex items-center justify-center" style={{ background: "#F1F5F9" }}>
                        <Layout className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <div className="font-medium text-sm text-foreground">{template.name}</div>
                      <div className="text-xs text-muted-foreground">Avg. {template.conversion} conversion</div>
                    </button>
                  ))}
                </div>

                {/* AI Content Generator */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4" style={{ color: "#7C3AED" }} />
                    <h4 className="font-semibold text-sm text-foreground">AI Content Generator</h4>
                  </div>
                  <Textarea 
                    placeholder="Describe your landing page goal... (e.g., 'A landing page for long-distance moving quotes targeting homeowners in California')"
                    className="mb-3"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Type className="w-3 h-3" />
                        Headlines
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="w-3 h-3" />
                        Body Copy
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Lightbulb className="w-3 h-3" />
                        CTA Ideas
                      </Button>
                    </div>
                    <Button 
                      onClick={handleGenerateContent}
                      disabled={isGenerating}
                      style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>

                  {generatedContent && (
                    <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Generated Content</span>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Copy className="w-3 h-3" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">{generatedContent}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* A/B Testing */}
            {activeTab === "abtest" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">A/B Test Manager</h3>
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setShowNewTest(true)}
                    style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}
                  >
                    <Plus className="w-4 h-4" />
                    Create Test
                  </Button>
                </div>

                {/* New Test Form */}
                {showNewTest && (
                  <div className="p-4 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 dark:bg-purple-950/20">
                    <div className="flex items-center gap-3 mb-3">
                      <FlaskConical className="w-5 h-5" style={{ color: "#7C3AED" }} />
                      <h4 className="font-semibold text-foreground">New A/B Test</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Test Name</label>
                        <Input 
                          placeholder="e.g., Homepage CTA Color" 
                          value={newTestName}
                          onChange={(e) => setNewTestName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Test Type</label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <Layers className="w-3 h-3" />
                            Element
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <Layout className="w-3 h-3" />
                            Page
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 rounded-lg border border-border bg-card">
                        <div className="text-xs font-medium text-muted-foreground mb-2">Control (Original)</div>
                        <div className="aspect-video rounded bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Current Version</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border border-dashed border-purple-300 bg-purple-50/30">
                        <div className="text-xs font-medium mb-2" style={{ color: "#7C3AED" }}>Variant A</div>
                        <div className="aspect-video rounded bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors">
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowNewTest(false)}>Cancel</Button>
                      <Button size="sm" onClick={handleCreateTest} style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
                        <Zap className="w-3 h-3 mr-1" />
                        Launch Test
                      </Button>
                    </div>
                  </div>
                )}

                {/* Active Tests */}
                <div className="space-y-3">
                  {AB_TESTS.map((test) => (
                    <div key={test.id} className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">{test.name}</h4>
                            <Badge 
                              className="text-[10px]"
                              style={{ 
                                background: test.status === "running" ? "#10B98120" : "#7C3AED20",
                                color: test.status === "running" ? "#10B981" : "#7C3AED"
                              }}
                            >
                              {test.status === "running" ? "Running" : "Completed"}
                            </Badge>
                            {test.confidence >= 95 && (
                              <Badge className="text-[10px] gap-1" style={{ background: "#F59E0B20", color: "#F59E0B" }}>
                                <Trophy className="w-2.5 h-2.5" />
                                Winner Found
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">Started {test.startDate}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold" style={{ color: "#10B981" }}>{test.lift}</div>
                          <div className="text-[10px] text-muted-foreground">Lift</div>
                        </div>
                      </div>

                      {/* Variants Comparison */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {test.variants.map((variant, idx) => (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-lg border ${variant.name === test.winner ? "border-green-300 bg-green-50/50 dark:bg-green-950/20" : "border-border bg-muted/30"}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-foreground">{variant.name}</span>
                              {variant.name === test.winner && (
                                <Trophy className="w-3 h-3 text-green-500" />
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <div className="text-sm font-bold text-foreground">{variant.visitors.toLocaleString()}</div>
                                <div className="text-[9px] text-muted-foreground">Visitors</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold text-foreground">{variant.conversions}</div>
                                <div className="text-[9px] text-muted-foreground">Conversions</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold" style={{ color: variant.name === test.winner ? "#10B981" : "#64748B" }}>{variant.rate}%</div>
                                <div className="text-[9px] text-muted-foreground">Rate</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Confidence Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Statistical Confidence</span>
                            <span className="font-medium" style={{ color: test.confidence >= 95 ? "#10B981" : "#F59E0B" }}>{test.confidence}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ 
                                width: `${test.confidence}%`,
                                background: test.confidence >= 95 ? "#10B981" : test.confidence >= 80 ? "#F59E0B" : "#EF4444"
                              }}
                            />
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1">
                          {test.status === "running" ? (
                            <>
                              <Pause className="w-3 h-3" />
                              Pause
                            </>
                          ) : (
                            <>
                              <ArrowRight className="w-3 h-3" />
                              Apply Winner
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversions */}
            {activeTab === "conversions" && (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Total Conversions", value: "2,829", icon: Target, color: "#7C3AED" },
                    { label: "Conversion Rate", value: "3.2%", icon: Percent, color: "#10B981" },
                    { label: "Avg. Time to Convert", value: "4.2 days", icon: Timer, color: "#EC4899" },
                    { label: "Total Value", value: "$84,420", icon: DollarSign, color: "#F59E0B" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                          <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Conversion Funnel */}
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">Conversion Funnel</h3>
                    <Badge variant="secondary">Last 30 days</Badge>
                  </div>
                  <div className="space-y-2">
                    {FUNNEL_STAGES.map((stage, i) => (
                      <div key={stage.stage} className="flex items-center gap-3">
                        <div className="w-32 text-xs text-muted-foreground truncate">{stage.stage}</div>
                        <div className="flex-1 h-8 rounded-lg overflow-hidden bg-muted relative">
                          <div 
                            className="h-full rounded-lg transition-all flex items-center justify-end px-2"
                            style={{ 
                              width: `${stage.rate}%`,
                              background: `linear-gradient(90deg, #7C3AED ${100 - stage.rate}%, #A855F7 100%)`,
                              minWidth: "60px"
                            }}
                          >
                            <span className="text-xs font-bold text-white">{stage.count.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-xs font-medium" style={{ color: "#7C3AED" }}>{stage.rate}%</span>
                        </div>
                        {i < FUNNEL_STAGES.length - 1 && (
                          <div className="w-16 text-right">
                            <span className="text-[10px] text-red-500">
                              -{((1 - (FUNNEL_STAGES[i + 1].count / stage.count)) * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conversion Events */}
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: "#F8FAFC" }}>
                    <span className="font-semibold text-sm text-foreground">Conversion Events</span>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Plus className="w-3 h-3" />
                      Add Event
                    </Button>
                  </div>
                  <div className="divide-y divide-border">
                    {CONVERSION_EVENTS.map((event, i) => (
                      <div key={i} className="px-4 py-3 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#7C3AED20" }}>
                          <Activity className="w-4 h-4" style={{ color: "#7C3AED" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground">{event.event}</div>
                          <div className="text-xs text-muted-foreground">Source: {event.source}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">{event.count}</div>
                          <div className="text-[10px] text-green-500">{event.trend}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium" style={{ color: "#7C3AED" }}>{event.value}</div>
                          <div className="text-[10px] text-muted-foreground">Avg. Value</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attribution */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Top Converting Sources</h4>
                    <div className="space-y-2">
                      {[
                        { source: "Google Ads", conversions: 412, rate: "4.2%" },
                        { source: "Organic Search", conversions: 328, rate: "3.8%" },
                        { source: "Direct", conversions: 245, rate: "3.1%" },
                        { source: "Facebook", conversions: 156, rate: "2.4%" },
                      ].map((item) => (
                        <div key={item.source} className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{item.source}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-foreground">{item.conversions}</span>
                            <Badge variant="secondary" className="text-[10px]">{item.rate}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <h4 className="font-semibold text-sm mb-3 text-foreground">Conversion Path</h4>
                    <div className="space-y-2">
                      {[
                        { path: "Ad → Quote → Book", count: 234, percent: 42 },
                        { path: "Organic → Blog → Quote", count: 156, percent: 28 },
                        { path: "Direct → Quote", count: 112, percent: 20 },
                        { path: "Social → Landing → Quote", count: 56, percent: 10 },
                      ].map((item) => (
                        <div key={item.path}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground truncate">{item.path}</span>
                            <span className="font-medium text-foreground">{item.count}</span>
                          </div>
                          <Progress value={item.percent} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#7C3AED" }} />
            <span className="text-xs text-muted-foreground">Demo Mode - No real campaigns affected</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ExternalLink className="w-3 h-3" />
            Learn More
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}