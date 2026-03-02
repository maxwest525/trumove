// Types for PPC Demo components

export interface Keyword {
  keyword: string;
  volume: number;
  cpc: string;
  competition: string;
  score: number;
  trend: string;
}

export interface Ad {
  id: number;
  headline: string;
  description: string;
  status: string;
  clicks: number;
  impressions: number;
  ctr: number;
  spend: number;
  conversions: number;
}

export interface ABTestVariant {
  name: string;
  visitors: number;
  conversions: number;
  rate: number;
}

export interface ABTest {
  id: number;
  name: string;
  status: "running" | "completed" | "paused";
  startDate: string;
  variants: ABTestVariant[];
  winner: string;
  confidence: number;
  lift: string;
}

export interface ConversionEvent {
  event: string;
  count: number;
  trend: string;
  value: string;
  source: string;
}

export interface FunnelStage {
  stage: string;
  count: number;
  rate: number;
}

export interface Stats {
  totalSpend: number;
  clicks: number;
  conversions: number;
  costPerConv: number;
}

export interface SEOIssue {
  type: string;
  message: string;
  impact: string;
}

export interface LandingPageTemplate {
  id: number;
  name: string;
  conversion: string;
  thumbnail: string;
}
