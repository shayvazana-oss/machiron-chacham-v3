import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpLeft, Play, Phone, Mail, Instagram, MessageCircle, ShieldCheck, FileCheck2,
  Radio, Camera, Clapperboard, PartyPopper, Megaphone, Building2, Heart, Plane,
  Check, Copy, Plus, Menu, X, MapPin, CalendarDays, Clock3, Package,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/* ---------- business data ---------- */
const PHONE_DISPLAY = '054-6330531'
const PHONE_TEL = '+972546330531'
const WA_NUMBER = '972546330531'
const EMAIL = 'differentperspective.jk@gmail.com'
const INSTAGRAM = 'https://www.instagram.com/jacobkdrone/'
const SHOWREEL = 'https://youtu.be/ImC2nrLLT5Q'
// a standalone build may inline images into window.__MEDIA
const m = (f) => window.__MEDIA?.[f] || `media/${f}`
const wa = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`

const NAV = [
  { label: 'עבודות', href: '#work' },
  { label: 'למי זה מתאים', href: '#who' },
  { label: 'איך זה עובד', href: '#process' },
  { label: 'שאלות', href: '#faq' },
]

const HERO_SLIDES = [
  { src: 'deadsea-swirl.jpg', place: 'ים המלח' },
  { src: 'jaffa.jpg', place: 'נמל יפו' },
  { src: 'sunset-flats.jpg', place: 'שעת זהב' },
  { src: 'island.jpg', place: 'צילום בחו״ל' },
  { src: 'mountain-road.jpg', place: 'כביש הררי' },
]

const TRUST = [
  'רישיון רת״א', 'ביטוח צד ג׳', 'סד״פ מסודר לפני כל טיסה', 'תיאום מול רשויות התעופה וכוחות הביטחון',
  'DJI Mavic 3 Pro · מערכת 3 מצלמות', '8+ שנות הטסה', 'מאות שעות הדרכת הטסה בארץ ובחו״ל',
]

const AUDIENCES = [
  {
    id: 'film', icon: Clapperboard, tab: 'קולנוע, טלוויזיה וקליפים', img: 'yt-fD1p0e-XTNc.jpg',
    title: 'השוט שפותח את הקליפ',
    text: 'סדרות טלוויזיה, הפקות וקליפים, בין היתר לליהוט, לשי נחייסי ולדניאל מויאל. אני מגיע עם תוכנית טיסה מוכנה ועובד צמוד לבמאי ולצלם הראשי, כך שהצוות מתרכז ביצירה ולא בלוגיסטיקה.',
    points: ['תיאום שוטים מול הבמאי מראש', 'עבודה בלוקיישנים מורכבים', 'חומר גלם באיכות מקורית'],
  },
  {
    id: 'events', icon: PartyPopper, tab: 'אירועים, ספורט ופסטיבלים', img: 'beach-coast.jpg',
    title: 'כל הקהל בפריים אחד',
    text: 'פסטיבלים, מרוצים ואירועי חוץ גדולים. מהאוויר רואים את הגודל של האירוע, ואת זה אי אפשר לצלם מהקרקע.',
    points: ['אישורי הטסה מעל אזורים מאוכלסים', 'עבודה לפי לו״ז של הפקה', 'שוטים מוכנים לסושיאל'],
  },
  {
    id: 'realestate', icon: Building2, tab: 'נדל״ן ואדריכלות', img: 'architecture-top.jpg',
    title: 'הפרויקט מהזווית שהאדריכל דמיין',
    text: 'צילומי מבט-על, תיעוד התקדמות בנייה ושוטים קולנועיים לשיווק פרויקטים. בזכות מערכת 3 המצלמות של ה-Mavic 3 Pro אפשר לעבור מפריים רחב לפרט קטן באותה טיסה.',
    points: ['תיעוד התקדמות בנייה', 'סטילס ברזולוציה גבוהה', 'סרטון שיווק לפרויקט'],
  },
  {
    id: 'private', icon: Heart, tab: 'חתונות, הצעות נישואין ותיירות', img: 'villa-waterfall.jpg',
    title: 'הרגע שלכם, מלמעלה',
    text: 'הצעות נישואין, חתונות, מלונות וצימרים. ממליץ על לוקיישן, מסביר איך מגיעים, מצלם, ואם תרצו גם עורך סרטון עם מוזיקה.',
    points: ['עזרה בבחירת לוקיישן', 'סרטון ערוך עם מוזיקה', 'צילום למלונות וחברות תיירות'],
  },
]

const REELS = [
  { id: 'ImC2nrLLT5Q', title: 'Cinematic Aerial Showreel', tag: 'שואוריל' },
  { id: 'fD1p0e-XTNc', title: 'Daniel Mouyal · A Little Too Much', tag: 'קליפ' },
  { id: 'L_iy-7RTUHE', title: 'ליהוט · צ׳וצ׳ו', tag: 'קליפ' },
  { id: 'Owc-KC799Lo', title: 'שי נחייסי ואיה זהבי פייגלין · היית בא אליי', tag: 'קליפ' },
  { id: 'UgAKWm9mSrM', title: 'ליהוט · Shelter', tag: 'קליפ' },
  { id: 'vpnEI_haqg0', title: 'בשביל הגיבורות', tag: 'הפקה' },
]

const STILLS = [
  'sinkholes.jpg', 'flower-rows.jpg', 'temple-forest.jpg', 'canal-town.jpg', 'reservoir.jpg',
  'pool-villa.jpg', 'village-top.jpg', 'hoodoos.jpg', 'salt-marsh.jpg', 'canyon.jpg', 'cloud-valley.jpg', 'desert-hills.jpg',
]

const STEPS = [
  {
    n: '01', icon: FileCheck2, title: 'תכנון ואישורים',
    text: 'מגדירים יחד את השוטים, הלוקיישן והלו״ז. אני מוציא את אישורי ההטסה, מתאם מול רשויות התעופה וכוחות הביטחון ומכין סד״פ לפי החוק.',
    meta: ['אישורי הטסה', 'תיאום רשויות', 'סד״פ'],
  },
  {
    n: '02', icon: Radio, title: 'יום ההטסה',
    text: 'מגיע בזמן עם Mavic 3 Pro ותוכנית טיסה מוכנה. עובד צמוד לבמאי או אליכם, עם ביטוח צד ג׳ ורישיון רת״א. אם יש רוח חזקה, גשם או הגבלה ביטחונית, קובעים מועד חדש.',
    meta: ['רישיון רת״א', 'ביטוח צד ג׳', 'תוכנית טיסה'],
  },
  {
    n: '03', icon: Package, title: 'מסירת החומרים',
    text: 'חומר הגלם באיכות המקורית עובר אליכם כבר ביום הצילום, על כרטיס זיכרון או USB שלכם, או בתיקייה ב-Drive או ב-iCloud. אם הזמנתם עריכה, הסרטון המוכן מגיע אחריו.',
    meta: ['כרטיס / USB', 'Drive / iCloud', 'איכות מקורית'],
  },
]

const TESTIMONIALS = [
  { name: 'גלעד קליין', role: '', text: 'היה תענוג לעבוד עם יעקב. הוא יצירתי, ראש גדול וסופר מקצועי. כל מי שצריך צילומי רחפן ברמה גבוהה, יעקב הוא הכתובת.' },
  { name: 'אברהם טבול', role: 'הצעת נישואין', text: 'לקחתי את יעקב לצילומי רחפן להצעת הנישואין שלי. הוא המליץ לי על מקום יפה עם נוף, הסביר איך מגיעים, עשה צילומים מטורפים, ערך ובחר שיר שמתאים לסרטון. ממליץ בחום 😁' },
  { name: 'מאיה', role: 'פרויקט אדריכלות', text: 'לקחתי את השירות של יעקב לפרויקט בארכיטקטורה. הכול היה מושלם, הוא מוכשר ומקצועי ברמות.' },
  { name: 'Navi Buchal', role: '', ltr: true, text: 'Jack is a consummate professional, an artist with a fine eye for detail and execution. Willing to go the extra mile for the client and creative team. A great hire and hard worker.' },
  { name: 'וואדים מכונה', role: 'הפקות', text: 'עבדתי עם יעקב בכמה הפקות ותמיד יצאתי מבסוט. בא בזמן, עשה את העבודה כמו שצריך ובצורה יסודית.' },
]

const FAQ = [
  { q: 'כמה עולה צילום רחפן?', a: 'המחיר תלוי בסוג הצילום, במשך העבודה ובמיקום. יש שלושה מסלולים: יום צילום (מלא או חצי), הפקה מקיפה (לפי פרויקט) ומסלול ממוקד תוכן (לפי כמות תוצרים). מלאו את מתכנן הטיסה ותקבלו הצעה מדויקת.' },
  { q: 'באיזו איכות ורזולוציה מצלמים?', a: 'באיכות הגבוהה ביותר שהציוד מאפשר. הרזולוציה, קצב הפריימים ופרופיל הצבע נקבעים לפי מה שההפקה שלכם צריכה.' },
  { q: 'איך מקבלים את החומרים?', a: 'ביום הצילום, על כרטיס זיכרון או USB שלכם, או בתיקייה ב-Drive או ב-iCloud שממנה מורידים את החומרים באיכות המקורית.' },
  { q: 'מה קורה אם יש מזג אוויר קשה או הגבלה ביטחונית?', a: 'לפעמים יש הגבלות זמניות בגלל המצב הביטחוני באזור מסוים, או רוחות חזקות וגשם. במקרה כזה קובעים יחד מועד חלופי.' },
  { q: 'אתה עובד עם רישיון?', a: 'כן. אני עובד עם רישיון של רת״א, ביטוח צד ג׳ וסד״פ מסודר לפני כל הטסה, לפי כל דרישות החוק.' },
  { q: 'איך יודעים אם מטיס מורשה?', a: 'שואלים אותו ישירות ומבקשים לראות את הרישיון, את אישור הביטוח ואת אישורי ההטסה לצילום. מטיס מקצועי יציג אותם בלי בעיה.' },
]

/* ---------- planner options ---------- */
const P_TYPES = ['קליפ / טלוויזיה / קולנוע', 'אירוע / ספורט / פסטיבל', 'פרסום ותוכן לעסק', 'נדל״ן ואדריכלות', 'חתונה / הצעת נישואין', 'תיירות ואירוח']
const P_DURATIONS = [
  { id: 'hours', label: 'כמה שעות' },
  { id: 'half', label: 'חצי יום' },
  { id: 'full', label: 'יום מלא' },
  { id: 'project', label: 'כמה ימים / פרויקט' },
]
const P_OUTPUTS = ['חומר גלם באיכות מקורית', 'סרטון ערוך', 'תמונות סטילס', 'שוטים לסושיאל (9:16)']
const PACKAGES = {
  day: { name: 'מסלול יום צילום', basis: 'לפי יום או חצי יום', why: 'להפקות עם לוח זמנים מוגדר' },
  full: { name: 'מסלול הפקה מקיף', basis: 'לפי פרויקט', why: 'לפרויקטים גדולים או בהתאמה אישית' },
  content: { name: 'מסלול ממוקד תוכן', basis: 'לפי כמות תוצרים', why: 'לסרטוני תדמית ותוכן ממותג' },
}
function pickPackage(duration) {
  if (duration === 'project') return PACKAGES.full
  if (duration === 'half' || duration === 'full') return PACKAGES.day
  return PACKAGES.content
}

/* ---------- small helpers ---------- */
function useTimecode() {
  const [f, setF] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setF((x) => x + 1), 40)
    return () => clearInterval(id)
  }, [])
  const s = Math.floor(f / 25)
  const pad = (n) => String(n).padStart(2, '0')
  return `00:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 25)}`
}

function Reveal({ children, className = '', as: Tag = 'div', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.from(el, { y: 36, opacity: 0, duration: 1, delay, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    })
    return () => ctx.revert()
  }, [delay])
  return <Tag ref={ref} className={className}>{children}</Tag>
}

function SectionHead({ eyebrow, title, sub, className = '' }) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="font-display text-[56px] font-bold leading-[0.9] sm:text-[84px] lg:text-[104px]">{title}</h2>
      {sub && <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-haze sm:text-lg">{sub}</p>}
    </Reveal>
  )
}

function CopyButton({ value, label }) {
  const [done, setDone] = useState(false)
  const onClick = () => {
    navigator.clipboard?.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1600) }).catch(() => {})
  }
  return (
    <button type="button" onClick={onClick} aria-label={`העתקת ${label}`} className="rounded-full p-2 text-haze transition-colors hover:bg-slate hover:text-bone">
      {done ? <Check className="h-4 w-4 text-gold" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}

/* ---------- sections ---------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-[calc(env(safe-area-inset-top,0px)+12px)] sm:px-6">
      <nav className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${scrolled ? 'glass border border-bone/10' : 'border border-transparent'}`}>
        <a href="#top" className="flex items-center gap-3" aria-label="Different Perspective, לראש הדף">
          <span className="relative grid h-9 w-9 place-items-center rounded-full border border-bone/30">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="absolute inset-1 rounded-full border border-dashed border-bone/20" />
          </span>
          <span className="leading-none">
            <span className="block font-mono text-[11px] font-bold tracking-[0.2em]" dir="ltr">DIFFERENT PERSPECTIVE</span>
            <span className="mt-1 block text-[12px] text-haze">יעקב כליפא · צילום רחפן</span>
          </span>
        </a>
        <ul className="hidden items-center gap-7 text-sm text-bone/80 lg:flex">
          {NAV.map((n) => <li key={n.href}><a className="transition-colors hover:text-gold" href={n.href}>{n.label}</a></li>)}
        </ul>
        <div className="flex items-center gap-2">
          <a href="#planner" className="btn-gold hidden !px-5 !py-2.5 text-sm sm:inline-flex">תכננו טיסה</a>
          <button type="button" className="rounded-full p-2.5 lg:hidden" aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass mx-auto mt-2 max-w-7xl rounded-3xl border border-bone/10 p-6 lg:hidden">
          <ul className="flex flex-col gap-1">
            {[...NAV, { label: 'מתכנן הטיסה', href: '#planner' }, { label: 'צור קשר', href: '#contact' }].map((n) => (
              <li key={n.href}><a onClick={() => setOpen(false)} className="block py-3 font-display text-4xl font-bold" href={n.href}>{n.label}</a></li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

function Hero() {
  const ref = useRef(null)
  const [i, setI] = useState(0)
  const tc = useTimecode()
  const [alt, setAlt] = useState(86)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % HERO_SLIDES.length), 6500)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    const id = setInterval(() => setAlt((a) => Math.max(60, Math.min(110, a + (Math.random() - 0.5) * 2.4))), 500)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.h-in', { y: 50, opacity: 0, duration: 1.1, stagger: 0.12, delay: 0.2, ease: 'power3.out' })
      gsap.from('.hud-in', { opacity: 0, duration: 1.4, delay: 0.6, ease: 'power2.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-night">
      {HERO_SLIDES.map((s, k) => (
        <div key={s.src} className="absolute inset-0 transition-opacity duration-[1600ms]" style={{ opacity: k === i ? 1 : 0 }} aria-hidden={k !== i}>
          <img key={k === i ? `on-${i}` : 'off'} src={m(s.src)} alt="" className={`h-full w-full object-cover ${k === i ? 'kenburns' : ''}`} loading={k === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/10 to-night" />
      <div className="absolute inset-0 bg-gradient-to-l from-night/80 via-night/20 to-transparent" />
      <div className="scanline absolute inset-0" />

      {/* viewfinder HUD */}
      <div className="hud-in pointer-events-none absolute inset-3 top-[88px] bottom-4 sm:inset-8 sm:top-[104px]" dir="ltr">
        <span className="bracket tl" /><span className="bracket tr" /><span className="bracket bl" /><span className="bracket br" />
        <div className="absolute left-4 top-3 flex items-center gap-3 font-mono text-[11px] text-bone/90 sm:left-6 sm:top-4 sm:text-xs">
          <span className="flex items-center gap-1.5"><span className="rec-dot h-2.5 w-2.5 rounded-full bg-rec" />REC</span>
          <span className="tabular-nums">{tc}</span>
        </div>
        <div className="absolute right-4 top-3 hidden items-center gap-4 font-mono text-xs text-bone/80 sm:right-6 sm:top-4 sm:flex">
          <span>5.1K · 25p</span><span>D-LOG M</span><span>ISO 100</span><span>1/50</span>
          <span className="flex items-center gap-1">87%<span className="relative h-2.5 w-5 rounded-[2px] border border-bone/70"><span className="absolute inset-y-[1px] left-[1px] w-[80%] bg-bone/80" /></span></span>
        </div>
        {/* crosshair */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
          <div className="relative h-14 w-14">
            <span className="absolute left-1/2 top-0 h-3 w-px bg-bone/60" /><span className="absolute bottom-0 left-1/2 h-3 w-px bg-bone/60" />
            <span className="absolute left-0 top-1/2 h-px w-3 bg-bone/60" /><span className="absolute right-0 top-1/2 h-px w-3 bg-bone/60" />
          </div>
        </div>
        {/* altitude ladder */}
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-2 font-mono text-[10px] text-hud/80 md:flex">
          {[120, 100, 80, 60, 40].map((v) => <span key={v} className="flex items-center gap-2">{v}<span className="h-px w-3 bg-hud/60" /></span>)}
        </div>
        <div className="absolute bottom-3 left-4 flex items-center gap-4 font-mono text-[11px] text-hud sm:bottom-4 sm:left-6 sm:text-xs">
          <span className="tabular-nums">ALT {alt.toFixed(1)}m</span>
          <span className="hidden sm:inline">GIMBAL -32°</span>
          <span className="hidden sm:inline">H.S 4.2m/s</span>
        </div>
        <div className="absolute bottom-3 right-4 font-mono text-[11px] text-bone/80 sm:bottom-4 sm:right-6 sm:text-xs">
          <span className="tabular-nums">{String(i + 1).padStart(2, '0')}/{String(HERO_SLIDES.length).padStart(2, '0')}</span>
          <span className="mx-2 text-bone/40">·</span>
          <span dir="rtl">{HERO_SLIDES[i].place}</span>
        </div>
      </div>

      <div className="wrap relative z-10 flex min-h-[100svh] flex-col justify-end pb-20 pt-36 sm:pb-24">
        <p className="h-in eyebrow mb-5">צילום רחפן קולנועי · רישיון רת״א</p>
        <h1 className="h-in font-display text-[88px] font-bold leading-[0.82] sm:text-[140px] lg:text-[190px]">
          רואים את זה<br /><span className="text-gold">אחרת.</span>
        </h1>
        <p className="h-in mt-6 max-w-xl text-lg leading-relaxed text-bone/80 sm:text-xl">
          שוטים מהאוויר להפקות, קליפים, אירועים ונדל״ן. אתם מתרכזים ביצירה, ואני דואג לאישורים, לתיאומים ולביטוח.
        </p>
        <div className="h-in mt-9 flex flex-wrap gap-3">
          <a href="#planner" className="btn-gold">תכננו את הטיסה שלכם <ArrowUpLeft className="h-4 w-4" /></a>
          <a href={SHOWREEL} target="_blank" rel="noreferrer" className="btn-ghost"><Play className="h-4 w-4 fill-current" /> לצפייה בשואוריל</a>
        </div>
      </div>
    </section>
  )
}

function TrustStrip() {
  const row = [...TRUST, ...TRUST]
  return (
    <div className="relative overflow-hidden border-y border-slate bg-coal py-5" aria-label="אישורים וניסיון">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((t, k) => (
          <span key={k} className="flex items-center gap-10 text-sm text-bone/80 sm:text-base" aria-hidden={k >= TRUST.length}>
            {t}<span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          </span>
        ))}
      </div>
    </div>
  )
}

function AltitudeScroll() {
  const wrap = useRef(null)
  const img = useRef(null)
  const altRef = useRef(null)
  const barRef = useRef(null)
  const [step, setStep] = useState(0)
  const LINES = [
    { alt: 'מהקרקע', text: 'רואים פרט.' },
    { alt: 'מ-40 מטר', text: 'רואים צורה.' },
    { alt: 'מ-100 מטר', text: 'רואים סיפור.' },
  ]
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          if (img.current) img.current.style.transform = `scale(${(3.6 - 2.6 * p).toFixed(4)})`
          if (altRef.current) altRef.current.textContent = (2 + p * 98).toFixed(1)
          if (barRef.current) barRef.current.style.transform = `scaleY(${p.toFixed(4)})`
          setStep(p < 0.33 ? 0 : p < 0.7 ? 1 : 2)
        },
      })
    }, wrap)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={wrap} className="relative h-[320vh] bg-night" aria-label="הפרספקטיבה">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <img ref={img} src={m('sinkholes.jpg')} alt="בולענים ליד ים המלח, צילום מבט-על" className="absolute inset-0 h-full w-full origin-center object-cover will-change-transform" style={{ transform: 'scale(3.6)' }} />
        <div className="absolute inset-0 bg-night/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/60" />

        {/* telemetry rail */}
        <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-3 sm:left-10" dir="ltr">
          <div className="relative h-56 w-[3px] overflow-hidden rounded-full bg-bone/15 sm:h-72">
            <div ref={barRef} className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-hud" style={{ transform: 'scaleY(0)' }} />
          </div>
          <div className="font-mono text-hud">
            <p className="text-[10px] tracking-[0.2em] text-hud/70">ALT</p>
            <p className="text-2xl tabular-nums sm:text-4xl"><span ref={altRef}>2.0</span><span className="text-sm">m</span></p>
            <p className="mt-3 text-[10px] tracking-[0.2em] text-hud/70">GIMBAL</p>
            <p className="text-sm">-90°</p>
          </div>
        </div>

        <div className="wrap relative flex !pl-24 sm:!pl-36 h-full flex-col justify-center">
          <p className="eyebrow mb-6">Different Perspective</p>
          <div className="relative min-h-[260px] sm:min-h-[340px]">
            {LINES.map((l, k) => (
              <div key={k} className="absolute inset-x-0 top-0 transition-all duration-700" style={{ opacity: step === k ? 1 : 0, transform: `translateY(${step === k ? 0 : step > k ? -30 : 30}px)` }} aria-hidden={step !== k}>
                <p className="font-display text-[72px] font-bold leading-[0.85] text-bone/50 sm:text-[120px] lg:text-[150px]">{l.alt}</p>
                <p className="font-display text-[72px] font-bold leading-[0.85] sm:text-[120px] lg:text-[150px]">{l.text}</p>
              </div>
            ))}
          </div>
          <p className="max-w-md text-base leading-relaxed text-bone/80 sm:text-lg">
            בולענים ליד ים המלח, צולם מבט-על. אותו מקום, בגובה אחר, מספר סיפור אחר. את הזווית הזאת אני מביא להפקה שלכם.
          </p>
        </div>
      </div>
    </section>
  )
}

