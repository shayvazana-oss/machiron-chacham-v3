import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, Phone, Pause, Play, List, X } from '@phosphor-icons/react'
import {
  IMG, VID, LOGO, SEQ, SEQ_FRAMES, PHONE, PRIVACY_URL, TERMS_URL, NAV_LINKS, FACTS, CAPABILITIES,
  PROJECTS, PHASES, ROLES, CERTS, LOGOS, TRACKS, FAQS,
} from './data.js'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })
const Mascot3D = lazy(() => import('./Mascot3D.jsx'))

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches
const reduceMotion = mq('(prefers-reduced-motion: reduce)')
const CTA = 'לשיחת ייעוץ' // one label for the one conversion intent on this page

/* One switch for all moving media on the page (the nav holds the button). */
const motion = { on: !reduceMotion, subs: new Set() }
const setMotion = (v) => {
  motion.on = v
  document.documentElement.dataset.motion = v ? 'on' : 'off'
  motion.subs.forEach((f) => f(v))
}
function useMotion() {
  const [on, set] = useState(motion.on)
  useEffect(() => { motion.subs.add(set); return () => motion.subs.delete(set) }, [])
  return on
}

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

/* A looping clip. Plays only while it is on screen and motion is switched on; otherwise shows its poster. */
function Clip({ name, alt = '', eager = false, className = 'absolute inset-0 h-full w-full object-cover' }) {
  const ref = useRef(null)
  const visible = useOnScreen(ref, { threshold: 0.2 })
  const on = useMotion()
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (visible && on) v.play().catch(() => {})
    else v.pause()
  }, [visible, on])
  return <video ref={ref} src={VID(name)} poster={IMG(name)} muted loop playsInline preload={eager ? 'auto' : 'metadata'}
    aria-label={alt || undefined} aria-hidden={alt ? undefined : 'true'} className={className} />
}

const Arrow = () => <ArrowLeft size={18} weight="bold" aria-hidden="true" />

