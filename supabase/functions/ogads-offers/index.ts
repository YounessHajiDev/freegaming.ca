import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

const OGADS_ENDPOINT = 'https://saveapp.store/api/v2'

interface Offer {
  id: number
  name: string
  description: string
  payout: number
  icon: string
  link: string
  country: string
  device: string
  category: string
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || req.headers.get('cf-connecting-ip') || ''
}

function normalizeOffers(data: unknown): Offer[] {
  const raw = Array.isArray(data) ? data : (data as Record<string, unknown>)?.offers
  if (!Array.isArray(raw)) return []

  return raw.map((o: any) => ({
    id: o.offerid ?? o.id ?? 0,
    name: o.name_short ?? o.nameShort ?? o.name ?? '',
    description: o.adcopy ?? o.description ?? '',
    payout: parseFloat(o.payout) || 0,
    icon: o.picture ?? o.image ?? o.creative ?? o.icon ?? '',
    link: o.link ?? o.url ?? o.tracking_url ?? '',
    country: o.country ?? '',
    device: o.device ?? '',
    category: o.ctype ?? o.category ?? '',
  }))
}

function isMobileUA(ua: string): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS })
  }

  try {
    const apiKey = Deno.env.get('OGADS_API_KEY')
    if (!apiKey) {
      throw new Error('OGADS_API_KEY is not configured')
    }

    const body = await req.json().catch(() => ({})) as {
      ip?: string
      user_agent?: string
      ctype?: number
      max?: number
      aff_sub4?: string
      aff_sub5?: string
    }

    const userAgent = body.user_agent ?? req.headers.get('user-agent') ?? ''
    const ip = body.ip ?? getClientIP(req)

    if (!ip || !userAgent) {
      return new Response(
        JSON.stringify({ success: false, error: 'ip and user_agent are required' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      )
    }

    // Default to CPI (1) for mobile devices. For desktop ctype has no effect per OGAds docs,
    // so we include all offer types (CPI+CPA+PIN+VID = 15) as a fallback.
    const uaLower = userAgent.toLowerCase()
    const isMobile = isMobileUA(uaLower)
    const ctype = body.ctype ?? (isMobile ? 1 : 15)
    const max = Math.min(body.max ?? 20, 100)

    const url = new URL(OGADS_ENDPOINT)
    url.searchParams.set('ip', ip)
    url.searchParams.set('user_agent', userAgent)
    url.searchParams.set('ctype', String(ctype))
    url.searchParams.set('max', String(max))
    if (body.aff_sub4) url.searchParams.set('aff_sub4', body.aff_sub4)
    if (body.aff_sub5) url.searchParams.set('aff_sub5', body.aff_sub5)

    const ogadsRes = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(20000),
    })

    if (!ogadsRes.ok) {
      throw new Error(`OGAds returned HTTP ${ogadsRes.status}`)
    }

    const data = await ogadsRes.json()
    const offers = normalizeOffers(data)

    return new Response(
      JSON.stringify({ success: true, offers }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        offers: [],
      }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }
})
