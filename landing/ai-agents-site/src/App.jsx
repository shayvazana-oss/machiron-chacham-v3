import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, Phone, Pause, Play, List, X, CheckCircle, Check, Certificate, CaretDown,
  OpenAiLogo, Lightning, Megaphone, Clock, Globe,
} from '@phosphor-icons/react'
import {
  IMG, VID, LOGO, PHONE, PRIVACY_URL, TERMS_URL, NAV_LINKS, STATS, RECOGNITION, AUDIENCE, ADMISSION, CAPABILITIES,
  PROJECTS, PHASES, ROLES, CERTS, LOGOS, TRACKS, FAQS,
} from './data.js'

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const CTA = 'לייעוץ לימודים' // one label for the one conversion intent on this page
const TOOL = (name) => `${import.meta.env.BASE_URL}tools/${name}.svg`
const WLOGO = (name) => LOGO(`${name}-w`) // partner logos, white on transparent, for the dark page

/* True while the element is on screen. IntersectionObserver only, no scroll listeners. */
function useOnScreen(ref, options) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), options)
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return on
}

function useWide() {
  const q = '(min-width: 768px)'
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

/* Landscape screens get the wide stage clip in the hero; portrait screens get the tall desk clip. */
function useLandscape() {
  const q = '(min-aspect-ratio: 1/1)'
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setOn(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return on
}
const HERO_ALT = {
  'm-team': 'חמישה סוכנים קטנים וצבעוניים עומדים על במה תחת אורות, לכל אחד אביזר אחר: אוזניות, זכוכית מגדלת, גרף, לוח שנה ומעטפה',
  'h-man': 'גבר יושב מול מחשב ושותה קפה, וסביבו על השולחן סוכנים קטנים וצבעוניים שעובדים: אחד בודק מסמכים בזכוכית מגדלת, אחד מסדר גרף עמודות, אחד עם אוזניות',
}

/* ---------------------------------------------------------------- Clips.
   A still first; the video is added only once the clip is on screen, and it plays only while it stays there.
   One switch (in the hero) stops every clip on the page. */
const Motion = createContext({ motion: true, setMotion: () => {} })
function Clip({ name, alt = '', eager = false, position = 'center' }) {
  const { motion } = useContext(Motion)
  const box = useRef(null)
  const vid = useRef(null)
  const visible = useOnScreen(box, { threshold: 0.35 })
  const [mounted, setMounted] = useState(eager)
  useEffect(() => { if (visible) setMounted(true) }, [visible])
  const play = motion && visible
  useEffect(() => {
    const v = vid.current
    if (!v) return
    if (play) v.play().catch(() => {})
    else v.pause()
  }, [play, mounted])
  const fit = 'absolute inset-0 h-full w-full object-cover'
  return (
    <div ref={box} className="absolute inset-0">
      <img src={IMG(name)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={fit} style={{ objectPosition: position }} />
      {mounted && motion && <video ref={vid} src={VID(name)} muted loop playsInline preload="auto" aria-hidden="true" className={fit} style={{ objectPosition: position }} />}
    </div>
  )
}

const Arrow = () => <ArrowLeft size={18} weight="bold" aria-hidden="true" />

/* Brand marks: a Simple Icons file, or a Phosphor glyph where Simple Icons has none (OpenAI). */
function Mark({ logo, Icon, className = 'h-[1em] w-[1em]' }) {
  if (Icon) return <Icon className={className} weight="fill" aria-hidden="true" />
  return <img src={TOOL(logo)} alt="" className={className} />
}

/* ---------------------------------------------------------------- Agent canvas.
   A workflow diagram in the style of n8n: a trigger, an AI agent (one of the mascots) and the tools it calls.
   It runs on a loop: the data moves along the wires, the agent works, each tool reports back.
   Three example agents take turns. Paused while off screen; static under reduced motion. */
const RUN_SECONDS = 7
const FLOWS = [
  {
    tab: 'סוכן לידים', short: 'לידים', hue: 0, model: { logo: 'claude', name: 'Claude' },
    trigger: { Icon: Lightning, text: 'ליד חדש נכנס מהטופס' },
    busy: 'מסווג ומתעדף את הליד', done: 'ליד חם, לטיפול מיידי',
    tools: [{ logo: 'hubspot', text: 'נרשם ב־CRM' }, { logo: 'whatsapp', text: 'הודעה ללקוח' }, { logo: 'googlesheets', text: 'עודכן בדוח' }],
    result: 'הליד טופל, בלי מגע יד',
  },
  {
    tab: 'סוכן קמפיינים', short: 'קמפיינים', hue: -52, model: { Icon: OpenAiLogo, name: 'ChatGPT' },
    trigger: { Icon: Megaphone, text: 'בריף למבצע חדש' },
    busy: 'כותב מודעות ובונה דף נחיתה', done: 'המודעות והדף מוכנים',
    tools: [{ logo: 'meta', text: 'מודעות לרשתות' }, { logo: 'gmail', text: 'מייל ללקוחות' }, { Icon: Globe, text: 'דף נחיתה באוויר' }],
    result: 'הקמפיין עלה לאוויר',
  },
  {
    tab: 'סוכן דוחות', short: 'דוחות', hue: 108, model: { logo: 'googlegemini', name: 'Gemini' },
    trigger: { Icon: Clock, text: 'כל בוקר ב־08:00' },
    busy: 'מנתח נתונים ומחפש חריגות', done: 'נמצאה חריגה אחת',
    tools: [{ logo: 'googlesheets', text: 'נתוני המכירות' }, { logo: 'gmail', text: 'דוח למנהל' }, { logo: 'whatsapp', text: 'התראה על החריגה' }],
    result: 'הדוח נשלח לפני תחילת היום',
  },
]

// Two geometries in viewBox units: a right-to-left flow on wide screens, a top-to-bottom flow on phones.
const GEO = {
  wide: {
    W: 1000, H: 500,
    trigger: { x: 865, y: 250, w: 230, h: 96 },
    agent: { x: 530, y: 250, w: 290, h: 148 },
    tools: [95, 250, 405].map((y) => ({ x: 145, y, w: 230, h: 84 })),
    wires: (g) => [
      `M${g.trigger.x - g.trigger.w / 2},250 L${g.agent.x + g.agent.w / 2},250`,
      ...g.tools.map((t) => `M${g.agent.x - g.agent.w / 2},250 C330,250 330,${t.y} ${t.x + t.w / 2},${t.y}`),
    ],
  },
  tall: {
    W: 360, H: 600,
    trigger: { x: 180, y: 52, w: 324, h: 80 },
    agent: { x: 180, y: 245, w: 324, h: 150 },
    tools: [64, 180, 296].map((x) => ({ x, y: 518, w: 108, h: 128 })),
    wires: (g) => [
      `M180,${g.trigger.y + g.trigger.h / 2} L180,${g.agent.y - g.agent.h / 2}`,
      ...g.tools.map((t) => `M180,${g.agent.y + g.agent.h / 2} C180,410 ${t.x},410 ${t.x},${t.y - t.h / 2}`),
    ],
  },
}
const T = { trigger: 0.2, wire1: 0.5, agent: 1.15, done: 3.0, wire2: 3.05, tools: 3.7, result: 4.5 }
const d = (seconds) => ({ '--d': `${seconds}s` })

function AgentCanvas() {
  const wide = useWide()
  const g = wide ? GEO.wide : GEO.tall
  const frame = useRef(null)
  const svg = useRef(null)
  const visible = useOnScreen(frame, { threshold: 0.25 })
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const flow = FLOWS[active]
  const halted = !reduceMotion && (!visible || !auto)
  useEffect(() => {
    const el = svg.current
    if (!el || !el.pauseAnimations) return
    if (halted) el.pauseAnimations()
    else el.unpauseAnimations()
  }, [halted, active, wide])
  const box = (n) => ({ left: `${((n.x - n.w / 2) / g.W) * 100}%`, top: `${((n.y - n.h / 2) / g.H) * 100}%`, width: `${(n.w / g.W) * 100}%`, height: `${(n.h / g.H) * 100}%` })
  const wires = g.wires(g)
  const wireAt = (i) => (i === 0 ? T.wire1 : T.wire2)
  return (
    <div ref={frame} className={`stage overflow-hidden rounded-media border border-line bg-surface ${halted ? 'halt' : ''}`}>
      <div className="flex items-stretch gap-1 border-b border-line px-2 sm:px-3">
        {FLOWS.map((f, i) => (
          <button key={f.tab} type="button" onClick={() => setActive(i)} aria-pressed={i === active}
            className={`relative min-h-[48px] flex-1 px-1 font-display text-[0.9rem] font-bold transition-colors sm:flex-none sm:px-4 sm:text-base ${i === active ? 'text-ink' : 'text-muted hover:text-ink'}`}>
            <span className="sm:hidden">{f.short}</span><span className="hidden sm:inline">{f.tab}</span>
            <span className="absolute inset-x-1 bottom-0 h-[2px] overflow-hidden bg-transparent">
              {i === active && (reduceMotion
                ? <span className="block h-full bg-accent-hi" />
                : <span key={active} className="prog block h-full bg-accent-hi" style={{ '--t': `${RUN_SECONDS}s` }} onAnimationEnd={() => setActive((active + 1) % FLOWS.length)} />)}
            </span>
          </button>
        ))}
        {!reduceMotion && (
          <button type="button" onClick={() => setAuto(!auto)} aria-label={auto ? 'השהיית ההדגמה' : 'הפעלת ההדגמה'}
            className="ms-auto grid w-11 shrink-0 place-items-center text-muted transition-colors hover:text-ink">
            {auto ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
          </button>
        )}
      </div>

      <p className="sr-only">הדגמה של שלושה סוכנים. {FLOWS.map((f) => `${f.tab}: ${f.trigger.text}, הסוכן ${f.busy}, ואז ${f.tools.map((t) => t.text).join(', ')}. ${f.result}.`).join(' ')}</p>

      <div key={`${active}-${wide}`} aria-hidden="true">
        <div className={`canvas relative ${wide ? 'canvas-wide' : 'canvas-tall'}`} style={{ aspectRatio: `${g.W} / ${g.H}` }}>
          <svg ref={svg} viewBox={`0 0 ${g.W} ${g.H}`} className="absolute inset-0 h-full w-full">
            {wires.map((w, i) => <path key={`b${i}`} d={w} fill="none" stroke="rgb(var(--line))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
            {wires.map((w, i) => <path key={`a${i}`} d={w} pathLength="1" className="draw" style={{ ...d(wireAt(i)), stroke: 'rgb(var(--accent-hi))' }} fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />)}
            {!reduceMotion && wires.map((w, i) => (
              <circle key={`p${i}`} r={wide ? 5 : 4} opacity="0" style={{ fill: 'rgb(var(--accent-hi))' }}>
                <animateMotion dur="0.65s" begin={`${wireAt(i)}s`} fill="freeze" path={w} />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="0.65s" begin={`${wireAt(i)}s`} fill="freeze" />
              </circle>
            ))}
          </svg>

          <div className="node flex items-center gap-[0.7em] px-[0.9em]" style={{ ...box(g.trigger), ...d(T.trigger) }}>
            <span className="grid h-[2.4em] w-[2.4em] shrink-0 place-items-center rounded-[0.6em] bg-accent/20 text-accent-hi"><flow.trigger.Icon className="h-[1.3em] w-[1.3em]" weight="fill" /></span>
            <div className="min-w-0">
              <p dir="ltr" className="text-right font-mono text-[0.7em] text-muted">trigger</p>
              <p className="font-display text-[1em] font-bold leading-tight">{flow.trigger.text}</p>
            </div>
          </div>

          <div className="node flex flex-col justify-between p-[0.85em]" style={{ ...box(g.agent), ...d(T.agent) }}>
            <div className="flex items-center gap-[0.7em]">
              <img src={IMG('m-cut')} alt="" className="bob h-[3.4em] w-[3.4em] shrink-0 object-contain" style={{ filter: flow.hue ? `hue-rotate(${flow.hue}deg)` : undefined }} />
              <div className="min-w-0 flex-1">
                <p dir="ltr" className="text-right font-mono text-[0.7em] text-accent-hi">ai agent</p>
                <p className="font-display text-[1.05em] font-bold leading-tight">{flow.tab}</p>
              </div>
              <span className="flex shrink-0 items-center gap-[0.35em] rounded-full border border-line px-[0.6em] py-[0.25em] font-mono text-[0.72em]"><Mark {...flow.model} />{flow.model.name}</span>
            </div>
            <div className="relative flex h-[2.5em] items-center rounded-[0.6em] bg-bg px-[0.8em] text-[0.92em]">
              <p className="leave absolute flex items-center gap-[0.5em] text-muted" style={d(T.done)}><span className="dots flex gap-1"><i /><i /><i /></span>{flow.busy}</p>
              <p className="b flex items-center gap-[0.45em] font-semibold" style={d(T.done + 0.1)}><CheckCircle className="h-[1.15em] w-[1.15em] shrink-0 text-accent-hi" weight="fill" />{flow.done}</p>
            </div>
          </div>

          {flow.tools.map((t, i) => (
            <div key={t.text} className={`node flex ${wide ? 'items-center gap-[0.7em] px-[0.85em]' : 'flex-col items-center justify-center gap-[0.45em] px-[0.4em] text-center'}`} style={{ ...box(g.tools[i]), ...d(T.tools + i * 0.15) }}>
              <span className="grid h-[2.3em] w-[2.3em] shrink-0 place-items-center rounded-[0.6em] bg-white/[0.06]"><Mark {...t} className="h-[1.2em] w-[1.2em]" /></span>
              <p className={`min-w-0 font-display font-semibold leading-tight ${wide ? 'flex-1 text-[0.95em]' : 'text-[0.82em]'}`}>{t.text}</p>
              {wide && <CheckCircle className="b h-[1.2em] w-[1.2em] shrink-0 text-accent-hi" weight="fill" style={d(T.tools + 0.2 + i * 0.15)} />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
          <div className="relative min-h-[1.5rem] flex-1">
            <p className="leave absolute flex items-center gap-2 text-muted" style={d(T.result)}><span className="dots flex gap-1"><i /><i /><i /></span>רץ</p>
            <p className="b flex items-center gap-2 font-display font-bold" style={d(T.result + 0.1)}><CheckCircle size={20} weight="fill" className="shrink-0 text-accent-hi" />{flow.result}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted">n8n<img src={TOOL('n8n')} alt="" className="h-4 w-4 opacity-70" /></span>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Navigation */
function Nav() {
  const [open, setOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-bg/70 backdrop-blur-md">
        <div className="page flex h-16 items-center justify-between gap-4">
          <a href="#home" className="shrink-0"><img src={WLOGO('yechida')} alt="היחידה ללימודי חוץ" className="h-6 w-auto sm:h-7" /></a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="ניווט ראשי">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href} className="text-muted transition-colors hover:text-ink">{l.label}</a>)}
          </nav>
          <div className="flex items-center gap-1.5">
            <a href={`tel:${PHONE}`} className="hidden items-center gap-2 px-2 font-mono font-semibold lg:flex"><Phone size={18} weight="fill" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
            <a href="#contact" className="btn btn-accent !hidden !px-4 !py-2.5 !text-base sm:!inline-flex">{CTA}</a>
            <a href={`tel:${PHONE}`} aria-label={`חיוג ${PHONE}`} className="grid h-11 w-11 place-items-center rounded-full sm:hidden"><Phone size={22} weight="fill" /></a>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={open} className="grid h-11 w-11 place-items-center rounded-full lg:hidden">
              {open ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-30 bg-bg px-5 pt-20 transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <nav className="flex flex-col" aria-label="ניווט נייד">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-4 font-display text-xl font-bold">{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="btn btn-accent mt-6">{CTA}</a>
        </nav>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- Lead form */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']
function readUtm() {
  let saved = {}
  try {
    saved = JSON.parse(sessionStorage.getItem('lp_utm') || '{}')
    const q = new URLSearchParams(window.location.search)
    UTM_KEYS.forEach((k) => { if (q.get(k)) saved[k] = q.get(k) })
    sessionStorage.setItem('lp_utm', JSON.stringify(saved))
  } catch { /* storage unavailable */ }
  return saved
}
const isLive = () => /^https?:$/.test(window.location.protocol) && !/claude|localhost|127\.0\.0\.1/.test(window.location.hostname)

function Field({ label, id, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-medium">{label}</label>
      <input id={id} aria-invalid={error ? 'true' : undefined} {...props}
        className={`w-full rounded-field border bg-bg px-4 py-3 text-lg text-ink placeholder:text-muted/70 transition-colors focus:border-accent-hi focus:outline-none ${error ? 'border-[#C2412C]' : 'border-line'}`} />
      {error && <p className="mt-1.5 text-[#C2412C]">{error}</p>}
    </div>
  )
}

function LeadForm({ place, full = false }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [errors, setErrors] = useState({})
  const [track, setTrack] = useState('')
  const utm = useRef({})
  useEffect(() => { utm.current = readUtm() }, [])
  const onSubmit = async (e) => {
    e.preventDefault()
    const el = e.currentTarget.elements
    const val = (n) => (el.namedItem(n)?.value || '').trim()
    const mobile = val('mobile').replace(/\D/g, '')
    const errs = {}
    if (val('name').length < 2) errs.name = 'נא למלא שם מלא.'
    if (!/^0\d{8,9}$/.test(mobile)) errs.mobile = 'נא למלא מספר נייד תקין.'
    if (!el.namedItem('consent_terms').checked) errs.terms = 'יש לאשר את מדיניות הפרטיות והתקנון.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    const done = () => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'generate_lead', form: 'lead-ai-agents', form_place: place, track: track || 'לא נבחר' })
      if (window.fbq) { try { window.fbq('track', 'Lead') } catch { /* pixel not ready */ } }
      setStatus('sent')
    }
    if (!isLive()) return setTimeout(done, 900) // preview: nothing is sent
    const body = new URLSearchParams({
      'form-name': 'lead-ai-agents', subject: 'ליד חדש: קורס AI Agents', 'bot-field': val('bot-field'),
      name: val('name'), mobile, email: val('email'), track,
      consent_marketing: el.namedItem('consent_marketing').checked ? 'yes' : '', consent_terms: 'yes',
      page_url: window.location.href.split('#')[0], ...utm.current,
    })
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      if (!r.ok) throw new Error(String(r.status))
      done()
    } catch {
      setStatus('idle')
      setErrors({ form: `השליחה לא הצליחה. נסו שוב, או חייגו ${PHONE}.` })
    }
  }
  if (status === 'sent') {
    return (
      <div className="flex min-h-[16rem] flex-col items-center justify-center text-center" role="status">
        <CheckCircle size={56} weight="fill" className="text-accent-hi" aria-hidden="true" />
        <h3 className="mt-4 text-2xl">קיבלנו את הפרטים</h3>
        <p className="mt-1.5 text-lg text-muted">יועץ לימודים יחזור אליכם בהקדם.</p>
      </div>
    )
  }
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="hidden" aria-hidden="true"><label>לא למלא: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <Field label="שם מלא" id={`${place}-name`} name="name" type="text" autoComplete="name" error={errors.name} />
      <Field label="נייד" id={`${place}-mobile`} name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="050-0000000" dir="ltr" style={{ textAlign: 'right' }} error={errors.mobile} />
      {full && <Field label="אימייל (לא חובה)" id={`${place}-email`} name="email" type="email" inputMode="email" autoComplete="email" dir="ltr" style={{ textAlign: 'right' }} />}
      {full && (
        <fieldset>
          <legend className="mb-2 font-medium">מסלול מימון לבדיקה (לא חובה)</legend>
          <div className="flex flex-wrap gap-2">
            {TRACKS.map((t) => (
              <button type="button" key={t.id} onClick={() => setTrack(track === t.id ? '' : t.id)} aria-pressed={track === t.id}
                className={`rounded-full px-4 py-2 transition-colors duration-300 ${track === t.id ? 'bg-accent text-accent-ink' : 'text-muted ring-1 ring-inset ring-line hover:text-ink'}`}>{t.id}</button>
            ))}
          </div>
        </fieldset>
      )}
      <div className="space-y-2 text-[0.94rem] leading-snug text-muted">
        <label className="flex gap-2.5"><input type="checkbox" name="consent_terms" required className="mt-0.5 h-4 w-4 flex-none accent-[rgb(var(--accent))]" /><span>קראתי ואני מאשר/ת את <a className="text-accent-hi underline" href={PRIVACY_URL} target="_blank" rel="noopener">מדיניות הפרטיות</a> ואת <a className="text-accent-hi underline" href={TERMS_URL} target="_blank" rel="noopener">תקנון האתר</a></span></label>
        <label className="flex gap-2.5"><input type="checkbox" name="consent_marketing" className="mt-0.5 h-4 w-4 flex-none accent-[rgb(var(--accent))]" /><span>מאשר/ת קבלת דיוור מהיחידה ללימודי חוץ</span></label>
        {errors.terms && <p className="text-[#C2412C]">{errors.terms}</p>}
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn btn-accent w-full disabled:opacity-60">{status === 'sending' ? 'שולחים...' : <>{CTA}<Arrow /></>}</button>
      {errors.form && <p role="alert" className="text-[#C2412C]">{errors.form}</p>}
    </form>
  )
}

/* Pauses every clip on the page. */
function MotionSwitch({ className = '' }) {
  const { motion, setMotion } = useContext(Motion)
  return (
    <button type="button" onClick={() => setMotion(!motion)} aria-label={motion ? 'השהיית הסרטונים בדף' : 'הפעלת הסרטונים בדף'}
      className={`shrink-0 place-items-center rounded-xl border border-white/20 bg-bg/40 text-white backdrop-blur transition-colors hover:bg-bg/70 ${className}`}>
      {motion ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
    </button>
  )
}

/* ---------------------------------------------------------------- Hero: the clip fills the screen, the words sit on it */
function Hero({ heroRef }) {
  const landscape = useLandscape()
  const clip = landscape ? 'm-team' : 'h-man'
  return (
    <section id="home" ref={heroRef} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Clip key={clip} name={clip} eager position={landscape ? '50% 55%' : '50% 62%'} alt={HERO_ALT[clip]} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(var(--bg)/0.92)_0%,rgb(var(--bg)/0.55)_26%,rgb(var(--bg)/0)_46%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(var(--bg))_0%,rgb(var(--bg)/0.7)_16%,rgb(var(--bg)/0)_40%)]" aria-hidden="true" />
      </div>
      {!reduceMotion && <MotionSwitch className="absolute left-4 top-[4.6rem] grid h-11 w-11 lg:hidden" />}
      <div className="page pt-24 lg:pt-28">
        <p dir="ltr" className="text-right font-mono text-sm text-accent-hi sm:text-base">AI Agent &amp; Automation Specialist</p>
        <h1 className="mt-2.5 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.4rem]">קורס סוכני AI <span className="mark block sm:inline">ואוטומציה</span></h1>
        <p className="mt-4 max-w-md text-lg text-ink/85 lg:hidden">160 שעות של בנייה מעשית, עד פרויקט גמר ותעודת הסמכה ממשלתית.</p>
      </div>
      <div className="page mt-auto flex flex-col gap-5 pb-7 lg:flex-row lg:items-end lg:justify-between lg:pb-12">
        <p className="hidden max-w-lg text-xl text-ink/85 lg:block">160 שעות של בנייה מעשית: סוכנים, אוטומציות ו־n8n, עד פרויקט גמר ותעודת הסמכה ממשלתית.</p>
        <div className="flex items-center gap-3">
          <a href="#contact" className="btn btn-accent min-w-0 flex-1 !px-3 sm:flex-none sm:!px-6">{CTA}<Arrow /></a>
          <a href="#syllabus" className="btn min-w-0 flex-1 border border-white/20 bg-bg/40 !px-3 backdrop-blur transition-colors hover:bg-bg/70 sm:flex-none sm:!px-6">לתוכנית הלימודים</a>
          {!reduceMotion && <MotionSwitch className="hidden h-[52px] w-[52px] lg:grid" />}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- The tools taught in the course */
const STACK = [{ Icon: OpenAiLogo, name: 'ChatGPT' }, { logo: 'claude', name: 'Claude' }, { logo: 'googlegemini', name: 'Gemini' }, { logo: 'n8n', name: 'n8n' }, { logo: 'make', name: 'Make' }]
function Stack() {
  return (
    <section className="border-y border-line" aria-label="הכלים בקורס">
      <div className="page flex flex-col items-center gap-5 py-7 lg:flex-row lg:justify-between">
        <p className="text-muted">עובדים עם הכלים שהשוק עובד איתם</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:gap-x-10">
          {STACK.map((t) => (
            <li key={t.name} className="flex items-center gap-2 font-display text-lg font-bold"><Mark {...t} className="h-6 w-6" />{t.name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- How an agent works, with the live canvas */
function About() {
  return (
    <section id="about" className="glow glow-blue page relative py-16 lg:py-24">
      <h2 className="h2 max-w-2xl">ככה עובד סוכן AI <span className="mark">שתבנו בקורס</span></h2>
      <p className="mt-4 max-w-2xl text-lg text-muted">טריגר מפעיל אותו, מודל שפה מחליט מה לעשות, והכלים מבצעים. הקורס לא מלמד כלים בנפרד: לוקחים אתגר עסקי אמיתי ובונים סוכן שעושה את העבודה.</p>
      <div className="mt-9"><AgentCanvas /></div>
      <p className="mt-3 text-sm text-muted">הדגמה להמחשה, ברוח הפרויקטים בקורס.</p>
      <ul className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {CAPABILITIES.map((c) => (
          <li key={c.title} className="border-t border-line pt-5">
            <h3 className="text-lg leading-snug">{c.title}</h3>
            <p className="mt-2 text-muted">{c.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- The course in numbers */
function Numbers() {
  return (
    <section className="border-y border-line bg-surface" aria-label="הקורס במספרים">
      <dl className="page grid grid-cols-2 lg:grid-cols-5">
        {STATS.map(([n, label], i) => (
          <div key={label} className={`flex flex-col-reverse border-line py-7 lg:border-s lg:px-7 lg:py-10 lg:first:border-s-0 lg:first:ps-0 ${i === STATS.length - 1 ? 'col-span-2 border-t lg:col-span-1 lg:border-t-0' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} ${i % 2 === 0 && i < STATS.length - 1 ? 'border-e pe-4 lg:border-e-0 lg:pe-7' : 'ps-4 lg:ps-7'}`}>
            <dt className="mt-2 text-[0.95rem] leading-snug text-muted">{label}</dt>
            <dd dir="ltr" className="text-right font-mono text-[2.6rem] font-semibold leading-none tracking-tight lg:text-[3.4rem]">{n}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ---------------------------------------------------------------- Projects: one agent, one clip, per project. Swipe on a phone, grid on a desktop. */
function Projects() {
  return (
    <section id="projects" className="glow glow-mix relative py-16 lg:py-24">
      <div className="page">
        <h2 className="h2">8 פרויקטים. <span className="mark">8 סוכנים שעובדים.</span></h2>
        <p className="mt-4 max-w-xl text-lg text-muted">לאורך הקורס בונים שמונה מערכות עובדות, מאפס.</p>
      </div>
      <ol className="no-bar mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8 lg:mx-auto lg:grid lg:max-w-page lg:grid-cols-4 lg:gap-x-5 lg:gap-y-11 lg:overflow-visible">
        {PROJECTS.map(([title, text], i) => (
          <li key={title} className="w-[72%] shrink-0 snap-center sm:w-[42%] lg:w-auto">
            <div className="media aspect-[4/5] border border-line">
              <Clip name={`p${i + 1}`} alt={`סוכן בעבודה: ${title}`} />
            </div>
            <p dir="ltr" className="mt-4 text-right font-mono text-sm text-accent-hi">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 text-lg leading-snug">{title}</h3>
            <p className="mt-1 text-muted">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* ---------------------------------------------------------------- Syllabus: three stages as tabs */
function Syllabus() {
  const [tab, setTab] = useState(0)
  const phase = PHASES[tab]
  const offset = PHASES.slice(0, tab).reduce((n, p) => n + p.modules.length, 0)
  const onKey = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const next = (tab + (e.key === 'ArrowLeft' ? 1 : -1) + PHASES.length) % PHASES.length // RTL: left is forward
    setTab(next)
    document.getElementById(`tab-${next}`)?.focus()
  }
  return (
    <section id="syllabus" className="border-t border-line bg-surface">
      <div className="page grid gap-10 py-16 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="lg:col-span-4">
          <h2 className="h2">תוכנית הלימודים</h2>
          <p className="mt-4 text-lg text-muted">12 מודולים בשלושה שלבים. למידה עיונית, מעשית ופרויקט גמר. לקבלת התעודות נדרשות 80% נוכחות, מטלות שוטפות ועמידה במבחנים.</p>
          <div role="tablist" aria-label="שלבי הסילבוס" aria-orientation="vertical" onKeyDown={onKey} className="mt-8 flex flex-wrap gap-2 lg:flex-col">
            {PHASES.map((p, i) => (
              <button key={p.tab} id={`tab-${i}`} role="tab" type="button" aria-selected={tab === i} aria-controls="syllabus-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}
                className={`flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-start font-display font-bold transition-colors duration-300 lg:text-lg ${tab === i ? 'bg-accent text-accent-ink' : 'border border-line text-muted hover:text-ink'}`}>
                {p.tab}<span dir="ltr" className="font-mono text-sm font-normal opacity-80">{p.modules.length} modules</span>
              </button>
            ))}
          </div>
        </div>
        <ol id="syllabus-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} key={tab} className="fade-in border-t border-line lg:col-span-8">
          {phase.modules.map(([title, text], i) => (
            <li key={title} className="grid grid-cols-[3rem_1fr] gap-x-3 border-b border-line py-6 sm:grid-cols-[4rem_1fr]">
              <span dir="ltr" className="text-right font-mono text-lg text-accent-hi sm:text-xl" aria-hidden="true">{String(offset + i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-lg leading-snug sm:text-xl">{title}</h3>
                <p className="mt-1.5 text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Certificates and the bodies behind them */
function Credentials() {
  const rest = LOGOS.filter(([file]) => file !== 'yechida' && !RECOGNITION.some(([f]) => f === file))
  return (
    <section id="certificates" className="page py-16 lg:py-24">
      <div className="grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="media aspect-[4/3] border border-line lg:col-span-5">
          <img src={IMG('m-grad')} alt="הסוכן עם כובע סיום, לצידו תעודה מגולגלת עם חותמת זהב" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="lg:col-span-7">
          <h2 className="h2">מסיימים עם <span className="mark">שתי תעודות</span></h2>
          <div className="mt-7 divide-y divide-line border-y border-line">
            {CERTS.map(([title, text]) => (
              <div key={title} className="flex gap-4 py-5">
                <Certificate size={32} className="shrink-0 text-accent-hi" aria-hidden="true" />
                <div>
                  <h3 className="text-xl leading-snug">{title}</h3>
                  <p className="mt-1 text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <ul className="mt-7 grid grid-cols-3 gap-3">
            {RECOGNITION.map(([file, org]) => (
              <li key={file} className="grid h-20 place-items-center rounded-tile border border-line px-3"><img src={WLOGO(file)} alt={org} loading="lazy" className="max-h-11 w-auto max-w-full object-contain" /></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-14 text-center text-muted">עוד שותפים וגופים שאיתם עובדת היחידה ללימודי חוץ</p>
      <ul className="mt-6 grid grid-cols-3 items-center gap-x-6 gap-y-7 opacity-70 sm:grid-cols-7">
        {rest.map(([file, name]) => (
          <li key={file} className="flex justify-center"><img src={WLOGO(file)} alt={name} loading="lazy" className="max-h-9 w-auto max-w-[6rem] object-contain" /></li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- Who it is for, and admission terms */
function Audience() {
  const Items = ({ items }) => (
    <ul className="mt-6 space-y-3.5">
      {items.map((t) => <li key={t} className="flex gap-3 text-lg"><Check size={20} weight="bold" className="mt-1 shrink-0 text-accent-hi" aria-hidden="true" />{t}</li>)}
    </ul>
  )
  return (
    <section className="border-t border-line bg-surface">
      <div className="page grid gap-12 py-16 md:grid-cols-2 lg:gap-14 lg:py-24">
        <div>
          <h2 className="h2">למי הקורס מתאים</h2>
          <p className="mt-4 text-muted">למי שרוצה ידע מקצועי ומעשי בבניית אפליקציות, מערכות אוטומציה וסוכני AI לצרכים עסקיים. בין היתר:</p>
          <Items items={AUDIENCE} />
        </div>
        <div>
          <h2 className="h2">תנאי קבלה</h2>
          <Items items={ADMISSION} />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- After the course, with the clip the hero did not use */
function Roles() {
  const landscape = useLandscape()
  const clip = landscape ? 'h-man' : 'm-team'
  return (
    <section className="page py-16 lg:py-24">
      <div className="grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className={`media border border-line ${landscape ? 'aspect-[4/5] lg:col-span-5' : 'aspect-[4/3]'}`}>
          <Clip key={clip} name={clip} position="50% 60%" alt={HERO_ALT[clip]} />
        </div>
        <div className="lg:col-span-7">
          <h2 className="h2">לאן ממשיכים <span className="mark">אחרי הקורס</span></h2>
          <p className="mt-4 max-w-xl text-lg text-muted">לארגונים בינוניים וגדולים, או לעבודה כעצמאים שמטמיעים AI ואוטומציה אצל לקוחות.</p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {ROLES.map((r) => <li key={r} className="rounded-full border border-line bg-surface/60 px-4 py-2 font-display font-semibold">{r}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Funding: three rows */
function Funding() {
  return (
    <section id="funding" className="border-t border-line bg-surface">
      <div className="page py-16 lg:py-24">
        <h2 className="h2">מסלולי מימון</h2>
        <p className="mt-4 max-w-xl text-lg text-muted">בשיחת הייעוץ בודקים יחד איזה מסלול מתאים לכם.</p>
        <div className="mt-9 border-t border-line">
          {TRACKS.map((t) => (
            <div key={t.id} className="grid items-baseline gap-x-10 gap-y-1 border-b border-line py-6 md:grid-cols-[12rem_14rem_1fr]">
              <p className="text-lg text-muted">{t.name}</p>
              <p className="font-display text-4xl font-extrabold text-accent-hi sm:text-5xl">{t.value}</p>
              <p className="text-lg">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- FAQ */
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="page py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
        <h2 className="h2 lg:col-span-4">שאלות נפוצות</h2>
        <ul className="border-t border-line lg:col-span-8">
          {FAQS.map(([q, a], i) => (
            <li key={q} className="border-b border-line">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-5 text-start font-display text-lg font-bold sm:text-xl">
                <span>{q}</span>
                <CaretDown size={18} weight="bold" className={`shrink-0 text-muted transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {open === i && <p className="fade-in pb-6 text-lg text-muted">{a}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Closing form, with the agent waving */
function Contact({ contactRef }) {
  return (
    <section id="contact" ref={contactRef} className="glow glow-blue page relative pb-12 lg:pb-20">
      <div className="grid gap-8 rounded-media border border-line bg-surface p-5 sm:p-9 lg:grid-cols-2 lg:gap-14 lg:p-14">
        <div className="flex flex-col">
          <h2 className="h2">רוצים לשמוע עוד <span className="mark">על הקורס?</span></h2>
          <p className="mt-4 max-w-md text-lg text-muted">השאירו פרטים לשיחת ייעוץ והכוונה. נבדוק יחד התאמה, מסלול מימון ומועדי פתיחה.</p>
          <a href={`tel:${PHONE}`} className="mt-6 inline-flex items-center gap-3 self-start font-mono text-4xl font-semibold"><Phone size={28} weight="fill" className="text-accent-hi" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
          <img src={IMG('m-cut-wave')} alt="" loading="lazy" className="mt-auto hidden w-40 self-end pt-8 lg:block" />
        </div>
        <div className="rounded-tile border border-line bg-bg p-5 sm:p-8"><LeadForm place="contact" full /></div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page flex flex-wrap items-center justify-between gap-4 pb-28 pt-6 text-[0.94rem] text-muted md:pb-8">
        <span>© היחידה ללימודי חוץ, בשיתוף מפעל הסייבר של אלתא מערכות</span>
        <span className="flex gap-6">
          <a className="transition-colors hover:text-ink" href={PRIVACY_URL} target="_blank" rel="noopener">מדיניות פרטיות</a>
          <a className="transition-colors hover:text-ink" href={TERMS_URL} target="_blank" rel="noopener">תקנון</a>
        </span>
      </div>
    </footer>
  )
}

/* Mobile action bar: appears once the hero is gone and steps aside at the closing form. */
function StickyBar({ heroRef, contactRef }) {
  const heroOn = useOnScreen(heroRef)
  const contactOn = useOnScreen(contactRef, { threshold: 0.15 })
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  const show = ready && !heroOn && !contactOn
  return (
    <div className={`fixed inset-x-0 bottom-0 z-30 flex gap-2 bg-bg/95 p-3 shadow-[0_-1px_0_rgb(var(--line))] backdrop-blur transition-transform duration-500 md:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}>
      <a href={`tel:${PHONE}`} className="btn flex-[0.7] ring-1 ring-inset ring-line"><Phone size={18} weight="bold" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
      <a href="#contact" className="btn btn-accent flex-1">{CTA}</a>
    </div>
  )
}

export default function App() {
  const heroRef = useRef(null)
  const contactRef = useRef(null)
  const [motion, setMotion] = useState(!reduceMotion)
  return (
    <Motion.Provider value={{ motion, setMotion }}>
      <a href="#about" className="fixed start-4 top-[-80px] z-50 rounded-full bg-ink px-4 py-2 text-bg transition-[top] focus:top-4">דילוג לתוכן</a>
      <Nav />
      <main>
        <Hero heroRef={heroRef} />
        <Stack />
        <About />
        <Numbers />
        <Projects />
        <Syllabus />
        <Credentials />
        <Audience />
        <Roles />
        <Funding />
        <Faq />
        <Contact contactRef={contactRef} />
      </main>
      <Footer />
      <StickyBar heroRef={heroRef} contactRef={contactRef} />
    </Motion.Provider>
  )
}
