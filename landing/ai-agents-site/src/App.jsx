import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, Phone, Pause, Play, List, X, Desktop, DeviceMobile, CheckCircle, Check, Lightbulb, TrendUp,
  Clock, MonitorPlay, Certificate, Wallet, GraduationCap, CaretDown,
} from '@phosphor-icons/react'
import {
  IMG, LOGO, PHONE, PRIVACY_URL, TERMS_URL, NAV_LINKS, FACTS, AUDIENCE, ADMISSION, CAPABILITIES,
  PROJECTS, PHASES, ROLES, CERTS, LOGOS, TRACKS, FAQS,
} from './data.js'

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const CTA = 'לייעוץ לימודים' // one label for the one conversion intent on this page

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

/* ---------------------------------------------------------------- Agents at work.
   A live demo in the page, not a video: someone asks in one sentence, and an agent builds the thing in front of you.
   Three jobs run one after another. Only transform and opacity animate, and everything stops while off screen or paused. */
const JOB_SECONDS = 6.2
const JOBS = [
  { tab: 'בונה אתר', who: 'man', from: 'מהמחשב', Icon: Desktop, ask: 'תבנה לי דף נחיתה למבצע החדש', busy: 'בונה את הדף', done: 'דף הנחיתה באוויר', hue: 0 },
  { tab: 'מרים קמפיין', who: 'woman', from: 'מהטלפון', Icon: DeviceMobile, ask: 'תרים לי קמפיין לרשתות', busy: 'מכין את המודעות', done: 'הקמפיין עלה לאוויר', hue: -52 },
  { tab: 'מנתח נתונים', who: 'man', from: 'מהמחשב', Icon: Desktop, ask: 'תנתח לי את נתוני החודש', busy: 'עובר על הנתונים', done: 'הדוח מוכן, עם תובנות', hue: 108 },
]
const d = (seconds) => ({ '--d': `${seconds}s` })
const Bar = ({ w, className = '' }) => <span className={`block h-1.5 rounded-full bg-line ${className}`} style={{ width: w }} />

