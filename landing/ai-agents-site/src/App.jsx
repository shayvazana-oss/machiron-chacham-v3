import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Workflow, ArrowUpLeft, Phone, Menu, X, Plus, Check, CheckCircle2, Loader2, ShieldCheck, Award, Globe,
  Medal, Ticket, Laptop, Lock, Bot, Database, Activity, Sparkles, BadgeCheck,
} from 'lucide-react'
import { IMG, VID, PHONE, PRIVACY_URL, TERMS_URL, NAV_LINKS, TOOLS, PROJECTS, MODULES, ROLES, TRACKS, FAQS, PARTNERS, CAPABILITIES, TOOL_GROUPS } from './data.js'
import { ProjectShuffler, AgentRain, AgentScheduler, CountUp } from './Interactive.jsx'

gsap.registerPlugin(ScrollTrigger)
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const Container = ({ className = '', children }) => (
  <div className={`mx-auto max-w-7xl px-5 sm:px-10 lg:px-16 ${className}`}>{children}</div>
)

function Heading({ eyebrow, line1, line2, text, center = false, className = '' }) {
  return (
    <div data-reveal className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tighter text-ink sm:text-5xl lg:text-6xl">
        {line1}
        {line2 && <span className="block font-serif font-medium text-primary">{line2}</span>}
      </h2>
      {text && <p className={`mt-5 text-base leading-relaxed text-muted sm:text-lg ${center ? 'mx-auto' : ''} max-w-xl`}>{text}</p>}
    </div>
  )
}

const Cta = ({ children, href = '#contact', className = '', ...rest }) => (
  <a href={href} className={`magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-bold text-deep shadow-lg shadow-primary/25 ${className}`} {...rest}>
    <span>{children}</span><ArrowUpLeft className="h-4 w-4" strokeWidth={2.6} />
  </a>
)

