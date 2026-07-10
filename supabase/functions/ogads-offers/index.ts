import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const apiKey = Deno.env.get("OGADS_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ success: false, error: "OGAds API key not configured", offers: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Extract visitor IP — check standard forwarding headers
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "1.1.1.1";

  const userAgent =
    req.headers.get("x-visitor-user-agent") ||
    req.headers.get("user-agent") ||
    "Mozilla/5.0";

  // Parse optional query params
  const url = new URL(req.url);
  const max = url.searchParams.get("max") || "8";
  const ctype = url.searchParams.get("ctype") || ""; // 1=CPI, 2=CPA, 4=PIN, 8=VID

  const params: Record<string, string> = {
    ip,
    user_agent: userAgent,
    max,
  };
  if (ctype) params.ctype = ctype;

  const apiUrl = "https://saveapp.store/api/v2?" + new URLSearchParams(params).toString();

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `OGAds API error: ${res.status}`, offers: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "no-store", // Offer availability changes frequently
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Fetch failed", offers: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