function SiteJob() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <i className="h-2 w-2 rounded-full bg-line" /><i className="h-2 w-2 rounded-full bg-line" /><i className="h-2 w-2 rounded-full bg-line" />
        <span className="ms-2 h-4 flex-1 rounded-full bg-surface" />
      </div>
      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="b flex items-center justify-between" style={d(0.6)}>
          <span className="h-4 w-4 rounded-md bg-accent" />
          <span className="flex items-center gap-2"><Bar w={26} /><Bar w={26} /><Bar w={26} /></span>
        </div>
        <div className="grid grid-cols-5 items-center gap-3">
          <div className="col-span-3">
            <p className="b font-display text-[1.05rem] font-semibold leading-tight" style={d(1.0)}>המבצע של החודש</p>
            <span className="b mt-2 block" style={d(1.3)}><Bar w="92%" /><Bar w="64%" className="mt-1.5" /></span>
            <span className="b mt-3 inline-block rounded-full bg-accent px-3.5 py-1 font-display text-xs font-semibold text-accent-ink" style={d(1.9)}>להרשמה</span>
          </div>
          <div className="b col-span-2 aspect-square overflow-hidden rounded-xl bg-surface" style={d(1.6)}>
            <img src={IMG('m-build')} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[2.3, 2.5, 2.7].map((t) => (
            <div key={t} className="b rounded-lg p-2 ring-1 ring-line" style={d(t)}>
              <span className="mb-1.5 block h-3 w-3 rounded-full bg-accent/25" /><Bar w="85%" /><Bar w="55%" className="mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CampaignJob() {
  const ads = ['p2', 'p7', 'p1']
  const channels = ['פייסבוק', 'אינסטגרם', 'וואטסאפ']
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="grid grid-cols-3 gap-2">
        {ads.map((name, i) => (
          <div key={name} className="b overflow-hidden rounded-xl ring-1 ring-line" style={d(0.6 + i * 0.35)}>
            <img src={IMG(name)} alt="" className="aspect-square w-full object-cover" />
            <div className="p-2">
              <Bar w="90%" /><Bar w="60%" className="mt-1" />
              <span className="mt-2 block rounded-full bg-accent py-0.5 text-center font-display text-[0.65rem] font-semibold text-accent-ink">לפרטים</span>
            </div>
          </div>
        ))}
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {channels.map((c, i) => (
          <li key={c} className="b flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold" style={d(2.0 + i * 0.4)}>
            <Check size={12} weight="bold" className="text-accent" aria-hidden="true" />{c}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DataJob() {
  const bars = [34, 48, 42, 62, 56, 84]
  const line = bars.map((h, i) => `${35 + i * 46},${96 - h - 10}`).join(' ')
  return (
    <div className="flex h-full flex-col justify-between p-3">
      <div className="grid grid-cols-2 gap-2">
        {['לידים', 'המרות'].map((k, i) => (
          <div key={k} className="b flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-line" style={d(0.6 + i * 0.2)}>
            <span className="text-sm font-semibold">{k}</span>
            <TrendUp size={18} weight="bold" className="text-accent" aria-hidden="true" />
          </div>
        ))}
      </div>
      <svg viewBox="0 0 300 100" className="w-full" aria-hidden="true">
        <line x1="10" y1="96.5" x2="290" y2="96.5" stroke="rgb(var(--line))" />
        {bars.map((h, i) => (
          <rect key={i} className="grow" style={d(1.0 + i * 0.14)} x={22 + i * 46} y={96 - h} width="26" height={h} rx="5"
            fill="rgb(var(--accent))" fillOpacity={i === bars.length - 1 ? 1 : 0.2} />
        ))}
        <polyline className="draw" style={d(2.0)} points={line} pathLength="1" fill="none" stroke="rgb(var(--ink))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="b flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm font-semibold leading-snug" style={d(2.9)}>
        <Lightbulb size={18} weight="fill" className="shrink-0 text-accent" aria-hidden="true" />הסוכן סימן חריגה אחת ושתי הזדמנויות
      </p>
    </div>
  )
}

const JOB_VIEWS = [SiteJob, CampaignJob, DataJob]

function AgentsAtWork() {
  const ref = useRef(null)
  const visible = useOnScreen(ref, { threshold: 0.3 })
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const job = JOBS[active]
  const View = JOB_VIEWS[active]
  const halted = !reduceMotion && (!visible || !auto)
  return (
    <div ref={ref} className={`stage rounded-media bg-surface p-3 sm:p-4 ${halted ? 'halt' : ''}`}>
      <div className="flex items-stretch gap-1.5">
        {JOBS.map((j, i) => (
          <button key={j.tab} type="button" onClick={() => setActive(i)} aria-pressed={i === active}
            className={`relative min-h-[44px] flex-1 font-display text-[0.82rem] font-semibold transition-colors sm:text-sm ${i === active ? 'text-ink' : 'text-muted hover:text-ink'}`}>
            {j.tab}
            <span className="absolute inset-x-1 bottom-0 h-[3px] overflow-hidden rounded-full bg-line">
              {i === active && (reduceMotion
                ? <span className="block h-full bg-accent" />
                : <span key={active} className="prog block h-full bg-accent" style={{ '--t': `${JOB_SECONDS}s` }} onAnimationEnd={() => setActive((active + 1) % JOBS.length)} />)}
            </span>
          </button>
        ))}
        {!reduceMotion && (
          <button type="button" onClick={() => setAuto(!auto)} aria-label={auto ? 'השהיית ההדגמה' : 'הפעלת ההדגמה'}
            className="grid w-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:text-ink">
            {auto ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
          </button>
        )}
      </div>

      <p className="sr-only">הדגמה: מבקשים במשפט אחד, והסוכן מבצע. {JOBS.map((j) => `${j.ask}: ${j.done}.`).join(' ')}</p>

      <div key={active} aria-hidden="true">
        <div className="b mt-3 flex items-center gap-2.5" style={d(0)}>
          <img src={IMG(`av-${job.who}`)} alt="" width="40" height="40" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          <div className="rounded-2xl rounded-ss-md bg-bg px-3.5 py-2 ring-1 ring-line">
            <p className="flex items-center gap-1 text-xs text-muted"><job.Icon size={13} weight="bold" />{job.from}</p>
            <p className="font-display text-[0.95rem] font-semibold leading-snug sm:text-base">{job.ask}</p>
          </div>
        </div>

        <div className="mt-3 aspect-[4/3] overflow-hidden rounded-tile bg-bg ring-1 ring-line"><View /></div>

        <div className="relative flex h-[4.75rem] items-center pe-24">
          <p className="leave absolute flex items-center gap-2 font-display text-[0.95rem] font-semibold text-muted" style={d(3.6)}>
            {job.busy}<span className="dots flex gap-1"><i /><i /><i /></span>
          </p>
          <p className="b flex items-center gap-1.5 font-display text-base font-semibold sm:text-lg" style={d(3.8)}>
            <CheckCircle size={22} weight="fill" className="shrink-0 text-accent" />{job.done}
          </p>
          <div className="absolute -top-3 end-0 h-[5.5rem] w-[5.5rem]" style={{ filter: job.hue ? `hue-rotate(${job.hue}deg)` : undefined }}>
            <span className="leave absolute inset-0" style={d(3.6)}><img src={IMG('m-cut')} alt="" className="bob h-full w-full object-contain" /></span>
            <img src={IMG('m-cut-wave')} alt="" className="b absolute inset-0 h-full w-full object-contain" style={d(3.7)} />
          </div>
        </div>
      </div>
    </div>
  )
}

const Arrow = () => <ArrowLeft size={18} weight="bold" aria-hidden="true" />

/* ---------------------------------------------------------------- Navigation: the school's name first */
function Nav() {
  const sentinel = useRef(null)
  const atTop = useOnScreen(sentinel)
  const [open, setOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <>
      <div ref={sentinel} className="absolute top-0 h-4 w-px" aria-hidden="true" />
      <header className={`fixed inset-x-0 top-0 z-40 bg-bg transition-shadow duration-300 ${atTop && !open ? 'shadow-[0_1px_0_rgb(var(--line))]' : 'shadow-[0_1px_0_rgb(var(--line)),0_6px_20px_-12px_rgb(17_20_28/0.25)]'}`}>
        <div className="page flex h-16 items-center justify-between gap-4">
          <a href="#home" className="shrink-0"><img src={LOGO('yechida')} alt="היחידה ללימודי חוץ" width="360" height="48" className="h-6 w-auto sm:h-7" /></a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="ניווט ראשי">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href} className="text-muted transition-colors hover:text-ink">{l.label}</a>)}
          </nav>
          <div className="flex items-center gap-1.5">
            <a href={`tel:${PHONE}`} className="hidden items-center gap-2 px-2 font-display font-semibold lg:flex"><Phone size={18} weight="fill" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
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
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-4 font-display text-xl font-semibold">{l.label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="btn btn-accent mt-6">{CTA}</a>
        </nav>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- Lead form, used in the hero (short) and at the end (full) */
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
        className={`w-full rounded-field border bg-bg px-4 py-3 text-lg text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none ${error ? 'border-[#C2412C]' : 'border-line'}`} />
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
        <CheckCircle size={56} weight="fill" className="text-accent" aria-hidden="true" />
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
                className={`rounded-full px-4 py-2 transition-colors duration-300 ${track === t.id ? 'bg-ink text-bg' : 'text-muted ring-1 ring-inset ring-line hover:text-ink'}`}>{t.id}</button>
            ))}
          </div>
        </fieldset>
      )}
      <div className="space-y-2 text-[0.94rem] leading-snug text-muted">
        <label className="flex gap-2.5"><input type="checkbox" name="consent_terms" required className="mt-0.5 h-4 w-4 flex-none accent-[rgb(var(--accent))]" /><span>קראתי ואני מאשר/ת את <a className="text-ink underline" href={PRIVACY_URL} target="_blank" rel="noopener">מדיניות הפרטיות</a> ואת <a className="text-ink underline" href={TERMS_URL} target="_blank" rel="noopener">תקנון האתר</a></span></label>
        <label className="flex gap-2.5"><input type="checkbox" name="consent_marketing" className="mt-0.5 h-4 w-4 flex-none accent-[rgb(var(--accent))]" /><span>מאשר/ת קבלת דיוור מהיחידה ללימודי חוץ</span></label>
        {errors.terms && <p className="text-[#C2412C]">{errors.terms}</p>}
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn btn-accent w-full disabled:opacity-60">{status === 'sending' ? 'שולחים...' : <>{CTA}<Arrow /></>}</button>
      {errors.form && <p role="alert" className="text-[#C2412C]">{errors.form}</p>}
    </form>
  )
}

