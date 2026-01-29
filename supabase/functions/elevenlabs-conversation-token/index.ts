import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "ElevenLabs API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get agent ID from request body (optional - can be hardcoded if only one agent)
    let agentId: string | undefined;
    try {
      const body = await req.json();
      agentId = body.agentId;
    } catch {
      // No body provided, that's OK
    }

    // Use provided agent ID or fall back to environment variable
    const ELEVENLABS_AGENT_ID = agentId || Deno.env.get("ELEVENLABS_AGENT_ID");
    
    if (!ELEVENLABS_AGENT_ID) {
      console.error("No agent ID provided and ELEVENLABS_AGENT_ID not configured");
      return new Response(
        JSON.stringify({ error: "Agent ID not configured. Please provide agentId in request body or set ELEVENLABS_AGENT_ID environment variable." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching signed URL for agent:", ELEVENLABS_AGENT_ID);

    // Fetch a signed URL for WebSocket connection (text-only agents)
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `ElevenLabs API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Successfully obtained signed URL");

    return new Response(
      JSON.stringify({ signed_url: data.signed_url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating conversation token:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Failed to generate conversation token", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
