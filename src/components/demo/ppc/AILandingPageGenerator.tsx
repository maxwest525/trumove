 import { useState } from "react";
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
  Download, Palette, Copy
 } from "lucide-react";
 import logoImg from "@/assets/logo.png";
 
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
    <div className="bg-white dark:bg-slate-900">
      {/* Hero Section - Dark with green CTAs */}
      <div 
        className="relative px-8 py-16 text-center"
        style={{ background: `linear-gradient(135deg, ${theme.secondary} 0%, #1E293B 50%, ${theme.secondary} 100%)` }}
      >
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            FMCSA Licensed
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ⭐ 4.9/5 Rating
          </Badge>
        </div>

        <img src={logoImg} alt="TruMove" className="h-10 mx-auto mb-6 brightness-0 invert" />
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          <EditableText sectionId="main-headline" as="span" className="block" /><br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, ${theme.primary}, ${theme.accentLight})` }}>
            <EditableText sectionId="sub-headline" as="span" />
          </span>
        </h1>
        
        <div className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
          <EditableText sectionId="hero-body" as="p" />
        </div>

        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="space-y-3 mb-4">
            <Input placeholder="Moving from (ZIP code)" className="bg-white/90 border-0 text-slate-900" />
            <Input placeholder="Moving to (ZIP code)" className="bg-white/90 border-0 text-slate-900" />
          </div>
          <Button className="w-full py-6 text-lg font-bold gap-2" style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)` }}>
            <EditableText sectionId="cta-primary" as="span" /> <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-xs text-slate-400 mt-3">🔒 No credit card required • Instant results</p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 text-slate-400 text-sm">
          <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Price Lock Guarantee</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 60-Second Quotes</span>
          <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 50,000+ Moves</span>
        </div>
      </div>

      {/* Social Proof Strip */}
      <div className="bg-slate-50 dark:bg-slate-800 py-4 px-8 border-y border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center gap-8 text-sm">
          <span className="text-slate-600 dark:text-slate-400">As featured in:</span>
          <span className="font-bold text-slate-400">Forbes</span>
          <span className="font-bold text-slate-400">Inc.</span>
          <span className="font-bold text-slate-400">TechCrunch</span>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-12 px-8">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">Get Your Quote in 3 Simple Steps</h2>
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { step: "1", title: "Enter Your Route", desc: "Tell us where you're moving", icon: MapPin },
            { step: "2", title: "AI Scans Your Home", desc: "Instant inventory estimate", icon: Zap },
            { step: "3", title: "Compare & Book", desc: "Choose verified carriers", icon: CheckCircle2 },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl" style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%)` }}>
                {item.step}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
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
             <Button size="sm" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
               Publish Page
             </Button>
           </div>
         </div>
 
         {/* Generated Landing Page Preview */}
         <div className="rounded-xl border-2 border-purple-300 overflow-hidden shadow-lg">
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
          <ScrollArea className="h-[450px]">
              {renderSelectedTemplate()}
           </ScrollArea>
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
     );
   }
 
   return (
     <div className="space-y-4">
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
 
       {/* Generate Button */}
       <Button 
         onClick={handleGenerateLandingPage}
         disabled={isGenerating || generationStep > 0}
         className="w-full py-6 text-lg font-bold gap-2"
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
             Generate Landing Page with AI
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
     </div>
   );
 }