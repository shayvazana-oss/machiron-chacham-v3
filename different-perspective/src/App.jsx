import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ---------- business data ---------- */
const PHONE_DISPLAY = '054-6330531'
const PHONE_TEL = '+972546330531'
const WA_NUMBER = '972546330531'
const EMAIL = 'differentperspective.jk@gmail.com'
const INSTAGRAM = 'https://www.instagram.com/jacobkdrone/'
// a standalone build may inline images into window.__MEDIA
const m = (f) => window.__MEDIA?.[f] || `media/${f}`
const wa = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
const yt = (id) => `https://youtu.be/${id}`

const HERO = [
  { src: 'deadsea-swirl.jpg', cap: 'ים המלח' },
  { src: 'jaffa.jpg', cap: 'נמל יפו' },
  { src: 'sunset-flats.jpg', cap: 'שעת זהב' },
  { src: 'island.jpg', cap: 'מטיול בחו״ל' },
]

const WORK = [
  { id: 'fD1p0e-XTNc', title: 'A Little Too Much', who: 'דניאל מויאל', kind: 'קליפ' },
  { id: 'L_iy-7RTUHE', title: 'צ׳וצ׳ו', who: 'ליהוט', kind: 'קליפ' },
  { id: 'Owc-KC799Lo', title: 'היית בא אליי', who: 'שי נחייסי ואיה זהבי פייגלין', kind: 'קליפ' },
  { id: 'UgAKWm9mSrM', title: 'Shelter', who: 'ליהוט', kind: 'קליפ' },
  { id: 'vpnEI_haqg0', title: 'בשביל הגיבורות', who: '', kind: 'הפקה' },
  { id: 'ImC2nrLLT5Q', title: 'Aerial Showreel', who: 'Different Perspective', kind: 'שואוריל' },
]

// free-form plate layout: [file, caption, grid classes, aspect]
const PLATES = [
  ['sinkholes.jpg', 'בולענים, ים המלח', 'md:col-span-7', 'aspect-[3/2]'],
  ['temple-forest.jpg', 'מקדש ביער', 'md:col-span-4 md:col-start-9 md:mt-40', 'aspect-[4/5]'],
  ['architecture-top.jpg', 'אדריכלות, מבט-על', 'md:col-span-12', 'aspect-[2.39/1]'],
  ['flower-rows.jpg', 'שורות פרחים', 'md:col-span-5 md:col-start-2', 'aspect-[4/5]'],
  ['villa-waterfall.jpg', 'וילה ליד מפל', 'md:col-span-5 md:col-start-8 md:mt-24', 'aspect-[3/2]'],
  ['cloud-valley.jpg', 'עמק מעל העננים', 'md:col-span-8 md:col-start-3', 'aspect-[2.39/1]'],
  ['village-top.jpg', 'כפר מלמעלה', 'md:col-span-4', 'aspect-square'],
  ['hoodoos.jpg', 'שקיעה בקניון', 'md:col-span-7 md:col-start-6 md:-mt-10', 'aspect-[3/2]'],
]

const SERVICES = [
  { t: 'קולנוע, טלוויזיה וקליפים', d: 'שוטים שפותחים סצנה. עובד צמוד לבמאי ולצלם הראשי, עם תוכנית טיסה שמוכנה לפני יום הצילום.' },
  { t: 'אירועים, ספורט ופסטיבלים', d: 'הגודל של האירוע, בפריים אחד. עבודה לפי הלו״ז של ההפקה, כולל אישורים מעל אזורים מאוכלסים.' },
  { t: 'פרסום ותוכן לעסקים', d: 'סרטוני תדמית ותוכן ממותג, כולל גרסאות אנכיות לרשתות.' },
  { t: 'נדל״ן ואדריכלות', d: 'מבט-על לפרויקט, תיעוד התקדמות בנייה וסטילס ברזולוציה גבוהה לשיווק.' },
  { t: 'חתונות והצעות נישואין', d: 'עזרה בבחירת לוקיישן, צילום, ואם רוצים גם סרטון ערוך עם מוזיקה.' },
  { t: 'תיירות ואירוח', d: 'מלונות, צימרים ואטרקציות, מהזווית שגורמת לאנשים להזמין.' },
]

