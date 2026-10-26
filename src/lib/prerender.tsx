import { createContext, useContext, type ReactNode } from 'react'

type PrerenderData = Record<string, unknown>

const PrerenderContext = createContext<PrerenderData>({})

export function PrerenderProvider({ data, children }: { data: PrerenderData; children: ReactNode }) {
  return <PrerenderContext.Provider value={data}>{children}</PrerenderContext.Provider>
}

/** Data embedded in the statically prerendered HTML for the initial route (undefined after client navigation). */
export function usePrerenderData<T>(key: string): T | undefined {
  return useContext(PrerenderContext)[key] as T | undefined
}

export function readPrerenderData(): PrerenderData {
  const el = typeof document !== 'undefined' ? document.getElementById('__PRERENDER_DATA__') : null
  if (!el?.textContent) return {}
  try {
    const parsed = JSON.parse(el.textContent) as { path: string; data: PrerenderData }
    const here = window.location.pathname.replace(/\/+$/, '') || '/'
    const there = parsed.path.replace(/\/+$/, '') || '/'
    return here === there ? parsed.data : {}
  } catch {
    return {}
  }
}
