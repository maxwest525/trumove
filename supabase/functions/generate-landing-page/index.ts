import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LandingPageRequest {
  prompt: string;
  businessName?: string;
  location?: string;
  targetAudience?: string;
  keywords?: string[];
}

const SYSTEM_PROMPT = `You are a landing page content generator for moving companies. Generate high-converting landing page content based on the user's description.

Return a JSON response with this exact structure (no markdown, just valid JSON):
{
  "headline": "Main headline (max 60 chars)",
  "subheadline": "Supporting headline (max 120 chars)",
  "heroDescription": "2-3 sentence value proposition",
  "ctaText": "Primary call-to-action button text (max 20 chars)",
  "ctaSecondary": "Secondary CTA text (max 25 chars)",
  "benefits": [
    {"icon": "shield", "title": "Benefit 1 Title", "description": "Short benefit description"},
    {"icon": "truck", "title": "Benefit 2 Title", "description": "Short benefit description"},
    {"icon": "star", "title": "Benefit 3 Title", "description": "Short benefit description"}
  ],
  "testimonial": {
    "quote": "A compelling customer testimonial",
    "author": "Customer Name",
    "location": "City, State"
  },
  "stats": [
    {"value": "50,000+", "label": "Moves Completed"},
    {"value": "4.9/5", "label": "Customer Rating"},
    {"value": "24/7", "label": "Support Available"}
  ],
  "faqItems": [
    {"question": "FAQ question 1?", "answer": "Concise answer"},
    {"question": "FAQ question 2?", "answer": "Concise answer"}
  ],
  "metaTitle": "SEO title (max 60 chars)",
  "metaDescription": "SEO description (max 160 chars)"
}

Guidelines:
- Use action-oriented language
- Emphasize trust signals (ratings, guarantees, experience)
- Include location-specific content when provided
- Target the specified audience's pain points
- Make CTAs compelling and urgent
- Use power words: Free, Guaranteed, Trusted, Fast, Easy

Icons available: shield, truck, star, clock, dollar, map, phone, check, heart, home`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service not configured");
    }

    const { prompt, businessName, location, targetAudience, keywords }: LandingPageRequest = await req.json();
    console.log("Landing page generation request:", { prompt, businessName, location, targetAudience, keywords });

    // Build context-aware prompt
    let userPrompt = `Generate landing page content for a moving company.

User Request: ${prompt}`;

    if (businessName) {
      userPrompt += `\nBusiness Name: ${businessName}`;
    }
    if (location) {
      userPrompt += `\nTarget Location: ${location}`;
    }
    if (targetAudience) {
      userPrompt += `\nTarget Audience: ${targetAudience}`;
    }
    if (keywords && keywords.length > 0) {
      userPrompt += `\nKeywords to incorporate: ${keywords.join(', ')}`;
    }

    userPrompt += `\n\nGenerate compelling, conversion-focused content. Return only valid JSON, no markdown formatting.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    // Parse the JSON response
    let landingPageContent;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content;
      if (content.includes('```json')) {
        cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (content.includes('```')) {
        cleanContent = content.replace(/```\n?/g, '');
      }
      landingPageContent = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return a fallback structure
      landingPageContent = {
        headline: businessName ? `${businessName} - Your Trusted Moving Partner` : "Your Trusted Moving Partner",
        subheadline: "Get a free quote in 60 seconds",
        heroDescription: content.slice(0, 200),
        ctaText: "Get Free Quote",
        ctaSecondary: "Call Now",
        benefits: [
          { icon: "shield", title: "Licensed & Insured", description: "Full protection for your belongings" },
          { icon: "truck", title: "Professional Team", description: "Trained and vetted movers" },
          { icon: "star", title: "5-Star Service", description: "Thousands of happy customers" }
        ],
        stats: [
          { value: "50,000+", label: "Moves Completed" },
          { value: "4.9/5", label: "Customer Rating" },
          { value: "24/7", label: "Support" }
        ],
        metaTitle: businessName ? `${businessName} - Professional Moving Services` : "Professional Moving Services",
        metaDescription: "Get a free moving quote today. Licensed, insured, and trusted by thousands."
      };
    }

    console.log("Landing page content generated successfully");

    return new Response(JSON.stringify({ 
      success: true,
      content: landingPageContent,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Landing page generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
