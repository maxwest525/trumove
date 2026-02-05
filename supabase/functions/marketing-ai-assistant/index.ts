 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 interface ChatMessage {
   role: "user" | "assistant" | "system";
   content: string;
 }
 
 interface MarketingRequest {
   messages: ChatMessage[];
   generateImage?: boolean;
   imagePrompt?: string;
 }
 
 const SYSTEM_PROMPT = `You are Trudy, TruMove's AI Marketing Assistant. You help users create marketing assets, design ads, build landing pages, and launch campaigns.
 
 Your capabilities:
 1. CREATE ADS: Generate ad copy for Google Ads, Meta (Facebook/Instagram), TikTok
 2. DESIGN LANDING PAGES: Provide content, headlines, CTAs for landing pages
 3. GENERATE IMAGES: When users request specific imagery (like "ad with a llama"), you can create images
 4. KEYWORD RESEARCH: Suggest high-intent keywords for moving services
 5. CAMPAIGN OPTIMIZATION: Provide tips to improve CTR, reduce CPC, increase conversions
 6. LAUNCH GUIDANCE: Step-by-step instructions for launching on each platform
 
 Brand Voice: Professional yet friendly. Emphasize trust, reliability, AI-powered technology.
 Key Stats to mention: 50,000+ moves completed, 4.9/5 rating, real-time tracking, no hidden fees.
 
 When creating ads:
 - Headlines: Max 30 characters for Google Ads, 40 for Meta
 - Descriptions: Max 90 characters for Google Ads, 125 for Meta
 - Always include a clear CTA
 - Reference trust signals (ratings, move count, guarantees)
 
 When users ask for images with specific elements (animals, themes, etc.), describe that you'll generate the image and provide the creative concept.
 
 For launch guidance, provide platform-specific steps:
 - Google Ads: ads.google.com → New Campaign → Search/Display → Budget → Keywords
 - Meta/Facebook: business.facebook.com → Ads Manager → Create → Objective → Audience
 - TikTok: ads.tiktok.com → Campaign → Ad Group → Creative
 
 Be concise, actionable, and always offer next steps.`;
 
 serve(async (req) => {
   // Handle CORS preflight
   if (req.method === "OPTIONS") {
     return new Response("ok", { headers: corsHeaders });
   }
 
   try {
     const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
     if (!LOVABLE_API_KEY) {
       console.error("LOVABLE_API_KEY is not configured");
       throw new Error("AI service not configured");
     }
 
     const { messages, generateImage, imagePrompt }: MarketingRequest = await req.json();
     console.log("Marketing AI request:", { messageCount: messages?.length, generateImage, imagePrompt });
 
     // If image generation is requested
     if (generateImage && imagePrompt) {
       console.log("Generating image with prompt:", imagePrompt);
       
       const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
         method: "POST",
         headers: {
           Authorization: `Bearer ${LOVABLE_API_KEY}`,
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           model: "google/gemini-2.5-flash-image",
           messages: [
             { 
               role: "user", 
               content: `Create a professional marketing advertisement image for a moving company called TruMove. The ad should feature: ${imagePrompt}. Style: Modern, clean, professional. Colors: Include purple (#7C3AED) accents. Make it suitable for digital advertising on Google, Facebook, and Instagram.`
             }
           ],
           modalities: ["image", "text"]
         }),
       });
 
       if (!imageResponse.ok) {
         const errorText = await imageResponse.text();
         console.error("Image generation error:", imageResponse.status, errorText);
         
         if (imageResponse.status === 429) {
           return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
             status: 429,
             headers: { ...corsHeaders, "Content-Type": "application/json" },
           });
         }
         if (imageResponse.status === 402) {
           return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
             status: 402,
             headers: { ...corsHeaders, "Content-Type": "application/json" },
           });
         }
         throw new Error("Failed to generate image");
       }
 
       const imageData = await imageResponse.json();
       const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
       const imageDescription = imageData.choices?.[0]?.message?.content || "Image generated successfully";
       
       console.log("Image generated:", generatedImage ? "success" : "no image returned");
       
       return new Response(JSON.stringify({ 
         type: "image",
         image: generatedImage,
         description: imageDescription
       }), {
         headers: { ...corsHeaders, "Content-Type": "application/json" },
       });
     }
 
     // Text-based chat with streaming
     console.log("Starting text chat stream");
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
           ...messages,
         ],
         stream: true,
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
 
     // Return streaming response
     return new Response(response.body, {
       headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
     });
 
   } catch (error) {
     console.error("Marketing AI error:", error);
     return new Response(
       JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
       { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
     );
   }
 });