const PLANS = [
  { t: 'יום צילום', b: 'לפי יום מלא או חצי יום', d: 'להפקות עם לוח זמנים מוגדר.' },
  { t: 'הפקה מקיפה', b: 'לפי פרויקט', d: 'לפרויקטים גדולים או בהתאמה אישית.' },
  { t: 'ממוקד תוכן', b: 'לפי כמות התוצרים', d: 'לסרטוני תדמית ותוכן ממותג.' },
]

const WORDS = [
  { q: 'יצירתי, ראש גדול וסופר מקצועי. כל מי שצריך צילומי רחפן ברמה גבוהה, יעקב הוא הכתובת.', n: 'גלעד קליין' },
  { q: 'המליץ לי על מקום יפה עם נוף, הסביר איך מגיעים, עשה צילומים מטורפים, ערך ובחר שיר שמתאים לסרטון.', n: 'אברהם טבול', r: 'הצעת נישואין' },
  { q: 'An artist with a fine eye for detail and execution. Willing to go the extra mile for the client and creative team.', n: 'Navi Buchal', ltr: true },
  { q: 'הכול היה מושלם. מוכשר ומקצועי ברמות.', n: 'מאיה', r: 'פרויקט אדריכלות' },
  { q: 'עבדתי איתו בכמה הפקות ותמיד יצאתי מבסוט. בא בזמן ועושה את העבודה בצורה יסודית.', n: 'וואדים מכונה' },
]

const FAQ = [
  { q: 'כמה עולה צילום רחפן?', a: 'זה תלוי בסוג הצילום, במשך העבודה ובמיקום. ספרו לי מה אתם צריכים ותקבלו הצעה מדויקת.' },
  { q: 'באיזו איכות מצלמים?', a: 'באיכות הגבוהה ביותר שהציוד מאפשר. רזולוציה, קצב פריימים ופרופיל צבע נקבעים לפי מה שההפקה צריכה.' },
  { q: 'איך מקבלים את החומרים?', a: 'כבר ביום הצילום, על כרטיס זיכרון או USB שלכם, או בתיקייה ב-Drive או ב-iCloud, באיכות המקורית.' },
  { q: 'מה קורה כשיש רוח, גשם או הגבלה ביטחונית?', a: 'קובעים יחד מועד חלופי. לא מטיסים כשזה לא בטוח.' },
  { q: 'איך יודעים שמטיס מורשה?', a: 'מבקשים לראות רישיון רת״א, אישור ביטוח צד ג׳ ואת אישורי ההטסה לצילום. מטיס מקצועי יציג אותם בלי בעיה.' },
]

// inline fields size to their text so the sentence reads naturally
const fit = (str) => ({ width: `${Math.max(str.length, 3) * 0.47 + 0.5}em` })

const KINDS = ['קליפ', 'הפקת טלוויזיה או קולנוע', 'אירוע', 'סרטון לעסק', 'פרויקט נדל״ן', 'חתונה או הצעת נישואין', 'מלון או צימר']
const OUTS = ['חומר גלם באיכות מקורית', 'סרטון ערוך', 'תמונות סטילס', 'גם וגם']

