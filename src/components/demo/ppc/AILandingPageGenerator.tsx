import { useState, useEffect } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Badge } from "@/components/ui/badge";
 import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
 import { 
   Sparkles, RefreshCw, ArrowRight, CheckCircle2, Star, 
   Shield, Clock, Phone, Zap, Users, TrendingUp, Play,
  ChevronDown, Quote, Award, Truck, Pencil, X, Check,
  MapPin, Search, Target, Globe, BarChart3, Hash, DollarSign,
  Calculator, Video, ThumbsUp, Building, Home, Package, ArrowDown,
   Download, Palette, Copy, Maximize2, Minimize2, FileText, Eye, EyeOff, Filter as FilterIcon,
   FileUp, Database, Rocket, ChevronLeft, ChevronRight, Loader2, ExternalLink
 } from "lucide-react";
import { Upload, MousePointerClick, PieChart, UserCheck, Map, TrendingDown, Lock, Timer, ArrowUp, Heart } from "lucide-react";
 import jsPDF from "jspdf";
 import autoTable from "jspdf-autotable";
 import logoImg from "@/assets/logo.png";
import DraggableModal from "@/components/ui/DraggableModal";
import { 
  TruMoveLogo, 
  PoweredByBadge, 
  TruMoveGuaranteeBadge,
  TrustBadgeStrip,
  SocialProofTicker,
  CountdownTimer,
  UrgencyBanner,
  ThreeStepProcess,
  TripleGuaranteeSection,
  VideoTestimonialGrid,
  ComparisonTableSection,
  FAQSection,
  FinalCTASection,
  TruMoveFooter
} from "./TruMoveBrandingElements";
import { MarketingAnalyticsDashboard } from "./MarketingAnalyticsDashboard";
import { LandingPageBoard, INITIAL_MOCK_PAGES } from "./LandingPageBoard";
import { LandingPage } from "./types";

// Heatmap positions per template
const TEMPLATE_HEATMAP_POSITIONS: Record<string, {
  id: string;
  element: string;
  top: string;
  left: string;
  width: string;
  height: string;
  intensity: 'high' | 'medium' | 'low';
}[]> = {
  "quote-funnel": [
    { id: "cta-primary", element: "Primary CTA Button", top: "55%", left: "50%", width: "200px", height: "50px", intensity: "high" },
    { id: "quote-form", element: "Quote Form Fields", top: "45%", left: "50%", width: "280px", height: "100px", intensity: "high" },
    { id: "trust-badges", element: "Trust Badges", top: "70%", left: "50%", width: "300px", height: "30px", intensity: "medium" },
    { id: "testimonials", element: "Testimonials", top: "85%", left: "50%", width: "250px", height: "60px", intensity: "low" },
  ],
  "comparison": [
    { id: "comparison-table", element: "Comparison Table", top: "45%", left: "50%", width: "400px", height: "180px", intensity: "high" },
    { id: "cta-primary", element: "Primary CTA Button", top: "75%", left: "50%", width: "180px", height: "45px", intensity: "high" },
    { id: "feature-row", element: "Feature Rows", top: "50%", left: "50%", width: "350px", height: "80px", intensity: "medium" },
  ],
  "calculator": [
    { id: "calculator-form", element: "Calculator Form", top: "40%", left: "30%", width: "280px", height: "200px", intensity: "high" },
    { id: "calculate-btn", element: "Calculate Button", top: "65%", left: "30%", width: "200px", height: "45px", intensity: "high" },
    { id: "result-area", element: "Result Display", top: "45%", left: "70%", width: "200px", height: "150px", intensity: "medium" },
  ],
  "testimonial": [
    { id: "video-testimonial", element: "Video Testimonials", top: "35%", left: "50%", width: "350px", height: "120px", intensity: "high" },
    { id: "testimonial-cards", element: "Testimonial Cards", top: "55%", left: "50%", width: "400px", height: "150px", intensity: "medium" },
    { id: "cta-primary", element: "Primary CTA Button", top: "85%", left: "50%", width: "200px", height: "45px", intensity: "high" },
  ],
  "local-seo": [
    { id: "hero-cta", element: "Hero CTA Form", top: "50%", left: "50%", width: "300px", height: "180px", intensity: "high" },
    { id: "local-badges", element: "Local Trust Badges", top: "25%", left: "50%", width: "280px", height: "40px", intensity: "medium" },
    { id: "location-info", element: "Location Info", top: "15%", left: "50%", width: "150px", height: "30px", intensity: "low" },
  ],
  "long-form": [
    { id: "sticky-cta", element: "Sticky CTA Footer", top: "95%", left: "50%", width: "350px", height: "50px", intensity: "high" },
    { id: "content-sections", element: "Content Sections", top: "40%", left: "50%", width: "400px", height: "200px", intensity: "medium" },
    { id: "toc-nav", element: "Table of Contents", top: "18%", left: "50%", width: "300px", height: "60px", intensity: "low" },
  ],
};

// Helper to draw a simple pie chart in jsPDF
function drawPieChart(
  doc: jsPDF, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  data: { value: number; color: [number, number, number]; label: string }[]
) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let startAngle = -Math.PI / 2; // Start from top
  
  data.forEach((slice) => {
    const sliceAngle = (slice.value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    
    // Draw slice
    doc.setFillColor(slice.color[0], slice.color[1], slice.color[2]);
    
    // Create path for pie slice
    const steps = 30;
    const points: [number, number][] = [[centerX, centerY]];
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (sliceAngle * i) / steps;
      points.push([
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      ]);
    }
    points.push([centerX, centerY]);
    
    // Draw filled polygon
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    const xCoords = points.map(p => p[0]);
    const yCoords = points.map(p => p[1]);
    
    // Use triangle approach for each segment
    for (let i = 1; i < points.length - 1; i++) {
      doc.triangle(
        points[0][0], points[0][1],
        points[i][0], points[i][1],
        points[i + 1][0], points[i + 1][1],
        'F'
      );
    }
    
    startAngle = endAngle;
  });
  
  // Draw white center for donut effect
  doc.setFillColor(255, 255, 255);
  const innerRadius = radius * 0.5;
  doc.circle(centerX, centerY, innerRadius, 'F');
}

// Helper to draw a bar chart in jsPDF
function drawBarChart(
  doc: jsPDF,
  startX: number,
  startY: number,
  width: number,
  height: number,
  data: { value: number; label: string; color: [number, number, number] }[]
) {
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (width - (data.length - 1) * 4) / data.length;
  const chartBottom = startY + height;
  
  // Draw axis
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(startX, chartBottom, startX + width, chartBottom);
  
  data.forEach((item, i) => {
    const barHeight = (item.value / maxValue) * (height - 15);
    const barX = startX + i * (barWidth + 4);
    const barY = chartBottom - barHeight;
    
    // Draw bar
    doc.setFillColor(item.color[0], item.color[1], item.color[2]);
    doc.roundedRect(barX, barY, barWidth, barHeight, 1, 1, 'F');
    
    // Draw value on top
    doc.setFontSize(7);
    doc.setTextColor(60, 60, 60);
    doc.text(item.value.toString(), barX + barWidth / 2, barY - 2, { align: 'center' });
    
    // Draw label below
    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120);
    const labelLines = doc.splitTextToSize(item.label, barWidth + 2);
    doc.text(labelLines[0].substring(0, 10), barX + barWidth / 2, chartBottom + 5, { align: 'center' });
  });
}
 
 interface AILandingPageGeneratorProps {
   isGenerating: boolean;
   onGenerate: () => void;
 }
 
const LANDING_PAGE_TEMPLATES = [
  { 
    id: "quote-funnel", 
    name: "Quote Funnel", 
    description: "High-converting quote request page with urgency triggers",
    conversion: "12.4%",
    style: "Dark hero, green CTAs"
  },
  { 
    id: "comparison", 
    name: "Comparison Page", 
    description: "Compare services side-by-side with competitor pricing",
    conversion: "9.8%",
    style: "Clean, trust-focused"
  },
  { 
    id: "calculator", 
    name: "Cost Calculator", 
    description: "Interactive tool that captures leads through utility",
    conversion: "15.2%",
    style: "Tool-first, minimal"
  },
  { 
    id: "testimonial", 
    name: "Testimonial Heavy", 
    description: "Social proof focused with video testimonials",
    conversion: "11.1%",
    style: "Warm, personal"
  },
  { 
    id: "local-seo", 
    name: "Local SEO Lander", 
    description: "Geo-targeted for specific city/region searches",
    conversion: "14.7%",
    style: "Location-specific"
  },
  { 
    id: "long-form", 
    name: "Long-Form Sales", 
    description: "Detailed sales page with objection handling",
    conversion: "8.3%",
    style: "Comprehensive"
  },
];

// Color theme definitions
const COLOR_THEMES = [
  {
    id: "default",
    name: "Default",
    primary: "#22C55E",
    primaryDark: "#16A34A",
    secondary: "#0F172A",
    accent: "#7C3AED",
    accentLight: "#A855F7",
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    primary: "#3B82F6",
    primaryDark: "#1D4ED8",
    secondary: "#0C4A6E",
    accent: "#06B6D4",
    accentLight: "#22D3EE",
  },
  {
    id: "sunset",
    name: "Sunset Orange",
    primary: "#F97316",
    primaryDark: "#EA580C",
    secondary: "#7C2D12",
    accent: "#FBBF24",
    accentLight: "#FCD34D",
  },
  {
    id: "forest",
    name: "Forest Green",
    primary: "#059669",
    primaryDark: "#047857",
    secondary: "#064E3B",
    accent: "#34D399",
    accentLight: "#6EE7B7",
  },
  {
    id: "royal",
    name: "Royal Purple",
    primary: "#8B5CF6",
    primaryDark: "#7C3AED",
    secondary: "#1E1B4B",
    accent: "#EC4899",
    accentLight: "#F472B6",
  },
  {
    id: "crimson",
    name: "Crimson Red",
    primary: "#EF4444",
    primaryDark: "#DC2626",
    secondary: "#450A0A",
    accent: "#F59E0B",
    accentLight: "#FBBF24",
  },
  {
    id: "midnight",
    name: "Midnight Black",
    primary: "#6366F1",
    primaryDark: "#4F46E5",
    secondary: "#020617",
    accent: "#A5F3FC",
    accentLight: "#CFFAFE",
  },
  {
    id: "coral",
    name: "Coral Pink",
    primary: "#F43F5E",
    primaryDark: "#E11D48",
    secondary: "#881337",
    accent: "#FB7185",
    accentLight: "#FDA4AF",
  },
];

