import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SITE = "https://www.freegaming.ca";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  // Fetch all active game slugs + updated timestamps
  const gameRows: { slug: string; updated_at: string }[] = [];
  const PAGE = 1000;
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from("games")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .range(offset, offset + PAGE - 1);
    if (error || !data || data.length === 0) break;
    gameRows.push(...data);
    if (data.length < PAGE) break;
    offset += PAGE;
  }

  // Fetch all category slugs
  const { data: categories } = await supabase
    .from("categories")
    .select("slug");
  const catSlugs: string[] = (categories ?? []).map((c: { slug: string }) => c.slug);

  const today = new Date().toISOString().split("T")[0];

  const urls: string[] = [];

  // Static pages
  const staticPages = [
    { loc: `${SITE}/`, changefreq: "daily",  priority: "1.0",  lastmod: today },
    { loc: `${SITE}/popular/`, changefreq: "daily",  priority: "0.8",  lastmod: today },
    { loc: `${SITE}/new-games/`, changefreq: "daily",  priority: "0.8",  lastmod: today },
    { loc: `${SITE}/free-games/`, changefreq: "weekly", priority: "0.9",  lastmod: today },
    { loc: `${SITE}/unblocked-games/`, changefreq: "weekly", priority: "0.9",  lastmod: today },
    { loc: `${SITE}/games-for-kids/`, changefreq: "weekly", priority: "0.9",  lastmod: today },
    { loc: `${SITE}/2-player-games/`, changefreq: "weekly", priority: "0.9",  lastmod: today },
    { loc: `${SITE}/play-online/`, changefreq: "weekly", priority: "0.9",  lastmod: today },
    { loc: `${SITE}/about/`, changefreq: "monthly", priority: "0.4",  lastmod: today },
    { loc: `${SITE}/contact/`, changefreq: "monthly", priority: "0.4",  lastmod: today },
    { loc: `${SITE}/privacy-policy/`, changefreq: "monthly", priority: "0.3",  lastmod: today },
    { loc: `${SITE}/terms-of-service/`, changefreq: "monthly", priority: "0.3",  lastmod: today },
  ];

  for (const p of staticPages) {
    urls.push(
      `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
    );
  }

  // Category pages
  for (const slug of catSlugs) {
    urls.push(
      `  <url>\n    <loc>${SITE}/category/${slug}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    );
  }

  // Game pages
  for (const row of gameRows) {
    const lastmod = row.updated_at
      ? row.updated_at.split("T")[0]
      : today;
    urls.push(
      `  <url>\n    <loc>${SITE}/games/${row.slug}/</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
    );
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
});