/* ---------- helpers ---------- */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('[data-reveal]')
    if (!els?.length) return
    const ctx = gsap.context(() => {
      els.forEach((el) => {
        gsap.fromTo(el, { y: 28, opacity: 0.001 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return ref
}

function Label({ children, className = '' }) {
  return <p className={`mb-8 text-[13px] tracking-wide text-ash ${className}`}>{children}</p>
}

/* ---------- sections ---------- */
function Header() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight - 80)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <header className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-colors duration-500 ${solid ? 'bg-screen/90 backdrop-blur' : ''}`}>
      <div className="wrap flex h-16 items-center justify-between text-[14px]">
        <a href="#top" className="font-serif text-[19px] leading-none" aria-label="לראש הדף">יעקב כליפא</a>
        <nav className="flex items-center gap-6 sm:gap-9">
          <a className="tlink hidden sm:inline-flex" href="#work">עבודות</a>
          <a className="tlink hidden sm:inline-flex" href="#services">שירותים</a>
          <a className="tlink hidden sm:inline-flex" href="#about">אודות</a>
          <a className="tlink" href="#contact">צרו קשר</a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % HERO.length), 6000)
    return () => clearInterval(id)
  }, [])
  return (
    <section id="top" className="flex min-h-[100svh] flex-col bg-screen pt-16">
      <figure className="shutter relative mx-4 flex-1 overflow-hidden sm:mx-8 lg:mx-14">
        {HERO.map((h, k) => (
          <img key={h.src} src={m(h.src)} alt={h.cap} loading={k ? 'lazy' : 'eager'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ${k === i ? 'drift opacity-100' : 'opacity-0'}`} />
        ))}
        <figcaption className="absolute bottom-0 inset-x-0 flex justify-center bg-gradient-to-t from-black/55 to-transparent px-4 pb-6 pt-24">
          <p className="fade-up max-w-2xl text-center text-[17px] leading-snug text-white [animation-delay:1.4s] [text-shadow:0_1px_12px_rgba(0,0,0,.6)] sm:text-[21px]">
            צילום רחפן קולנועי להפקות, קליפים, אירועים ונדל״ן.
          </p>
        </figcaption>
      </figure>
      <div className="wrap grid gap-6 pb-20 pt-7 sm:grid-cols-[1fr_auto] sm:items-end sm:py-9">
        <h1 className="fade-up font-serif text-[44px] font-light leading-[1] [animation-delay:.9s] sm:text-[72px] lg:text-[96px]">
          Different Perspective
        </h1>
        <div className="fade-up flex items-end justify-between gap-10 text-[13px] text-ash [animation-delay:1.1s] sm:flex-col sm:items-start sm:gap-2">
          <p className="tabular-nums">{HERO[i].cap} · {i + 1}/{HERO.length}</p>
          <a href="#work" className="tlink text-paper">לעבודות ↓</a>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  const ref = useReveal()
  return (
    <section ref={ref} className="paper py-24 sm:py-36">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <Label className="lg:col-span-3">היי, אני יעקב</Label>
        <div className="lg:col-span-9">
          <p data-reveal className="font-serif text-[28px] font-light leading-[1.35] sm:text-[40px] lg:text-[48px]">
            מטיס רחפנים מאז 2018. צילמתי סדרות טלוויזיה, קליפים, פסטיבלים, אירועי ספורט ופרויקטים של אדריכלות.
            <span className="text-ash"> את האישורים, התיאומים והביטוח אני לוקח עליי, כדי שאתם תתרכזו בשוט.</span>
          </p>
          <div data-reveal className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-[15px]">
            <a href="#contact" className="tlink">לבדוק זמינות ←</a>
            <a href={yt('ImC2nrLLT5Q')} target="_blank" rel="noreferrer" className="tlink">לצפייה בשואוריל ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkIndex() {
  const ref = useReveal()
  const [hover, setHover] = useState(null)
  const preview = useRef(null)
  const onMove = (e) => {
    if (!preview.current) return
    preview.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
  }
  return (
    <section id="work" ref={ref} className="bg-screen py-24 sm:py-36" onMouseMove={onMove}>
      <div className="wrap">
        <div className="mb-14 flex items-end justify-between gap-6">
          <h2 data-reveal className="font-serif text-[44px] font-light leading-none sm:text-[72px]">עבודות</h2>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="tlink text-[14px] text-ash">עוד באינסטגרם ↗</a>
        </div>
        <ul className="border-t border-white/15" onMouseLeave={() => setHover(null)}>
          {WORK.map((w) => (
            <li key={w.id} data-reveal className="border-b border-white/15">
              <a href={yt(w.id)} target="_blank" rel="noreferrer" onMouseEnter={() => setHover(w.id)}
                className={`group grid grid-cols-[88px_1fr] items-center gap-x-5 gap-y-1 py-5 transition-opacity duration-300 sm:grid-cols-[1.4fr_1fr_120px_40px] sm:py-7 ${hover && hover !== w.id ? 'sm:opacity-35' : ''}`}>
                <img src={m(`yt-${w.id}.jpg`)} alt="" loading="lazy" className="row-span-2 aspect-video w-[88px] object-cover sm:hidden" />
                <span className="font-serif text-[22px] leading-tight sm:text-[34px]"><bdi>{w.title}</bdi></span>
                <span className="text-[14px] text-ash sm:text-[16px] sm:text-paper/80">{w.who || '—'}<span className="sm:hidden"> · {w.kind}</span></span>
                <span className="hidden text-[14px] text-ash sm:block">{w.kind}</span>
                <span className="hidden text-left text-[18px] transition-transform duration-300 group-hover:-translate-x-1 sm:block">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* cursor-following preview (desktop) */}
      <div ref={preview} className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[360px] md:block" aria-hidden="true">
        {WORK.map((w) => (
          <img key={w.id} src={m(`yt-${w.id}.jpg`)} alt="" className={`absolute inset-0 aspect-video w-full object-cover transition-all duration-300 ${hover === w.id ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} />
        ))}
      </div>
    </section>
  )
}

function Altitude() {
  const wrap = useRef(null)
  const img = useRef(null)
  const alt = useRef(null)
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: ({ progress: p }) => {
          if (img.current) img.current.style.transform = `scale(${(3.2 - 2.2 * p).toFixed(4)})`
          if (alt.current) alt.current.textContent = Math.round(2 + p * 98)
          setPhase(p < 0.55 ? 0 : 1)
        },
      })
    }, wrap)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={wrap} className="relative h-[260vh] bg-screen">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="relative mx-4 h-[72svh] overflow-hidden sm:mx-8 lg:mx-14">
          <img ref={img} src={m('sinkholes.jpg')} alt="בולענים ליד ים המלח, מבט-על" className="absolute inset-0 h-full w-full object-cover will-change-transform" style={{ transform: 'scale(3.2)' }} />
        </div>
        <div className="wrap mt-6 flex items-baseline justify-between gap-6">
          <p className="font-serif text-[26px] font-light leading-tight sm:text-[40px]">
            <span className={`transition-opacity duration-500 ${phase === 0 ? 'opacity-100' : 'opacity-30'}`}>אותו מקום.</span>{' '}
            <span className={`transition-opacity duration-500 ${phase === 1 ? 'opacity-100' : 'opacity-30'}`}>גובה אחר.</span>
          </p>
          <p className="shrink-0 text-[13px] text-ash"><span ref={alt} className="font-serif text-[26px] tabular-nums text-paper sm:text-[40px]">2</span> מ׳</p>
        </div>
      </div>
    </section>
  )
}

function Plates() {
  const ref = useReveal()
  return (
    <section ref={ref} className="bg-screen pb-28 pt-10 sm:pb-40">
      <div className="wrap">
        <Label>סטילס</Label>
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-y-20">
          {PLATES.map(([src, cap, cls, ar]) => (
            <figure key={src} data-reveal className={cls}>
              <div className={`${ar} max-w-full overflow-hidden bg-reel`}>
                <img src={m(src)} alt={cap} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.03]" />
              </div>
              <figcaption className="caption mt-3">{cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  const ref = useReveal()
  return (
    <section id="services" ref={ref} className="paper py-24 sm:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 data-reveal className="font-serif text-[44px] font-light leading-none sm:text-[64px]">למי אני טס</h2>
        </div>
        <dl className="grid gap-x-12 sm:grid-cols-2 lg:col-span-8">
          {SERVICES.map((s) => (
            <div key={s.t} data-reveal className="border-t border-ink/15 py-7">
              <dt className="font-serif text-[24px] leading-tight">{s.t}</dt>
              <dd className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-ink/70">{s.d}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="wrap mt-24 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Label>מסלולים</Label>
          <p data-reveal className="max-w-[34ch] text-[15px] leading-relaxed text-ink/70">אין מחירון קבוע, כי כל הפקה שונה. בוחרים את המבנה שמתאים לכם, ואני שולח הצעה מדויקת.</p>
        </div>
        <div className="grid gap-px bg-ink/15 sm:grid-cols-3 lg:col-span-8">
          {PLANS.map((p) => (
            <div key={p.t} data-reveal className="bg-paper py-6 sm:px-6 sm:first:pr-0">
              <h3 className="font-serif text-[28px] leading-none">{p.t}</h3>
              <p className="mt-3 text-[14px] text-ink">{p.b}</p>
              <p className="mt-1 text-[14px] text-ink/60">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Safety() {
  const ref = useReveal()
  return (
    <section ref={ref} className="paper border-t border-ink/10 py-24 sm:py-32">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <Label className="lg:col-span-3">לפני שממריאים</Label>
        <div className="lg:col-span-9">
          <p data-reveal className="font-serif text-[26px] font-light leading-[1.4] sm:text-[36px]">
            רישיון רת״א. ביטוח צד ג׳. סד״פ מסודר לפני כל טיסה. אישורי הטסה ותיאום מול רשויות התעופה וכוחות הביטחון.
            <span className="text-ink/45"> את כל זה אני מסדר מראש, אתם מקבלים יום צילום שקט.</span>
          </p>
          <p data-reveal className="mt-10 text-[14px] text-ink/60">צילום ב-DJI Mavic 3 Pro עם מערכת שלוש מצלמות · מאות שעות הדרכת הטסה בארץ ובחו״ל</p>
        </div>
      </div>
    </section>
  )
}

function About() {
  const ref = useReveal()
  return (
    <section id="about" ref={ref} className="paper border-t border-ink/10 py-24 sm:py-36">
      <div className="wrap grid items-start gap-12 lg:grid-cols-12">
        <figure data-reveal className="lg:col-span-5">
          <div className="aspect-[4/5] max-w-full overflow-hidden bg-ink/10">
            <img src={m('jacob.jpg')} alt="יעקב כליפא עם שלט הרחפן" className="h-full w-full object-cover" />
          </div>
          <figcaption className="caption mt-3">יעקב כליפא, צלם, יוצר תוכן ומדריך הטסה</figcaption>
        </figure>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-16">
          <h2 data-reveal className="font-serif text-[44px] font-light leading-none sm:text-[64px]">איך זה התחיל</h2>
          <div data-reveal className="mt-10 grid max-w-[58ch] gap-5 text-[17px] leading-[1.75] text-ink/80">
            <p>תמיד הייתה בי תשוקה לתעופה. ב-2018, רגע לפני טיול גדול בעולם, גיליתי את עולם הרחפנים, ומאז אין דרך חזרה.</p>
            <p>עם השנים עבדתי על סדרות טלוויזיה, קליפים, פסטיבלים, אירועי ספורט וצילומי אדריכלות, והדרכתי קבוצות בהטסה בארץ ובחו״ל.</p>
            <p>בכל פרויקט אני עובד אותו דבר: הכנה יסודית וביצוע מדויק, כדי שהצוות יתמקד ביצירה ולא בלוגיסטיקה.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Words() {
  const ref = useReveal()
  return (
    <section ref={ref} className="paper border-t border-ink/10 py-24 sm:py-36">
      <div className="wrap">
        <Label>מה אומרים</Label>
        <div className="grid gap-x-16 gap-y-16 md:grid-cols-2">
          {WORDS.map((w, k) => (
            <figure key={w.n} data-reveal className={k === 0 ? 'md:col-span-2' : ''}>
              <blockquote dir={w.ltr ? 'ltr' : 'rtl'} className={`font-serif font-light leading-[1.35] ${k === 0 ? 'max-w-[26ch] text-[30px] sm:text-[48px]' : 'max-w-[38ch] text-[22px] sm:text-[26px]'}`}>
                ״{w.q}״
              </blockquote>
              <figcaption className="mt-5 text-[14px] text-ink/60">{w.n}{w.r ? `, ${w.r}` : ''}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const ref = useReveal()
  return (
    <section ref={ref} className="paper border-t border-ink/10 py-24 sm:py-32">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <h2 data-reveal className="font-serif text-[44px] font-light leading-none sm:text-[64px] lg:col-span-4">שאלות</h2>
        <div className="border-t border-ink/15 lg:col-span-8">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-ink/15">
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 font-serif text-[21px] leading-snug sm:text-[24px] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="shrink-0 text-[20px] font-light transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-[60ch] pb-7 text-[16px] leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [kind, setKind] = useState(KINDS[0])
  const [where, setWhere] = useState('')
  const [when, setWhen] = useState('')
  const [out, setOut] = useState(OUTS[1])
  const [name, setName] = useState('')
  const text = [
    `היי יעקב, אני ${name || '...'}.`,
    `אני צריך/ה צילום רחפן ל${kind}${where ? ` ב${where}` : ''}${when ? `, בערך ב${when}` : ''}.`,
    `מה שחשוב לי לקבל: ${out}.`,
    'אשמח להצעת מחיר.',
  ].join('\n')
  return (
    <section id="contact" className="relative overflow-hidden bg-screen">
      <img src={m('harbor-dusk.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-screen via-screen/70 to-screen" />
      <div className="wrap relative py-24 sm:py-36">
        <Label>צרו קשר</Label>
        <form onSubmit={(e) => e.preventDefault()} className="max-w-5xl font-serif text-[26px] font-light leading-[1.9] sm:text-[40px] sm:leading-[1.8]">
          <p>
            היי יעקב, אני{' '}
            <label htmlFor="ct-name" className="sr-only">שם</label>
            <input id="ct-name" className="field-line max-w-full" style={fit(name || 'השם שלי')} placeholder="השם שלי" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />.
            {' '}אני צריך/ה צילום רחפן ל<label htmlFor="ct-kind" className="sr-only">סוג הצילום</label>
            <select id="ct-kind" className="field-line max-w-full cursor-pointer appearance-none" style={fit(kind)} value={kind} onChange={(e) => setKind(e.target.value)}>
              {KINDS.map((k) => <option key={k}>{k}</option>)}
            </select>
            {' '}ב<label htmlFor="ct-where" className="sr-only">מיקום</label>
            <input id="ct-where" className="field-line max-w-full" style={fit(where || 'איפה')} placeholder="איפה" value={where} onChange={(e) => setWhere(e.target.value)} />,
            {' '}בערך ב<label htmlFor="ct-when" className="sr-only">מתי</label>
            <input id="ct-when" className="field-line max-w-full" style={fit(when || 'מתי')} placeholder="מתי" value={when} onChange={(e) => setWhen(e.target.value)} />.
            {' '}מה שחשוב לי לקבל: <label htmlFor="ct-out" className="sr-only">תוצרים</label>
            <select id="ct-out" className="field-line max-w-full cursor-pointer appearance-none" style={fit(out)} value={out} onChange={(e) => setOut(e.target.value)}>
              {OUTS.map((o) => <option key={o}>{o}</option>)}
            </select>.
          </p>
          <a href={wa(text)} target="_blank" rel="noreferrer" className="mt-12 inline-flex items-center gap-4 bg-paper px-7 py-4 font-sans text-[16px] font-medium text-ink transition-colors hover:bg-sand">
            שליחה בוואטסאפ <span aria-hidden="true">←</span>
          </a>
        </form>

        <div className="mt-24 grid gap-8 border-t border-white/15 pt-10 text-[15px] sm:grid-cols-3">
          <div>
            <p className="caption mb-2">טלפון</p>
            <a href={`tel:${PHONE_TEL}`} className="select-all font-serif text-[24px]" dir="ltr">{PHONE_DISPLAY}</a>
          </div>
          <div className="min-w-0">
            <p className="caption mb-2">מייל</p>
            <a href={`mailto:${EMAIL}`} className="block select-all break-all font-serif text-[20px]" dir="ltr">{EMAIL}</a>
          </div>
          <div>
            <p className="caption mb-2">אינסטגרם</p>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="font-serif text-[24px]" dir="ltr">@jacobkdrone</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-screen pb-24 sm:pb-10">
      <div className="wrap flex flex-col justify-between gap-3 border-t border-white/10 pt-8 text-[13px] text-ash sm:flex-row">
        <p>Different Perspective · צילום רחפן קולנועי · זמין להפקות בכל הארץ</p>
        <p>© {new Date().getFullYear()} יעקב כליפא</p>
      </div>
    </footer>
  )
}

function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 bg-screen/95 pb-[env(safe-area-inset-bottom,0px)] text-[15px] backdrop-blur sm:hidden">
      <a href={wa('היי יעקב, הגעתי מהאתר ואשמח לשמוע על צילום רחפן')} target="_blank" rel="noreferrer" className="py-4 text-center">וואטסאפ</a>
      <a href={`tel:${PHONE_TEL}`} className="border-r border-white/10 py-4 text-center">חיוג</a>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(id)
  }, [])
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <WorkIndex />
        <Altitude />
        <Plates />
        <Services />
        <Safety />
        <About />
        <Words />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