interface EditableSection {
  id: string;
  type: 'headline' | 'subheadline' | 'body' | 'cta' | 'testimonial';
  content: string;
}

 // Imported dataset types
 interface KeywordPerformance {
   keyword: string;
   clicks: number;
   impressions: number;
   ctr: number;
   conversions: number;
   cost: number;
   position: number;
   trend: 'up' | 'down' | 'stable';
   winningReason: string;
 }
 
 interface GeographicData {
   region: string;
   state: string;
   clicks: number;
   conversions: number;
   convRate: number;
   revenue: number;
   topCity: string;
 }
 
 interface DemographicData {
   segment: string;
   percentage: number;
   clicks: number;
   conversions: number;
   avgOrderValue: number;
   device: string;
 }
 
 interface ClickBehavior {
   element: string;
   clicks: number;
   percentage: number;
   heatmapIntensity: 'high' | 'medium' | 'low';
   conversionImpact: string;
 }
 
 interface ImportedDataset {
   keywords: KeywordPerformance[];
   geographic: GeographicData[];
   demographic: DemographicData[];
   clickBehavior: ClickBehavior[];
   dateRange: string;
   totalClicks: number;
   totalConversions: number;
   totalRevenue: number;
 }
 
 // Mock imported data
 const MOCK_IMPORTED_DATA: ImportedDataset = {
   dateRange: "Jan 1 - Feb 5, 2025",
   totalClicks: 24847,
   totalConversions: 1892,
   totalRevenue: 284600,
   keywords: [
     { keyword: "long distance moving company", clicks: 4521, impressions: 89420, ctr: 5.06, conversions: 412, cost: 8245, position: 2.1, trend: 'up', winningReason: "High intent + low competition. Users searching this are 3.2x more likely to convert." },
     { keyword: "cross country movers near me", clicks: 3892, impressions: 67340, ctr: 5.78, conversions: 387, cost: 7120, position: 1.8, trend: 'up', winningReason: "Local modifier 'near me' signals immediate need. 42% higher conversion rate." },
     { keyword: "moving cost calculator", clicks: 5124, impressions: 124500, ctr: 4.12, conversions: 298, cost: 4890, position: 3.2, trend: 'stable', winningReason: "Tool-based intent captures early funnel. Lower CPA despite lower conversion rate." },
     { keyword: "cheap movers", clicks: 6234, impressions: 156780, ctr: 3.98, conversions: 245, cost: 11200, position: 4.1, trend: 'down', winningReason: "High volume but price-sensitive audience. Consider for brand awareness only." },
     { keyword: "ai moving estimate", clicks: 1847, impressions: 23400, ctr: 7.89, conversions: 289, cost: 2340, position: 1.2, trend: 'up', winningReason: "Emerging keyword with 340% YoY growth. Early mover advantage, lowest CPA." },
     { keyword: "furniture moving service", clicks: 2129, impressions: 45670, ctr: 4.66, conversions: 178, cost: 3980, position: 2.8, trend: 'stable', winningReason: "Specific service intent. Users often bundle with full-service moves." },
   ],
   geographic: [
     { region: "West", state: "California", clicks: 6847, conversions: 521, convRate: 7.61, revenue: 78150, topCity: "Los Angeles" },
     { region: "South", state: "Texas", clicks: 5234, conversions: 398, convRate: 7.60, revenue: 59700, topCity: "Houston" },
     { region: "South", state: "Florida", clicks: 4892, conversions: 367, convRate: 7.50, revenue: 55050, topCity: "Miami" },
     { region: "Northeast", state: "New York", clicks: 3567, conversions: 289, convRate: 8.10, revenue: 43350, topCity: "New York City" },
     { region: "West", state: "Arizona", clicks: 2134, conversions: 167, convRate: 7.82, revenue: 25050, topCity: "Phoenix" },
     { region: "Midwest", state: "Illinois", clicks: 1873, conversions: 150, convRate: 8.01, revenue: 22500, topCity: "Chicago" },
   ],
   demographic: [
     { segment: "Homeowners 35-54", percentage: 38, clicks: 9442, conversions: 812, avgOrderValue: 3240, device: "Desktop 62%" },
     { segment: "Young Professionals 25-34", percentage: 28, clicks: 6957, conversions: 492, avgOrderValue: 2180, device: "Mobile 71%" },
     { segment: "Retirees 55+", percentage: 18, clicks: 4472, conversions: 378, avgOrderValue: 4120, device: "Desktop 78%" },
     { segment: "First-time Movers 18-24", percentage: 12, clicks: 2982, conversions: 156, avgOrderValue: 1450, device: "Mobile 89%" },
     { segment: "Corporate Relocation", percentage: 4, clicks: 994, conversions: 54, avgOrderValue: 8900, device: "Desktop 91%" },
   ],
   clickBehavior: [
     { element: "Primary CTA Button", clicks: 8934, percentage: 35.9, heatmapIntensity: 'high', conversionImpact: "+47% of all conversions" },
     { element: "Quote Form Fields", clicks: 6721, percentage: 27.0, heatmapIntensity: 'high', conversionImpact: "89% form completion rate" },
     { element: "Trust Badges", clicks: 3892, percentage: 15.7, heatmapIntensity: 'medium', conversionImpact: "Users who click convert 2.3x more" },
     { element: "Pricing Section", clicks: 2834, percentage: 11.4, heatmapIntensity: 'medium', conversionImpact: "Reduces bounce by 34%" },
     { element: "Testimonials", clicks: 1567, percentage: 6.3, heatmapIntensity: 'low', conversionImpact: "Increases time on page 45s" },
     { element: "Navigation Links", clicks: 899, percentage: 3.6, heatmapIntensity: 'low', conversionImpact: "Often leads to exit - consider removing" },
   ],
 };
 
 export function AILandingPageGenerator({ isGenerating, onGenerate }: AILandingPageGeneratorProps) {
   const [showLandingPage, setShowLandingPage] = useState(false);
   const [businessName, setBusinessName] = useState("TruMove");
   const [targetAudience, setTargetAudience] = useState("Homeowners planning long-distance moves");
   const [mainOffer, setMainOffer] = useState("Get a guaranteed quote in 60 seconds with AI-powered pricing");
  const [targetLocation, setTargetLocation] = useState("California, Texas, Florida");
   const [generationStep, setGenerationStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("quote-funnel");
  const [selectedTheme, setSelectedTheme] = useState("default");
  
  // Editable sections
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sections, setSections] = useState<EditableSection[]>([
    { id: 'main-headline', type: 'headline', content: 'Stop Overpaying for Your Move.' },
    { id: 'sub-headline', type: 'subheadline', content: 'Get AI-Powered Pricing Now.' },
    { id: 'hero-body', type: 'body', content: 'Join 50,000+ families who saved an average of $847 on their move. Our AI scans your inventory and matches you with verified carriers in seconds.' },
    { id: 'cta-primary', type: 'cta', content: 'Get My Free Quote' },
    { id: 'testimonial-1', type: 'testimonial', content: 'I was quoted $4,200 by another company. TruMove got me the same service for $3,350. The AI inventory scanner was scary accurate!' },
  ]);
  const [tempEditValue, setTempEditValue] = useState("");
   
   // Data import state
   const [showDataImport, setShowDataImport] = useState(false);
   const [importedData, setImportedData] = useState<ImportedDataset | null>(null);
   const [activeDataTab, setActiveDataTab] = useState<'keywords' | 'geographic' | 'demographic' | 'clicks'>('keywords');
   const [isPopoutOpen, setIsPopoutOpen] = useState(false);
   const [isSideBySide, setIsSideBySide] = useState(false);
   
   // Keyword filter state
   const [keywordTrendFilter, setKeywordTrendFilter] = useState<'all' | 'up' | 'down' | 'stable'>('all');
   const [keywordConversionFilter, setKeywordConversionFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
   
   // Heatmap overlay state
   const [showHeatmapOverlay, setShowHeatmapOverlay] = useState(false);
   const [customHeatmapPositions, setCustomHeatmapPositions] = useState<typeof TEMPLATE_HEATMAP_POSITIONS["quote-funnel"]>(
     TEMPLATE_HEATMAP_POSITIONS["quote-funnel"]
   );
   const [editingHeatmapId, setEditingHeatmapId] = useState<string | null>(null);
  const [mainView, setMainView] = useState<'analytics' | 'create' | 'manage'>('analytics');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [managedPages, setManagedPages] = useState<LandingPage[]>(INITIAL_MOCK_PAGES);
  const [publishedPageId, setPublishedPageId] = useState<string | null>(null);
  const [showDomainConnect, setShowDomainConnect] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);

   // Update heatmap positions when template changes
   useEffect(() => {
     setCustomHeatmapPositions(TEMPLATE_HEATMAP_POSITIONS[selectedTemplate] || TEMPLATE_HEATMAP_POSITIONS["quote-funnel"]);
   }, [selectedTemplate]);

  // Get current template index for navigation
  const currentTemplateIndex = LANDING_PAGE_TEMPLATES.findIndex(t => t.id === selectedTemplate);
  
  const goToPrevTemplate = () => {
    const prevIndex = currentTemplateIndex > 0 ? currentTemplateIndex - 1 : LANDING_PAGE_TEMPLATES.length - 1;
    setSelectedTemplate(LANDING_PAGE_TEMPLATES[prevIndex].id);
    setIsPublished(false);
  };
  
  const goToNextTemplate = () => {
    const nextIndex = currentTemplateIndex < LANDING_PAGE_TEMPLATES.length - 1 ? currentTemplateIndex + 1 : 0;
    setSelectedTemplate(LANDING_PAGE_TEMPLATES[nextIndex].id);
    setIsPublished(false);
  };
  
  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success("Connecting to hosting...");
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Optimizing assets...");
    await new Promise(r => setTimeout(r, 800));
    toast.success("Deploying to CDN...");
    await new Promise(r => setTimeout(r, 600));
    setIsPublishing(false);
    setIsPublished(true);
    
    // Create new page entry for the board
    const templateInfo = LANDING_PAGE_TEMPLATES.find(t => t.id === selectedTemplate);
    const newPageId = crypto.randomUUID();
    const newPage: LandingPage = {
      id: newPageId,
      name: `${businessName} - ${targetLocation.split(',')[0].trim()}`,
      template: templateInfo?.name || 'Quote Funnel',
      status: 'active',
      dailyBudget: 100,
      totalSpend: 0,
      conversions: 0,
      conversionRate: 0,
      cpa: 0,
      trend: 'stable',
      url: `${businessName.toLowerCase().replace(/\s/g, '')}.lovable.app/${selectedTemplate}`,
      createdAt: new Date().toISOString().split('T')[0],
      performance: 'new',
      customDomain: null,
      domainStatus: null
    };
    
    setManagedPages(prev => [newPage, ...prev]);
    setPublishedPageId(newPageId);
    
    toast.success("🎉 Landing page published!", {
      description: `Now tracking in Manage Pages`,
      action: {
        label: "View Board",
        onClick: () => setMainView('manage')
      }
    });
  };
  
  const handleVerifyDomain = async () => {
    if (!domainInput || !publishedPageId) return;
    setIsVerifyingDomain(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsVerifyingDomain(false);
    
    // Simulate 70% success rate
    const success = Math.random() > 0.3;
    
    if (success) {
      setManagedPages(prev => prev.map(p => 
        p.id === publishedPageId 
          ? { ...p, customDomain: domainInput, domainStatus: 'active' as const }
          : p
      ));
      toast.success(`Domain connected: ${domainInput}`, {
        description: "Your landing page is now live on your custom domain"
      });
      setShowDomainConnect(false);
    } else {
      setManagedPages(prev => prev.map(p => 
        p.id === publishedPageId 
          ? { ...p, customDomain: domainInput, domainStatus: 'pending' as const }
          : p
      ));
      toast.warning("DNS not yet propagated", {
        description: "Check back in a few hours. Propagation can take up to 72 hours."
      });
    }
  };

   // Get current heatmap positions
   const getCurrentHeatmapPositions = () => {
     return customHeatmapPositions;
   };

   // Update heatmap position
   const updateHeatmapPosition = (id: string, field: string, value: string) => {
     setCustomHeatmapPositions(prev => 
       prev.map(pos => pos.id === id ? { ...pos, [field]: value } : pos)
     );
   };
 
   const handleGenerateLandingPage = () => {
     setGenerationStep(1);
     onGenerate();
     
     // Simulate generation steps
     const steps = [1, 2, 3, 4, 5];
     steps.forEach((step, index) => {
       setTimeout(() => {
         setGenerationStep(step);
         if (step === 5) {
           setTimeout(() => {
             setShowLandingPage(true);
             setGenerationStep(0);
           }, 800);
         }
       }, (index + 1) * 600);
     });
   };
 
   // Simulate data import
   const handleImportData = () => {
     toast.success("Data imported successfully!", {
       description: "Analyzing keyword performance, geographic & demographic insights..."
     });
     setTimeout(() => {
       setImportedData(MOCK_IMPORTED_DATA);
       // Auto-populate form fields from imported data
       const topStates = MOCK_IMPORTED_DATA.geographic.slice(0, 3).map(g => g.state).join(", ");
       setTargetLocation(topStates);
       
       // Set target audience from top demographic
       const topDemo = MOCK_IMPORTED_DATA.demographic[0];
       if (topDemo) {
         setTargetAudience(`${topDemo.segment} (${topDemo.device})`);
       }
     }, 1500);
   };
 
   // Filter keywords based on current filters
   const getFilteredKeywords = () => {
     if (!importedData) return [];
     return importedData.keywords.filter(kw => {
       // Trend filter
       if (keywordTrendFilter !== 'all' && kw.trend !== keywordTrendFilter) return false;
       
       // Conversion rate filter
       const convRate = (kw.conversions / kw.clicks) * 100;
       if (keywordConversionFilter === 'high' && convRate < 8) return false;
       if (keywordConversionFilter === 'medium' && (convRate < 5 || convRate >= 8)) return false;
       if (keywordConversionFilter === 'low' && convRate >= 5) return false;
       
       return true;
     });
   };
 
   // Export analytics as PDF
   const exportAnalyticsPdf = () => {
     if (!importedData) {
       toast.error("No data to export. Import analytics data first.");
       return;
     }
     
     const doc = new jsPDF();
     const pageWidth = doc.internal.pageSize.getWidth();
     
     // Title
     doc.setFontSize(22);
     doc.setTextColor(124, 58, 237);
     doc.text("Landing Page Analytics Report", pageWidth / 2, 20, { align: "center" });
     
     doc.setFontSize(10);
     doc.setTextColor(100);
     doc.text(`Generated: ${new Date().toLocaleDateString()} • Data Range: ${importedData.dateRange}`, pageWidth / 2, 28, { align: "center" });
     
     // Overview Stats
     doc.setFontSize(14);
     doc.setTextColor(30);
     doc.text("Performance Overview", 14, 42);
     
     doc.setFontSize(11);
     doc.setTextColor(60);
     doc.text(`Total Clicks: ${importedData.totalClicks.toLocaleString()}`, 14, 52);
     doc.text(`Total Conversions: ${importedData.totalConversions.toLocaleString()}`, 80, 52);
     doc.text(`Total Revenue: $${importedData.totalRevenue.toLocaleString()}`, 150, 52);
     doc.text(`Conversion Rate: ${((importedData.totalConversions / importedData.totalClicks) * 100).toFixed(2)}%`, 14, 60);
     
     // Keywords Table
     doc.setFontSize(14);
     doc.setTextColor(30);
     doc.text("Top Performing Keywords", 14, 75);
     
     autoTable(doc, {
       startY: 80,
       head: [['Keyword', 'Clicks', 'Conv.', 'CTR', 'Trend', 'Why It Wins']],
       body: importedData.keywords.map(kw => [
         kw.keyword,
         kw.clicks.toLocaleString(),
         kw.conversions.toString(),
         `${kw.ctr.toFixed(2)}%`,
         kw.trend === 'up' ? '↑' : kw.trend === 'down' ? '↓' : '→',
         kw.winningReason.substring(0, 50) + '...'
       ]),
       styles: { fontSize: 8 },
       headStyles: { fillColor: [124, 58, 237] },
       columnStyles: { 5: { cellWidth: 50 } }
     });
     
     // Geographic Performance
     const geoY = (doc as any).lastAutoTable.finalY + 15;
     doc.setFontSize(14);
     doc.setTextColor(30);
     doc.text("Geographic Performance", 14, geoY);
     
     autoTable(doc, {
       startY: geoY + 5,
       head: [['State', 'Region', 'Clicks', 'Conversions', 'Conv Rate', 'Revenue', 'Top City']],
       body: importedData.geographic.map(geo => [
         geo.state,
         geo.region,
         geo.clicks.toLocaleString(),
         geo.conversions.toString(),
         `${geo.convRate.toFixed(2)}%`,
         `$${geo.revenue.toLocaleString()}`,
         geo.topCity
       ]),
       styles: { fontSize: 8 },
       headStyles: { fillColor: [236, 72, 153] }
     });
     
     // Demographics
     const demoY = (doc as any).lastAutoTable.finalY + 15;
     doc.setFontSize(14);
     doc.setTextColor(30);
     doc.text("Demographic Insights", 14, demoY);
     
     autoTable(doc, {
       startY: demoY + 5,
       head: [['Segment', 'Share', 'Clicks', 'Conversions', 'Avg Order', 'Device']],
       body: importedData.demographic.map(demo => [
         demo.segment,
         `${demo.percentage}%`,
         demo.clicks.toLocaleString(),
         demo.conversions.toString(),
         `$${demo.avgOrderValue.toLocaleString()}`,
         demo.device
       ]),
       styles: { fontSize: 8 },
       headStyles: { fillColor: [59, 130, 246] }
     });
     
     // Click Behavior
     const clickY = (doc as any).lastAutoTable.finalY + 15;
     doc.setFontSize(14);
     doc.setTextColor(30);
     doc.text("Click Behavior & Heatmap Analysis", 14, clickY);
     
     autoTable(doc, {
       startY: clickY + 5,
       head: [['Element', 'Clicks', 'Share', 'Intensity', 'Impact']],
       body: importedData.clickBehavior.map(click => [
         click.element,
         click.clicks.toLocaleString(),
         `${click.percentage}%`,
         click.heatmapIntensity === 'high' ? '🔥 Hot' : click.heatmapIntensity === 'medium' ? '⚡ Warm' : '❄️ Cool',
         click.conversionImpact
       ]),
       styles: { fontSize: 8 },
       headStyles: { fillColor: [239, 68, 68] }
     });
     
     // AI Recommendations
     doc.addPage();
     doc.setFontSize(18);
     doc.setTextColor(124, 58, 237);
     doc.text("AI-Powered Recommendations", pageWidth / 2, 20, { align: "center" });
     
     const recommendations = [
       {
         title: "1. Double Down on Emerging Keywords",
         desc: `The keyword "ai moving estimate" shows 340% YoY growth with the lowest CPA ($8.09). Increase budget allocation by 40% and create dedicated landing page variants.`
       },
       {
         title: "2. Optimize for Mobile Young Professionals",
         desc: `25-34 age segment converts at high rate on mobile (71% mobile usage). Ensure mobile page speed <2s and implement one-tap calling CTAs.`
       },
       {
         title: "3. Geo-Target High-Value Markets",
         desc: `New York shows highest conversion rate (8.10%) despite lower volume. Consider increasing regional bids and adding city-specific landing pages.`
       },
       {
         title: "4. Leverage Trust Badge Interaction",
         desc: `Users who click trust badges convert 2.3x more. Make badges more prominent above the fold and add interactive tooltip explanations.`
       },
       {
         title: "5. Reduce Navigation Friction",
         desc: `Navigation links show low engagement (3.6%) and often lead to exit. Consider removing or minimizing navigation on focused landing pages.`
       },
       {
         title: "6. Target Corporate Relocation Segment",
         desc: `Corporate relocations show $8,900 avg order value (highest). Create B2B focused landing page variant with case studies and volume pricing.`
       }
     ];
     
     let recY = 35;
     recommendations.forEach(rec => {
       doc.setFontSize(12);
       doc.setTextColor(30);
       doc.text(rec.title, 14, recY);
       doc.setFontSize(10);
       doc.setTextColor(80);
       const lines = doc.splitTextToSize(rec.desc, pageWidth - 28);
       doc.text(lines, 14, recY + 7);
       recY += 25 + (lines.length * 4);
     });
     
     // Footer
     doc.setFontSize(9);
     doc.setTextColor(150);
     doc.text("Generated by TruMove AI Marketing Suite", pageWidth / 2, 285, { align: "center" });
     
     // Page 3: Visual Charts
     doc.addPage();
     doc.setFontSize(18);
     doc.setTextColor(124, 58, 237);
     doc.text("Visual Analytics", pageWidth / 2, 20, { align: "center" });
     
     // Click Distribution Pie Chart
     doc.setFontSize(12);
     doc.setTextColor(30);
     doc.text("Click Distribution by Element", 40, 40);
     
     const pieData = importedData.clickBehavior.slice(0, 5).map((click, i) => ({
       value: click.clicks,
       color: [
         [239, 68, 68],    // red
         [249, 115, 22],   // orange
         [234, 179, 8],    // yellow
         [34, 197, 94],    // green
         [59, 130, 246],   // blue
       ][i] as [number, number, number],
       label: click.element
     }));
     
     drawPieChart(doc, 50, 85, 30, pieData);
     
     // Legend for pie chart
     let legendY = 50;
     pieData.forEach((item) => {
       doc.setFillColor(item.color[0], item.color[1], item.color[2]);
       doc.rect(90, legendY - 3, 6, 6, 'F');
       doc.setFontSize(8);
       doc.setTextColor(60);
       doc.text(`${item.label} (${((item.value / importedData.totalClicks) * 100).toFixed(1)}%)`, 100, legendY);
       legendY += 10;
     });
     
     // Conversion by Demographic Bar Chart
     doc.setFontSize(12);
     doc.setTextColor(30);
     doc.text("Conversions by Demographic", 40, 130);
     
     const demoBarData = importedData.demographic.map((demo, i) => ({
       value: demo.conversions,
       label: demo.segment.split(' ')[0],
       color: [
         [34, 197, 94],    // green
         [59, 130, 246],   // blue
         [139, 92, 246],   // purple
         [245, 158, 11],   // amber
         [236, 72, 153],   // pink
       ][i] as [number, number, number]
     }));
     
     drawBarChart(doc, 25, 140, pageWidth - 50, 50, demoBarData);
     
     // Geographic Performance Bar Chart
     doc.setFontSize(12);
     doc.setTextColor(30);
     doc.text("Revenue by State", 40, 210);
     
     const geoBarData = importedData.geographic.slice(0, 5).map((geo, i) => ({
       value: Math.round(geo.revenue / 1000),
       label: geo.state,
       color: [
         [124, 58, 237],   // purple
         [236, 72, 153],   // pink
         [59, 130, 246],   // blue
         [16, 185, 129],   // teal
         [245, 158, 11],   // amber
       ][i] as [number, number, number]
     }));
     
     drawBarChart(doc, 25, 220, pageWidth - 50, 50, geoBarData);
     
     doc.setFontSize(8);
     doc.setTextColor(100);
     doc.text("Values in thousands ($K)", pageWidth / 2, 275, { align: "center" });
     
     doc.save(`landing-page-analytics-${new Date().toISOString().split('T')[0]}.pdf`);
     toast.success("Analytics PDF exported successfully!");
   };
 
  const startEditing = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSection(sectionId);
      setTempEditValue(section.content);
    }
  };

  const saveEdit = () => {
    if (editingSection) {
      setSections(prev => prev.map(s => 
        s.id === editingSection ? { ...s, content: tempEditValue } : s
      ));
      setEditingSection(null);
      setTempEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setTempEditValue("");
  };

  const getSection = (id: string) => sections.find(s => s.id === id)?.content || "";

  // Get current theme colors
  const getThemeColors = () => {
    return COLOR_THEMES.find(t => t.id === selectedTheme) || COLOR_THEMES[0];
  };

  const theme = getThemeColors();

  // Generate template-specific HTML content
  const generateHtmlContent = () => {
    const templateName = LANDING_PAGE_TEMPLATES.find(t => t.id === selectedTemplate)?.name || "Landing Page";
    const themeName = COLOR_THEMES.find(t => t.id === selectedTheme)?.name || "Default";
    
    // Common CSS styles
    const commonStyles = `
    :root {
      --primary: ${theme.primary};
      --primary-dark: ${theme.primaryDark};
      --secondary: ${theme.secondary};
      --accent: ${theme.accent};
      --accent-light: ${theme.accentLight};
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .btn-primary { padding: 1rem 2rem; font-size: 1.125rem; font-weight: 700; color: white; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border: none; border-radius: 0.5rem; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; }
    .btn-primary:hover { opacity: 0.9; }
    .input { width: 100%; padding: 0.75rem 1rem; border-radius: 0.5rem; border: 1px solid #E2E8F0; margin-bottom: 0.75rem; font-size: 1rem; }
    .badge { display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; }
    .badge-primary { background: rgba(124, 58, 237, 0.1); color: var(--primary); }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    @media (max-width: 768px) { .container { padding: 0 1rem; } }`;

    // Template-specific body content
    const getTemplateBody = () => {
      switch (selectedTemplate) {
        case "quote-funnel":
          return `
    <section style="background: linear-gradient(135deg, ${theme.secondary} 0%, #1E293B 50%, ${theme.secondary} 100%); padding: 4rem 2rem; text-align: center; color: white; position: relative;">
      <div style="position: absolute; top: 1rem; left: 1rem;">
        <span class="badge" style="background: rgba(34, 197, 94, 0.2); color: #22C55E; border: 1px solid rgba(34, 197, 94, 0.3);">✓ FMCSA Licensed</span>
      </div>
      <div style="position: absolute; top: 1rem; right: 1rem;">
        <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.3);">⭐ 4.9/5 Rating</span>
      </div>
      <h1 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 1rem;">
        ${getSection('main-headline')}<br>
        <span style="background: linear-gradient(90deg, ${theme.primary}, ${theme.accentLight}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${getSection('sub-headline')}</span>
      </h1>
      <p style="font-size: 1.125rem; color: #CBD5E1; margin-bottom: 2rem; max-width: 42rem; margin-left: auto; margin-right: auto;">${getSection('hero-body')}</p>
      <div style="max-width: 28rem; margin: 0 auto; background: rgba(255,255,255,0.1); backdrop-filter: blur(8px); border-radius: 1rem; padding: 1.5rem; border: 1px solid rgba(255,255,255,0.2);">
        <input type="text" class="input" placeholder="Moving from (ZIP code)" style="background: rgba(255,255,255,0.9); border: none; color: #1E293B;">
        <input type="text" class="input" placeholder="Moving to (ZIP code)" style="background: rgba(255,255,255,0.9); border: none; color: #1E293B;">
        <button class="btn-primary" style="width: 100%;">${getSection('cta-primary')} →</button>
        <p style="font-size: 0.75rem; color: #94A3B8; margin-top: 0.75rem; text-align: center;">🔒 No credit card required • Instant results</p>
      </div>
      <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 2rem; color: #94A3B8; font-size: 0.875rem; flex-wrap: wrap;">
        <span>🛡️ Price Lock Guarantee</span>
        <span>⏱️ 60-Second Quotes</span>
        <span>👥 50,000+ Moves</span>
      </div>
    </section>
    <section style="padding: 3rem 2rem;">
      <h2 style="text-align: center; font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem;">Get Your Quote in 3 Simple Steps</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; max-width: 48rem; margin: 0 auto;">
        <div style="text-align: center;">
          <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%); color: white; font-weight: 700; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem;">1</div>
          <h3 style="font-weight: 600; margin-bottom: 0.25rem;">Enter Your Route</h3>
          <p style="font-size: 0.875rem; color: #64748B;">Tell us where you're moving</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%); color: white; font-weight: 700; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem;">2</div>
          <h3 style="font-weight: 600; margin-bottom: 0.25rem;">AI Scans Your Home</h3>
          <p style="font-size: 0.875rem; color: #64748B;">Instant inventory estimate</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%); color: white; font-weight: 700; font-size: 1.25rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem;">3</div>
          <h3 style="font-weight: 600; margin-bottom: 0.25rem;">Compare & Book</h3>
          <p style="font-size: 0.875rem; color: #64748B;">Choose verified carriers</p>
        </div>
      </div>
    </section>`;

        case "comparison":
          return `
    <section style="padding: 3rem 2rem; text-align: center; background: linear-gradient(to bottom, #F8FAFC, white);">
      <span class="badge badge-primary" style="margin-bottom: 1rem;">Compare & Save</span>
      <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">How We Stack Up Against the Competition</h1>
      <p style="font-size: 1.125rem; color: #64748B; max-width: 42rem; margin: 0 auto 2rem;">See why 50,000+ families chose ${businessName} over traditional moving brokers</p>
    </section>
    <section style="padding: 2rem;">
      <table style="width: 100%; max-width: 48rem; margin: 0 auto; border-collapse: collapse; border: 1px solid #E2E8F0; border-radius: 0.75rem; overflow: hidden;">
        <thead>
          <tr style="background: #F1F5F9;">
            <th style="padding: 1rem; text-align: left;">Feature</th>
            <th style="padding: 1rem; text-align: center; background: ${theme.primary}; color: white;">${businessName}</th>
            <th style="padding: 1rem; text-align: center;">Competitor A</th>
            <th style="padding: 1rem; text-align: center;">Competitor B</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-top: 1px solid #E2E8F0;">
            <td style="padding: 1rem;">AI Inventory Scanning</td>
            <td style="padding: 1rem; text-align: center; background: ${theme.primary}10;">✅</td>
            <td style="padding: 1rem; text-align: center;">❌</td>
            <td style="padding: 1rem; text-align: center;">❌</td>
          </tr>
          <tr style="border-top: 1px solid #E2E8F0;">
            <td style="padding: 1rem;">Price Lock Guarantee</td>
            <td style="padding: 1rem; text-align: center; background: ${theme.primary}10;">✅</td>
            <td style="padding: 1rem; text-align: center;">❌</td>
            <td style="padding: 1rem; text-align: center;">❌</td>
          </tr>
          <tr style="border-top: 1px solid #E2E8F0;">
            <td style="padding: 1rem;">Real-Time Tracking</td>
            <td style="padding: 1rem; text-align: center; background: ${theme.primary}10;">✅</td>
            <td style="padding: 1rem; text-align: center;">✅</td>
            <td style="padding: 1rem; text-align: center;">✅</td>
          </tr>
          <tr style="border-top: 1px solid #E2E8F0;">
            <td style="padding: 1rem;">24/7 Support</td>
            <td style="padding: 1rem; text-align: center; background: ${theme.primary}10;">✅</td>
            <td style="padding: 1rem; text-align: center;">❌</td>
            <td style="padding: 1rem; text-align: center;">✅</td>
          </tr>
        </tbody>
      </table>
      <div style="text-align: center; margin-top: 2rem;">
        <a href="#" class="btn-primary">${getSection('cta-primary')} →</a>
      </div>
    </section>`;

        case "calculator":
          return `
    <header style="padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0;">
      <h1 style="font-size: 1.5rem; font-weight: 700;">${businessName}</h1>
      <span class="badge badge-primary">🧮 Free Calculator</span>
    </header>
    <section style="padding: 3rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 900px; margin: 0 auto;">
      <div>
        <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">Moving Cost Calculator</h2>
        <p style="color: #64748B; margin-bottom: 1.5rem;">Get an instant estimate based on your move details. No email required.</p>
        <div style="background: white; padding: 1.5rem; border-radius: 1rem; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">From</label>
          <input type="text" class="input" placeholder="Origin city or ZIP">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">To</label>
          <input type="text" class="input" placeholder="Destination city or ZIP">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem;">Home Size</label>
          <select class="input" style="width: 100%;">
            <option>Studio / 1 Bedroom</option>
            <option>2 Bedroom</option>
            <option>3 Bedroom</option>
            <option>4+ Bedroom</option>
          </select>
          <button class="btn-primary" style="width: 100%; margin-top: 0.5rem; background: linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentLight} 100%);">🧮 Calculate My Cost</button>
        </div>
      </div>
      <div style="display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center; padding: 3rem; border: 2px dashed #E2E8F0; border-radius: 1rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">💰</div>
          <p style="color: #94A3B8;">Your estimate will appear here</p>
          <p style="font-size: 0.75rem; color: #CBD5E1; margin-top: 0.5rem;">Enter your details to get started</p>
        </div>
      </div>
    </section>`;

        case "testimonial":
          return `
    <section style="padding: 3rem 2rem; text-align: center; background: linear-gradient(to bottom, ${theme.primary}10, white);">
      <div style="display: flex; justify-content: center; gap: 0.25rem; margin-bottom: 1rem;">
        ${[1,2,3,4,5].map(() => `<span style="color: ${theme.primary}; font-size: 2rem;">★</span>`).join('')}
      </div>
      <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.75rem;">Real Families. Real Stories.</h1>
      <p style="font-size: 1.125rem; color: #64748B;">See why we're rated 4.9/5 by over 50,000 customers</p>
    </section>
    <section style="padding: 2rem; max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
      ${[
        { name: "Sarah M.", location: "Austin, TX", quote: "Saved $847 on my cross-country move!" },
        { name: "Michael C.", location: "Denver, CO", quote: "The AI scanner was incredibly accurate." },
        { name: "Emily R.", location: "Seattle, WA", quote: "Best moving experience ever. Period." },
        { name: "David K.", location: "Miami, FL", quote: "24/7 support made all the difference." },
      ].map(t => `
        <div style="padding: 1.5rem; border-radius: 1rem; background: white; border: 1px solid #E2E8F0;">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
            <div style="width: 3rem; height: 3rem; border-radius: 50%; background: linear-gradient(135deg, ${theme.primary}, ${theme.accent}); color: white; font-weight: 700; display: flex; align-items: center; justify-content: center;">${t.name[0]}</div>
            <div>
              <div style="font-weight: 600;">${t.name}</div>
              <div style="font-size: 0.875rem; color: #64748B;">${t.location}</div>
            </div>
          </div>
          <p style="color: #475569; font-style: italic;">"${t.quote}"</p>
        </div>
      `).join('')}
    </section>
    <div style="text-align: center; padding: 2rem;">
      <a href="#" class="btn-primary">Join 50,000+ Happy Families →</a>
    </div>`;

        case "local-seo":
          return `
    <section style="padding: 4rem 2rem; text-align: center; background: linear-gradient(135deg, ${theme.primaryDark} 0%, ${theme.primary} 100%); color: white;">
      <span class="badge" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); margin-bottom: 1rem;">📍 ${targetLocation || "California"} Movers</span>
      <h1 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem;">#1 Rated Moving Company in ${targetLocation || "California"}</h1>
      <p style="font-size: 1.125rem; opacity: 0.9; max-width: 42rem; margin: 0 auto 2rem;">Trusted by local families for over 10 years. Licensed, insured, and ready to make your move stress-free.</p>
      <div style="max-width: 28rem; margin: 0 auto; background: white; border-radius: 1rem; padding: 1.5rem; color: #1E293B;">
        <h3 style="font-weight: 600; margin-bottom: 1rem;">Get a Free Local Quote</h3>
        <input type="text" class="input" placeholder="Your ZIP code" style="text-align: center;">
        <input type="text" class="input" placeholder="Phone number" style="text-align: center;">
        <button class="btn-primary" style="width: 100%;">Get My Quote →</button>
        <p style="font-size: 0.75rem; color: #64748B; margin-top: 0.75rem;">Serving all of ${targetLocation || "California"}</p>
      </div>
    </section>
    <section style="padding: 2rem; background: #F8FAFC; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center;">
      <div><div style="font-size: 1.5rem; font-weight: 700;">🏢</div><div style="font-size: 1.25rem; font-weight: 700;">Downtown LA</div><div style="font-size: 0.75rem; color: #64748B;">Local Office</div></div>
      <div><div style="font-size: 1.5rem; font-weight: 700;">📦</div><div style="font-size: 1.25rem; font-weight: 700;">12,847</div><div style="font-size: 0.75rem; color: #64748B;">Moves Completed</div></div>
      <div><div style="font-size: 1.5rem; font-weight: 700;">⏱️</div><div style="font-size: 1.25rem; font-weight: 700;">< 2 hours</div><div style="font-size: 0.75rem; color: #64748B;">Avg Response</div></div>
      <div><div style="font-size: 1.5rem; font-weight: 700;">⭐</div><div style="font-size: 1.25rem; font-weight: 700;">4.9/5</div><div style="font-size: 0.75rem; color: #64748B;">Rating</div></div>
    </section>
    <section style="padding: 2rem; text-align: center;">
      <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Areas We Serve</h2>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem;">
        ${["Los Angeles", "San Diego", "San Francisco", "Sacramento", "San Jose", "Oakland", "Fresno", "Long Beach"].map(city => `<span class="badge" style="background: #F1F5F9; color: #475569; padding: 0.5rem 1rem;">${city}</span>`).join('')}
      </div>
    </section>`;

        case "long-form":
          return `
    <article style="max-width: 48rem; margin: 0 auto; padding: 3rem 2rem;">
      <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #64748B; margin-bottom: 1rem;">The Complete Guide</p>
      <h1 style="font-size: 2.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem;">Everything You Need to Know Before Hiring a Moving Company in 2025</h1>
      <p style="font-size: 1.125rem; color: #64748B; margin-bottom: 1rem;">A comprehensive guide to saving money, avoiding scams, and finding the perfect mover for your needs.</p>
      <p style="font-size: 0.875rem; color: #94A3B8;">15 min read • Updated Feb 2025</p>
    </article>
    <nav style="padding: 1.5rem 2rem; background: #F8FAFC; border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
      <div style="max-width: 48rem; margin: 0 auto;">
        <h3 style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.75rem;">In This Guide:</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
          <a href="#" style="color: ${theme.primary}; text-decoration: none;">1. Understanding Moving Costs</a>
          <a href="#" style="color: ${theme.primary}; text-decoration: none;">2. Red Flags to Watch For</a>
          <a href="#" style="color: ${theme.primary}; text-decoration: none;">3. How to Compare Quotes</a>
          <a href="#" style="color: ${theme.primary}; text-decoration: none;">4. The AI Advantage</a>
        </div>
      </div>
    </nav>
    <article style="max-width: 48rem; margin: 0 auto; padding: 2rem;">
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">1. Understanding Moving Costs</h2>
        <p style="color: #475569; margin-bottom: 1rem;">The average cost of a long-distance move ranges from $2,000 to $5,000, depending on distance, weight, and time of year. Here's how to budget effectively...</p>
        <div style="padding: 1rem; border-radius: 0.75rem; background: ${theme.primary}10; border: 1px solid ${theme.primary}30;">
          <p style="font-size: 0.875rem; color: ${theme.primaryDark};">💡 <strong>Pro Tip:</strong> Get quotes at least 4-6 weeks before your move date for the best rates.</p>
        </div>
      </section>
      <section>
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">2. Red Flags to Watch For</h2>
        <ul style="list-style: none; padding: 0;">
          <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem; color: #475569;"><span style="color: #EF4444;">✗</span> Large deposits required upfront</li>
          <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem; color: #475569;"><span style="color: #EF4444;">✗</span> No physical address or office</li>
          <li style="display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem; color: #475569;"><span style="color: #EF4444;">✗</span> Quotes given over the phone without inspection</li>
          <li style="display: flex; align-items: flex-start; gap: 0.5rem; color: #475569;"><span style="color: #EF4444;">✗</span> No FMCSA registration number</li>
        </ul>
      </section>
    </article>
    <footer style="position: sticky; bottom: 0; padding: 1rem 2rem; background: white; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; max-width: 48rem; margin: 0 auto;">
      <div>
        <p style="font-weight: 600;">Ready to get started?</p>
        <p style="font-size: 0.875rem; color: #64748B;">Get your free AI-powered quote in 60 seconds</p>
      </div>
      <a href="#" class="btn-primary">${getSection('cta-primary')} →</a>
    </footer>`;

        default:
          return `<section style="padding: 4rem 2rem; text-align: center;"><h1 style="font-size: 2rem; font-weight: 700;">${businessName}</h1><p style="color: #64748B; margin: 1rem 0;">${mainOffer}</p><a href="#" class="btn-primary">${getSection('cta-primary')} →</a></section>`;
      }
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${templateName}</title>
  <meta name="description" content="${mainOffer}">
  <style>${commonStyles}</style>
</head>
<body>
  ${getTemplateBody()}
  <!-- Generated by ${businessName} AI Landing Page Generator -->
  <!-- Template: ${templateName} | Theme: ${themeName} -->
</body>
</html>`;
  };

  // Export landing page as HTML file download
  const exportAsHtml = () => {
    const htmlContent = generateHtmlContent();
    
    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${businessName.toLowerCase().replace(/\s/g, '-')}-${selectedTemplate}-landing-page.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Landing page exported!", {
      description: "HTML file downloaded successfully"
    });
  };

  // Copy HTML to clipboard
  const copyHtmlToClipboard = async () => {
    const htmlContent = generateHtmlContent();
    
    try {
      await navigator.clipboard.writeText(htmlContent);
      toast.success("HTML copied to clipboard!", {
        description: "Paste it anywhere to use"
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Please try the download option instead"
      });
    }
  };

  const EditableText = ({ sectionId, className, as: Component = 'span' }: { sectionId: string; className?: string; as?: 'span' | 'p' | 'h1' | 'h2' }) => {
    const isEditing = editingSection === sectionId;
    const content = getSection(sectionId);
    
    if (isEditing) {
      return (
        <div className="relative inline-flex items-center gap-2 w-full">
          {Component === 'p' || Component === 'span' ? (
            <Textarea
              value={tempEditValue}
              onChange={(e) => setTempEditValue(e.target.value)}
              className="text-sm bg-white text-slate-900 border-2 border-purple-500 rounded-lg p-2 min-h-[60px] w-full"
              autoFocus
            />
          ) : (
            <Input
              value={tempEditValue}
              onChange={(e) => setTempEditValue(e.target.value)}
              className="text-lg font-bold bg-white text-slate-900 border-2 border-purple-500 rounded-lg p-2 w-full"
              autoFocus
            />
          )}
          <div className="flex gap-1">
            <button 
              onClick={saveEdit}
              className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              <Check className="w-4 h-4" />
            </button>
            <button 
              onClick={cancelEdit}
              className="p-1.5 rounded-lg bg-slate-500 text-white hover:bg-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <Component 
        className={`${className} group relative cursor-pointer hover:bg-purple-500/20 rounded px-1 -mx-1 transition-colors`}
        onClick={() => startEditing(sectionId)}
      >
        {content}
        <Pencil className="w-3 h-3 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
      </Component>
    );
  };

  // Template-specific landing page renders
  const renderQuoteFunnelPage = () => (
    <div className="bg-white dark:bg-slate-900 relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2" style={{ borderColor: theme.primary }}>
        <div className="flex items-center justify-between px-6 py-3">
          <TruMoveLogo className="h-8" />
          <div className="flex items-center gap-4">
            <a href="tel:1-800-TRUMOVE" className="flex items-center gap-2 text-slate-700 hover:text-green-600 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-semibold text-sm">1-800-TRUMOVE</span>
            </a>
            <Button size="sm" style={{ background: theme.primary }}>Get a Quote</Button>
          </div>
        </div>
      </header>

      {/* Urgency Banner */}
      <div className="py-2.5 text-center text-white" style={{ background: `linear-gradient(90deg, #DC2626, #EA580C)` }}>
        <span className="flex items-center justify-center gap-2 text-sm font-medium">
          <Zap className="w-4 h-4 animate-pulse" />
          🔥 Limited Time: $200 Off Long-Distance Moves — Only 3 Spots Left This Week!
          <Zap className="w-4 h-4 animate-pulse" />
        </span>
      </div>

      {/* Hero Section - Dark with green CTAs */}
      <div 
        className="relative px-8 py-20 text-center"
        style={{ background: `linear-gradient(135deg, ${theme.secondary} 0%, #0F172A 50%, ${theme.secondary} 100%)` }}
      >
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            FMCSA Licensed
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Shield className="w-3 h-3 mr-1" />
            Bonded & Insured
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ⭐ 4.9/5 Rating • 50K+ Moves
          </Badge>
        </div>

        <TruMoveLogo className="h-12 mx-auto mb-6 brightness-0 invert" />
        
        <Badge className="mb-6 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-1.5">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          AI-Powered Moving Technology
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight max-w-4xl mx-auto">
          <EditableText sectionId="main-headline" as="span" className="block" />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, ${theme.primary}, ${theme.accentLight}, ${theme.primary})` }}>
            <EditableText sectionId="sub-headline" as="span" />
          </span>
        </h1>
        
        <div className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          <EditableText sectionId="hero-body" as="p" />
        </div>

        {/* Feature checkmarks */}
        <div className="flex items-center justify-center gap-6 mb-10 text-sm">
          {[
            "Instant AI-Powered Quotes",
            "Verified Carriers Only", 
            "Price Lock Guarantee",
            "24/7 Live Support"
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-white/90">
              <CheckCircle2 className="w-4 h-4" style={{ color: theme.primary }} />
              {item}
            </span>
          ))}
        </div>

        {/* Quote Form with animated glow */}
        <div 
          className="max-w-lg mx-auto rounded-3xl p-8 border-2 shadow-2xl relative overflow-hidden"
          style={{ 
            background: 'rgba(255,255,255,0.08)', 
            borderColor: `${theme.primary}50`,
            boxShadow: `0 0 60px ${theme.primary}30`
          }}
        >
          <div 
            className="absolute inset-0 rounded-3xl animate-pulse opacity-30"
            style={{ background: `linear-gradient(45deg, transparent, ${theme.primary}20, transparent)` }}
          />
          <div className="relative">
            <h3 className="text-white font-bold text-xl mb-4">Get Your Free TruMove Quote</h3>
            <div className="space-y-3 mb-4">
              <Input placeholder="Moving from (ZIP code)" className="bg-white/95 border-0 text-slate-900 py-5" />
              <Input placeholder="Moving to (ZIP code)" className="bg-white/95 border-0 text-slate-900 py-5" />
              <Input placeholder="Phone number" className="bg-white/95 border-0 text-slate-900 py-5" />
            </div>
            <Button 
              className="w-full py-7 text-lg font-bold gap-2 shadow-lg" 
              style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)` }}
            >
              <EditableText sectionId="cta-primary" as="span" /> <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure</span>
              <span>•</span>
              <span>No Credit Card</span>
              <span>•</span>
              <span>Instant Results</span>
            </div>
          </div>
        </div>

        {/* As Seen In */}
        <div className="mt-12 flex items-center justify-center gap-8 text-slate-500">
          <span className="text-sm">As seen in:</span>
          <span className="font-bold text-lg opacity-50">Forbes</span>
          <span className="font-bold text-lg opacity-50">Inc.</span>
          <span className="font-bold text-lg opacity-50">TechCrunch</span>
          <span className="font-bold text-lg opacity-50">WSJ</span>
        </div>
      </div>

      {/* Social Proof Ticker */}
      <div className="bg-slate-900 text-white py-3 overflow-hidden relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[
            "Sarah from Austin just saved $847 on her move",
            "Michael in Denver got a quote in 47 seconds", 
            "The Johnson family completed their TruMove today",
            "Emily from Seattle rated TruMove 5 stars",
            "1,247 quotes generated today",
            "David from Miami just booked his move",
            "Sarah from Austin just saved $847 on her move",
            "Michael in Denver got a quote in 47 seconds",
          ].map((proof, i) => (
            <span key={i} className="mx-8 flex items-center gap-2">
              <span style={{ color: theme.primary }}>●</span>
              <span className="text-sm">{proof}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Trust Badge Strip */}
      <div className="flex justify-center items-center gap-8 py-5 border-b border-slate-200 bg-slate-50">
        {[
          { icon: Shield, text: "FMCSA Licensed" },
          { icon: Award, text: "BBB A+ Rated" },
          { icon: Users, text: "50,000+ Moves" },
          { icon: Star, text: "4.9/5 Rating" },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2">
            <badge.icon className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm font-medium text-slate-700">{badge.text}</span>
          </div>
        ))}
      </div>

      {/* 3-Step Process */}
      <div className="py-16 px-8 bg-white">
        <div className="text-center mb-12">
          <Badge className="mb-4" style={{ background: `${theme.primary}15`, color: theme.primary, borderColor: `${theme.primary}30` }}>
            How TruMove Works
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">3 Simple Steps to Your Perfect Move</h2>
          <p className="text-lg text-slate-600">Powered by TruMove AI technology</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="absolute top-14 left-20 right-20 h-0.5 hidden md:block" style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent}, ${theme.primary})` }} />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: 1, icon: "📱", title: "Scan Your Home", description: "Use our AI scanner to instantly inventory your belongings" },
              { number: 2, icon: "🔍", title: "Get Matched", description: "TruMove AI matches you with verified carriers in seconds" },
              { number: 3, icon: "🚚", title: "Move Stress-Free", description: "Track your move in real-time with TruTrack technology" },
            ].map((step, i) => (
              <div key={i} className="relative text-center">
                <div 
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl shadow-lg relative z-10"
                  style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`, boxShadow: `0 8px 32px ${theme.primary}40` }}
                >
                  {step.icon}
                </div>
                <div className="absolute -top-2 right-1/3 w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center z-20">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-10">
          <PoweredByBadge />
        </div>
      </div>

      {/* Video Testimonials */}
      <div className="py-16 px-8 bg-slate-50">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border border-purple-500/30">Real Stories</Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Watch Real TruMove Stories</h2>
          <p className="text-lg text-slate-600">See why families across America trust TruMove</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Sarah M.", location: "Austin, TX", saved: "$847", thumbnail: "👩‍💼" },
            { name: "Michael C.", location: "Denver, CO", saved: "$623", thumbnail: "👨‍💻" },
            { name: "Emily R.", location: "Seattle, WA", saved: "$1,200", thumbnail: "👩‍🎨" },
            { name: "David K.", location: "Miami, FL", saved: "$445", thumbnail: "👨‍🔧" },
          ].map((t, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-5xl relative">
                {t.thumbnail}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Play className="w-6 h-6 ml-1" style={{ color: theme.primary }} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-0.5 mb-2">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.location}</p>
                <Badge className="mt-2 text-[10px]" style={{ background: `${theme.primary}15`, color: theme.primary }}>
                  Saved {t.saved}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTableSection />

      {/* Calculator Preview */}
      <div className="py-16 px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4" style={{ background: `${theme.accent}15`, color: theme.accent }}>
            <Calculator className="w-3 h-3 mr-1" /> Cost Estimator
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">See Your TruMove Price Instantly</h2>
          <p className="text-lg text-slate-600 mb-8">Our AI calculates your exact cost based on distance, inventory, and timing</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Avg. Savings", value: "$847", icon: DollarSign },
              { label: "Quote Time", value: "47 sec", icon: Timer },
              { label: "Happy Customers", value: "50K+", icon: Heart },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <stat.icon className="w-8 h-8 mx-auto mb-3" style={{ color: theme.primary }} />
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Triple Guarantee */}
      <TripleGuaranteeSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <FinalCTASection theme={theme} />

      {/* Footer */}
      <TruMoveFooter />

      {/* Floating Elements */}
      <button 
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow"
        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})` }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
          <Truck className="w-4 h-4" />
          <Sparkles className="w-2.5 h-2.5 absolute -top-0.5 -right-0.5 text-amber-300" />
        </div>
        <span className="font-medium">Chat with Trudy</span>
      </button>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );

  const renderComparisonPage = () => (
    <div className="bg-white dark:bg-slate-900">
      {/* Clean white hero */}
      <div className="px-8 py-12 text-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Badge className="mb-4" style={{ background: `${theme.primary}20`, color: theme.primary }}>Compare & Save</Badge>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
          How We Stack Up Against the Competition
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          See why 50,000+ families chose {businessName} over traditional moving brokers
        </p>
      </div>

      {/* Comparison Table */}
      <div className="px-8 py-8">
        <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="grid grid-cols-4 bg-slate-100 dark:bg-slate-800 text-sm font-semibold">
            <div className="p-4">Feature</div>
            <div className="p-4 text-center text-white" style={{ background: theme.primary }}>{businessName}</div>
            <div className="p-4 text-center">Competitor A</div>
            <div className="p-4 text-center">Competitor B</div>
          </div>
          {[
            { feature: "AI Inventory Scanning", us: true, a: false, b: false },
            { feature: "Instant Online Quotes", us: true, a: true, b: false },
            { feature: "FMCSA Verification", us: true, a: false, b: true },
            { feature: "Price Lock Guarantee", us: true, a: false, b: false },
            { feature: "Real-Time Tracking", us: true, a: true, b: true },
            { feature: "24/7 Support", us: true, a: false, b: true },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-4 border-t border-slate-200 dark:border-slate-700 text-sm">
              <div className="p-4 text-slate-700 dark:text-slate-300">{row.feature}</div>
              <div className="p-4 text-center" style={{ background: `${theme.primary}10` }}>
                {row.us ? <CheckCircle2 className="w-5 h-5 mx-auto" style={{ color: theme.primary }} /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
              </div>
              <div className="p-4 text-center">
                {row.a ? <CheckCircle2 className="w-5 h-5 text-slate-400 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
              </div>
              <div className="p-4 text-center">
                {row.b ? <CheckCircle2 className="w-5 h-5 text-slate-400 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 py-8 text-center">
        <Button className="py-6 px-10 text-lg font-bold gap-2 text-white" style={{ background: theme.primary }}>
          Get Your Free Quote <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  const renderCalculatorPage = () => (
    <div className="bg-slate-50 dark:bg-slate-900">
      {/* Minimal header */}
      <div className="px-8 py-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <img src={logoImg} alt="TruMove" className="h-8" />
        <Badge style={{ background: `${theme.accent}20`, color: theme.accent }}>
          <Calculator className="w-3 h-3 mr-1" /> Free Calculator
        </Badge>
      </div>

      {/* Tool-first layout */}
      <div className="px-8 py-12 grid grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Moving Cost Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Get an instant estimate based on your move details. No email required.
          </p>
          
          <div className="space-y-4 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">From</label>
              <Input placeholder="Origin city or ZIP" className="bg-slate-50 dark:bg-slate-900" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">To</label>
              <Input placeholder="Destination city or ZIP" className="bg-slate-50 dark:bg-slate-900" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Home Size</label>
              <select className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
                <option>Studio / 1 Bedroom</option>
                <option>2 Bedroom</option>
                <option>3 Bedroom</option>
                <option>4+ Bedroom</option>
              </select>
            </div>
            <Button className="w-full py-5 font-bold text-white" style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentLight} 100%)` }}>
              <Calculator className="w-4 h-4 mr-2" /> Calculate My Cost
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="text-center p-8 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600">
            <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Your estimate will appear here</p>
            <p className="text-xs text-slate-400 mt-2">Enter your details to get started</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 border-t border-slate-200 dark:border-slate-700 flex justify-center gap-6 text-sm text-slate-500">
        <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Secure</span>
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Instant Results</span>
        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 50,000+ Quotes</span>
      </div>
    </div>
  );

  const renderTestimonialPage = () => (
    <div style={{ background: `linear-gradient(to bottom, ${theme.primary}10, white)` }}>
      {/* Warm header */}
      <div className="px-8 py-12 text-center">
        <div className="flex justify-center mb-4">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-8 h-8" style={{ fill: theme.primary, color: theme.primary }} />)}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Real Families. Real Stories.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          See why we're rated 4.9/5 by over 50,000 customers
        </p>
      </div>

      {/* Video Testimonial Grid */}
      <div className="px-8 py-8 grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[
          { name: "Sarah M.", location: "Austin, TX", quote: "Saved $847 on my cross-country move!" },
          { name: "Michael C.", location: "Denver, CO", quote: "The AI scanner was incredibly accurate." },
          { name: "Emily R.", location: "Seattle, WA", quote: "Best moving experience ever. Period." },
          { name: "David K.", location: "Miami, FL", quote: "24/7 support made all the difference." },
        ].map((t, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
                {t.name[0]}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{t.name}</div>
                <div className="text-sm text-slate-500">{t.location}</div>
              </div>
              <div className="ml-auto flex">
                {[1,2,3,4,5].map(j => <Star key={j} className="w-3 h-3" style={{ fill: theme.primary, color: theme.primary }} />)}
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 italic">"{t.quote}"</p>
            <button className="mt-4 flex items-center gap-2 text-sm font-medium" style={{ color: theme.primary }}>
              <Play className="w-4 h-4" /> Watch Video
            </button>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-8 py-10 text-center">
        <Button className="py-6 px-10 text-lg font-bold gap-2 text-white" style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)` }}>
          Join 50,000+ Happy Families <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );

  const renderLocalSeoPage = () => (
    <div className="bg-white dark:bg-slate-900">
      {/* Location-specific hero */}
      <div className="px-8 py-16 text-center" style={{ background: `linear-gradient(135deg, ${theme.primaryDark} 0%, ${theme.primary} 100%)` }}>
        <Badge className="mb-4 bg-white/20 text-white border border-white/30">
          <MapPin className="w-3 h-3 mr-1" /> {targetLocation || "California"} Movers
        </Badge>
        <h1 className="text-4xl font-bold text-white mb-4">
          #1 Rated Moving Company in {targetLocation || "California"}
        </h1>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Trusted by local families for over 10 years. Licensed, insured, and ready to make your move stress-free.
        </p>
        
        <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-slate-900 mb-4">Get a Free Local Quote</h3>
          <div className="space-y-3 mb-4">
            <Input placeholder="Your ZIP code" className="text-center" />
            <Input placeholder="Phone number" className="text-center" />
          </div>
          <Button className="w-full py-5 font-bold text-white" style={{ background: theme.primary }}>
            Get My Quote <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-slate-500 mt-3">Serving all of {targetLocation || "California"}</p>
        </div>
      </div>

      {/* Local trust signals */}
      <div className="py-8 px-8 grid grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        {[
          { icon: Building, label: "Local Office", value: "Downtown LA" },
          { icon: Users, label: "Moves Completed", value: "12,847" },
          { icon: Clock, label: "Avg Response", value: "< 2 hours" },
          { icon: Star, label: "Rating", value: "4.9/5" },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <item.icon className="w-6 h-6 mx-auto mb-2" style={{ color: theme.primary }} />
            <div className="text-xl font-bold text-slate-900 dark:text-white">{item.value}</div>
            <div className="text-xs text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Service areas */}
      <div className="py-10 px-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Areas We Serve</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {["Los Angeles", "San Diego", "San Francisco", "Sacramento", "San Jose", "Oakland", "Fresno", "Long Beach"].map(city => (
            <Badge key={city} variant="secondary" className="text-sm py-1 px-3">{city}</Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLongFormPage = () => (
    <div className="bg-white dark:bg-slate-900">
      {/* Editorial-style header */}
      <div className="px-8 py-16 max-w-3xl mx-auto text-center">
        <p className="text-sm text-slate-500 uppercase tracking-wider mb-4">The Complete Guide</p>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          Everything You Need to Know Before Hiring a Moving Company in 2025
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          A comprehensive guide to saving money, avoiding scams, and finding the perfect mover for your needs.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6 text-sm text-slate-500">
          <span>15 min read</span>
          <span>•</span>
          <span>Updated Feb 2025</span>
        </div>
      </div>

      {/* TOC */}
      <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">In This Guide:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              "1. Understanding Moving Costs",
              "2. Red Flags to Watch For",
              "3. How to Compare Quotes",
              "4. The AI Advantage",
              "5. Packing Tips & Tricks",
              "6. Your Moving Day Checklist",
            ].map((item, i) => (
              <div key={i} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="px-8 py-12 max-w-3xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Understanding Moving Costs</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            The average cost of a long-distance move ranges from $2,000 to $5,000, depending on distance, 
            weight, and time of year. Here's how to budget effectively...
          </p>
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>💡 Pro Tip:</strong> Get quotes at least 4-6 weeks before your move date for the best rates.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Red Flags to Watch For</h2>
          <ul className="space-y-3">
            {[
              "Large deposits required upfront",
              "No physical address or office",
              "Quotes given over the phone without inspection",
              "No FMCSA registration number",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 px-8 py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Ready to get started?</p>
            <p className="text-sm text-slate-500">Get your free AI-powered quote in 60 seconds</p>
          </div>
          <Button className="py-5 px-8 font-bold gap-2 text-white" style={{ background: theme.primary }}>
            Get My Quote <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSelectedTemplate = () => {
    switch (selectedTemplate) {
      case "quote-funnel": return renderQuoteFunnelPage();
      case "comparison": return renderComparisonPage();
      case "calculator": return renderCalculatorPage();
      case "testimonial": return renderTestimonialPage();
      case "local-seo": return renderLocalSeoPage();
      case "long-form": return renderLongFormPage();
      default: return renderQuoteFunnelPage();
    }
  };

   if (showLandingPage) {
     return (
       <>
         <div className="space-y-4">
         {/* Control Bar */}
         <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
           <div className="flex items-center gap-3">
             <Badge className="gap-1" style={{ background: "#10B98120", color: "#10B981" }}>
               <CheckCircle2 className="w-3 h-3" />
               AI Generated
             </Badge>
            <span className="text-sm text-muted-foreground">
              {LANDING_PAGE_TEMPLATES.find(t => t.id === selectedTemplate)?.name} • Click text to edit
            </span>
           </div>
           <div className="flex gap-2">
             {/* Color Theme Selector */}
             <Select value={selectedTheme} onValueChange={setSelectedTheme}>
               <SelectTrigger className="w-[160px] h-9">
                 <Palette className="w-3.5 h-3.5 mr-2" />
                 <SelectValue placeholder="Theme" />
               </SelectTrigger>
               <SelectContent>
                 {COLOR_THEMES.map((colorTheme) => (
                   <SelectItem key={colorTheme.id} value={colorTheme.id}>
                     <div className="flex items-center gap-2">
                       <div 
                         className="w-4 h-4 rounded-full border border-border"
                         style={{ background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})` }}
                       />
                       {colorTheme.name}
                     </div>
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>

             <Button variant="outline" size="sm" onClick={() => setShowLandingPage(false)}>
               <RefreshCw className="w-3 h-3 mr-1" />
               Regenerate
             </Button>
             <Button variant="outline" size="sm" onClick={exportAsHtml}>
               <Download className="w-3 h-3 mr-1" />
               Export HTML
             </Button>
             <Button variant="outline" size="sm" onClick={copyHtmlToClipboard}>
               <Copy className="w-3 h-3 mr-1" />
               Copy HTML
             </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDataImport(true)}
                className={importedData ? "border-green-500 text-green-600" : ""}
              >
                <Upload className="w-3 h-3 mr-1" />
                {importedData ? "Data Imported" : "Import Data"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsPopoutOpen(true)}
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Pop Out
              </Button>
             <Button size="sm" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
               Publish Page
             </Button>
           </div>
         </div>
 
         {/* Generated Landing Page Preview */}
          <div className="rounded-xl border-2 border-purple-300 overflow-hidden shadow-lg relative group">
            {/* Quick Pop Out Button on Preview */}
            <button
              onClick={() => setIsPopoutOpen(true)}
              className="absolute top-12 right-3 z-10 p-2 rounded-lg bg-white/90 dark:bg-slate-800/90 shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-50 dark:hover:bg-purple-900/50"
              title="Pop out to larger view"
            >
              <Maximize2 className="w-4 h-4 text-purple-600" />
            </button>
           {/* Browser Chrome */}
           <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border-b border-border">
             <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-400" />
               <div className="w-3 h-3 rounded-full bg-amber-400" />
               <div className="w-3 h-3 rounded-full bg-green-400" />
             </div>
             <div className="flex-1 mx-4">
               <div className="bg-white dark:bg-slate-700 rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
                 https://{businessName.toLowerCase().replace(/\s/g, '')}.com/{selectedTemplate}
               </div>
             </div>
           </div>
 
           {/* Actual Landing Page Content */}
           <div className="relative">
             <ScrollArea className="h-[450px]">
              {renderSelectedTemplate()}
             </ScrollArea>
             
             {/* Heatmap Overlay */}
             {showHeatmapOverlay && importedData && (
               <div className="absolute inset-0 pointer-events-none z-20">
                  {getCurrentHeatmapPositions().map((pos, i) => {
                    const clickData = importedData.clickBehavior.find(c => 
                      c.element.toLowerCase().includes(pos.element.toLowerCase().split(' ')[0])
                    );
                    const intensity = pos.intensity;
                    const colors = {
                      high: { bg: "rgba(239, 68, 68, 0.6)", shadow: "0 0 40px 20px rgba(239, 68, 68, 0.4)", badge: "bg-red-600" },
                      medium: { bg: "rgba(249, 115, 22, 0.5)", shadow: "0 0 30px 15px rgba(249, 115, 22, 0.3)", badge: "bg-orange-500" },
                      low: { bg: "rgba(59, 130, 246, 0.4)", shadow: "0 0 25px 10px rgba(59, 130, 246, 0.25)", badge: "bg-blue-500" },
                    };
                    const color = colors[intensity];
                    
                    return (
                      <div 
                        key={pos.id}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg ${intensity === 'high' ? 'animate-pulse' : ''}`}
                        style={{ 
                          top: pos.top,
                          left: pos.left,
                          width: pos.width,
                          height: pos.height,
                          background: `radial-gradient(ellipse, ${color.bg} 0%, ${color.bg.replace(/0\.[456]/g, '0.15')} 40%, transparent 70%)`,
                          boxShadow: color.shadow
                        }}
                      >
                        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 ${color.badge} text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium`}>
                          {intensity === 'high' ? '🔥' : intensity === 'medium' ? '⚡' : '❄️'} {clickData?.percentage || ((5 - i) * 8)}% • {pos.element}
                        </div>
                      </div>
                    );
                  })}
                 
                 {/* Legend */}
                 <div className="absolute bottom-4 right-4 p-2 rounded-lg bg-black/80 backdrop-blur-sm text-white text-[10px] space-y-1">
                   <div className="font-semibold mb-1">Click Heatmap</div>
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Hot (25%+)</div>
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Warm (10-25%)</div>
                   <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Cool (&lt;10%)</div>
                 </div>
               </div>
             )}
           </div>
         </div>
 
        {/* SEO & Keyword Analysis */}
        <div className="grid grid-cols-2 gap-4">
          {/* Keywords Used */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#7C3AED20" }}>
                <Hash className="w-4 h-4" style={{ color: "#7C3AED" }} />
              </div>
              <h4 className="font-semibold text-sm text-foreground">Keywords Targeted</h4>
             </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { keyword: "long distance moving", volume: "12.4K", difficulty: "high" },
                { keyword: "moving quote", volume: "8.2K", difficulty: "medium" },
                { keyword: "cross country movers", volume: "6.8K", difficulty: "high" },
                { keyword: "moving cost calculator", volume: "9.1K", difficulty: "medium" },
                { keyword: "cheap movers", volume: "14.2K", difficulty: "high" },
                { keyword: "AI moving estimate", volume: "890", difficulty: "low" },
              ].map((kw) => (
                <Badge 
                  key={kw.keyword} 
                  variant="secondary" 
                  className="text-[10px] gap-1"
                >
                  {kw.keyword}
                  <span className="text-muted-foreground">({kw.volume})</span>
                </Badge>
              ))}
             </div>
           </div>

          {/* Geographic Targeting */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EC489920" }}>
                <MapPin className="w-4 h-4" style={{ color: "#EC4899" }} />
              </div>
              <h4 className="font-semibold text-sm text-foreground">Geographic Targeting</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Primary Markets:</span>
                <span className="font-medium text-foreground">CA, TX, FL, NY</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Search Intent:</span>
                <Badge variant="secondary" className="text-[10px]">Transactional</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Local Modifiers:</span>
                <span className="text-xs text-muted-foreground">"near me", city names</span>
              </div>
            </div>
          </div>
        </div>

        {/* Why These Choices - SEO Reasoning */}
         {/* Data Import Modal */}
         {showDataImport && (
           <div className="p-4 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-700">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500">
                   <FileUp className="w-4 h-4 text-white" />
                 </div>
                 <div>
                   <h4 className="font-semibold text-blue-900 dark:text-blue-200">Import Analytics Data</h4>
                   <p className="text-xs text-blue-600 dark:text-blue-400">Connect your Google Ads, Analytics, or upload CSV</p>
                 </div>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setShowDataImport(false)}>
                 <X className="w-4 h-4" />
               </Button>
             </div>
             
             <div className="grid grid-cols-3 gap-3 mb-4">
               <button 
                 onClick={handleImportData}
                 className="p-4 rounded-xl border border-border bg-card hover:border-blue-400 transition-all text-center"
               >
                 <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-2">
                   <BarChart3 className="w-5 h-5 text-blue-600" />
                 </div>
                 <p className="font-medium text-sm text-foreground">Google Ads</p>
                 <p className="text-xs text-muted-foreground">Import campaigns</p>
               </button>
               <button 
                 onClick={handleImportData}
                 className="p-4 rounded-xl border border-border bg-card hover:border-blue-400 transition-all text-center"
               >
                 <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mx-auto mb-2">
                   <PieChart className="w-5 h-5 text-orange-600" />
                 </div>
                 <p className="font-medium text-sm text-foreground">Google Analytics</p>
                 <p className="text-xs text-muted-foreground">Import behavior</p>
               </button>
               <button 
                 onClick={handleImportData}
                 className="p-4 rounded-xl border border-border bg-card hover:border-blue-400 transition-all text-center"
               >
                 <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
                   <Upload className="w-5 h-5 text-green-600" />
                 </div>
                 <p className="font-medium text-sm text-foreground">Upload CSV</p>
                 <p className="text-xs text-muted-foreground">Custom data</p>
               </button>
             </div>
             
             <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
               <CheckCircle2 className="w-4 h-4 text-blue-600" />
               <p className="text-xs text-blue-700 dark:text-blue-300">
                 <strong>Demo Mode:</strong> Click any source to load sample data with keyword performance, geographic & demographic insights.
               </p>
             </div>
           </div>
         )}
 
         {/* Imported Data Analytics Panel */}
         {importedData && (
           <div className="rounded-xl border border-border bg-card overflow-hidden">
             {/* Header with stats */}
             <div className="p-4 border-b border-border bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500">
                     <CheckCircle2 className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-foreground">Imported Analytics Data</h4>
                     <p className="text-xs text-muted-foreground">{importedData.dateRange}</p>
                   </div>
                 </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowHeatmapOverlay(!showHeatmapOverlay)}
                      className={showHeatmapOverlay ? "border-red-400 bg-red-50 text-red-600 dark:bg-red-950/30" : ""}
                    >
                      {showHeatmapOverlay ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
                      {showHeatmapOverlay ? "Hide" : "Show"} Heatmap
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={exportAnalyticsPdf}
                      className="gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Export PDF
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setImportedData(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                 <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                   <p className="text-2xl font-bold text-foreground">{importedData.totalClicks.toLocaleString()}</p>
                   <p className="text-xs text-muted-foreground">Total Clicks</p>
                 </div>
                 <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                   <p className="text-2xl font-bold text-green-600">{importedData.totalConversions.toLocaleString()}</p>
                   <p className="text-xs text-muted-foreground">Conversions</p>
                 </div>
                 <div className="text-center p-2 rounded-lg bg-white/50 dark:bg-slate-800/50">
                   <p className="text-2xl font-bold text-blue-600">${(importedData.totalRevenue / 1000).toFixed(1)}K</p>
                   <p className="text-xs text-muted-foreground">Revenue</p>
                 </div>
               </div>
             </div>
             
             {/* Tabs */}
             <div className="flex border-b border-border">
               {[
                 { id: 'keywords', label: 'Keywords', icon: Hash },
                 { id: 'geographic', label: 'Geographic', icon: Map },
                 { id: 'demographic', label: 'Demographics', icon: UserCheck },
                 { id: 'clicks', label: 'Click Behavior', icon: MousePointerClick },
               ].map((tab) => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveDataTab(tab.id as typeof activeDataTab)}
                   className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                     activeDataTab === tab.id 
                       ? "text-primary border-b-2 border-primary bg-primary/5" 
                       : "text-muted-foreground hover:text-foreground"
                   }`}
                 >
                   <tab.icon className="w-3.5 h-3.5" />
                   {tab.label}
                 </button>
               ))}
             </div>
             
             {/* Tab Content */}
             <div className="p-4">
               {activeDataTab === 'keywords' && (
                 <div className="space-y-3">
                   <div className="flex items-center justify-between mb-2">
                     <h5 className="font-medium text-sm text-foreground">Keyword Performance & Why They're Winning</h5>
                      <div className="flex items-center gap-2">
                        {/* Trend Filter */}
                        <Select value={keywordTrendFilter} onValueChange={(v: 'all' | 'up' | 'down' | 'stable') => setKeywordTrendFilter(v)}>
                          <SelectTrigger className="h-7 w-[100px] text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <SelectValue placeholder="Trend" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Trends</SelectItem>
                            <SelectItem value="up">↑ Trending Up</SelectItem>
                            <SelectItem value="down">↓ Trending Down</SelectItem>
                            <SelectItem value="stable">→ Stable</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {/* Conversion Filter */}
                        <Select value={keywordConversionFilter} onValueChange={(v: 'all' | 'high' | 'medium' | 'low') => setKeywordConversionFilter(v)}>
                          <SelectTrigger className="h-7 w-[110px] text-xs">
                            <FilterIcon className="w-3 h-3 mr-1" />
                            <SelectValue placeholder="Conv Rate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Rates</SelectItem>
                            <SelectItem value="high">High (&gt;8%)</SelectItem>
                            <SelectItem value="medium">Medium (5-8%)</SelectItem>
                            <SelectItem value="low">Low (&lt;5%)</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Badge variant="secondary" className="text-[10px]">
                          {getFilteredKeywords().length} of {importedData.keywords.length}
                        </Badge>
                      </div>
                   </div>
                    {getFilteredKeywords().length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <FilterIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No keywords match your filters</p>
                        <button 
                          onClick={() => { setKeywordTrendFilter('all'); setKeywordConversionFilter('all'); }}
                          className="text-xs text-primary hover:underline mt-1"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : getFilteredKeywords().map((kw, i) => (
                     <div key={i} className="p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                       <div className="flex items-start justify-between mb-2">
                         <div className="flex items-center gap-2">
                           <Badge 
                             variant="secondary" 
                             className={`text-xs ${
                               kw.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                               kw.trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                               ''
                             }`}
                           >
                             {kw.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : 
                              kw.trend === 'down' ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                             #{kw.position.toFixed(1)}
                           </Badge>
                           <span className="font-medium text-sm text-foreground">{kw.keyword}</span>
                         </div>
                         <div className="flex items-center gap-3 text-xs text-muted-foreground">
                           <span>{kw.clicks.toLocaleString()} clicks</span>
                           <span className="text-green-600 font-medium">{kw.conversions} conv</span>
                           <span>{kw.ctr.toFixed(2)}% CTR</span>
                         </div>
                       </div>
                       <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800">
                         <p className="text-xs text-purple-700 dark:text-purple-300 flex items-start gap-1.5">
                           <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                           <span><strong>Why it's winning:</strong> {kw.winningReason}</span>
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
               
               {activeDataTab === 'geographic' && (
                 <div className="space-y-3">
                   <div className="flex items-center justify-between mb-2">
                     <h5 className="font-medium text-sm text-foreground">Geographic Markets Performance</h5>
                     <Badge variant="secondary" className="text-xs">
                       <Map className="w-3 h-3 mr-1" />
                       Top 6 States
                     </Badge>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     {importedData.geographic.map((geo, i) => (
                       <div key={i} className="p-3 rounded-xl border border-border bg-card">
                         <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                               <MapPin className="w-4 h-4 text-blue-600" />
                             </div>
                             <div>
                               <p className="font-medium text-sm text-foreground">{geo.state}</p>
                               <p className="text-xs text-muted-foreground">{geo.region} • {geo.topCity}</p>
                             </div>
                           </div>
                           <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                             {geo.convRate.toFixed(1)}% CVR
                           </Badge>
                         </div>
                         <div className="grid grid-cols-3 gap-2 text-center text-xs">
                           <div className="p-1.5 rounded bg-muted">
                             <p className="font-semibold text-foreground">{geo.clicks.toLocaleString()}</p>
                             <p className="text-muted-foreground">Clicks</p>
                           </div>
                           <div className="p-1.5 rounded bg-muted">
                             <p className="font-semibold text-green-600">{geo.conversions}</p>
                             <p className="text-muted-foreground">Conv</p>
                           </div>
                           <div className="p-1.5 rounded bg-muted">
                             <p className="font-semibold text-blue-600">${(geo.revenue / 1000).toFixed(1)}K</p>
                             <p className="text-muted-foreground">Revenue</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
               
               {activeDataTab === 'demographic' && (
                 <div className="space-y-3">
                   <div className="flex items-center justify-between mb-2">
                     <h5 className="font-medium text-sm text-foreground">Who's Clicking & Converting</h5>
                     <Badge variant="secondary" className="text-xs">
                       <UserCheck className="w-3 h-3 mr-1" />
                       Audience Segments
                     </Badge>
                   </div>
                   {importedData.demographic.map((demo, i) => (
                     <div key={i} className="p-3 rounded-xl border border-border bg-card">
                       <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                           <div 
                             className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
                             style={{ 
                               background: `linear-gradient(135deg, ${
                                 i === 0 ? '#22C55E' : i === 1 ? '#3B82F6' : i === 2 ? '#8B5CF6' : i === 3 ? '#F59E0B' : '#EC4899'
                               } 0%, ${
                                 i === 0 ? '#16A34A' : i === 1 ? '#1D4ED8' : i === 2 ? '#7C3AED' : i === 3 ? '#D97706' : '#DB2777'
                               } 100%)` 
                             }}
                           >
                             {demo.percentage}%
                           </div>
                           <div>
                             <p className="font-medium text-sm text-foreground">{demo.segment}</p>
                             <p className="text-xs text-muted-foreground">{demo.device}</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="font-semibold text-sm text-green-600">${demo.avgOrderValue.toLocaleString()}</p>
                           <p className="text-xs text-muted-foreground">Avg Order</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-4 text-xs">
                         <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                             <span className="text-muted-foreground">Clicks</span>
                             <span className="font-medium text-foreground">{demo.clicks.toLocaleString()}</span>
                           </div>
                           <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                             <div 
                               className="h-full rounded-full bg-blue-500" 
                               style={{ width: `${(demo.clicks / 9442) * 100}%` }}
                             />
                           </div>
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                             <span className="text-muted-foreground">Conversions</span>
                             <span className="font-medium text-green-600">{demo.conversions}</span>
                           </div>
                           <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                             <div 
                               className="h-full rounded-full bg-green-500" 
                               style={{ width: `${(demo.conversions / 812) * 100}%` }}
                             />
                           </div>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
               
               {activeDataTab === 'clicks' && (
                 <div className="space-y-3">
                   <div className="flex items-center justify-between mb-2">
                     <h5 className="font-medium text-sm text-foreground">Click Behavior & Heatmap Insights</h5>
                     <Badge variant="secondary" className="text-xs">
                       <MousePointerClick className="w-3 h-3 mr-1" />
                       Element Analysis
                     </Badge>
                   </div>
                   {importedData.clickBehavior.map((click, i) => (
                     <div key={i} className="p-3 rounded-xl border border-border bg-card">
                       <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2">
                           <div 
                             className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                               click.heatmapIntensity === 'high' ? 'bg-red-100 dark:bg-red-900' :
                               click.heatmapIntensity === 'medium' ? 'bg-amber-100 dark:bg-amber-900' :
                               'bg-blue-100 dark:bg-blue-900'
                             }`}
                           >
                             <MousePointerClick className={`w-4 h-4 ${
                               click.heatmapIntensity === 'high' ? 'text-red-600' :
                               click.heatmapIntensity === 'medium' ? 'text-amber-600' :
                               'text-blue-600'
                             }`} />
                           </div>
                           <div>
                             <p className="font-medium text-sm text-foreground">{click.element}</p>
                             <p className="text-xs text-muted-foreground">{click.clicks.toLocaleString()} clicks ({click.percentage}%)</p>
                           </div>
                         </div>
                         <Badge 
                           variant="secondary" 
                           className={`text-xs ${
                             click.heatmapIntensity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                             click.heatmapIntensity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                             'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                           }`}
                         >
                           {click.heatmapIntensity === 'high' ? '🔥 Hot' : 
                            click.heatmapIntensity === 'medium' ? '⚡ Warm' : 
                            '❄️ Cool'}
                         </Badge>
                       </div>
                       <div className="p-2 rounded-lg bg-muted">
                         <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                           <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                           <span><strong>Conversion Impact:</strong> {click.conversionImpact}</span>
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
         )}
 
         {/* Why These Choices - SEO Reasoning */}
         <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 dark:bg-purple-950/30 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-500">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-purple-900 dark:text-purple-200">Why AI Made These Choices</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-1.5 font-medium text-purple-800 dark:text-purple-300 mb-1">
                  <Target className="w-3.5 h-3.5" /> Headline Strategy
                </div>
                <p className="text-purple-700 dark:text-purple-400 text-xs">
                  "Stop Overpaying" triggers loss aversion (2x more powerful than gain). 
                  Pain-point headlines convert 34% better than feature-focused ones.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-medium text-purple-800 dark:text-purple-300 mb-1">
                  <BarChart3 className="w-3.5 h-3.5" /> Specific Numbers
                </div>
                <p className="text-purple-700 dark:text-purple-400 text-xs">
                  "$847 saved" and "50,000+ families" are specific, not rounded. 
                  Specific numbers increase trust by 27% vs generic claims.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-1.5 font-medium text-purple-800 dark:text-purple-300 mb-1">
                  <Globe className="w-3.5 h-3.5" /> SEO Structure
                </div>
                <p className="text-purple-700 dark:text-purple-400 text-xs">
                  H1 contains primary keyword "move" + modifier "AI-powered". 
                  Schema markup ready for FAQ rich snippets. Mobile-first layout for Core Web Vitals.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-medium text-purple-800 dark:text-purple-300 mb-1">
                  <Zap className="w-3.5 h-3.5" /> CTA Psychology
                </div>
                <p className="text-purple-700 dark:text-purple-400 text-xs">
                  Green buttons on dark backgrounds have 21% higher CTR. 
                  "Get My" uses possessive language increasing ownership feeling.
                </p>
              </div>
            </div>
          </div>
         </div>
         </div>
      
       {/* Popout Modal using DraggableModal */}
       <DraggableModal
         isOpen={isPopoutOpen}
         onClose={() => setIsPopoutOpen(false)}
         title={
           <div className="flex items-center gap-3">
             <Sparkles className="w-4 h-4 text-white" />
             <span className="text-white font-semibold">Landing Page Preview</span>
             <Badge className="bg-white/20 text-white border-white/30 text-xs">
               {LANDING_PAGE_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
             </Badge>
             {isSideBySide && (
               <Badge className="bg-green-500/30 text-green-200 border-green-400/30 text-xs">
                 Side-by-Side
               </Badge>
             )}
           </div>
         }
         storageKey="tm_landing_page_popout"
         defaultWidth={1200}
         defaultHeight={700}
         minWidth={600}
         minHeight={400}
         maxWidth={1800}
         maxHeight={1000}
         headerClassName="bg-gradient-to-r from-purple-600 to-purple-500"
         footer={
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
              {/* Left: Template Switcher */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-background rounded-lg border border-border p-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={goToPrevTemplate}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Select value={selectedTemplate} onValueChange={(v) => { setSelectedTemplate(v); setIsPublished(false); }}>
                    <SelectTrigger className="w-[140px] h-7 text-xs border-0 bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-[200]">
                      {LANDING_PAGE_TEMPLATES.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center justify-between gap-2 w-full">
                            <span>{template.name}</span>
                            <Badge variant="secondary" className="text-[9px] ml-1">{template.conversion}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7"
                    onClick={goToNextTemplate}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="h-6 w-px bg-border" />
                
                <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={() => setIsSideBySide(!isSideBySide)}
                  className={`h-7 text-xs ${isSideBySide ? 'bg-purple-100 dark:bg-purple-900/50' : ''}`}
               >
                  <BarChart3 className="w-3 h-3 mr-1" />
                 {isSideBySide ? 'Preview Only' : 'Side-by-Side'}
               </Button>
                <Select value={selectedTheme} onValueChange={(v) => { setSelectedTheme(v); setIsPublished(false); }}>
                  <SelectTrigger className="w-[120px] h-7 text-xs">
                    <Palette className="w-3 h-3 mr-1" />
                   <SelectValue placeholder="Theme" />
                 </SelectTrigger>
                  <SelectContent className="bg-popover z-[200]">
                   {COLOR_THEMES.map((colorTheme) => (
                     <SelectItem key={colorTheme.id} value={colorTheme.id}>
                       <div className="flex items-center gap-2">
                         <div 
                           className="w-4 h-4 rounded-full border border-border"
                           style={{ background: `linear-gradient(135deg, ${colorTheme.primary}, ${colorTheme.accent})` }}
                         />
                         {colorTheme.name}
                       </div>
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
              
              {/* Right: Export + Publish */}
             <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportAsHtml} className="h-7 gap-1 text-xs">
                  <Download className="w-3 h-3" /> HTML
               </Button>
                <Button variant="outline" size="sm" onClick={copyHtmlToClipboard} className="h-7 gap-1 text-xs">
                  <Copy className="w-3 h-3" /> Copy
               </Button>
               {importedData && (
                  <Button variant="outline" size="sm" onClick={exportAnalyticsPdf} className="h-7 gap-1 text-xs">
                    <FileText className="w-3 h-3" /> PDF
                 </Button>
               )}
                
                <div className="h-6 w-px bg-border" />
                
                {isPublished ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="h-8 gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.open("#", "_blank")}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Published
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5"
                      onClick={() => setShowDomainConnect(!showDomainConnect)}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {showDomainConnect ? 'Hide Domain' : 'Connect Domain'}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    className="h-8 gap-1.5"
                    style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}
                    onClick={handlePublish}
                    disabled={isPublishing}
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-3.5 h-3.5" />
                        Publish
                      </>
                    )}
                  </Button>
                )}
             </div>
           </div>
         }
       >
         {/* Domain Connection Panel (expandable) */}
         {showDomainConnect && isPublished && (
           <div className="border-b border-border bg-muted/30 p-4 shrink-0">
             <div className="max-w-xl mx-auto space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <Globe className="w-5 h-5 text-primary" />
                   <h4 className="font-semibold text-sm">Connect Custom Domain</h4>
                 </div>
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowDomainConnect(false)}>
                   <X className="w-3.5 h-3.5" />
                 </Button>
               </div>
               
               <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                 <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">🌐 Your page is live at:</p>
                 <code className="text-sm font-mono text-green-600 dark:text-green-400">
                   https://{businessName.toLowerCase().replace(/\s/g, '')}.lovable.app/{selectedTemplate}
                 </code>
               </div>
               
               <div className="space-y-2">
                 <label className="text-xs font-medium text-muted-foreground">Enter your custom domain:</label>
                 <div className="flex gap-2">
                   <Input 
                     value={domainInput}
                     onChange={(e) => setDomainInput(e.target.value)}
                     placeholder="moves.yourcompany.com"
                     className="h-9"
                   />
                   <Button 
                     onClick={handleVerifyDomain}
                     disabled={!domainInput || isVerifyingDomain}
                     className="h-9 gap-1.5"
                   >
                     {isVerifyingDomain ? (
                       <>
                         <Loader2 className="w-3.5 h-3.5 animate-spin" />
                         Verifying...
                       </>
                     ) : (
                       <>
                         <CheckCircle2 className="w-3.5 h-3.5" />
                         Verify DNS
                       </>
                     )}
                   </Button>
                 </div>
               </div>
               
               <div className="p-3 rounded-lg bg-muted border border-border">
                 <p className="text-xs font-medium text-foreground mb-2">DNS Configuration Required:</p>
                 <div className="font-mono text-xs text-muted-foreground space-y-1">
                   <p><span className="text-foreground font-medium">Type:</span> A Record</p>
                   <p><span className="text-foreground font-medium">Name:</span> @ (or subdomain)</p>
                   <p><span className="text-foreground font-medium">Value:</span> 185.158.133.1</p>
                 </div>
               </div>
               
               <div className="flex items-center justify-between">
                 <a 
                   href="https://docs.lovable.dev/features/custom-domain"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-xs text-primary hover:underline flex items-center gap-1"
                 >
                   📚 Full setup guide <ExternalLink className="w-3 h-3" />
                 </a>
                 <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" asChild>
                   <a href="https://www.godaddy.com/domains" target="_blank" rel="noopener noreferrer">
                     Get a Domain <ExternalLink className="w-3 h-3" />
                   </a>
                 </Button>
               </div>
               
               <p className="text-[10px] text-muted-foreground text-center">
                 ⏳ DNS propagation can take up to 72 hours
               </p>
             </div>
           </div>
         )}
         
         {/* Browser Chrome */}
         <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border shrink-0">
           <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-400" />
             <div className="w-3 h-3 rounded-full bg-amber-400" />
             <div className="w-3 h-3 rounded-full bg-green-400" />
           </div>
           <div className="flex-1 mx-4">
             <div className="bg-background rounded-md px-3 py-1.5 text-sm text-muted-foreground font-mono border border-border">
               https://{businessName.toLowerCase().replace(/\s/g, '')}.com/{selectedTemplate}
             </div>
           </div>
           {importedData && (
             <Button 
               variant={showHeatmapOverlay ? "default" : "outline"} 
               size="sm" 
               onClick={() => setShowHeatmapOverlay(!showHeatmapOverlay)}
               className="h-7 text-xs"
             >
               {showHeatmapOverlay ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
               Heatmap
             </Button>
           )}
         </div>
         
         {/* Content Area - Side by Side or Full */}
         {isSideBySide ? (
           <div className="flex flex-1 overflow-hidden">
             {/* Landing Page Preview */}
             <div className="flex-1 border-r border-border relative">
               <ScrollArea className="h-full">
                 {renderSelectedTemplate()}
               </ScrollArea>
               
               {/* Heatmap Overlay in side-by-side */}
               {showHeatmapOverlay && importedData && (
                 <div className="absolute inset-0 pointer-events-none z-20">
                   {getCurrentHeatmapPositions().map((pos, i) => {
                     const clickData = importedData.clickBehavior.find(c => c.element.toLowerCase().includes(pos.element.toLowerCase().split(' ')[0]));
                     const intensity = pos.intensity;
                     const colors = {
                       high: { bg: "rgba(239, 68, 68, 0.6)", shadow: "rgba(239, 68, 68, 0.4)", badge: "bg-red-600" },
                       medium: { bg: "rgba(249, 115, 22, 0.5)", shadow: "rgba(249, 115, 22, 0.3)", badge: "bg-amber-600" },
                       low: { bg: "rgba(59, 130, 246, 0.4)", shadow: "rgba(59, 130, 246, 0.2)", badge: "bg-blue-600" },
                     };
                     const color = colors[intensity];
                     
                     return (
                       <div 
                         key={pos.id}
                         className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg ${intensity === 'high' ? 'animate-pulse' : ''}`}
                         style={{ 
                           top: pos.top,
                           left: pos.left,
                           width: pos.width,
                           height: pos.height,
                           background: `radial-gradient(ellipse, ${color.bg} 0%, ${color.bg.replace('0.6', '0.2').replace('0.5', '0.15').replace('0.4', '0.1')} 40%, transparent 70%)`,
                           boxShadow: intensity === 'high' ? `0 0 40px 20px ${color.shadow}` : undefined
                         }}
                       >
                         <div className={`absolute -top-6 left-1/2 -translate-x-1/2 ${color.badge} text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium`}>
                           {intensity === 'high' ? '🔥' : intensity === 'medium' ? '⚡' : '❄️'} {clickData?.percentage || ((5 - i) * 8)}% clicks
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}
             </div>
             
             {/* Analytics Panel */}
             <div className="w-[380px] flex flex-col bg-muted/30">
               <div className="p-3 border-b border-border bg-card shrink-0">
                 <div className="flex items-center justify-between">
                   <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                     <BarChart3 className="w-4 h-4 text-purple-500" />
                     Analytics & SEO
                   </h4>
                 </div>
               </div>
               
               <ScrollArea className="flex-1">
                 <div className="p-3 space-y-4">
                   {/* Quick Stats */}
                   {importedData && (
                     <div className="grid grid-cols-3 gap-2">
                       <div className="p-2 rounded-lg bg-card border border-border text-center">
                         <p className="text-lg font-bold text-foreground">{(importedData.totalClicks / 1000).toFixed(1)}K</p>
                         <p className="text-[10px] text-muted-foreground">Clicks</p>
                       </div>
                       <div className="p-2 rounded-lg bg-card border border-border text-center">
                         <p className="text-lg font-bold text-green-600">{importedData.totalConversions.toLocaleString()}</p>
                         <p className="text-[10px] text-muted-foreground">Conversions</p>
                       </div>
                       <div className="p-2 rounded-lg bg-card border border-border text-center">
                         <p className="text-lg font-bold text-blue-600">${(importedData.totalRevenue / 1000).toFixed(0)}K</p>
                         <p className="text-[10px] text-muted-foreground">Revenue</p>
                       </div>
                     </div>
                   )}
                   
                   {/* Top Keywords */}
                   {importedData && (
                     <div className="p-3 rounded-xl border border-border bg-card">
                       <div className="flex items-center gap-2 mb-2">
                         <Target className="w-4 h-4 text-green-500" />
                         <h5 className="font-semibold text-xs text-foreground">Top Keywords</h5>
                       </div>
                       <div className="space-y-2">
                         {importedData.keywords.slice(0, 4).map((kw, i) => (
                           <div key={i} className="flex items-center justify-between text-xs">
                             <span className="text-muted-foreground truncate flex-1">{kw.keyword}</span>
                             <div className="flex items-center gap-2">
                               <span className="text-green-600 font-medium">{kw.conversions}</span>
                               {kw.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                               {kw.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   {/* Click Behavior */}
                   {importedData && (
                     <div className="p-3 rounded-xl border border-border bg-card">
                       <div className="flex items-center gap-2 mb-2">
                         <MousePointerClick className="w-4 h-4 text-red-500" />
                         <h5 className="font-semibold text-xs text-foreground">Click Behavior</h5>
                       </div>
                       <div className="space-y-2">
                         {importedData.clickBehavior.slice(0, 4).map((click, i) => (
                           <div key={i} className="flex items-center justify-between text-xs">
                             <div className="flex items-center gap-1.5">
                               <span 
                                 className={`w-2 h-2 rounded-full ${
                                   click.heatmapIntensity === 'high' ? 'bg-red-500' :
                                   click.heatmapIntensity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                                 }`}
                               />
                               <span className="text-muted-foreground truncate">{click.element}</span>
                             </div>
                             <span className="font-medium text-foreground">{click.percentage}%</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   {/* AI Insights */}
                   <div className="p-3 rounded-xl border border-purple-200 bg-purple-50 dark:bg-purple-950/30 dark:border-purple-800">
                     <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="w-4 h-4 text-purple-500" />
                       <h5 className="font-semibold text-xs text-purple-900 dark:text-purple-200">AI Insights</h5>
                     </div>
                     <div className="space-y-2 text-[10px] text-purple-700 dark:text-purple-300">
                       <p>• "Stop Overpaying" triggers loss aversion (2x more powerful)</p>
                       <p>• Specific numbers ($847) increase trust by 27%</p>
                       <p>• Green CTAs on dark backgrounds have 21% higher CTR</p>
                     </div>
                   </div>
                   
                   {!importedData && (
                     <div className="p-4 text-center border-2 border-dashed border-border rounded-xl">
                       <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                       <p className="text-xs text-muted-foreground">No analytics data imported</p>
                       <p className="text-[10px] text-muted-foreground mt-1">Import before generating to see insights</p>
                     </div>
                   )}
                 </div>
               </ScrollArea>
             </div>
           </div>
         ) : (
           /* Full width preview only */
           <ScrollArea className="flex-1">
             {renderSelectedTemplate()}
           </ScrollArea>
         )}
       </DraggableModal>
     </>
   );
 }

  const handleProceedToCreate = () => {
    // Pre-populate from analytics data
    setTargetLocation("California, Texas, Florida");
    setTargetAudience("Homeowners 35-54 (Desktop 62%)");
    setMainView('create');
  };

  const handleEditPage = (pageId: string) => {
    // Switch to create view to edit existing page
    setMainView('create');
    // Would load page data here
  };

  return (
     <div className="space-y-4">
      {/* View Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/50 border border-border">
        <button
          onClick={() => setMainView('analytics')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            mainView === 'analytics' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics & Insights
          </span>
        </button>
        <button
          onClick={() => setMainView('create')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            mainView === 'create' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Create Page
          </span>
        </button>
        <button
          onClick={() => setMainView('manage')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
            mainView === 'manage' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            Manage Pages
          </span>
        </button>
      </div>

      {/* Analytics Dashboard View */}
      {mainView === 'analytics' && (
        <MarketingAnalyticsDashboard onProceedToCreate={handleProceedToCreate} />
      )}

      {/* Landing Page Board View */}
      {mainView === 'manage' && (
        <LandingPageBoard 
          onCreateNew={() => setMainView('create')} 
          onEditPage={handleEditPage}
          pages={managedPages}
          onPagesChange={setManagedPages}
        />
      )}

      {/* Create Page View */}
      {mainView === 'create' && (
      <>
       {/* Intro Card */}
       <div className="p-6 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-700">
         <div className="flex items-start gap-4">
           <div 
             className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
             style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}
           >
             <Sparkles className="w-6 h-6 text-white" />
           </div>
           <div className="flex-1">
             <h3 className="text-lg font-bold text-foreground mb-2">AI Landing Page Generator</h3>
             <p className="text-sm text-muted-foreground mb-4">
               Tell our AI about your business and target audience, and it will generate a high-converting 
               landing page like the pros at ClickFunnels or Unbounce would create — complete with 
               persuasive copy, trust signals, and optimized CTAs.
             </p>
             <div className="flex flex-wrap gap-2 text-xs">
               <Badge variant="secondary" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Conversion-Optimized</Badge>
               <Badge variant="secondary" className="gap-1"><Zap className="w-3 h-3" /> Instant Generation</Badge>
               <Badge variant="secondary" className="gap-1"><TrendingUp className="w-3 h-3" /> A/B Test Ready</Badge>
              <Badge variant="secondary" className="gap-1"><Pencil className="w-3 h-3" /> Inline Editing</Badge>
             </div>
           </div>
         </div>
       </div>
 
      {/* Template Selection */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs font-bold">1</span>
          Choose a template style
        </h4>
        
        <div className="grid grid-cols-3 gap-3">
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
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-foreground">{template.name}</span>
                <Badge variant="secondary" className="text-[9px]">{template.conversion}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{template.description}</p>
              <span className="text-[10px] text-purple-600 dark:text-purple-400">{template.style}</span>
            </button>
          ))}
        </div>
      </div>

       {/* Input Form */}
       <div className="rounded-xl border border-border bg-card p-5">
         <h4 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs font-bold">2</span>
          Tell us about your business
         </h4>
         
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
               Business Name
             </label>
             <Input 
               value={businessName}
               onChange={(e) => setBusinessName(e.target.value)}
               placeholder="Your company name"
             />
           </div>
           
           <div>
             <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Target Location(s)
             </label>
             <Input 
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              placeholder="Cities, states, or regions"
             />
           </div>
           
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Target Audience
            </label>
            <Input 
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Who are you trying to reach?"
            />
          </div>
          
          <div className="col-span-2">
             <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
               Main Offer / Value Proposition
             </label>
             <Textarea 
               value={mainOffer}
               onChange={(e) => setMainOffer(e.target.value)}
               placeholder="What's the main benefit you're offering?"
               rows={2}
             />
           </div>
         </div>
       </div>
 
       {/* Step 3: Import Analytics Data (Optional) */}
       <div className="rounded-xl border border-border bg-card p-5">
         <h4 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
           <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs font-bold">3</span>
           Import Analytics Data
           <Badge variant="secondary" className="text-[10px] ml-1">Optional</Badge>
         </h4>
         
         {!importedData ? (
           <div className="space-y-4">
             <p className="text-xs text-muted-foreground">
               Import your existing campaign data to auto-populate fields and enable data-driven generation.
             </p>
             
             <div className="grid grid-cols-3 gap-3">
               <button 
                 onClick={handleImportData}
                 className="p-4 rounded-xl border border-border bg-card hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all text-center group"
               >
                 <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                   <BarChart3 className="w-5 h-5 text-blue-600" />
                 </div>
                 <p className="font-medium text-sm text-foreground">Google Ads</p>
                 <p className="text-xs text-muted-foreground">Import campaigns</p>
               </button>
               <button 
                 onClick={handleImportData}
                 className="p-4 rounded-xl border border-border bg-card hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/30 transition-all text-center group"
               >
                 <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                   <PieChart className="w-5 h-5 text-orange-600" />
                 </div>
                 <p className="font-medium text-sm text-foreground">Analytics</p>
                 <p className="text-xs text-muted-foreground">Import behavior</p>
               </button>
               <button 
                 onClick={handleImportData}
                 className="p-4 rounded-xl border border-border bg-card hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-all text-center group"
               >
                 <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                   <Upload className="w-5 h-5 text-green-600" />
                 </div>
                 <p className="font-medium text-sm text-foreground">Upload CSV</p>
                 <p className="text-xs text-muted-foreground">Custom data</p>
               </button>
             </div>
             
             <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
               <Database className="w-4 h-4 text-muted-foreground flex-shrink-0" />
               <p className="text-xs text-muted-foreground">
                 <strong>Demo Mode:</strong> Click any source to load sample data with 24,847 clicks and 1,892 conversions.
               </p>
             </div>
           </div>
         ) : (
           <div className="space-y-3">
             {/* Imported Data Summary */}
             <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                   <CheckCircle2 className="w-4 h-4 text-white" />
                 </div>
                 <div>
                   <p className="font-medium text-sm text-green-900 dark:text-green-200">Data Imported Successfully</p>
                   <p className="text-xs text-green-600 dark:text-green-400">{importedData.dateRange}</p>
                 </div>
               </div>
               <Button 
                 variant="ghost" 
                 size="sm" 
                 onClick={() => setImportedData(null)}
                 className="text-green-700 hover:text-green-900 hover:bg-green-100 dark:hover:bg-green-900/50"
               >
                 <X className="w-4 h-4" />
               </Button>
             </div>
             
             {/* Quick Stats */}
             <div className="grid grid-cols-3 gap-3">
               <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                 <p className="text-xl font-bold text-foreground">{importedData.totalClicks.toLocaleString()}</p>
                 <p className="text-xs text-muted-foreground">Total Clicks</p>
               </div>
               <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                 <p className="text-xl font-bold text-green-600">{importedData.totalConversions.toLocaleString()}</p>
                 <p className="text-xs text-muted-foreground">Conversions</p>
               </div>
               <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                 <p className="text-xl font-bold text-blue-600">${(importedData.totalRevenue / 1000).toFixed(1)}K</p>
                 <p className="text-xs text-muted-foreground">Revenue</p>
               </div>
             </div>
             
             {/* Auto-populated info */}
             <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
               <div className="flex items-start gap-2">
                 <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                 <div className="text-xs text-purple-700 dark:text-purple-300">
                   <p className="font-medium mb-1">Fields auto-populated from data:</p>
                   <ul className="space-y-0.5">
                     <li>• Target Location: Top 3 geographic markets</li>
                     <li>• Target Audience: Highest converting demographic</li>
                   </ul>
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>
 
       {/* Generate Button */}
       <Button 
         onClick={handleGenerateLandingPage}
         disabled={isGenerating || generationStep > 0}
         className="w-full py-6 text-lg font-bold gap-2 text-white"
         style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}
       >
         {generationStep > 0 ? (
           <>
             <RefreshCw className="w-5 h-5 animate-spin" />
             {generationStep === 1 && "Analyzing your inputs..."}
             {generationStep === 2 && "Generating headline copy..."}
             {generationStep === 3 && "Building page structure..."}
             {generationStep === 4 && "Adding trust elements..."}
             {generationStep === 5 && "Optimizing for conversions..."}
           </>
         ) : (
           <>
             <Sparkles className="w-5 h-5" />
             {importedData ? (
               <>Generate Data-Driven Landing Page</>
             ) : (
               <>Generate Landing Page with AI</>
             )}
           </>
         )}
       </Button>
 
       {/* Generation Steps Indicator */}
       {generationStep > 0 && (
         <div className="p-4 rounded-xl border border-border bg-card">
           <div className="space-y-2">
             {[
               { step: 1, label: "Analyzing inputs" },
               { step: 2, label: "Generating headline copy" },
               { step: 3, label: "Building page structure" },
               { step: 4, label: "Adding trust elements" },
               { step: 5, label: "Optimizing for conversions" },
             ].map((item) => (
               <div 
                 key={item.step} 
                 className={`flex items-center gap-2 text-sm transition-all ${
                   generationStep >= item.step ? "text-foreground" : "text-muted-foreground/50"
                 }`}
               >
                 {generationStep > item.step ? (
                   <CheckCircle2 className="w-4 h-4 text-green-500" />
                 ) : generationStep === item.step ? (
                   <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
                 ) : (
                   <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
                 )}
                 {item.label}
               </div>
             ))}
           </div>
         </div>
       )}
      </>
      )}
     </div>
   );
 }