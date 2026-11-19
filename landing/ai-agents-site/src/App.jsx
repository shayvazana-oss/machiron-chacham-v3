import { Fragment, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, Phone, Pause, Play, List, X } from '@phosphor-icons/react'
import {
  IMG, VID, LOGO, SEQ, SEQ_FRAMES, PHONE, PRIVACY_URL, TERMS_URL, NAV_LINKS, FACTS, CAPABILITIES,
  PROJECTS, PHASES, ROLES, CERTS, LOGOS, TRACKS, FAQS,
} from './data.js'

gsap.registerPlugin(ScrollTrigger)

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches
const reduceMotion = mq('(prefers-reduced-motion: reduce)')
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

/* A looping clip that plays only while visible and can be paused by the visitor.
   Renders inside a positioned parent. With reduced motion it is a still image. */
function LoopVideo({ name, poster, alt, eager = false, className = 'absolute inset-0 h-full w-full object-cover' }) {
  const ref = useRef(null)
  const wanted = useRef(true)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && wanted.current) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  if (reduceMotion) return <img src={poster} alt={alt} className={className} />
  const toggle = () => {
    const v = ref.current
    wanted.current = v.paused
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }
  return (
    <>
      <video ref={ref} src={VID(name)} poster={poster} muted loop playsInline preload={eager ? 'auto' : 'none'} aria-label={alt}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className={className} />
      <button type="button" onClick={toggle} aria-label={playing ? 'השהיית הווידאו' : 'הפעלת הווידאו'}
        className="absolute bottom-4 left-4 grid h-10 w-10 place-items-center rounded-full bg-night/60 text-white transition-colors hover:bg-night/85">
        {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
      </button>
    </>
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

/* ---------------------------------------------------------------- Hero: one poster, one message */
function Hero({ heroRef }) {
  const [wide, setWide] = useState(false)
  useEffect(() => { setWide(mq('(min-width: 768px)')) }, [])
  return (
    <section id="home" ref={heroRef} className="page pt-20">
      <div className="media h-[calc(100dvh-6.5rem)] max-h-[880px] min-h-[600px]">
        {wide
          ? <LoopVideo eager name="m-hero" poster={IMG('m-hero')} alt="הסוכן, דמות הקורס, יושב על גג מול קו רקיע בשקיעה ומנופף" className="absolute inset-0 h-full w-full object-cover object-left" />
          : <img src={IMG('m-hero-v')} alt="הסוכן, דמות הקורס, יושב על גג מול קו רקיע בשקיעה" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-top" />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-night/80 via-night/30 to-transparent max-md:bg-gradient-to-t max-md:from-night max-md:via-night/75 max-md:via-40% max-md:to-transparent max-md:to-65%" />
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-10 lg:justify-center lg:p-16">
          <div className="pointer-events-auto max-w-2xl">
            <p className="text-base text-white/80 sm:text-lg">היחידה ללימודי חוץ ומפעל הסייבר של אלתא</p>
            <h1 className="mt-3 text-[2.3rem] sm:text-6xl lg:text-[4.75rem]">
              <span className="block whitespace-nowrap">תבנו סוכני AI</span>
              <span className="block whitespace-nowrap">שעובדים בשבילכם</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-white/85 sm:text-xl">קורס מעשי של 160 שעות אקדמיות. בונים סוכני AI ואוטומציות עסקיות ומסיימים עם תעודת הסמכה ממשלתית.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#contact" className="btn btn-accent">{CTA}<Arrow /></a>
              <a href={`tel:${PHONE}`} className="btn text-white ring-1 ring-inset ring-white/45 transition-colors hover:bg-white/10"><Phone size={18} weight="bold" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
            </div>
          </div>
        </div>
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

/* ---------------------------------------------------------------- Statement: the words arrive as you read */
function Statement() {
  const ref = useRef(null)
  const parts = [
    ['הקורס לא מלמד כלים. הוא מייצר', false], ['אנשי AI יישומיים', true],
    ['שלוקחים אתגר עסקי אמיתי, מאפיינים אותו, ובונים סוכן שמבצע את העבודה.', false],
  ]
  useEffect(() => {
    if (reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.sw', { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 82%', end: 'bottom 55%', scrub: true } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section className="page py-20 lg:py-32">
      <p ref={ref} className="max-w-[24ch] font-display text-[2rem] font-semibold leading-[1.18] sm:text-5xl lg:text-[4.25rem]">
        {parts.map(([text, marked], i) => (
          <span key={i} className={marked ? 'mark' : undefined}>
            {text.split(' ').map((w, j) => <Fragment key={j}><span className="sw">{w}</span> </Fragment>)}
          </span>
        ))}
      </p>
    </section>
  )
}

/* ---------------------------------------------------------------- The agent, built step by step.
   Desktop: the section pins and a frame sequence follows the scroll, one capability at a time.
   Mobile and reduced motion: the same clip loops next to a plain list. */
function AgentSequence() {
  const section = useRef(null)
  const canvas = useRef(null)
  const frames = useRef([])
  const current = useRef(0)
  const stepRef = useRef(0)
  const [step, setStep] = useState(0)
  const [scrub, setScrub] = useState(false)
  useEffect(() => { setScrub(!reduceMotion && mq('(min-width: 1024px)')) }, [])

  useEffect(() => {
    if (!scrub) return
    const c = canvas.current
    const draw = (i) => {
      const img = frames.current[i]
      if (!img || !img.complete || !img.naturalWidth) return
      const ctx2d = c.getContext('2d')
      const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight)
      const w = img.naturalWidth * s, h = img.naturalHeight * s
      ctx2d.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h)
    }
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      c.width = Math.round(c.clientWidth * dpr)
      c.height = Math.round(c.clientHeight * dpr)
      draw(current.current)
    }
    for (let i = 0; i < SEQ_FRAMES; i++) {
      const img = new Image()
      img.onload = () => { if (i === current.current) draw(i) }
      img.src = SEQ(i)
      frames.current[i] = img
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(c)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current, start: 'top top', end: '+=240%', pin: true,
        onUpdate: (self) => {
          const i = Math.round(self.progress * (SEQ_FRAMES - 1))
          if (i !== current.current) { current.current = i; draw(i) }
          const s = Math.min(CAPABILITIES.length - 1, Math.floor(self.progress * CAPABILITIES.length))
          if (s !== stepRef.current) { stepRef.current = s; setStep(s) }
        },
      })
    }, section)
    return () => { ro.disconnect(); ctx.revert() }
  }, [scrub])

  return (
    <section id="agent" ref={section} className="bg-surface">
      <div className={`page grid items-center gap-10 py-20 lg:grid-cols-12 lg:gap-14 ${scrub ? 'lg:h-[100dvh] lg:py-24' : 'lg:py-32'}`}>
        <div className="lg:col-span-5">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.4rem]">זה הסוכן שתדעו לבנות</h2>
          <ol className="mt-9 space-y-6">
            {CAPABILITIES.map((c, i) => {
              const active = !scrub || i === step
              return (
                <li key={c.title} className={`border-s-[3px] ps-5 transition-[opacity,border-color] duration-500 ${active ? 'border-accent opacity-100' : 'border-transparent opacity-35'}`}>
                  <h3 className="text-xl sm:text-2xl">{c.title}</h3>
                  <p className="mt-1.5 text-muted">{c.text}</p>
                </li>
              )
            })}
          </ol>
        </div>
        <div className="lg:col-span-7">
          <div className="media aspect-video">
            {scrub
              ? <canvas ref={canvas} className="absolute inset-0 h-full w-full" role="img" aria-label="הסוכן עומד על במה, ובזה אחר זה נדלקים סביבו חמישה כדורי אור שמתחברים אליו" />
              : <LoopVideo name="m-seq" poster={IMG('m-tools')} alt="הסוכן עומד על במה, וסביבו נדלקים חמישה כדורי אור שמתחברים אליו" />}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Projects */
function Projects() {
  return (
    <section id="projects" className="page py-24 lg:py-32">
      <h2 className="rv max-w-[16ch] text-4xl sm:text-5xl lg:text-6xl">8 פרויקטים, כל אחד <span className="mark">מערכת עובדת</span></h2>
      <p className="rv mt-5 max-w-xl text-lg text-muted sm:text-xl">לכל סוכן תפקיד משלו. אלה המערכות שבונים לאורך הקורס, מאפס.</p>
      <div className="rv media mt-12 aspect-video">
        <LoopVideo name="m-team" poster={IMG('m-team')} alt="חמישה סוכנים בצבעים שונים עומדים בשורה, לכל אחד אביזר אחר: אוזניות, זכוכית מגדלת, גרף, לוח שנה ומעטפה" />
      </div>
      <ul className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2">
        {PROJECTS.map(([title, text]) => (
          <li key={title}>
            <h3 className="text-xl sm:text-2xl">{title}</h3>
            <p className="mt-2 text-muted">{text}</p>
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

/* ---------------------------------------------------------------- Roles: one sentence, set large */
function Roles() {
  return (
    <section className="page py-24 lg:py-36">
      <p className="rv max-w-[30ch] font-display text-[1.9rem] font-semibold leading-[1.28] sm:text-5xl sm:leading-[1.22] lg:text-[3.6rem]">
        <span className="text-muted">בוגרי הקורס משתלבים בתפקידים כמו </span>
        {ROLES.map((r, i) => (
          <Fragment key={r}>{r}<span className="text-muted">{i < ROLES.length - 2 ? ', ' : i === ROLES.length - 2 ? ' או ' : '.'}</span></Fragment>
        ))}
      </p>
      <p className="rv mt-8 max-w-xl text-lg text-muted sm:text-xl">בארגונים בינוניים וגדולים, או כעצמאים שמטמיעים AI ואוטומציה אצל לקוחות.</p>
    </section>
  )
}

/* ---------------------------------------------------------------- Certificates and partners */
function Credentials() {
  return (
    <section className="page pb-24 lg:pb-32">
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
      <div className="rv mt-16 rounded-media bg-white px-6 py-10 sm:px-12 sm:py-12">
        <p className="max-w-2xl text-lg text-[#40463D]">היחידה ללימודי חוץ מובילה מזה שלוש שנים את חממת התעסוקה של שירות התעסוקה, עם מעל 80% השמה. בין השותפים והגופים שאיתם היא עובדת:</p>
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
    <section id="funding" className="bg-surface py-24 lg:py-32">
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
    <section id="faq" className="page py-24 lg:py-32">
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
          <div key={open} className="fade-in rounded-media bg-surface p-10 xl:p-12">
            <h3 className="text-3xl">{FAQS[open][0]}</h3>
            <p className="mt-5 text-xl leading-relaxed text-muted">{FAQS[open][1]}</p>
          </div>
        </div>
      </div>
    </section>
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
        className={`w-full rounded-field border bg-bg px-4 py-3.5 text-lg text-ink placeholder:text-muted/60 transition-colors focus:border-ink focus:outline-none ${error ? 'border-[#C2412C]' : 'border-line'}`} />
      {error && <p className="mt-1.5 text-[#C2412C] dark:text-[#FF9A85]">{error}</p>}
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
    <section id="contact" ref={contactRef} className="page pb-16 lg:pb-24">
      <div className="grid gap-10 rounded-media bg-accent p-6 text-accent-ink sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-16">
        <div className="flex flex-col">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl">למדו לבנות AI, לפני שהשוק יתקדם בלעדיכם</h2>
          <p className="mt-5 max-w-md text-xl">השאירו פרטים לשיחת ייעוץ והכוונה. נבדוק יחד התאמה, מסלול מימון ומועדי פתיחה.</p>
          <a href={`tel:${PHONE}`} className="mt-7 inline-flex items-center gap-3 self-start font-display text-4xl font-semibold"><Phone size={30} weight="fill" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
          <img src={IMG('m-cut-wave')} alt="" loading="lazy" className="mt-auto hidden w-44 self-end pt-8 lg:block" />
        </div>
        <div className="rounded-media bg-surface p-6 text-ink sm:p-9">
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
                {errors.terms && <p className="text-[#C2412C] dark:text-[#FF9A85]">{errors.terms}</p>}
              </div>
              <button type="submit" disabled={status === 'sending'} className="btn btn-ink w-full disabled:opacity-60">{status === 'sending' ? 'שולחים...' : <>{CTA}<Arrow /></>}</button>
              {errors.form && <p role="alert" className="text-[#C2412C] dark:text-[#FF9A85]">{errors.form}</p>}
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
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.rv').forEach((el) => io.observe(el))
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    document.fonts?.ready.then(refresh)
    return () => { io.disconnect(); window.removeEventListener('load', refresh) }
  }, [])
  return (
    <>
      <a href="#agent" className="fixed start-4 top-[-80px] z-50 rounded-full bg-ink px-4 py-2 text-bg transition-[top] focus:top-4">דילוג לתוכן</a>
      <Nav />
      <main>
        <Hero heroRef={heroRef} />
        <Facts />
        <Statement />
        <AgentSequence />
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
