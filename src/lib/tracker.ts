/**
 * Monitor first-party: coleta tudo que o navegador expõe sobre a visita.
 * Sem dependências e sem rede por padrão — os eventos ficam numa fila em
 * localStorage até alguém plugar um destino com setSink().
 * Nunca captura o valor digitado em campos de formulário.
 */

export type TrackedEvent = {
  id: string
  name: string
  ts: string
  visitor: string
  session: string
  path: string
  props?: Record<string, unknown>
}

type Dict = Record<string, unknown>
type Sink = (event: TrackedEvent) => void

const CFG = { maxQueue: 500, heartbeatMs: 15000, textLimit: 80 }
const KEY = {
  queue: 'ct_track_queue',
  visitor: 'ct_visitor',
  visits: 'ct_visits',
  firstSeen: 'ct_first_seen',
  session: 'ct_session',
}

const read = (store: Storage, key: string) => {
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}
const write = (store: Storage, key: string, value: string) => {
  try {
    store.setItem(key, value)
  } catch {
    /* modo privado / cota cheia */
  }
}
const uid = () =>
  crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
const round = (n: number) => Math.round(n)

let sink: Sink = import.meta.env.DEV ? (e) => console.debug('[track]', e.name, e.props ?? {}) : () => {}
let queue: TrackedEvent[] = []
let started = false

/** Troca o destino dos eventos (ex.: POST para uma API). */
export function setSink(next: Sink) {
  sink = next
}

/** Eventos acumulados e ainda não enviados. */
export function getQueue(): TrackedEvent[] {
  return [...queue]
}

/** Esvazia a fila (depois de um envio bem-sucedido). */
export function clearQueue() {
  queue = []
  persist()
}

/** Grava a fila no disco; a cada N eventos e na saída da página. */
let pending = 0
function persist() {
  pending = 0
  write(localStorage, KEY.queue, JSON.stringify(queue))
}

export function track(name: string, props?: Dict) {
  const event: TrackedEvent = {
    id: uid(),
    name,
    ts: new Date().toISOString(),
    visitor: visitorId,
    session: sessionId,
    path: `${location.pathname}${location.hash}`,
    props,
  }
  queue.push(event)
  if (queue.length > CFG.maxQueue) queue.shift()
  if (++pending >= 10 || queue.length === 1) persist()
  sink(event)
}

// ---------------------------------------------------------------- identidade

const visitorId = (() => {
  const saved = read(localStorage, KEY.visitor)
  if (saved) return saved
  const id = uid()
  write(localStorage, KEY.visitor, id)
  write(localStorage, KEY.firstSeen, new Date().toISOString())
  return id
})()

const sessionId = (() => {
  const saved = read(sessionStorage, KEY.session)
  if (saved) return saved
  const id = uid()
  write(sessionStorage, KEY.session, id)
  return id
})()

const visits = Number(read(localStorage, KEY.visits) ?? 0) + 1
write(localStorage, KEY.visits, String(visits))

// ------------------------------------------------------------- ambiente bruto

const nav = navigator as any
const uad = nav.userAgentData
const conn = nav.connection ?? nav.mozConnection ?? nav.webkitConnection

function media(query: string) {
  try {
    return matchMedia(query).matches
  } catch {
    return undefined
  }
}

function gpu() {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')) as
      | WebGLRenderingContext
      | null
    if (!gl) return null
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    if (!ext) return null
    return {
      vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL),
    }
  } catch {
    return null
  }
}

function environments(): Dict {
  const params = new URLSearchParams(location.search)
  const utm: Dict = {}
  for (const [key, value] of params) if (key.startsWith('utm_')) utm[key] = value
  const ads: Dict = {}
  for (const key of ['gclid', 'fbclid', 'ttclid', 'msclkid', 'wbraid', 'gbraid']) {
    if (params.has(key)) ads[key] = params.get(key)
  }

  return {
    url: location.href,
    path: location.pathname,
    hash: location.hash,
    query: location.search,
    title: document.title,
    referrer: document.referrer || null,
    referrerHost: document.referrer ? new URL(document.referrer).hostname : null,
    utm,
    ads,
    lang: nav.language,
    languages: nav.languages,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    tzOffsetMin: new Date().getTimezoneOffset(),
    localTime: new Date().toString(),
    clock: Date.now(),
    userAgent: nav.userAgent,
    platform: nav.platform,
    vendor: nav.vendor,
    cores: nav.hardwareConcurrency ?? null,
    memoryGb: nav.deviceMemory ?? null,
    touchPoints: nav.maxTouchPoints ?? null,
    online: nav.onLine,
    cookies: nav.cookieEnabled,
    dnt: nav.doNotTrack ?? (window as any).doNotTrack ?? null,
    pdfViewer: nav.pdfViewerEnabled ?? null,
    secure: window.isSecureContext,
    historyLength: history.length,
    screen: {
      w: screen.width,
      h: screen.height,
      availW: screen.availWidth,
      availH: screen.availHeight,
      depth: screen.colorDepth,
      dpr: devicePixelRatio,
      orientation: screen.orientation?.type ?? null,
    },
    viewport: { w: innerWidth, h: innerHeight },
    connection: conn
      ? { type: conn.type, effectiveType: conn.effectiveType, downlink: conn.downlink, rtt: conn.rtt, saveData: conn.saveData }
      : null,
    prefs: {
      colorScheme: media('(prefers-color-scheme: dark)') ? 'dark' : 'light',
      reducedMotion: media('(prefers-reduced-motion: reduce)'),
      contrast: media('(prefers-contrast: more)'),
      forcedColors: media('(forced-colors: active)'),
      pointerFine: media('(pointer: fine)'),
      hover: media('(hover: hover)'),
    },
    gpu: gpu(),
  }
}

