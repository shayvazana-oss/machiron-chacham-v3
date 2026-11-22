import { Fragment, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Phone, Pause, Play, List, X, Desktop, DeviceMobile, CheckCircle, Check, Lightbulb, TrendUp } from '@phosphor-icons/react'
import {
  IMG, LOGO, PHONE, PRIVACY_URL, TERMS_URL, NAV_LINKS, FACTS, CAPABILITIES,
  PROJECTS, PHASES, ROLES, CERTS, LOGOS, TRACKS, FAQS,
} from './data.js'

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const CTA = 'לשיחת ייעוץ' // one label for the one conversion intent on this page

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

/* ---------------------------------------------------------------- Navigation */
function Nav() {
  const sentinel = useRef(null)
  const atTop = useOnScreen(sentinel)
  const [open, setOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <>
      <div ref={sentinel} className="absolute top-0 h-4 w-px" aria-hidden="true" />
      <header className={`fixed inset-x-0 top-0 z-40 bg-bg transition-shadow duration-300 ${atTop || open ? '' : 'shadow-[0_1px_0_rgb(var(--line))]'}`}>
        <div className="page flex h-16 items-center justify-between gap-6">
          <a href="#home" className="flex items-center gap-2.5 whitespace-nowrap font-display text-base font-semibold sm:text-lg">
            <img src={IMG('m-cut')} alt="" className="h-8 w-8 object-contain" />
            <span dir="ltr">AI Agent Specialist</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="ניווט ראשי">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href} className="text-[1.0625rem] text-muted transition-colors hover:text-ink">{l.label}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#contact" className="btn btn-accent !px-4 !py-2.5 !text-base sm:!px-5">{CTA}</a>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={open} className="grid h-11 w-11 place-items-center rounded-full lg:hidden">
              {open ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-30 bg-bg px-5 pt-24 transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
        <nav className="flex flex-col" aria-label="ניווט נייד">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-line py-5 font-display text-3xl font-semibold">{l.label}</a>
          ))}
        </nav>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- Hero: the message beside the live demo */
function Hero({ heroRef }) {
  return (
    <section id="home" ref={heroRef} className="page pb-12 pt-24 lg:pb-20 lg:pt-28">
      <div className="grid items-center gap-9 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="enter text-base text-muted sm:text-lg">היחידה ללימודי חוץ ומפעל הסייבר של אלתא</p>
          <h1 className="enter mt-3 text-[2.55rem] leading-[1.04] [animation-delay:80ms] sm:text-6xl lg:text-[4.75rem]">
            <span className="block whitespace-nowrap">תבנו סוכני AI</span>
            <span className="mark block whitespace-nowrap">שעובדים בשבילכם</span>
          </h1>
          <p className="enter mt-5 max-w-md text-lg text-muted [animation-delay:160ms] sm:text-xl">קורס מעשי של 160 שעות אקדמיות. בונים סוכני AI ואוטומציות עסקיות ומסיימים עם תעודת הסמכה ממשלתית.</p>
          <div className="enter mt-7 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
            <a href="#contact" className="btn btn-accent">{CTA}<Arrow /></a>
            <a href={`tel:${PHONE}`} className="btn ring-1 ring-inset ring-line transition-colors hover:bg-surface"><Phone size={18} weight="bold" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
          </div>
        </div>
        <figure className="enter mx-auto w-full max-w-[440px] [animation-delay:200ms] lg:col-span-5">
          <AgentsAtWork />
          <figcaption className="mt-3 text-base leading-snug text-muted sm:text-lg">מבקשים במשפט אחד. הסוכן שבניתם עושה את העבודה.</figcaption>
        </figure>
      </div>
    </section>
  )
}