/* ---------------------------------------------------------------- Hero: what the course is, its facts, and the form */
const FACT_ICONS = [Clock, MonitorPlay, Certificate, Wallet]
function Hero({ heroRef }) {
  return (
    <section id="home" ref={heroRef} className="bg-surface">
      <div className="page grid gap-8 pb-10 pt-24 lg:grid-cols-12 lg:items-start lg:gap-14 lg:pb-16 lg:pt-28">
        <div className="lg:col-span-7 lg:pt-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-bg px-3.5 py-1.5 text-[0.94rem] font-semibold ring-1 ring-line">
            <GraduationCap size={18} weight="fill" className="text-accent" aria-hidden="true" />קורס מקצועי עם תעודת הסמכה ממשלתית
          </p>
          <h1 className="mt-4 text-[2.15rem] sm:text-5xl lg:text-[3.4rem]">קורס סוכני AI ואוטומציה</h1>
          <p dir="ltr" className="mt-2 text-right font-display text-lg font-semibold text-accent sm:text-xl">AI Agent &amp; Automation Specialist</p>
          <p className="mt-4 max-w-xl text-lg text-muted">לומדים לבנות סוכני AI ואוטומציות עסקיות, מהיסודות ועד פרויקט גמר. קורס של היחידה ללימודי חוץ, בשיתוף מפעל הסייבר של אלתא מערכות.</p>
          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-8">
            {FACTS.map(([term, value], i) => {
              const Icon = FACT_ICONS[i]
              return (
                <div key={term} className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bg ring-1 ring-line"><Icon size={20} className="text-accent" aria-hidden="true" /></span>
                  <div>
                    <dt className="text-[0.94rem] text-muted">{term}</dt>
                    <dd className="font-display font-semibold leading-snug">{value}</dd>
                  </div>
                </div>
              )
            })}
          </dl>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-media bg-bg p-5 shadow-[0_16px_40px_-24px_rgb(17_20_28/0.3)] ring-1 ring-line sm:p-7">
            <h2 className="text-2xl">לפרטים וייעוץ לימודים</h2>
            <p className="mb-5 mt-1 text-muted">יועץ לימודים יחזור אליכם לבדיקת התאמה, מסלול מימון ומועדי פתיחה.</p>
            <LeadForm place="hero" />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Partners */
function Partners() {
  const logos = LOGOS.filter(([file]) => file !== 'yechida')
  return (
    <section className="page py-10 lg:py-12" aria-label="שותפים וגופים">
      <p className="text-center text-muted">בין השותפים והגופים שאיתם עובדת היחידה ללימודי חוץ</p>
      <ul className="mt-6 grid grid-cols-3 items-center gap-x-5 gap-y-7 lg:flex lg:justify-between lg:gap-6">
        {logos.map(([file, name]) => (
          <li key={file} className="flex justify-center"><img src={LOGO(file)} alt={name} loading="lazy" className="max-h-9 w-auto max-w-[5.75rem] object-contain lg:max-h-11 lg:max-w-[7rem]" /></li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- About the course, with the live demo */
function About() {
  return (
    <section id="about" className="page border-t border-line py-14 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <h2 className="h2">על הקורס</h2>
          <p className="mt-4 max-w-2xl text-lg">הקורס לא מלמד כלים. הוא מכשיר אנשי AI יישומיים שלוקחים אתגר עסקי אמיתי, מאפיינים אותו, ובונים סוכן שמבצע את העבודה.</p>
          <h3 className="mt-9 text-xl">מה לומדים לבנות</h3>
          <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {CAPABILITIES.map((c) => (
              <li key={c.title} className="flex gap-3">
                <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <p className="font-display font-semibold leading-snug">{c.title}</p>
                  <p className="mt-1 text-muted">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <figure className="mx-auto w-full max-w-[420px] lg:col-span-5">
          <AgentsAtWork />
          <figcaption className="mt-3 text-muted">הדגמה: מבקשים במשפט אחד, והסוכן מבצע. סוכנים כאלה לומדים לבנות בקורס.</figcaption>
        </figure>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Who it is for, and admission terms */
function Audience() {
  const List_ = ({ items }) => (
    <ul className="mt-5 space-y-3">
      {items.map((t) => <li key={t} className="flex gap-3 text-lg"><Check size={20} weight="bold" className="mt-1 shrink-0 text-accent" aria-hidden="true" />{t}</li>)}
    </ul>
  )
  return (
    <section className="bg-surface">
      <div className="page grid gap-10 py-14 md:grid-cols-2 lg:gap-14 lg:py-20">
        <div>
          <h2 className="h2">למי הקורס מתאים</h2>
          <p className="mt-4 text-muted">למי שרוצה ידע מקצועי ומעשי בבניית אפליקציות, מערכות אוטומציה וסוכני AI לצרכים עסקיים. בין היתר:</p>
          <List_ items={AUDIENCE} />
        </div>
        <div>
          <h2 className="h2">תנאי קבלה</h2>
          <List_ items={ADMISSION} />
        </div>
      </div>
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
    <section id="syllabus" className="page py-14 lg:py-20">
      <h2 className="h2">תוכנית הלימודים</h2>
      <p className="mt-3 text-lg text-muted">12 מודולים בשלושה שלבים, 160 שעות אקדמיות.</p>
      <div role="tablist" aria-label="שלבי הסילבוס" onKeyDown={onKey} className="mt-7 flex flex-wrap gap-2">
        {PHASES.map((p, i) => (
          <button key={p.tab} id={`tab-${i}`} role="tab" type="button" aria-selected={tab === i} aria-controls="syllabus-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}
            className={`rounded-full px-4 py-2.5 font-display font-semibold transition-colors duration-300 ${tab === i ? 'bg-ink text-bg' : 'text-muted ring-1 ring-inset ring-line hover:text-ink'}`}>{p.tab}</button>
        ))}
      </div>
      <ol id="syllabus-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} key={tab} className="fade-in mt-7 grid gap-x-12 border-t border-line md:grid-cols-2">
        {phase.modules.map(([title, text], i) => (
          <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-x-2 border-b border-line py-5">
            <span className="font-display text-lg font-semibold tabular-nums text-accent" aria-hidden="true">{String(offset + i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="text-lg leading-snug">{title}</h3>
              <p className="mt-1 text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-2xl text-muted">הלימודים כוללים למידה עיונית, מעשית ועבודה על פרויקט גמר. לקבלת התעודות נדרשות 80% נוכחות, מטלות שוטפות ועמידה במבחנים ובפרויקטי הסיום.</p>
    </section>
  )
}

/* ---------------------------------------------------------------- Projects: a plain numbered list */
function Projects() {
  return (
    <section id="projects" className="bg-surface">
      <div className="page py-14 lg:py-20">
        <h2 className="h2">8 פרויקטים מעשיים</h2>
        <p className="mt-3 max-w-xl text-lg text-muted">לאורך הקורס בונים שמונה מערכות עובדות, מאפס.</p>
        <ol className="mt-8 grid gap-3 md:grid-cols-2">
          {PROJECTS.map(([title, text], i) => (
            <li key={title} className="flex gap-4 rounded-tile bg-bg p-5 ring-1 ring-line">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 font-display font-semibold tabular-nums text-accent" aria-hidden="true">{i + 1}</span>
              <div>
                <h3 className="text-lg leading-snug">{title}</h3>
                <p className="mt-1 text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- After the course */
function Roles() {
  return (
    <section className="page py-14 lg:py-20">
      <h2 className="h2">לאן ממשיכים אחרי הקורס</h2>
      <p className="mt-3 max-w-2xl text-lg text-muted">בוגרי הקורס משתלבים בארגונים בינוניים וגדולים, או עובדים כעצמאים שמטמיעים AI ואוטומציה אצל לקוחות. בין התפקידים:</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {ROLES.map((r) => <li key={r} className="rounded-full bg-surface px-4 py-2 font-display font-semibold">{r}</li>)}
      </ul>
      <p className="mt-8 max-w-2xl border-s-[3px] border-accent ps-4 text-lg">היחידה ללימודי חוץ מובילה מזה שלוש שנים את חממת התעסוקה של שירות התעסוקה, עם <strong className="font-display">מעל 80% השמה</strong>.</p>
    </section>
  )
}

/* ---------------------------------------------------------------- Certificates */
function Credentials() {
  return (
    <section id="certificates" className="bg-surface">
      <div className="page py-14 lg:py-20">
        <h2 className="h2">מסיימים עם שתי תעודות</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {CERTS.map(([title, text]) => (
            <div key={title} className="flex gap-4 rounded-tile bg-bg p-6 ring-1 ring-line">
              <Certificate size={36} className="shrink-0 text-accent" aria-hidden="true" />
              <div>
                <h3 className="text-xl leading-snug">{title}</h3>
                <p className="mt-1.5 text-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Funding */
function Funding() {
  return (
    <section id="funding" className="page py-14 lg:py-20">
      <h2 className="h2">מסלולי מימון</h2>
      <p className="mt-3 max-w-xl text-lg text-muted">בשיחת הייעוץ בודקים יחד איזה מסלול מתאים לכם.</p>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {TRACKS.map((t) => (
          <div key={t.id} className="rounded-tile p-6 ring-1 ring-line">
            <p className="text-muted">{t.name}</p>
            <p className="mt-1 font-display text-3xl font-bold text-accent">{t.value}</p>
            <p className="mt-2">{t.text}</p>
          </div>
        ))}
      </div>
      <a href="#contact" className="btn btn-accent mt-8">{CTA}<Arrow /></a>
    </section>
  )
}

/* ---------------------------------------------------------------- FAQ: a plain accordion */
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="bg-surface">
      <div className="page py-14 lg:py-20">
        <h2 className="h2">שאלות נפוצות</h2>
        <ul className="mt-7 max-w-3xl border-t border-line">
          {FAQS.map(([q, a], i) => (
            <li key={q} className="border-b border-line">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-4 text-start font-display text-lg font-semibold">
                <span>{q}</span>
                <CaretDown size={18} weight="bold" className={`shrink-0 text-muted transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {open === i && <p className="fade-in pb-5 text-lg text-muted">{a}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Closing form */
function Contact({ contactRef }) {
  return (
    <section id="contact" ref={contactRef} className="page py-14 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="h2">רוצים לשמוע עוד על הקורס?</h2>
          <p className="mt-4 max-w-md text-lg text-muted">השאירו פרטים לשיחת ייעוץ והכוונה. נבדוק יחד התאמה, מסלול מימון ומועדי פתיחה.</p>
          <a href={`tel:${PHONE}`} className="mt-6 inline-flex items-center gap-3 font-display text-3xl font-bold"><Phone size={26} weight="fill" className="text-accent" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
        </div>
        <div className="rounded-media bg-bg p-5 ring-1 ring-line sm:p-8"><LeadForm place="contact" full /></div>
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
    <div className={`fixed inset-x-0 bottom-0 z-30 flex gap-2 bg-bg p-3 shadow-[0_-1px_0_rgb(var(--line))] transition-transform duration-500 md:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}>
      <a href={`tel:${PHONE}`} className="btn flex-[0.7] ring-1 ring-inset ring-line"><Phone size={18} weight="bold" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
      <a href="#contact" className="btn btn-accent flex-1">{CTA}</a>
    </div>
  )
}

export default function App() {
  const heroRef = useRef(null)
  const contactRef = useRef(null)
  return (
    <>
      <a href="#about" className="fixed start-4 top-[-80px] z-50 rounded-full bg-ink px-4 py-2 text-bg transition-[top] focus:top-4">דילוג לתוכן</a>
      <Nav />
      <main>
        <Hero heroRef={heroRef} />
        <Partners />
        <About />
        <Audience />
        <Syllabus />
        <Projects />
        <Roles />
        <Credentials />
        <Funding />
        <Faq />
        <Contact contactRef={contactRef} />
      </main>
      <Footer />
      <StickyBar heroRef={heroRef} contactRef={contactRef} />
    </>
  )
}