async function deepEnvironment() {
  const hints = uad?.getHighEntropyValues
    ? await uad
        .getHighEntropyValues(['architecture', 'bitness', 'model', 'platform', 'platformVersion', 'uaFullVersion', 'fullVersionList', 'wow64'])
        .catch(() => null)
    : null
  const storage = await nav.storage?.estimate?.().catch(() => null)
  const battery = await nav.getBattery?.().then((b: any) => ({ level: b.level, charging: b.charging })).catch(() => null)
  track('environment_deep', { hints, storage, battery })
}

// ------------------------------------------------------------------ comportamento

const t0 = Date.now()
let hiddenMs = 0
let hiddenAt: number | null = null
let activeMs = 0
let maxScroll = 0
let clicks = 0
const sectionTimes = new Map<string, { open: number; ms: number }>()

function scrollPct() {
  const max = document.documentElement.scrollHeight - innerHeight
  return max > 0 ? Math.min(100, round((scrollY / max) * 100)) : 0
}

function onScroll() {
  const pct = scrollPct()
  if (pct <= maxScroll) return
  for (const milestone of [25, 50, 75, 100]) {
    if (maxScroll < milestone && pct >= milestone) track('scroll_depth', { pct: milestone })
  }
  maxScroll = pct
}

function textOf(el: Element) {
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, CFG.textLimit)
}

function onClick(e: MouseEvent) {
  clicks++
  const target = e.target as Element | null
  const el = target?.closest('a,button,[data-track]')
  if (!el) {
    track('click', { tag: target?.tagName?.toLowerCase(), x: round((e.clientX / innerWidth) * 100), y: round((e.clientY / innerHeight) * 100) })
    return
  }
  const anchor = el as HTMLAnchorElement
  const cta = el.getAttribute('data-track')
  const section = el.closest('section[id]')?.id ?? null
  track('click', {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    cta,
    track: cta,
    text: textOf(el),
    href: anchor.href ?? null,
    x: round((e.clientX / innerWidth) * 100),
    y: round((e.clientY / innerHeight) * 100),
    scrollPct: scrollPct(),
  })
  if (cta) track('cta_click', { cta, section, text: textOf(el), scrollPct: scrollPct() })
  if (el.tagName === 'A' && anchor.hostname && anchor.hostname !== location.hostname) {
    track('outbound_click', { href: anchor.href })
  }
}

function onVisibility() {
  if (document.visibilityState === 'hidden') {
    hiddenAt = Date.now()
    track('tab_hidden', { elapsedMs: Date.now() - t0, scrollPct: maxScroll })
    persist()
  } else {
    if (hiddenAt) hiddenMs += Date.now() - hiddenAt
    hiddenAt = null
    track('tab_visible', { hiddenMs })
  }
}

function summary() {
  return {
    elapsedMs: Date.now() - t0,
    hiddenMs,
    visibleMs: Date.now() - t0 - hiddenMs,
    maxScrollPct: maxScroll,
    clicks,
    sections: Object.fromEntries([...sectionTimes].map(([id, s]) => [id, s.ms])),
  }
}

function observeSections() {
  const sections = document.querySelectorAll('section[id]')
  if (!sections.length || !('IntersectionObserver' in window)) return
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = entry.target.id
        const state = sectionTimes.get(id) ?? { open: 0, ms: 0 }
        if (entry.isIntersecting) {
          if (!state.open) {
            state.open = Date.now()
            track('section_view', { section: id, ratio: Math.round(entry.intersectionRatio * 100) })
          }
        } else if (state.open) {
          state.ms += Date.now() - state.open
          state.open = 0
        }
        sectionTimes.set(id, state)
      }
    },
    { threshold: [0.25, 0.5, 0.75] },
  )
  sections.forEach((s) => observer.observe(s))
}