/* ------------------------------------------------------------ 1. Navbar */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <>
      <header className={`fixed left-1/2 top-4 z-50 flex w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full px-3 py-2 transition-all duration-500 sm:px-4 ${scrolled || open ? 'glass shadow-2xl shadow-black/50' : 'border border-transparent'}`}>
        <a href="#home" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15"><img src={IMG('m-cut')} alt="" className="h-7 w-7 object-contain transition-transform duration-500 hover:rotate-6 hover:scale-110" /></span>
          <span className="font-display text-sm font-bold tracking-tight sm:text-base" dir="ltr">AI Agent Specialist</span>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="lift-on-hover rounded-full px-3.5 py-2 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#contact" className="magnetic-btn inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-deep">
            <span>לשיחת ייעוץ</span><ArrowUpLeft className="hidden h-4 w-4 sm:block" strokeWidth={2.6} />
          </a>
          <button onClick={() => setOpen((o) => !o)} aria-label="תפריט" aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>
      <div className={`fixed inset-0 z-40 flex flex-col justify-center bg-deep/90 px-8 backdrop-blur-2xl transition-all duration-500 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'}`}>
        {[...NAV_LINKS, { label: 'לשיחת ייעוץ', href: '#contact' }].map((l, i) => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${open ? 80 + i * 60 : 0}ms` }}
            className={`flex items-baseline gap-4 py-3 font-display text-4xl font-extrabold tracking-tighter transition-all duration-700 ${open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <span className="font-mono text-xs text-primary">0{i + 1}</span>{l.label}
          </a>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------ 2. Hero */
function Hero() {
  const ref = useRef(null)
  const [video, setVideo] = useState(false)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!reduceMotion && window.matchMedia('(min-width: 768px)').matches) setVideo(true)
  }, [])
  useEffect(() => {
    if (reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-line-1', { y: 40, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' })
      gsap.from('.hero-line-2', { y: 60, opacity: 0, duration: 1.2, delay: 0.5, ease: 'power3.out' })
      gsap.from('.hero-cta, .hero-meta', { y: 24, opacity: 0, duration: 0.8, delay: 0.8, stagger: 0.12, ease: 'power3.out' })
      gsap.from('.hero-chip', { scale: 0.8, opacity: 0, duration: 0.9, delay: 1.1, stagger: 0.18, ease: 'back.out(1.6)' })
      gsap.to('.hero-bg', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const chips = [
    { icon: Sparkles, text: 'היי, אני הסוכן שתבנו', cls: 'left-[43%] top-[21%]', delay: '0s', tone: 'text-primary' },
    { icon: Bot, text: 'ליד חדש סווג', cls: 'left-[2%] top-[19%]', delay: '1.5s', tone: 'text-accent' },
    { icon: Database, text: 'נפתח ב-CRM', cls: 'left-[2%] top-[64%]', delay: '3s', tone: 'text-emerald-400' },
  ]
  return (
    <section id="home" ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-deep">
      <div className="hero-bg absolute left-0 top-0 h-[32rem] w-full md:h-full lg:-left-[7%] lg:w-[107%]">
        <picture>
          <source media="(max-width: 767px)" srcSet={IMG('m-hero-v')} />
          <img src={IMG('m-hero')} alt="הסוכן, דמות הקורס, יושב על גג מול קו רקיע בשקיעה" fetchPriority="high" className="h-full w-full animate-kenburns-soft object-cover object-left max-md:object-[center_30%]" />
        </picture>
        {video && (
          <video src={VID('m-hero')} poster={IMG('m-hero')} autoPlay muted loop playsInline preload="auto" aria-hidden="true" onPlaying={() => setPlaying(true)}
            className={`absolute inset-0 h-full w-full animate-kenburns-soft object-cover object-left transition-opacity duration-1000 ${playing ? 'opacity-100' : 'opacity-0'}`} />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-l from-deep/80 via-deep/30 via-45% to-transparent to-75% max-md:bg-gradient-to-t max-md:from-deep max-md:from-[47%] max-md:via-transparent max-md:via-[66%] max-md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* themed floating particles: agent run events */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        {chips.map((c) => (
          <div key={c.text} className={`hero-chip absolute ${c.cls}`}>
            <div className="glass flex animate-float items-center gap-2 rounded-full rounded-bl-md px-3.5 py-2 text-xs font-medium text-white/90 shadow-xl shadow-black/40" style={{ animationDelay: c.delay }}>
              <c.icon className={`h-3.5 w-3.5 ${c.tone}`} strokeWidth={2.4} />{c.text}
            </div>
          </div>
        ))}
      </div>

      <Container className="relative z-10 flex min-h-[100dvh] flex-col justify-end pb-10 pt-[21rem] md:pt-32">
        <p className="hero-meta"><span className="eyebrow !text-white/80">Limudey Hutz × ELTA Cyber<span className="max-sm:hidden"> · AI Agent & Automation Specialist</span></span></p>
        <h1 className="mt-5 max-w-3xl font-display text-[3.4rem] font-black leading-[0.92] tracking-tighter text-white drop-shadow-[0_4px_24px_rgba(4,5,7,0.55)] sm:text-7xl lg:text-[5.9rem]">
          <span className="hero-line-1 block">תבנו סוכני AI</span>
          <span className="hero-line-2 block font-serif font-medium text-primary">שעובדים בשבילכם</span>
        </h1>
        <p className="hero-meta mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          הכשרה אחת, 2 התמחויות. לומדים לתרגם אתגר עסקי למערכת עובדת: סוכנים שמחוברים ל-CRM, לדיוור ולידע הארגוני, ומבצעים את העבודה בעצמם.
        </p>
        <div className="hero-cta mt-9 flex flex-wrap gap-3">
          <Cta>לשיחת ייעוץ והכוונה</Cta>
          <a href={`tel:${PHONE}`} className="magnetic-btn glass-dark inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-semibold text-white">
            <Phone className="h-4 w-4" /><span dir="ltr">{PHONE}</span>
          </a>
        </div>

        <div className="hero-meta mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {[[Medal, 'פיקדון חיילים משוחררים', 'הקורס מוכר לשימוש בפיקדון'], [Ticket, 'עד 90% מימון', 'תוכנית השוברים, למתאימים'], [Award, 'תעודת הסמכה ממשלתית', '+ תעודת בוגר מטעם אלתא'], [Laptop, 'אונליין בפיקוח', 'לומדים מכל מקום בארץ']].map(([Icon, t, s]) => (
            <div key={t} className="glass-dark flex items-center gap-3 p-4 sm:p-5">
              <span className="hidden h-10 w-10 flex-none place-items-center rounded-2xl bg-primary/10 text-primary sm:grid"><Icon className="h-5 w-5" strokeWidth={2.2} /></span>
              <div><div className="font-display text-sm font-bold leading-tight sm:text-base">{t}</div><div className="mt-0.5 text-xs text-white/55">{s}</div></div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Marquee({ items, mono = false, reverse = false }) {
  return (
    <div className="mask-fade-x overflow-hidden border-y border-divider py-5" dir="ltr" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-12" style={reverse ? { animationDirection: 'reverse' } : undefined}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className={`flex items-center gap-12 whitespace-nowrap text-white/70 ${mono ? 'font-mono text-sm' : 'font-display text-base font-medium'}`}>
            {t}<Sparkles className="h-3 w-3 text-primary" />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ 3. Features */
function Features() {
  const cards = [
    { eyebrow: '01 / Projects', title: '8 פרויקטים, כל אחד מערכת עובדת', demo: <ProjectShuffler />, text: 'לא תרגילים. אוטומציות עסקיות שבונים מאפס לאורך הקורס, מצ\'אטבוט לשירות ועד פרויקט גמר.', bullets: ['שירות, לידים, מכירות', 'HR, פיננסים, CX'] },
    { eyebrow: '02 / Agents', title: 'סוכנים שמבצעים, לא רק עונים', demo: <AgentRain />, text: 'סוכנים עצמאיים שמבינים משימות, מנתחים מידע, מפעילים כלים חיצוניים ומקבלים החלטות באופן אוטומטי.', bullets: ['מחוברים לידע הארגוני', 'ניטור ומניעת הזיות'] },
    { eyebrow: '03 / Integration', title: 'אינטגרציה מקצה לקצה', demo: <AgentScheduler />, text: 'חיבור מלא בין ה-CRM, הדיוור, הטפסים והתפעול הארגוני. חיסכון מאסיבי בזמן ובמשאבים.', bullets: ['Make ו-n8n', 'API ו-JSON'] },
  ]
  return (
    <section id="build" className="py-24 sm:py-32">
      <Container>
        <Heading eyebrow="What you build" line1="הקורס לא מלמד כלים." line2="הוא מייצר אנשי AI יישומיים" text="כאלה שלוקחים אתגר עסקי אמיתי, מאפיינים אותו, ובונים סוכן שעושה את העבודה." />
        <div data-stagger className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cards.map((c) => (
            <article key={c.title} className="feature-card group rounded-4xl border border-divider bg-surface p-6 transition-colors duration-500 hover:border-primary/30 sm:p-8">
              <span className="eyebrow !text-muted">{c.eyebrow}</span>
              <h3 className="mb-6 mt-3 font-display text-xl font-bold leading-tight sm:text-2xl">{c.title}</h3>
              {c.demo}
              <p className="mt-7 text-sm leading-relaxed text-muted sm:text-base">{c.text}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {c.bullets.map((b) => <li key={b} className="flex items-center gap-1.5 rounded-full border border-divider px-3 py-1.5 text-xs text-white/80"><Check className="h-3 w-3 text-primary" strokeWidth={3} />{b}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ Meet the agent: the four capabilities */
function MeetAgent() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-accent/15 blur-[130px]" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <figure data-reveal className="group relative lg:col-span-6">
            <div className="absolute -inset-3 rounded-[2.75rem] bg-gradient-to-br from-primary/25 via-accent/20 to-transparent blur-2xl transition-opacity duration-700 group-hover:opacity-80" />
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10">
              <img src={IMG('m-work')} alt="הסוכן עובד מול מחשב נייד, סביבו זרימת עבודה אוטומטית" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]" />
              <div className="glass absolute bottom-4 start-4 flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-white/90">
                <span className="ring-pulse h-2 w-2 rounded-full bg-primary" />עובד גם כשאתם ישנים
              </div>
            </div>
          </figure>
          <div className="lg:col-span-6">
            <Heading eyebrow="Meet the agent" line1="הכירו את הסוכן" line2="שתדעו לבנות" text="בסוף הקורס תדעו לבנות אותו מאפס, על ארבע היכולות שלו." />
            <ol data-stagger className="mt-9 space-y-3">
              {CAPABILITIES.map((c, i) => (
                <li key={c.title} className="group/item flex gap-4 rounded-3xl border border-divider bg-surface p-5 transition-all duration-500 hover:-translate-x-1 hover:border-primary/40">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-primary/10 font-mono text-sm text-primary transition-colors duration-500 group-hover/item:bg-primary group-hover/item:text-deep" dir="ltr">0{i + 1}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug">{c.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">{c.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ The tools the agent conducts */
function Orchestra() {
  return (
    <section className="relative overflow-hidden bg-deep py-24 sm:py-32">
      <Container>
        <Heading center eyebrow="One agent, every tool" line1="סוכן אחד," line2="מנצח על כל הכלים" text="בקורס עובדים עם ChatGPT, Claude ו-Gemini, ומחברים אותם לתהליכים עסקיים ב-Make וב-n8n. הדגש הוא על המערכת שבונים, לא על הכלי." />
        <figure data-reveal className="group relative mt-12 overflow-hidden rounded-[2.25rem] border border-white/10">
          <img src={IMG('m-tools')} alt="הסוכן מנצח על חמישה כדורי אור צבעוניים שמחוברים אליו בקווי אור" loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-deep to-transparent" />
          <div className="absolute inset-0" dir="ltr">
            {[['ChatGPT', '11%', '56%'], ['Claude', '26.5%', '36%'], ['Gemini', '50%', '25.5%'], ['Make', '73.5%', '36%'], ['n8n', '89%', '56%']].map(([t, left, top], i) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left, top }}>
                <span className="glass block animate-float rounded-full px-2 py-1 font-mono text-[9px] font-medium text-white shadow-lg shadow-black/40 sm:px-4 sm:py-1.5 sm:text-sm" style={{ animationDelay: `${i * 0.6}s` }}>{t}</span>
              </span>
            ))}
          </div>
        </figure>
        <div data-stagger className="relative z-10 mt-4 grid gap-4 sm:-mt-16 sm:px-8 lg:grid-cols-3">
          {TOOL_GROUPS.map((g) => (
            <div key={g.title} className="glass rounded-3xl p-6">
              <span className="eyebrow">{g.label}</span>
              <h3 className="mt-3 font-display text-xl font-bold">{g.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{g.text}</p>
              <div className="mt-4 flex flex-wrap gap-2" dir="ltr">
                {g.tools.map((t) => <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-mono text-sm text-white/90 transition-colors duration-300 hover:border-primary hover:text-primary">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ 4. Pillars */
function Pillars() {
  const items = [
    { label: 'Academic hours', end: 160, suffix: '', unit: 'ש״א', text: 'למידה עיונית, מעשית ועבודה על פרויקט גמר.' },
    { label: 'Modules', end: 12, suffix: '', unit: 'מודולים', text: 'מ-NoCode ופרומפטים ועד סוכן AI מלא עם דמו מקצועי.' },
    { label: 'Funding', end: 90, suffix: '%', prefix: 'עד', unit: 'מימון', text: 'בתוכנית השוברים, למתאימים. הקורס מוכר גם לפיקדון.' },
  ]
  return (
    <section className="relative overflow-hidden border-y border-divider py-20 sm:py-28">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-accent/20 blur-[110px]" />
      <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-[110px]" />
      <Container className="relative">
        <div className="grid divide-divider lg:grid-cols-3 lg:divide-x lg:divide-x-reverse">
          {items.map((p) => (
            <div key={p.label} data-reveal className="relative px-2 py-8 lg:px-10 lg:py-0">
              <span className="eyebrow">{p.label}</span>
              <div className="mt-4 flex items-baseline gap-3">
                {p.prefix && <span className="font-serif text-2xl text-white/80">{p.prefix}</span>}
                <span className="gradient-text font-display text-7xl font-black leading-none tracking-tighter sm:text-8xl lg:text-[7rem]"><CountUp end={p.end} suffix={p.suffix} /></span>
                <span className="font-serif text-2xl text-white/80">{p.unit}</span>
              </div>
              <div className="mt-5 h-px w-full overflow-hidden bg-divider"><div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent" style={{ animation: 'pillar-sweep 3s ease-in-out infinite' }} /></div>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted sm:text-base">{p.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ 5. Protocol (sticky stack) */
function Protocol() {
  const ref = useRef(null)
  const steps = [
    { n: '01', eyebrow: 'Learn', title: 'לומדים', sub: 'אונליין בפיקוח, מכל מקום בארץ', img: 'learn', alt: 'סטודנטית לומדת אונליין מול מחשב נייד', text: '160 שעות אקדמיות שמשלבות למידה עיונית ותרגול מעשי על הכלים עצמם. מתחילים מהיסודות ומתקדמים מודול אחרי מודול.', bullets: ['12 מודולים שנבנים אחד על השני', 'Gemini, ChatGPT, Claude, Make, n8n', 'ראיון אישי והכוונה מקצועית לפני ההרשמה'] },
    { n: '02', eyebrow: 'Build', title: 'בונים', sub: '8 פרויקטים מעשיים', img: 'team', alt: 'צוות מציג פרויקט אוטומציה על מסך', text: 'כל פרויקט הוא אוטומציה עסקית אמיתית: מאפיינים את הבעיה, מתכננים את הזרימה, מחברים מערכות ובודקים שזה עובד.', bullets: ["צ'אטבוט ו-AI Agent לשירות לקוחות", 'מערכת לידים עם חיבור ל-CRM', 'אוטומציות ל-HR, לפיננסים ולחווית לקוח'] },
    { n: '03', eyebrow: 'Certify', title: 'מוסמכים', sub: 'פרויקט גמר ושתי תעודות', img: 'm-grad', alt: 'הסוכן עם כובע סיום ותעודה עם חותמת זהב', text: 'מסיימים עם פתרון AI עסקי מלא ודמו מקצועי. למסיימים בהצלחה מוענקות שתי תעודות.', bullets: ['תעודת הסמכה ממשלתית: "פיתוח פתרונות דיגיטליים לפרויקטים עסקיים"', 'תעודת בוגר מטעם היחידה ללימודי חוץ ומפעל הסייבר של אלתא', 'נדרשות 80% נוכחות ועמידה במטלות ובמבחנים'] },
  ]
  useEffect(() => {
    if (reduceMotion) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const cards = gsap.utils.toArray('.protocol-card', ref.current)
      cards.slice(0, -1).forEach((card) => {
        gsap.to(card.querySelector('.protocol-inner'), {
          scale: 0.92, filter: 'blur(6px) saturate(0.7)', opacity: 0.45, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top top+=96', end: '+=520', scrub: 1 },
        })
      })
    })
    return () => mm.revert()
  }, [])
  return (
    <section id="path" ref={ref} className="py-24 sm:py-32">
      <Container>
        <Heading eyebrow="The path" line1="שלושה שלבים." line2="מאפס לפרויקט גמר" text="כך נראה המסלול, מהשיעור הראשון ועד התעודה." />
        <div className="mt-14 space-y-6 lg:space-y-0">
          {steps.map((s, i) => (
            <div key={s.n} className="protocol-card lg:sticky lg:top-24 lg:pb-10" style={{ zIndex: i + 1 }}>
              <div className="protocol-inner grid origin-top overflow-hidden rounded-4xl border border-divider bg-surface shadow-2xl shadow-black/60 lg:grid-cols-5">
                <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-3 lg:p-14">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-primary">{s.n}</span>
                    <span className="h-px w-10 bg-primary/50" />
                    <span className="eyebrow !text-muted">{s.eyebrow}</span>
                  </div>
                  <h3 className="mt-5 font-display text-5xl font-black tracking-tighter sm:text-6xl">{s.title}</h3>
                  <p className="mt-1 font-serif text-2xl text-primary sm:text-3xl">{s.sub}</p>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">{s.text}</p>
                  <ul className="mt-6 space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-white/85 sm:text-base">
                        <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-3 w-3" strokeWidth={3} /></span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative min-h-[260px] lg:col-span-2 lg:min-h-[540px]">
                  <img src={IMG(s.img)} alt={s.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-l from-surface/0 via-surface/0 to-surface/70 max-lg:bg-gradient-to-b max-lg:from-surface/60 max-lg:via-transparent max-lg:to-transparent" />
                  <span className="absolute bottom-5 left-5 font-display text-8xl font-black leading-none text-white/15" dir="ltr">{s.n}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ 6. Services grid — the 8 projects */
function ProjectsGrid() {
  return (
    <section className="relative bg-deep py-24 sm:py-32">
      <Container>
        <figure data-reveal className="group relative mb-16 overflow-hidden rounded-[2.25rem] border border-white/10">
          <img src={IMG('m-team')} alt="חמישה סוכנים בצבעים שונים, לכל אחד תפקיד: שירות, מחקר, דוחות, תזמון ודיוור" loading="lazy" className="aspect-[16/9] w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/10 to-transparent max-sm:hidden" />
          <figcaption className="relative flex flex-wrap items-end justify-between gap-4 bg-surface p-6 sm:absolute sm:inset-x-0 sm:bottom-0 sm:bg-transparent sm:p-10">
            <div>
              <span className="eyebrow">One agent per job</span>
              <p className="mt-2 font-display text-3xl font-black leading-none tracking-tighter sm:text-5xl">לכל סוכן <span className="font-serif font-medium text-primary">תפקיד משלו</span></p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
              {['שירות', 'מחקר', 'דוחות', 'תזמון', 'דיוור'].map((t) => <span key={t} className="glass rounded-full px-3 py-1.5">{t}</span>)}
            </div>
          </figcaption>
        </figure>
        <Heading eyebrow="8 hands-on projects" line1="מה תבנו בפועל," line2="פרויקט אחרי פרויקט" />
        <div data-stagger className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-4xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p, i) => (
            <div key={p.title} className="svc-tile group relative bg-deep p-7 transition-colors duration-500 hover:bg-white/[0.04] sm:p-8">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-deep"><p.icon className="h-6 w-6" strokeWidth={2.2} /></span>
                <span className="font-mono text-xs text-white/30" dir="ltr">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-lg font-bold leading-snug sm:text-xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{p.text}</p>
              <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ Syllabus */
function Accordion({ items, render, numbered = false }) {
  const [open, setOpen] = useState(0)
  return (
    <div>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={i} className="border-b border-divider">
            <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="group flex w-full items-center gap-5 py-5 text-start sm:py-6">
              {numbered && <span className={`grid h-10 w-10 flex-none place-items-center rounded-full font-mono text-xs transition-all duration-500 ${isOpen ? 'bg-primary text-deep shadow-lg shadow-primary/30' : 'border border-divider text-muted group-hover:border-primary/50'}`} dir="ltr">{String(i + 1).padStart(2, '0')}</span>}
              <span className={`flex-1 font-display text-lg font-bold leading-snug tracking-tight transition-colors sm:text-xl ${isOpen ? 'text-ink' : 'text-white/85 group-hover:text-primary'}`}>{render.title(it)}</span>
              <span className={`grid h-9 w-9 flex-none place-items-center rounded-full border border-divider transition-all duration-500 ${isOpen ? 'rotate-45 border-primary bg-primary text-deep' : ''}`}><Plus className="h-4 w-4" /></span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden"><div className={`pb-7 ${numbered ? 'sm:ps-[3.75rem]' : ''}`}>{render.body(it)}</div></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Syllabus() {
  return (
    <section id="syllabus" className="py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Heading eyebrow="Syllabus" line1="12 מודולים." line2="כל אחד נסגר בתוצר" text="לחצו על מודול כדי לראות מה לומדים בו." />
              <figure data-reveal className="relative mt-10 overflow-hidden rounded-4xl border border-divider">
                <img src={IMG('elta')} alt="מרכז מחקר סייבר מתקדם" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <span className="eyebrow">Powered by ELTA cyber</span>
                  <p className="mt-2 font-display text-lg font-bold leading-snug">המרכז הבינלאומי למקצועות הסייבר של אלתא מערכות (התעשייה האווירית) והיחידה ללימודי חוץ.</p>
                </figcaption>
              </figure>
            </div>
          </div>
          <div data-reveal className="lg:col-span-7">
            <Accordion numbered items={MODULES} render={{
              title: (m) => <>{m.title}{m.en && <span dir="ltr" className="mr-2 inline-block font-mono text-sm font-medium text-muted">{m.en}</span>}</>,
              body: (m) => <ul className="max-w-xl space-y-3">{m.points.map(([b, t]) => <li key={b} className="text-sm leading-relaxed text-muted sm:text-base"><b className="font-semibold text-ink">{b}: </b>{t}</li>)}</ul>,
            }} />
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ Roles */
function Roles() {
  return (
    <section id="roles" className="border-t border-divider py-24 sm:py-32">
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Heading eyebrow="Career" line1="לאן זה" line2="לוקח אתכם" text="השליטה בכלים ממצבת את הבוגרים כנכס אסטרטגי בכל ארגון: להפוך אתגרים עסקיים לפתרונות, לייעל תהליכים ולחסוך עלויות." />
          </div>
          <figure data-reveal className="group relative overflow-hidden rounded-4xl border border-divider lg:col-span-7">
            <img src={IMG('before-after')} alt="לפני ואחרי: מעבודה משרדית שגרתית לתפקיד בעולם ה-AI" loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-transparent to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 grid grid-cols-2 p-5 font-mono text-xs uppercase tracking-[0.2em]" dir="ltr">
              <span className="text-white/60">Before · לפני</span>
              <span className="ps-4 text-primary">After · אחרי</span>
            </figcaption>
          </figure>
        </div>
        <div data-reveal className="mt-12">
          {ROLES.map(([title, sub], i) => (
            <a key={title} href="#contact" className="group relative grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-1 overflow-hidden border-t border-divider px-2 py-6 last:border-b sm:px-4 lg:grid-cols-[4rem_1fr_1fr_2.5rem] lg:py-7">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
              <span className="relative font-mono text-xs text-muted transition-colors group-hover:text-deep" dir="ltr">0{i + 1}</span>
              <h3 className="relative font-display text-2xl font-extrabold tracking-tighter transition-colors group-hover:text-deep sm:text-3xl lg:text-4xl">{title}</h3>
              <p className="relative col-start-2 text-sm text-muted transition-colors group-hover:text-deep/80 sm:text-base lg:col-start-3">{sub}</p>
              <ArrowUpLeft className="relative hidden h-6 w-6 text-white/40 transition-all duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-deep lg:block" />
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ 7. Trust signals */
function TrustSignals() {
  const badges = [
    { icon: Award, title: 'תעודת הסמכה ממשלתית', text: '"פיתוח פתרונות דיגיטליים לפרויקטים עסקיים" No-Code & AI.' },
    { icon: ShieldCheck, title: 'אלתא מערכות · התעשייה האווירית', text: 'תעודת בוגר מטעם היחידה ללימודי חוץ ומפעל הסייבר של אלתא.' },
    { icon: Globe, title: 'EC-Council · edX', text: 'מרכז הסמכה רשמי של EC-Council, ושיתוף עם edX, פלטפורמת הלמידה של MIT ו-Harvard.' },
  ]
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute left-1/2 top-0 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      <Container className="relative">
        <Heading center eyebrow="Credentials" line1="גוף מוכר," line2="שותפים שמכירים" text="היחידה ללימודי חוץ מובילה מזה שלוש שנים את חממת התעסוקה של שירות התעסוקה, עם מעל 80% השמה, ואת מערך ההכשרות של משרד האוצר והחשב הכללי." />
        <div data-stagger className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
          {badges.map((b) => (
            <div key={b.title} className="group rounded-4xl border border-divider bg-surface p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary"><b.icon className="h-7 w-7" strokeWidth={2} /></span>
              <h3 className="mt-6 font-display text-xl font-bold">{b.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{b.text}</p>
            </div>
          ))}
        </div>
      </Container>
      <div className="relative mt-16"><Marquee items={PARTNERS} reverse /></div>
    </section>
  )
}

/* ------------------------------------------------------------ Funding */
function Funding({ track, setTrack }) {
  return (
    <section id="funding" className="border-t border-divider py-24 sm:py-32">
      <Container>
        <Heading eyebrow="Funding" line1="מימון" line2="וזכאות" text="סמנו מה מתאר אתכם ונסמן את המסלול ששווה לבדוק. הבדיקה עצמה נעשית בשיחת הייעוץ ואינה מחייבת." />
        <div data-reveal className="mt-10 flex flex-wrap items-center gap-2">
          <span className="me-2 text-muted">אני:</span>
          {TRACKS.map((t) => (
            <button key={t.id} onClick={() => setTrack(t.id)} className={`rounded-full px-4 py-2.5 text-sm transition-all duration-300 ${track === t.id ? 'bg-primary font-bold text-deep' : 'border border-divider text-white/80 hover:border-white/60'}`}>{t.pick}</button>
          ))}
        </div>
        <div data-stagger className="mt-8 grid gap-5 lg:grid-cols-3">
          {TRACKS.map((t) => {
            const sel = track === t.id
            return (
              <div key={t.id} className={`flex flex-col rounded-4xl border bg-surface p-8 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${sel ? 'border-primary shadow-2xl shadow-primary/20 lg:-translate-y-3' : track ? 'border-divider opacity-50' : 'border-divider'}`}>
                <span className="eyebrow">{t.code}</span>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-display text-5xl font-black tracking-tighter sm:text-6xl">{t.big}</span>
                  <span className="font-serif text-xl text-muted">{t.small}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{t.text}</p>
                <ul className="mt-6 space-y-2.5 border-t border-divider pt-6 text-sm text-white/85">
                  <li className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 flex-none text-primary" strokeWidth={3} />אותה הכשרה, אותן 2 תעודות</li>
                  <li className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 flex-none text-primary" strokeWidth={3} />בדיקה והכוונה בשיחת הייעוץ</li>
                </ul>
                <a href="#contact" onClick={() => setTrack(t.id)} className="lift-on-hover mt-7 inline-flex items-center gap-1.5 font-bold text-primary">{t.cta}<ArrowUpLeft className="h-4 w-4" strokeWidth={2.6} /></a>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="border-t border-divider py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4"><Heading eyebrow="FAQ" line1="שאלות" line2="נפוצות" /></div>
          <div data-reveal className="lg:col-span-8">
            <Accordion items={FAQS} render={{ title: ([q]) => q, body: ([, a]) => <p className="max-w-2xl text-base leading-relaxed text-muted">{a}</p> }} />
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ 8. Contact form */
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

function Field({ label, id, ...props }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-xs text-muted">{label}</span>
      <input id={id} name={id} {...props} className="w-full rounded-2xl border border-divider bg-background px-4 py-3.5 text-base text-ink placeholder:text-white/25 transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" />
    </label>
  )
}

function ContactForm({ track, setTrack }) {
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [error, setError] = useState('')
  const utm = useRef({})
  useEffect(() => { utm.current = readUtm() }, [])
  const onSubmit = async (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const mobile = f.mobile.value.replace(/\D/g, '')
    if (f.name.value.trim().length < 2 || !/^0\d{8,9}$/.test(mobile) || !f.consent_terms.checked) {
      return setError('יש למלא שם ונייד תקין, ולאשר את מדיניות הפרטיות והתקנון.')
    }
    setError('')
    setStatus('sending')
    const done = () => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'generate_lead', form: 'lead-ai-agents', track: track || 'לא נבחר' })
      if (window.fbq) { try { window.fbq('track', 'Lead') } catch { /* pixel not ready */ } }
      setStatus('sent')
    }
    if (!isLive()) return setTimeout(done, 1200) // preview mode: nothing is sent
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
      setError(`השליחה לא הצליחה. נסו שוב, או חייגו ${PHONE}.`)
    }
  }
  return (
    <section id="contact" className="relative overflow-hidden bg-deep py-24 sm:py-32">
      <img src={IMG('abstract')} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-deep/60 to-deep" />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div data-reveal>
              <span className="eyebrow">Next step</span>
              <h2 className="mt-4 font-display text-5xl font-black leading-[0.95] tracking-tighter sm:text-6xl lg:text-7xl">
                למדו לבנות AI,
                <span className="block font-serif font-medium text-primary">לפני שהשוק יתקדם בלעדיכם</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">השאירו פרטים לשיחת ייעוץ והכוונה. נבדוק יחד התאמה, מסלול מימון ומועדי פתיחה.</p>
            </div>
            <div data-stagger className="mt-9 grid gap-3 sm:grid-cols-2">
              <a href={`tel:${PHONE}`} className="glass flex items-center gap-4 rounded-3xl p-5 transition-colors hover:border-primary/40">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-primary text-deep"><Phone className="h-5 w-5" /></span>
                <div><div className="text-xs text-muted">מוקד ייעוץ</div><div className="font-mono text-2xl font-semibold" dir="ltr">{PHONE}</div></div>
              </a>
              <div className="glass flex items-center gap-4 rounded-3xl p-5">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-white/10 text-primary"><Laptop className="h-5 w-5" /></span>
                <div><div className="text-xs text-muted">מיקום</div><div className="font-display font-bold">אונליין בפיקוח · כל הארץ</div></div>
              </div>
            </div>
            <p data-reveal className="mt-6 flex items-center gap-2 text-xs text-muted"><Lock className="h-3.5 w-3.5" />הפרטים משמשים ליצירת קשר בנוגע לקורס בלבד.</p>
          </div>

          <div data-reveal className="relative lg:col-span-6 lg:ps-8">
            <img src={IMG('m-cut-wave')} alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute -top-[5.5rem] end-6 z-10 w-32 animate-float drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] sm:-top-28 sm:w-40" />
            <div className="rounded-[2.25rem] border border-white/10 bg-gradient-to-b from-white/15 to-white/5 p-1.5">
              <div className="rounded-[1.9rem] bg-surface/95 p-6 sm:p-9">
                {status === 'sent' ? (
                  <div className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
                    <CheckCircle2 className="h-16 w-16 text-primary" strokeWidth={1.6} />
                    <h3 className="mt-6 font-display text-3xl font-black tracking-tight">קיבלנו. תודה!</h3>
                    <p className="mt-2 text-muted">יועץ לימודים יחזור אליכם בהקדם.</p>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate className="space-y-4">
                    <p className="hidden" aria-hidden="true"><label>לא למלא: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="שם מלא" id="name" type="text" autoComplete="name" placeholder="ישראל ישראלי" />
                      <Field label="נייד" id="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="050-0000000" dir="ltr" style={{ textAlign: 'right' }} />
                    </div>
                    <Field label="אימייל" id="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" dir="ltr" style={{ textAlign: 'right' }} />
                    <div>
                      <span className="mb-2 block text-xs text-muted">מסלול מימון לבדיקה (לא חובה)</span>
                      <div className="flex flex-wrap gap-2">
                        {TRACKS.map((t) => (
                          <button type="button" key={t.id} onClick={() => setTrack(track === t.id ? '' : t.id)} aria-pressed={track === t.id}
                            className={`rounded-full px-3.5 py-2 text-sm transition-all ${track === t.id ? 'bg-primary font-bold text-deep' : 'border border-divider text-white/75 hover:border-white/50'}`}>{t.id}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2.5 pt-1 text-xs leading-relaxed text-muted">
                      <label className="flex gap-2.5"><input type="checkbox" name="consent_marketing" className="mt-0.5 h-4 w-4 flex-none accent-[#C8FF4D]" /><span>מאשר/ת קבלת דיוור מהיחידה ללימודי חוץ בהתאם למדיניות הפרטיות</span></label>
                      <label className="flex gap-2.5"><input type="checkbox" name="consent_terms" required className="mt-0.5 h-4 w-4 flex-none accent-[#C8FF4D]" /><span>מאשר/ת שקראתי את <a className="text-white/80 underline" href={PRIVACY_URL} target="_blank" rel="noopener">מדיניות הפרטיות</a> ו<a className="text-white/80 underline" href={TERMS_URL} target="_blank" rel="noopener">תקנון האתר</a></span></label>
                    </div>
                    <button type="submit" disabled={status === 'sending'} className="magnetic-btn flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-lg font-black text-deep shadow-xl shadow-primary/25 disabled:opacity-70">
                      {status === 'sending' ? <><Loader2 className="h-5 w-5 animate-spin" /><span>שולח...</span></> : <><span>דברו איתי</span><ArrowUpLeft className="h-5 w-5" strokeWidth={2.6} /></>}
                    </button>
                    {error && <p role="alert" className="text-sm text-[#FF7A5C]">{error}</p>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------ 9. Footer */
function Footer() {
  return (
    <footer className="bg-deep pb-28 pt-16 md:pb-12">
      <Container>
        <div className="grid gap-10 border-t border-white/10 pt-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/15"><img src={IMG('m-cut')} alt="" className="h-8 w-8 object-contain" /></span>
              <span className="font-display text-lg font-bold" dir="ltr">AI Agent Specialist</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">קורס פתרונות דיגיטליים לפרויקטים עסקיים, מבית היחידה ללימודי חוץ והמרכז הבינלאומי למקצועות הסייבר בשיתוף אלתא מערכות.</p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 font-mono text-xs text-white/70">
              <span className="ring-pulse h-2 w-2 rounded-full bg-primary" />מוקד ייעוץ <span dir="ltr">{PHONE}</span>
            </div>
          </div>
          <div>
            <div className="eyebrow !text-white/40">הקורס</div>
            <ul className="mt-4 space-y-3 text-sm text-white/70">{NAV_LINKS.map((l) => <li key={l.href}><a className="lift-on-hover inline-block hover:text-primary" href={l.href}>{l.label}</a></li>)}</ul>
          </div>
          <div>
            <div className="eyebrow !text-white/40">תעודות</div>
            <ul className="mt-4 space-y-3 text-sm text-white/70"><li>הסמכה ממשלתית</li><li>בוגר Agents & Automation</li><li>אלתא מערכות · IAI</li></ul>
          </div>
          <div>
            <div className="eyebrow !text-white/40">יצירת קשר</div>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><a className="hover:text-primary" href={`tel:${PHONE}`} dir="ltr">{PHONE}</a></li>
              <li><a className="hover:text-primary" href="https://limudey-hutz.co.il" target="_blank" rel="noopener" dir="ltr">limudey-hutz.co.il</a></li>
              <li>אונליין בפיקוח · כל הארץ</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40">
          <span>© היחידה ללימודי חוץ</span>
          <span className="flex gap-5"><a className="hover:text-white" href={PRIVACY_URL} target="_blank" rel="noopener">מדיניות פרטיות</a><a className="hover:text-white" href={TERMS_URL} target="_blank" rel="noopener">תקנון</a></span>
        </div>
      </Container>
    </footer>
  )
}

function StickyBar() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className={`glass fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-full p-1.5 transition-transform duration-700 md:hidden ${show ? 'translate-y-0' : 'translate-y-[160%]'}`}>
      <a href={`tel:${PHONE}`} className="flex flex-[0.6] items-center justify-center gap-2 rounded-full border border-white/15 py-3 font-mono text-sm font-semibold" dir="ltr"><Phone className="h-4 w-4" />{PHONE}</a>
      <a href="#contact" className="flex flex-1 items-center justify-center rounded-full bg-primary py-3 text-sm font-black text-deep">לשיחת ייעוץ</a>
    </div>
  )
}

/* Desktop helper: the mascot peeks from the corner and points to the form */
function Helper() {
  const [show, setShow] = useState(false)
  const [closed, setClosed] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const contact = document.getElementById('contact')
      const nearForm = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.9 : false
      setShow(window.scrollY > window.innerHeight * 0.9 && !nearForm)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (closed) return null
  return (
    <div className={`group fixed bottom-0 left-3 z-40 hidden items-end gap-2 transition-all duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] lg:flex ${show ? 'translate-y-0 opacity-100' : 'translate-y-[110%] opacity-0'}`}>
      <a href="#contact" aria-label="שאלות על הקורס? דברו איתנו" className="relative block">
        <img src={IMG('m-cut')} alt="" className="-mb-8 w-20 transition-transform duration-500 group-hover:-translate-y-4 group-hover:rotate-3" />
      </a>
      <div className="glass pointer-events-none relative mb-10 translate-y-2 rounded-2xl rounded-br-sm px-4 py-3 text-sm opacity-0 shadow-2xl shadow-black/50 transition-all duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <a href="#contact" className="font-medium hover:text-primary">שאלות על הקורס? דברו איתנו</a>
        <button onClick={() => setClosed(true)} aria-label="סגירה" className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-surface-2 text-white/70 ring-1 ring-white/15 hover:text-white"><X className="h-3 w-3" /></button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ App */
export default function App() {
  const [track, setTrack] = useState('')
  useEffect(() => {
    if (reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.set(el, { transition: 'none' })
        gsap.from(el, { y: 44, opacity: 0, duration: 1, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: el, start: 'top 86%', once: true } })
      })
      gsap.utils.toArray('[data-stagger]').forEach((group) => {
        gsap.set(group.children, { transition: 'none' })
        gsap.from(group.children, { y: 44, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', clearProps: 'all', scrollTrigger: { trigger: group, start: 'top 84%', once: true } })
      })
    })
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => { clearTimeout(id); window.removeEventListener('load', onLoad); ctx.revert() }
  }, [])
  return (
    <div className="relative">
      <div className="noise-overlay" />
      <a href="#build" className="fixed start-4 top-[-60px] z-[70] rounded-full bg-primary px-4 py-2 font-bold text-deep transition-all focus:top-4">דילוג לתוכן</a>
      <Navbar />
      <main>
        <Hero />
        <Marquee items={TOOLS} mono />
        <Features />
        <MeetAgent />
        <Orchestra />
        <Pillars />
        <Protocol />
        <ProjectsGrid />
        <Syllabus />
        <Roles />
        <TrustSignals />
        <Funding track={track} setTrack={setTrack} />
        <Faq />
        <ContactForm track={track} setTrack={setTrack} />
      </main>
      <Footer />
      <StickyBar />
      <Helper />
    </div>
  )
}