function Facts() {
  return (
    <section className="page py-12 lg:py-16" aria-label="עיקרי הקורס">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-4 lg:gap-x-0">
        {FACTS.map(([big, small]) => (
          <li key={big} className="border-line lg:border-s lg:ps-8 lg:first:border-s-0 lg:first:ps-0">
            <p className="font-display text-xl font-semibold leading-tight sm:text-2xl">{big}</p>
            <p className="mt-1.5 text-base text-muted">{small}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------------- Statement */
function Statement() {
  return (
    <section className="page py-20 lg:py-32">
      <p className="rv max-w-[24ch] font-display text-[2rem] font-semibold leading-[1.18] sm:text-5xl lg:text-[4.25rem]">
        הקורס לא מלמד כלים. הוא מייצר <span className="mark">אנשי AI יישומיים</span> שלוקחים אתגר עסקי אמיתי, מאפיינים אותו, ובונים סוכן שמבצע את העבודה.
      </p>
    </section>
  )
}

/* ---------------------------------------------------------------- The agent you will know how to build */
function Agent() {
  return (
    <section id="agent" className="bg-surface">
      <div className="page grid items-center gap-10 py-20 lg:grid-cols-12 lg:gap-14 lg:py-28">
        <div className="lg:col-span-5">
          <h2 className="rv text-4xl sm:text-5xl lg:text-[3.4rem]">זה הסוכן שתדעו לבנות</h2>
          <ol className="rv mt-8 space-y-6">
            {CAPABILITIES.map((c) => (
              <li key={c.title} className="border-s-[3px] border-accent ps-5">
                <h3 className="text-xl sm:text-2xl">{c.title}</h3>
                <p className="mt-1.5 text-muted">{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="rv media aspect-video lg:col-span-7">
          <img src={IMG('m-tools')} alt="הסוכן עומד על במה, וסביבו חמישה כדורי אור שמחוברים אליו" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Projects: eight stills, one per project */
function Projects() {
  return (
    <section id="projects" className="page py-20 lg:py-28">
      <h2 className="rv max-w-[18ch] text-4xl sm:text-5xl lg:text-6xl">8 פרויקטים, כל אחד <span className="mark">מערכת עובדת</span></h2>
      <p className="rv mt-4 max-w-xl text-lg text-muted sm:text-xl">לכל סוכן תפקיד משלו. אלה המערכות שבונים לאורך הקורס, מאפס.</p>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
        {PROJECTS.map(([title, text], i) => (
          <li key={title} className="rv">
            <div className="media aspect-[4/5]">
              <img src={IMG(`p${i + 1}`)} alt={`סוכן בעבודה: ${title}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <h3 className="mt-3 text-lg leading-snug sm:text-xl">{title}</h3>
            <p className="mt-1 text-base text-muted">{text}</p>
          </li>
        ))}
      </ul>
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
    <section id="syllabus" className="bg-surface py-24 lg:py-32">
      <div className="page">
        <h2 className="rv text-4xl sm:text-5xl lg:text-6xl">12 מודולים בשלושה שלבים</h2>
        <div role="tablist" aria-label="שלבי הסילבוס" onKeyDown={onKey} className="rv mt-9 flex flex-wrap gap-2">
          {PHASES.map((p, i) => (
            <button key={p.tab} id={`tab-${i}`} role="tab" type="button" aria-selected={tab === i} aria-controls="syllabus-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}
              className={`rounded-full px-5 py-2.5 font-display text-lg font-medium transition-colors duration-300 ${tab === i ? 'bg-ink text-bg' : 'text-muted ring-1 ring-inset ring-line hover:text-ink'}`}>{p.tab}</button>
          ))}
        </div>
        <div id="syllabus-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="media aspect-[4/3] lg:sticky lg:top-24">
              <img key={phase.img} src={IMG(phase.img)} alt={phase.alt} loading="lazy" className="fade-in absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
          <ol key={tab} className="fade-in space-y-9 lg:col-span-7 lg:pt-2">
            {phase.modules.map(([title, text], i) => (
              <li key={title} className="grid grid-cols-[2.75rem_1fr] gap-x-2 sm:grid-cols-[3.5rem_1fr]">
                <span className="font-display text-2xl font-medium tabular-nums text-muted sm:text-3xl" aria-hidden="true">{offset + i + 1}</span>
                <div>
                  <h3 className="text-xl sm:text-2xl">{title}</h3>
                  <p className="mt-1.5 max-w-[60ch] text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-14 max-w-2xl border-t border-line pt-6 text-muted">160 שעות אקדמיות של למידה עיונית, מעשית ועבודה על פרויקט גמר. לקבלת התעודות נדרשות 80% נוכחות, מטלות שוטפות ועמידה במבחנים ובפרויקטי הסיום.</p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Roles: one sentence, set large, with the team picture */
function Roles() {
  return (
    <section className="page py-24 lg:py-32">
      <p className="rv max-w-[30ch] font-display text-[1.9rem] font-semibold leading-[1.28] sm:text-5xl sm:leading-[1.22] lg:text-[3.6rem]">
        <span className="text-muted">בוגרי הקורס משתלבים בתפקידים כמו </span>
        {ROLES.map((r, i) => (
          <Fragment key={r}>{r}<span className="text-muted">{i < ROLES.length - 2 ? ', ' : i === ROLES.length - 2 ? ' או ' : '.'}</span></Fragment>
        ))}
      </p>
      <p className="rv mt-8 max-w-xl text-lg text-muted sm:text-xl">בארגונים בינוניים וגדולים, או כעצמאים שמטמיעים AI ואוטומציה אצל לקוחות.</p>
      <div className="rv media mt-12 aspect-video lg:aspect-[21/9]">
        <img src={IMG('m-team')} alt="חמישה סוכנים בצבעים שונים עומדים בשורה, לכל אחד אביזר אחר: אוזניות, זכוכית מגדלת, גרף, לוח שנה ומעטפה" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Certificates and partners */
function Credentials() {
  return (
    <section className="page py-24 lg:py-32">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="rv media aspect-[4/3] lg:col-span-6">
          <img src={IMG('m-grad')} alt="הסוכן עם כובע סיום, לצידו תעודה מגולגלת עם חותמת זהב" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="lg:col-span-6">
          <h2 className="rv text-4xl sm:text-5xl lg:text-6xl">מסיימים עם שתי תעודות</h2>
          <dl className="rv mt-9 space-y-7">
            {CERTS.map(([title, text]) => (
              <div key={title}>
                <dt className="font-display text-2xl font-semibold">{title}</dt>
                <dd className="mt-1.5 text-lg text-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {/* The partner logos are the organisations' own artwork, so they sit on white in both themes. */}
      <div className="rv mt-16 rounded-media border border-line bg-white px-6 py-10 sm:px-12 sm:py-12">
        <p className="max-w-2xl text-lg text-muted">היחידה ללימודי חוץ מובילה מזה שלוש שנים את חממת התעסוקה של שירות התעסוקה, עם מעל 80% השמה. בין השותפים והגופים שאיתם היא עובדת:</p>
        <ul className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-5">
          {LOGOS.map(([file, name]) => (
            <li key={file} className="flex justify-center"><img src={LOGO(file)} alt={name} loading="lazy" className="max-h-14 w-auto max-w-[9.5rem] object-contain" /></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Funding: three rows, not three cards */
function Funding() {
  return (
    <section id="funding" className="py-24 lg:py-32">
      <div className="page">
        <h2 className="rv text-4xl sm:text-5xl lg:text-6xl">שלושה מסלולי מימון</h2>
        <p className="rv mt-5 max-w-xl text-lg text-muted sm:text-xl">בשיחת הייעוץ בודקים יחד איזה מסלול מתאים לכם.</p>
        <div className="rv mt-12 border-t border-line">
          {TRACKS.map((t) => (
            <div key={t.id} className="grid items-baseline gap-x-10 gap-y-2 border-b border-line py-8 md:grid-cols-[14rem_18rem_1fr]">
              <p className="text-lg text-muted">{t.name}</p>
              <p className="font-display text-5xl font-semibold sm:text-6xl">{t.value}</p>
              <p className="text-lg">{t.text}</p>
            </div>
          ))}
        </div>
        <a href="#contact" className="btn btn-ink mt-10">{CTA}<Arrow /></a>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- FAQ: questions on one side, the answer on the other */
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="bg-surface"><div className="page py-24 lg:py-32">
      <h2 className="rv text-4xl sm:text-5xl lg:text-6xl">שאלות נפוצות</h2>
      <div className="mt-12 grid gap-x-14 lg:grid-cols-12">
        <ul className="lg:col-span-5">
          {FAQS.map(([q, a], i) => (
            <li key={q}>
              <button type="button" onClick={() => setOpen(i)} aria-expanded={open === i}
                className={`flex w-full items-center justify-between gap-4 py-3.5 text-start font-display text-xl font-medium transition-colors duration-300 sm:text-2xl ${open === i ? 'text-ink' : 'text-muted hover:text-ink'}`}>
                <span>{q}</span>
                <span className={`transition-opacity duration-300 ${open === i ? 'opacity-100' : 'opacity-0'}`}><Arrow /></span>
              </button>
              {open === i && <p className="fade-in pb-5 text-lg text-muted lg:hidden">{a}</p>}
            </li>
          ))}
        </ul>
        <div className="hidden lg:col-span-7 lg:block">
          <div key={open} className="fade-in rounded-media bg-bg p-10 xl:p-12">
            <h3 className="text-3xl">{FAQS[open][0]}</h3>
            <p className="mt-5 text-xl leading-relaxed text-muted">{FAQS[open][1]}</p>
          </div>
        </div>
      </div>
    </div></section>
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
      <label htmlFor={id} className="mb-2 block font-medium">{label}</label>
      <input id={id} name={id} aria-invalid={error ? 'true' : undefined} {...props}
        className={`w-full rounded-field border bg-surface px-4 py-3.5 text-lg text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none ${error ? 'border-[#C2412C]' : 'border-line'}`} />
      {error && <p className="mt-1.5 text-[#C2412C]">{error}</p>}
    </div>
  )
}

function Contact({ contactRef }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [errors, setErrors] = useState({})
  const [track, setTrack] = useState('')
  const utm = useRef({})
  useEffect(() => { utm.current = readUtm() }, [])
  const onSubmit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const mobile = f.mobile.value.replace(/\D/g, '')
    const errs = {}
    if (f.name.value.trim().length < 2) errs.name = 'נא למלא שם מלא.'
    if (!/^0\d{8,9}$/.test(mobile)) errs.mobile = 'נא למלא מספר נייד תקין.'
    if (!f.consent_terms.checked) errs.terms = 'יש לאשר את מדיניות הפרטיות והתקנון.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    const done = () => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'generate_lead', form: 'lead-ai-agents', track: track || 'לא נבחר' })
      if (window.fbq) { try { window.fbq('track', 'Lead') } catch { /* pixel not ready */ } }
      setStatus('sent')
    }
    if (!isLive()) return setTimeout(done, 900) // preview: nothing is sent
    const body = new URLSearchParams({
      'form-name': 'lead-ai-agents', subject: 'ליד חדש: קורס AI Agents', 'bot-field': f['bot-field'].value,
      name: f.name.value.trim(), mobile, email: f.email.value.trim(), track,
      consent_marketing: f.consent_marketing.checked ? 'yes' : '', consent_terms: 'yes',
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
  return (
    <section id="contact" ref={contactRef} className="page py-16 lg:py-24">
      <div className="grid gap-10 rounded-media bg-accent p-6 text-accent-ink sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-16">
        <div className="flex flex-col">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl">למדו לבנות AI, לפני שהשוק יתקדם בלעדיכם</h2>
          <p className="mt-5 max-w-md text-xl">השאירו פרטים לשיחת ייעוץ והכוונה. נבדוק יחד התאמה, מסלול מימון ומועדי פתיחה.</p>
          <a href={`tel:${PHONE}`} className="mt-7 inline-flex items-center gap-3 self-start font-display text-4xl font-semibold"><Phone size={30} weight="fill" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
          <img src={IMG('m-cut-wave')} alt="" loading="lazy" className="mt-auto hidden w-44 self-end pt-8 lg:block" />
        </div>
        <div className="rounded-media bg-bg p-6 text-ink sm:p-9">
          {status === 'sent' ? (
            <div className="flex min-h-[26rem] flex-col items-center justify-center text-center" role="status">
              <img src={IMG('m-cut-wave')} alt="" className="w-32" />
              <h3 className="mt-6 text-3xl">קיבלנו את הפרטים</h3>
              <p className="mt-2 text-lg text-muted">יועץ לימודים יחזור אליכם בהקדם.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-5">
              <p className="hidden" aria-hidden="true"><label>לא למלא: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
              <Field label="שם מלא" id="name" type="text" autoComplete="name" error={errors.name} />
              <Field label="נייד" id="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="050-0000000" dir="ltr" style={{ textAlign: 'right' }} error={errors.mobile} />
              <Field label="אימייל (לא חובה)" id="email" type="email" inputMode="email" autoComplete="email" dir="ltr" style={{ textAlign: 'right' }} />
              <fieldset>
                <legend className="mb-2 font-medium">מסלול מימון לבדיקה (לא חובה)</legend>
                <div className="flex flex-wrap gap-2">
                  {TRACKS.map((t) => (
                    <button type="button" key={t.id} onClick={() => setTrack(track === t.id ? '' : t.id)} aria-pressed={track === t.id}
                      className={`rounded-full px-4 py-2 transition-colors duration-300 ${track === t.id ? 'bg-ink text-bg' : 'text-muted ring-1 ring-inset ring-line hover:text-ink'}`}>{t.id}</button>
                  ))}
                </div>
              </fieldset>
              <div className="space-y-2.5 text-base text-muted">
                <label className="flex gap-2.5"><input type="checkbox" name="consent_marketing" className="mt-1 h-4 w-4 flex-none accent-[rgb(var(--ink))]" /><span>מאשר/ת קבלת דיוור מהיחידה ללימודי חוץ בהתאם למדיניות הפרטיות</span></label>
                <label className="flex gap-2.5"><input type="checkbox" name="consent_terms" required className="mt-1 h-4 w-4 flex-none accent-[rgb(var(--ink))]" /><span>מאשר/ת שקראתי את <a className="text-ink underline" href={PRIVACY_URL} target="_blank" rel="noopener">מדיניות הפרטיות</a> ואת <a className="text-ink underline" href={TERMS_URL} target="_blank" rel="noopener">תקנון האתר</a></span></label>
                {errors.terms && <p className="text-[#C2412C]">{errors.terms}</p>}
              </div>
              <button type="submit" disabled={status === 'sending'} className="btn btn-ink w-full disabled:opacity-60">{status === 'sending' ? 'שולחים...' : <>{CTA}<Arrow /></>}</button>
              {errors.form && <p role="alert" className="text-[#C2412C]">{errors.form}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="page flex flex-wrap items-center justify-between gap-4 pb-28 pt-4 text-base text-muted md:pb-12">
      <span>© היחידה ללימודי חוץ, בשיתוף מפעל הסייבר של אלתא מערכות</span>
      <span className="flex gap-6">
        <a className="transition-colors hover:text-ink" href={PRIVACY_URL} target="_blank" rel="noopener">מדיניות פרטיות</a>
        <a className="transition-colors hover:text-ink" href={TERMS_URL} target="_blank" rel="noopener">תקנון</a>
      </span>
    </footer>
  )
}

/* Mobile action bar: appears once the hero is gone and steps aside at the form. */
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
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    document.querySelectorAll('.rv').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <>
      <a href="#agent" className="fixed start-4 top-[-80px] z-50 rounded-full bg-ink px-4 py-2 text-bg transition-[top] focus:top-4">דילוג לתוכן</a>
      <Nav />
      <main>
        <Hero heroRef={heroRef} />
        <Facts />
        <Statement />
        <Agent />
        <Projects />
        <Syllabus />
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