const vitals: Dict = {}

function navigationTimings() {
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  if (!entry) return {}
  return {
    navigationType: entry.type,
    ttfbMs: round(entry.responseStart),
    domContentLoadedMs: round(entry.domContentLoadedEventEnd),
    loadMs: round(entry.loadEventEnd),
    transferKB: round(entry.transferSize / 1024),
  }
}

function observeVitals() {
  try {
    new PerformanceObserver((list) => {
      for (const item of list.getEntries() as any[]) vitals.lcpMs = round(item.startTime)
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((list) => {
      for (const item of list.getEntries() as any[])
        if (!item.hadRecentInput) vitals.cls = Number(vitals.cls ?? 0) + item.value
    }).observe({ type: 'layout-shift', buffered: true })
  } catch {
    /* PerformanceObserver indisponível */
  }
}

// ---------------------------------------------------------------------- start

export function initTracker() {
  if (started) return
  started = true

  const env = environments()
  track('page_view', {
    ...env,
    visits,
    firstSeen: read(localStorage, KEY.firstSeen),
    landing: sessionStorage.getItem('ct_landing') ?? location.href,
  })
  write(sessionStorage, 'ct_landing', sessionStorage.getItem('ct_landing') ?? location.href)
  void deepEnvironment()

  observeSections()
  observeVitals()

  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('click', onClick, true)
  addEventListener('focusin', (e) => {
    const el = e.target as HTMLElement
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
      track('field_focus', { field: el.getAttribute('name') || el.id || null, type: (el as HTMLInputElement).type ?? el.tagName })
    }
  })
  addEventListener('change', (e) => {
    const el = e.target as HTMLElement
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
      track('field_change', { field: el.getAttribute('name') || el.id || null, type: (el as HTMLInputElement).type ?? el.tagName })
    }
  })
  addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement
    track('form_submit', { form: form.id || form.getAttribute('name') || null })
  }, true)
  addEventListener('copy', () => {
    const selected = document.getSelection()?.toString() ?? ''
    if (selected) track('copy', { chars: selected.length })
  })
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') track('press_escape', { scrollPct: maxScroll })
  })
  addEventListener('error', (e) => {
    track('js_error', { message: e.message, file: e.filename, line: e.lineno })
  })
  addEventListener('unhandledrejection', (e) => {
    track('js_rejection', { reason: String(e.reason).slice(0, 200) })
  })
  document.addEventListener('visibilitychange', onVisibility)
  addEventListener('resize', () => track('resize', { viewport: { w: innerWidth, h: innerHeight } }))

  setInterval(() => {
    if (document.visibilityState !== 'visible') return
    activeMs = Date.now() - t0 - hiddenMs
    track('heartbeat', { elapsedMs: Date.now() - t0, visibleMs: activeMs, scrollPct: maxScroll, clicks })
  }, CFG.heartbeatMs)

  addEventListener('pagehide', () => {
    if (hiddenAt) hiddenMs += Date.now() - hiddenAt
    for (const [id, state] of sectionTimes) {
      if (state.open) {
        state.ms += Date.now() - state.open
        state.open = 0
      }
      if (state.ms) track('section_time', { section: id, ms: state.ms })
    }
    track('vitals', { ...navigationTimings(), ...vitals, cls: Number((vitals.cls as number) ?? 0).toFixed(4) })
    track('exit', summary())
    persist()
  })

  if (import.meta.env.DEV) (window as any).__track = track
}

// ------------------------------------------------------------------- envio

/** Envia a fila para o backend: a cada N ms e no fechamento da aba. */
export function startBeacon(url: string, options: { everyMs?: number; maxBatch?: number } = {}) {
  let sending = false
  const body = (events: TrackedEvent[]) => new Blob([JSON.stringify({ events })], { type: 'text/plain;charset=UTF-8' })

  const beacon = () => {
    if (queue.length === 0) return
    if (navigator.sendBeacon(url, body(queue))) {
      queue = []
      persist()
    }
  }

  const send = () => {
    if (sending || queue.length === 0) return
    sending = true
    const batch = queue.slice(0, options.maxBatch ?? 25)
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, // text/plain evita preflight cross-origin
      body: body(batch),
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) return
        const sent = new Set(batch.map((event) => event.id))
        queue = queue.filter((event) => !sent.has(event.id))
        persist()
      })
      .catch(() => {}) // volta na próxima rodada
      .finally(() => {
        sending = false
      })
  }

  setInterval(send, options.everyMs ?? 10000)
  addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') beacon()
  })
  addEventListener('pagehide', beacon)
}
