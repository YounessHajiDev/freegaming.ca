import { supabase } from './supabase'
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js'

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
    let message = error.message
    if (error instanceof FunctionsHttpError) {
      try {
        const ctx = await error.context.json()
        message = ctx?.error ?? error.message
      } catch {
        // keep generic message
      }
    } else if (error instanceof FunctionsRelayError) {
      message = `Relay error: ${error.message}`
    } else if (error instanceof FunctionsFetchError) {
      message = `Fetch error: ${error.message}`
    }
    return { success: false, offers: [], error: message }
  }

  return data ?? { success: false, offers: [], error: 'Empty response' }
}
