import { supabase } from './supabase'

export interface OGAdsOffer {
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

export interface OGAdsOffersResponse {
  success: boolean
  offers: OGAdsOffer[]
  error?: string
}

export async function fetchOGAdsOffers(
  options: { max?: number; ctype?: number } = {},
): Promise<OGAdsOffersResponse> {
  const userAgent = navigator.userAgent

  const { data, error } = await supabase.functions.invoke<OGAdsOffersResponse>('ogads-offers', {
    body: { user_agent: userAgent, max: options.max ?? 20, ctype: options.ctype },
  })

  if (error) {
    return { success: false, offers: [], error: error.message }
  }

  return data ?? { success: false, offers: [], error: 'Empty response' }
}