function Audiences() {
  const [active, setActive] = useState(AUDIENCES[0].id)
  const a = AUDIENCES.find((x) => x.id === active)
  return (
    <section id="who" className="py-24 sm:py-32">
      <div className="wrap">
        <SectionHead eyebrow="למי זה מתאים" title={<>זווית אחת<br />משנה את כל התמונה</>} sub="ארבעה סוגי לקוחות, וכל אחד מהם צריך משהו אחר מהשוט. בחרו את שלכם:" />
        <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist">
          {AUDIENCES.map((x) => {
            const Icon = x.icon
            return (
              <button key={x.id} type="button" role="tab" aria-selected={active === x.id} aria-pressed={active === x.id} onClick={() => setActive(x.id)} className="chip flex shrink-0 items-center gap-2">
                <Icon className="h-4 w-4" />{x.tab}
              </button>
            )
          })}
        </div>
        <div key={a.id} className="mt-8 grid overflow-hidden rounded-[28px] border border-slate bg-coal lg:grid-cols-[1.25fr_1fr]" role="tabpanel">
          <div className="relative aspect-[16/10] max-w-full overflow-hidden lg:aspect-auto lg:min-h-[480px]">
            <img src={m(a.img)} alt="" className="kenburns absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-coal/80 to-transparent lg:bg-gradient-to-l" />
          </div>
          <div className="flex min-w-0 flex-col justify-center gap-6 p-6 sm:p-10">
            <h3 className="font-display text-5xl font-bold leading-[0.9] sm:text-6xl">{a.title}</h3>
            <p className="max-w-[55ch] leading-relaxed text-bone/80">{a.text}</p>
            <ul className="grid gap-3">
              {a.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm sm:text-base"><span className="grid h-6 w-6 place-items-center rounded-full bg-gold/15"><Check className="h-3.5 w-3.5 text-gold" /></span>{p}</li>
              ))}
            </ul>
            <a href="#planner" className="btn-ghost self-start">לתכנון הטסה <ArrowUpLeft className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Work() {
  const [main, ...rest] = REELS
  return (
    <section id="work" className="border-t border-slate py-24 sm:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="עבודות נבחרות" title="על המסך" sub="קליפים, הפקות ושואוריל. כל כרטיס נפתח ביוטיוב." />
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn-ghost"><Instagram className="h-4 w-4" /> עוד באינסטגרם</a>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ReelCard r={main} big />
          {rest.map((r) => <ReelCard key={r.id} r={r} />)}
        </div>
      </div>

      <div className="mt-16">
        <div className="wrap mb-5 flex items-center justify-between">
          <p className="eyebrow">סטילס · גללו הצידה</p>
          <p className="font-mono text-xs text-haze" dir="ltr">{STILLS.length} FRAMES</p>
        </div>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-12">
          {STILLS.map((s, k) => (
            <figure key={s} className="relative h-[260px] w-[78vw] max-w-[440px] shrink-0 snap-start overflow-hidden rounded-2xl sm:h-[340px]">
              <img src={m(s)} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-night/70 px-2.5 py-1 font-mono text-[10px] text-bone/80" dir="ltr">DP_{String(k + 1).padStart(4, '0')}.DNG</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReelCard({ r, big }) {
  return (
    <a href={`https://youtu.be/${r.id}`} target="_blank" rel="noreferrer" className={`group relative block overflow-hidden rounded-[24px] border border-slate bg-coal ${big ? 'aspect-video sm:col-span-2 lg:row-span-2 lg:aspect-auto' : 'aspect-video'}`}>
      <img src={m(`yt-${r.id}.jpg`)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/10 to-transparent" />
      <span className="absolute right-4 top-4 rounded-full bg-night/70 px-3 py-1 text-xs text-bone/90 backdrop-blur">{r.tag}</span>
      <span className={`absolute left-4 top-4 grid place-items-center rounded-full bg-gold text-night transition-transform group-hover:scale-110 ${big ? 'h-16 w-16' : 'h-11 w-11'}`}>
        <Play className={`${big ? 'h-6 w-6' : 'h-4 w-4'} fill-current`} />
      </span>
      <p className={`absolute inset-x-4 bottom-4 font-semibold leading-snug ${big ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'}`}>{r.title}</p>
    </a>
  )
}

function Process() {
  return (
    <section id="process" className="border-t border-slate bg-coal/40 py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead eyebrow="איך זה עובד" title={<>שלושה שלבים,<br />ראש שקט</>} sub="להטיס רחפן כל אחד יכול. להפיק ממנו תוצאה ברמה שמתאימה להפקה שלכם, זה כבר דורש ניסיון והכנה." />
        </div>
        <div className="grid gap-5">
          {STEPS.map((s, k) => {
            const Icon = s.icon
            return (
              <article key={s.n} className="sticky rounded-[28px] border border-slate bg-coal p-6 shadow-[0_-20px_60px_-20px_rgba(0,0,0,.8)] sm:p-9" style={{ top: `${110 + k * 24}px` }}>
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/10"><Icon className="h-6 w-6 text-gold" strokeWidth={2.2} /></span>
                  <span className="font-mono text-5xl font-bold leading-none text-bone/15" dir="ltr">{s.n}</span>
                </div>
                <h3 className="mt-6 font-display text-5xl font-bold">{s.title}</h3>
                <p className="mt-3 max-w-[60ch] leading-relaxed text-bone/75">{s.text}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {s.meta.map((t) => <span key={t} className="rounded-full border border-slate px-3 py-1 font-mono text-[11px] text-hud">{t}</span>)}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Planner() {
  const [type, setType] = useState(P_TYPES[3])
  const [duration, setDuration] = useState('half')
  const [outputs, setOutputs] = useState(['סרטון ערוך', 'תמונות סטילס'])
  const [place, setPlace] = useState('')
  const [date, setDate] = useState('')
  const pkg = pickPackage(duration)
  const durLabel = P_DURATIONS.find((d) => d.id === duration)?.label
  const toggle = (o) => setOutputs((xs) => (xs.includes(o) ? xs.filter((x) => x !== o) : [...xs, o]))
  const dateLabel = date ? new Date(date + 'T12:00:00').toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const code = useMemo(() => {
    const s = `${type}${duration}${outputs.join()}${place}${date}`
    let h = 0; for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0
    return `DP-${String(h % 9000 + 1000)}`
  }, [type, duration, outputs, place, date])

  const message = [
    'היי יעקב, הגעתי מהאתר 👋',
    `סוג הפקה: ${type}`,
    `מיקום: ${place || 'עוד לא סגור'}`,
    `תאריך: ${dateLabel || 'גמיש'}`,
    `משך: ${durLabel}`,
    `תוצרים: ${outputs.length ? outputs.join(', ') : 'נתייעץ'}`,
    `מסלול מתאים: ${pkg.name}`,
    'אשמח להצעת מחיר.',
  ].join('\n')

  const rows = [
    { icon: Camera, k: 'סוג הפקה', v: type },
    { icon: MapPin, k: 'מיקום', v: place || '—' },
    { icon: CalendarDays, k: 'תאריך', v: dateLabel || 'גמיש' },
    { icon: Clock3, k: 'משך', v: durLabel },
    { icon: Package, k: 'תוצרים', v: outputs.length ? outputs.join(' · ') : '—' },
  ]

  return (
    <section id="planner" className="relative overflow-hidden border-t border-slate py-24 sm:py-32">
      <img src={m('flower-rows.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.12]" />
      <div className="absolute inset-0 bg-gradient-to-b from-night via-night/80 to-night" />
      <div className="wrap relative">
        <SectionHead eyebrow="מתכנן טיסה" title={<>בנו בריף<br />בדקה אחת</>} sub="סמנו מה אתם צריכים. בצד תראו איזה מסלול מתאים לכם, ובלחיצה אחת הבריף נשלח ליעקב בוואטסאפ." />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid min-w-0 gap-8">
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-bone/90">1. מה מצלמים?</legend>
              <div className="flex flex-wrap gap-2">
                {P_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className="chip">{t}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-bone/90">2. כמה זמן?</legend>
              <div className="flex flex-wrap gap-2">
                {P_DURATIONS.map((d) => <button key={d.id} type="button" aria-pressed={duration === d.id} onClick={() => setDuration(d.id)} className="chip">{d.label}</button>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-bone/90">3. מה תרצו לקבל? <span className="font-normal text-haze">(אפשר כמה)</span></legend>
              <div className="flex flex-wrap gap-2">
                {P_OUTPUTS.map((o) => <button key={o} type="button" aria-pressed={outputs.includes(o)} onClick={() => toggle(o)} className="chip">{o}</button>)}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-bone/90" htmlFor="pl-place">4. איפה?
                <input id="pl-place" className="field font-normal" placeholder="למשל: הרצליה פיתוח" value={place} onChange={(e) => setPlace(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-bone/90" htmlFor="pl-date">5. מתי? <span className="sr-only">(לא חובה)</span>
                <input id="pl-date" type="date" className="field font-normal" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>
          </div>

          {/* flight brief card */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[28px] border border-slate bg-coal">
              <div className="flex items-center justify-between border-b border-dashed border-slate px-6 py-4" dir="ltr">
                <span className="font-mono text-xs tracking-[0.2em] text-hud">FLIGHT BRIEF</span>
                <span className="font-mono text-xs text-bone/70 tabular-nums">{code}</span>
              </div>
              <dl className="grid gap-4 px-6 py-6">
                {rows.map(({ icon: Icon, k, v }) => (
                  <div key={k} className="grid grid-cols-[auto_88px_1fr] items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 text-haze" />
                    <dt className="text-sm text-haze">{k}</dt>
                    <dd className="min-w-0 break-words text-sm font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="relative border-t border-dashed border-slate px-6 py-6">
                <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-night" />
                <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-night" />
                <p className="text-xs text-haze">המסלול שמתאים לכם</p>
                <p className="mt-1 font-display text-5xl font-bold text-gold">{pkg.name}</p>
                <p className="mt-1 text-sm text-bone/70">תמחור {pkg.basis} · {pkg.why}</p>
                <ul className="mt-5 grid grid-cols-2 gap-2 text-xs text-bone/80">
                  {['אישורי הטסה', 'תיאום רשויות', 'סד״פ לפי החוק', 'ביטוח צד ג׳'].map((t) => (
                    <li key={t} className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-hud" />{t}</li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-haze">כלול בכל מסלול</p>
                <a href={wa(message)} target="_blank" rel="noreferrer" className="btn-gold mt-6 w-full"><MessageCircle className="h-4 w-4" /> שליחת הבריף בוואטסאפ</a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="border-t border-slate py-24 sm:py-32">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] max-w-full overflow-hidden rounded-[28px]">
            <img src={m('jacob.jpg')} alt="יעקב כליפא" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
          </div>
          <div className="pointer-events-none absolute inset-3"><span className="bracket tl" /><span className="bracket tr" /><span className="bracket bl" /><span className="bracket br" /></div>
          <div className="absolute -bottom-5 left-6 rounded-2xl border border-slate bg-coal px-5 py-3">
            <p className="font-mono text-[10px] tracking-[0.2em] text-hud" dir="ltr">FIRST FLIGHT</p>
            <p className="font-mono text-3xl font-bold leading-none">2018</p>
          </div>
        </Reveal>
        <div>
          <SectionHead eyebrow="קצת עליי" title={<>נעים להכיר,<br />יעקב כליפא</>} />
          <Reveal className="mt-6 grid max-w-[60ch] gap-4 text-base leading-relaxed text-bone/80 sm:text-lg">
            <p>מאז ומתמיד הייתה בי תשוקה לתעופה. ב-2018, רגע לפני טיול גדול בעולם, גיליתי את עולם הרחפנים ומאז אין דרך חזרה.</p>
            <p>אני צלם, יוצר תוכן ומדריך הטסה מקצועי. עבדתי על סדרות טלוויזיה, קליפים, פסטיבלים, אירועי ספורט וצילומי אדריכלות, והדרכתי מאות שעות הטסה לקבוצות בארץ ובחו״ל.</p>
            <p className="text-bone">הגישה שלי זהה בכל פרויקט: הכנה יסודית וביצוע מדויק, כדי שהצוות יתמקד בשוט ולא בלוגיסטיקה.</p>
          </Reveal>
          <Reveal className="mt-8 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-slate bg-slate">
            {[{ v: '8+', l: 'שנות הטסה' }, { v: '3', l: 'מצלמות ב-Mavic 3 Pro' }, { v: 'מאות', l: 'שעות הדרכת הטסה' }].map((s) => (
              <div key={s.l} className="bg-coal p-4 text-center">
                <p className={`${/\d/.test(s.v) ? 'font-mono text-4xl' : 'font-display text-5xl'} font-bold leading-none text-gold`} dir="ltr">{s.v}</p>
                <p className="mt-1 text-xs text-haze">{s.l}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="border-t border-slate bg-coal/40 py-24 sm:py-32">
      <div className="wrap">
        <SectionHead eyebrow="המלצות" title="מה אומרים עליי" />
      </div>
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-8 lg:px-12">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="flex w-[84vw] max-w-[420px] shrink-0 snap-start flex-col justify-between gap-8 rounded-[28px] border border-slate bg-coal p-7">
            <blockquote className="text-lg leading-relaxed text-bone/90" dir={t.ltr ? 'ltr' : 'rtl'}>
              <span className="font-display text-6xl leading-none text-gold">״</span>
              <p className="-mt-4">{t.text}</p>
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-slate font-display text-2xl font-bold text-gold">{t.name[0]}</span>
              <span><span className="block font-semibold">{t.name}</span>{t.role && <span className="block text-sm text-haze">{t.role}</span>}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="border-t border-slate py-24 sm:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead eyebrow="שאלות נפוצות" title={<>לפני<br />ההמראה</>} sub="לא מצאתם תשובה? כתבו לי בוואטסאפ ואחזור אליכם." />
        <div className="divide-y divide-slate border-y border-slate">
          {FAQ.map((f, k) => (
            <details key={k} className="group py-2" open={k === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="max-w-[62ch] pb-5 leading-relaxed text-bone/75">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [msg, setMsg] = useState('')
  const text = ['היי יעקב, הגעתי מהאתר 👋', name && `שם: ${name}`, phone && `טלפון: ${phone}`, msg && `\n${msg}`].filter(Boolean).join('\n')
  return (
    <section id="contact" className="relative overflow-hidden border-t border-slate">
      <img src={m('harbor-dusk.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/85 to-night/60" />
      <div className="wrap relative grid gap-12 py-24 sm:py-32 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-4">מוכנים להמראה?</p>
          <h2 className="font-display text-[64px] font-bold leading-[0.85] sm:text-[110px]">בואו נרים<br /><span className="text-gold">את ההפקה.</span></h2>
          <ul className="mt-10 grid gap-3">
            <li className="flex items-center justify-between gap-3 rounded-2xl border border-slate bg-coal/80 px-5 py-4">
              <a href={`tel:${PHONE_TEL}`} className="flex min-w-0 items-center gap-3"><Phone className="h-5 w-5 shrink-0 text-gold" /><span className="select-all font-mono text-lg" dir="ltr">{PHONE_DISPLAY}</span></a>
              <CopyButton value={PHONE_DISPLAY} label="מספר הטלפון" />
            </li>
            <li className="flex items-center justify-between gap-3 rounded-2xl border border-slate bg-coal/80 px-5 py-4">
              <a href={`mailto:${EMAIL}`} className="flex min-w-0 items-center gap-3"><Mail className="h-5 w-5 shrink-0 text-gold" /><span className="select-all truncate font-mono text-sm sm:text-base" dir="ltr">{EMAIL}</span></a>
              <CopyButton value={EMAIL} label="כתובת המייל" />
            </li>
            <li className="flex items-center justify-between gap-3 rounded-2xl border border-slate bg-coal/80 px-5 py-4">
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="flex items-center gap-3"><Instagram className="h-5 w-5 text-gold" /><span className="font-mono" dir="ltr">@jacobkdrone</span></a>
            </li>
          </ul>
        </div>
        <form className="grid content-start gap-4 rounded-[28px] border border-slate bg-coal/90 p-6 backdrop-blur sm:p-8" onSubmit={(e) => e.preventDefault()}>
          <h3 className="font-display text-4xl font-bold">הצעת מחיר מותאמת</h3>
          <p className="-mt-2 text-sm text-haze">ממלאים, לוחצים, וההודעה נפתחת בוואטסאפ מוכנה לשליחה.</p>
          <label className="grid gap-2 text-sm" htmlFor="c-name">שם מלא<input id="c-name" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="grid gap-2 text-sm" htmlFor="c-phone">טלפון<input id="c-phone" className="field" inputMode="tel" autoComplete="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          <label className="grid gap-2 text-sm" htmlFor="c-msg">על מה מדובר?<textarea id="c-msg" rows={4} className="field resize-none" placeholder="סוג ההפקה, מיקום, תאריך משוער" value={msg} onChange={(e) => setMsg(e.target.value)} /></label>
          <a href={wa(text)} target="_blank" rel="noreferrer" className="btn-gold mt-2"><MessageCircle className="h-4 w-4" /> שליחה בוואטסאפ</a>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate pb-28 pt-10 sm:pb-10">
      <div className="wrap flex flex-col items-start justify-between gap-6 text-sm text-haze sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hud opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-hud" /></span>
          <span>זמין להפקות בכל הארץ · רישיון רת״א · ביטוח צד ג׳</span>
        </div>
        <p dir="ltr" className="font-mono text-xs">© {new Date().getFullYear()} DIFFERENT PERSPECTIVE · JACOB KHALIFA</p>
      </div>
    </footer>
  )
}

function MobileBar() {
  return (
    <div className="glass fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-bone/10 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-2.5 sm:hidden">
      <a href={wa('היי יעקב, הגעתי מהאתר ואשמח לשמוע על צילום רחפן 👋')} target="_blank" rel="noreferrer" className="btn-gold flex-1 !py-3"><MessageCircle className="h-4 w-4" /> וואטסאפ</a>
      <a href={`tel:${PHONE_TEL}`} className="btn-ghost flex-1 !py-3"><Phone className="h-4 w-4" /> חיוג</a>
    </div>
  )
}

function FloatingWhatsApp() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  if (!show) return null
  return (
    <a href={wa('היי יעקב, הגעתי מהאתר ואשמח לשמוע על צילום רחפן 👋')} target="_blank" rel="noreferrer" aria-label="וואטסאפ ליעקב"
      className="fixed bottom-6 left-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-gold text-night shadow-[0_10px_40px_-10px_rgba(244,183,64,.7)] transition-transform hover:scale-110 sm:grid">
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => clearTimeout(id)
  }, [])
  return (
    <div className="relative">
      <div className="noise" />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <AltitudeScroll />
        <Audiences />
        <Work />
        <Process />
        <Planner />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
      <FloatingWhatsApp />
    </div>
  )
}