/* ---------------------------------------------------------------- Navigation */
function Nav() {
  const sentinel = useRef(null)
  const atTop = useOnScreen(sentinel)
  const [open, setOpen] = useState(false)
  const on = useMotion()
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
            <button type="button" onClick={() => setMotion(!on)} aria-pressed={!on} aria-label={on ? 'השהיית התנועה בעמוד' : 'הפעלת התנועה בעמוד'}
              className="hidden h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:text-ink sm:grid">
              {on ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
            </button>
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

/* ---------------------------------------------------------------- Hero.
   Phone: one full-screen vertical clip. Desktop: the headline beside a drifting wall of the agents at work. */
const WALL = [['p1', 'p2', 'p3'], ['p5', 'm-hero-v', 'p4'], ['p6', 'p7', 'p8']]
function Hero({ heroRef }) {
  const root = useRef(null)
  const [wide, setWide] = useState(false)
  useEffect(() => { setWide(mq('(min-width: 1024px)')) }, [])
  useEffect(() => {
    if (reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.hw', { yPercent: 115, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.1 })
      gsap.from('.hf', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.75 })
      gsap.from('.wall-col', { yPercent: 18, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.2 })
    }, root)
    return () => ctx.revert()
  }, [wide])
  const words = (text) => text.split(' ').map((w, i) => (
    <Fragment key={i}><span className="inline-block overflow-hidden pb-[0.12em] align-bottom"><span className="hw inline-block">{w}</span></span> </Fragment>
  ))
  return (
    <section id="home" ref={heroRef} className="relative overflow-hidden bg-night text-white">
      <div ref={root} className="relative flex h-[100dvh] min-h-[620px] flex-col justify-end pt-16 lg:max-h-[1000px] lg:justify-center">
        {wide ? (
          <div className="absolute inset-y-0 left-0 w-[56%] overflow-hidden" aria-hidden="true">
            <div className="grid h-full origin-center rotate-[5deg] scale-[1.12] grid-cols-3 gap-4 px-4">
              {WALL.map((col, c) => (
                <div key={c} className={`wall-col ${c === 1 ? '-mt-40' : '-mt-10'}`}>
                  <div className={`space-y-4 ${c === 1 ? 'drift-b' : 'drift-a'}`}>
                    {col.map((name) => <div key={name} className="media aspect-[9/16]"><Clip name={name} eager /></div>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-night from-[4%] via-night/40 via-[26%] to-transparent to-[55%]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-night to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
          </div>
        ) : (
          <>
            <Clip eager name="m-hero-v" alt="הסוכן, דמות הקורס, קופץ על גג מול קו רקיע בשקיעה, וכדורי אור חגים סביבו" className="absolute inset-0 h-full w-full object-cover object-top" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/70 via-35% to-transparent to-65%" />
          </>
        )}
        <div className="page relative pb-8 lg:pb-0">
          <div className="max-w-xl">
            <p className="hf text-base text-white/80 sm:text-lg">היחידה ללימודי חוץ ומפעל הסייבר של אלתא</p>
            <h1 className="mt-3 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[5.2rem]">
              <span className="block whitespace-nowrap">{words('תבנו סוכני AI')}</span>
              <span className="block whitespace-nowrap text-accent">{words('שעובדים בשבילכם')}</span>
            </h1>
            <p className="hf mt-5 max-w-md text-lg text-white/85 sm:text-xl">קורס מעשי של 160 שעות אקדמיות. בונים סוכני AI ואוטומציות עסקיות ומסיימים עם תעודת הסמכה ממשלתית.</p>
            <div className="hf mt-7 flex flex-wrap items-center gap-3">
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
   The section pins and a frame sequence follows the scroll, one capability at a time.
   With reduced motion it is a still image next to the full list. */
function AgentSequence() {
  const section = useRef(null)
  const canvas = useRef(null)
  const frames = useRef([])
  const current = useRef(0)
  const stepRef = useRef(0)
  const [step, setStep] = useState(0)
  const scrub = !reduceMotion

  useEffect(() => {
    if (!scrub) return
    const c = canvas.current
    const stride = mq('(min-width: 1024px)') ? 1 : 2 // phones load every second frame
    const count = Math.ceil(SEQ_FRAMES / stride)
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
    for (let i = 0; i < count; i++) {
      const img = new Image()
      img.onload = () => { if (i === current.current) draw(i) }
      img.src = SEQ(Math.min(SEQ_FRAMES - 1, i * stride))
      frames.current[i] = img
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(c)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current, start: 'top top', end: '+=260%', pin: true,
        onUpdate: (self) => {
          const i = Math.round(self.progress * (count - 1))
          if (i !== current.current) { current.current = i; draw(i) }
          const st = Math.min(CAPABILITIES.length - 1, Math.floor(self.progress * CAPABILITIES.length))
          if (st !== stepRef.current) { stepRef.current = st; setStep(st) }
        },
      })
    }, section)
    return () => { ro.disconnect(); ctx.revert() }
  }, [scrub])

  return (
    <section id="agent" ref={section} className="bg-surface">
      <div className={`page flex flex-col justify-center gap-7 py-16 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14 ${scrub ? 'h-[100dvh] min-h-[640px] pt-20' : 'lg:py-32'}`}>
        <div className="lg:order-2 lg:col-span-7">
          <div className="media aspect-video max-lg:-mx-5 max-lg:rounded-none sm:max-lg:-mx-8">
            {scrub
              ? <canvas ref={canvas} className="absolute inset-0 h-full w-full" role="img" aria-label="הסוכן עומד על במה, ובזה אחר זה נדלקים סביבו חמישה כדורי אור שמתחברים אליו" />
              : <img src={IMG('m-tools')} alt="הסוכן עומד על במה, וסביבו חמישה כדורי אור שמחוברים אליו" className="absolute inset-0 h-full w-full object-cover" />}
          </div>
        </div>
        <div className="lg:order-1 lg:col-span-5">
          <h2 className="text-[2rem] sm:text-5xl lg:text-[3.4rem]">זה הסוכן שתדעו לבנות</h2>
          {scrub && (
            <div className="mt-5 flex gap-1.5 lg:hidden" aria-hidden="true">
              {CAPABILITIES.map((c, i) => <span key={c.title} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? 'bg-accent' : 'bg-line'}`} />)}
            </div>
          )}
          <ol className={`mt-6 lg:mt-9 lg:space-y-6 ${scrub ? 'max-lg:relative max-lg:min-h-[11.5rem]' : 'space-y-6'}`}>
            {CAPABILITIES.map((c, i) => {
              const active = !scrub || i === step
              return (
                <li key={c.title} className={`border-accent transition-[opacity,border-color] duration-500 lg:border-s-[3px] lg:ps-5 ${scrub ? 'max-lg:absolute max-lg:inset-x-0 max-lg:top-0' : ''} ${active ? 'opacity-100' : 'opacity-0 lg:border-transparent lg:opacity-35'}`}>
                  <h3 className="text-xl sm:text-2xl">{c.title}</h3>
                  <p className="mt-1.5 text-muted">{c.text}</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Projects: a reel of eight clips, one per project.
   Desktop: the section pins and the reel pans sideways with the scroll. Phones: swipe. */
function Projects() {
  const wrap = useRef(null)
  const track = useRef(null)
  const [pan, setPan] = useState(false)
  useEffect(() => { setPan(!reduceMotion && mq('(min-width: 1024px)')) }, [])
  useEffect(() => {
    if (!pan) return
    const ctx = gsap.context(() => {
      const dist = () => track.current.scrollWidth - wrap.current.clientWidth
      gsap.to(track.current, {
        x: () => dist(), ease: 'none', // RTL: the reel runs to the left, so it travels right
        scrollTrigger: { trigger: wrap.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      })
    }, wrap)
    return () => ctx.revert()
  }, [pan])
  return (
    <section id="projects" ref={wrap} className={`overflow-hidden ${pan ? 'flex h-[100dvh] min-h-[680px] flex-col justify-center pt-16' : 'py-20 lg:py-32'}`}>
      <div className="page">
        <h2 className="max-w-[18ch] text-4xl sm:text-5xl lg:text-6xl">8 פרויקטים, כל אחד <span className="mark">מערכת עובדת</span></h2>
        <p className="mt-4 max-w-xl text-lg text-muted sm:text-xl">לכל סוכן תפקיד משלו. אלה המערכות שבונים לאורך הקורס, מאפס.</p>
      </div>
      <ul ref={track} className={`mt-9 flex gap-4 ps-5 sm:gap-5 sm:ps-8 lg:ps-[max(2rem,calc((100vw-1240px)/2+2rem))] ${pan ? 'w-max pe-[30vw] will-change-transform' : 'snap-x snap-mandatory overflow-x-auto pe-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'}`}>
        {PROJECTS.map(([title, text], i) => (
          <li key={title} className="w-[68vw] max-w-[300px] flex-none snap-start lg:w-[min(300px,28dvh)]">
            <div className="media aspect-[9/16]"><Clip name={`p${i + 1}`} alt={`סוכן בעבודה: ${title}`} /></div>
            <h3 className="mt-4 text-xl leading-snug">{title}</h3>
            <p className="mt-1.5 text-muted">{text}</p>
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

/* ---------------------------------------------------------------- Roles: one sentence, set large over the team clip */
function Roles() {
  return (
    <section className="relative overflow-hidden bg-night text-white">
      <Clip name="m-team" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      <div className="page relative py-28 lg:py-44">
        <p className="rv max-w-[30ch] font-display text-[1.9rem] font-semibold leading-[1.28] sm:text-5xl sm:leading-[1.22] lg:text-[3.6rem]">
          <span className="text-white/65">בוגרי הקורס משתלבים בתפקידים כמו </span>
          {ROLES.map((r, i) => (
            <Fragment key={r}>{r}<span className="text-white/65">{i < ROLES.length - 2 ? ', ' : i === ROLES.length - 2 ? ' או ' : '.'}</span></Fragment>
          ))}
        </p>
        <p className="rv mt-8 max-w-xl text-lg text-white/80 sm:text-xl">בארגונים בינוניים וגדולים, או כעצמאים שמטמיעים AI ואוטומציה אצל לקוחות.</p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- A real 3D model of the agent. Drag to spin it. */
function Stage() {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '600px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <section ref={ref} className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none overflow-hidden" aria-hidden="true" dir="ltr">
        <div className="type-run flex w-max gap-[0.4em] whitespace-nowrap font-display text-[32vw] font-semibold leading-none text-ink/[0.06] lg:text-[20vw]">
          <span>AI AGENT</span><span>AI AGENT</span><span>AI AGENT</span><span>AI AGENT</span>
        </div>
      </div>
      <div className="page relative text-center">
        <h2 className="rv text-4xl sm:text-5xl lg:text-6xl">קחו אותו לסיבוב</h2>
        <p className="rv mt-3 text-lg text-muted">מודל תלת-ממדי בזמן אמת. גררו כדי לסובב.</p>
        <div className="mx-auto mt-2 aspect-square w-full max-w-[560px]">
          {near && <Suspense fallback={null}><Mascot3D url={`${import.meta.env.BASE_URL}model/mascot`} /></Suspense>}
        </div>
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
        className={`w-full rounded-field border bg-bg px-4 py-3.5 text-lg text-ink placeholder:text-muted/60 transition-colors focus:border-ink focus:outline-none ${error ? 'border-[#FF9A85]' : 'border-line'}`} />
      {error && <p className="mt-1.5 text-[#FF9A85]">{error}</p>}
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
                {errors.terms && <p className="text-[#FF9A85]">{errors.terms}</p>}
              </div>
              <button type="submit" disabled={status === 'sending'} className="btn btn-ink w-full disabled:opacity-60">{status === 'sending' ? 'שולחים...' : <>{CTA}<Arrow /></>}</button>
              {errors.form && <p role="alert" className="text-[#FF9A85]">{errors.form}</p>}
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
        <Projects />
        <Statement />
        <AgentSequence />
        <Syllabus />
        <Roles />
        <Stage />
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
