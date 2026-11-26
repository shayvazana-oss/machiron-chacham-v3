import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, Phone, Pause, Play, List, X, CheckCircle, Check, Certificate, CaretDown,
  OpenAiLogo, Lightning, Megaphone, Clock, Globe, PaperPlaneRight, Sparkle,
} from '@phosphor-icons/react'
import {
  IMG, VID, LOGO, PHONE, PRIVACY_URL, TERMS_URL, NAV_LINKS, STATS, RECOGNITION, AUDIENCE, ADMISSION, CAPABILITIES,
  PROJECTS, PHASES, ROLES, CERTS, LOGOS, TRACKS, FAQS,
} from './data.js'

const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const CTA = 'לייעוץ לימודים' // one label for the one conversion intent on this page
const TOOL = (name) => `${import.meta.env.BASE_URL}tools/${name}.svg`
const d = (seconds) => ({ '--d': `${seconds}s` })

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

/* ---------------------------------------------------------------- Clips.
   A still first; the video is added only once the clip is on screen, and it plays only while it stays there.
   One switch (in the hero) stops every clip and demo on the page. */
const Motion = createContext({ motion: true, setMotion: () => {} })
function Clip({ name, alt = '', position = 'center' }) {
  const { motion } = useContext(Motion)
  const box = useRef(null)
  const vid = useRef(null)
  const visible = useOnScreen(box, { threshold: 0.35 })
  const [mounted, setMounted] = useState(false)
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
      <img src={IMG(name)} alt={alt} loading="lazy" decoding="async" className={fit} style={{ objectPosition: position }} />
      {mounted && motion && <video ref={vid} src={VID(name)} muted loop playsInline preload="auto" aria-hidden="true" className={fit} style={{ objectPosition: position }} />}
    </div>
  )
}

const Arrow = () => <ArrowLeft size={18} weight="bold" aria-hidden="true" />

/* Brand marks: a Simple Icons file in the brand's colour, or a Phosphor glyph where Simple Icons has none (OpenAI). */
function Mark({ logo, Icon, className = 'h-[1em] w-[1em]' }) {
  if (Icon) return <Icon className={className} weight="fill" aria-hidden="true" />
  return <img src={TOOL(logo)} alt="" className={className} />
}

/* A mascot in one of the cast colours. The green cut-out is the source; the others are hue turns of it. */
const HUE = { lime: 0, violet: 160, orange: -52, cyan: 108, pink: 250 }
function Mascot({ hue = 'lime', wave = false, className = '' }) {
  const h = HUE[hue] || 0
  return <img src={IMG(wave ? 'm-cut-wave' : 'm-cut')} alt="" className={`object-contain ${className}`} style={h ? { filter: `hue-rotate(${h}deg) saturate(1.1)` } : undefined} />
}

/* Pauses every clip and demo on the page. */
function MotionSwitch({ className = '' }) {
  const { motion, setMotion } = useContext(Motion)
  return (
    <button type="button" onClick={() => setMotion(!motion)} aria-label={motion ? 'השהיית האנימציות והסרטונים בדף' : 'הפעלת האנימציות והסרטונים בדף'}
      className={`grid shrink-0 place-items-center rounded-full border border-line bg-white text-ink shadow-sm transition-colors hover:bg-surface ${className}`}>
      {motion ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
    </button>
  )
}

/* Types `text` out while `run` is true; shows it whole under reduced motion. */
function useTyped(text, run, speed = 42) {
  const [n, setN] = useState(reduceMotion ? text.length : 0)
  useEffect(() => { setN(reduceMotion ? text.length : 0) }, [text])
  useEffect(() => {
    if (!run || reduceMotion || n >= text.length) return
    const id = setTimeout(() => setN((v) => v + 1), speed)
    return () => clearTimeout(id)
  }, [run, n, text, speed])
  return [text.slice(0, n), n >= text.length]
}

/* ---------------------------------------------------------------- Hero demo: the computer.
   Someone types a task to an AI model; on the right of the screen the workflow is built in n8n,
   and the agents jump out of the screen to do their part. Three tasks take turns. */
const HERO_RUNS = [
  {
    model: { logo: 'claude', name: 'Claude' },
    prompt: 'תבנה לי סוכן שמטפל בלידים מהאתר',
    reply: 'בונה לכם Lead Agent: מחבר את הטופס, ה־CRM והוואטסאפ.',
    trigger: { Icon: Lightning, text: 'ליד חדש מהטופס' },
    agent: { name: 'Lead Agent', hue: 'lime' },
    tools: [{ logo: 'hubspot', text: 'CRM' }, { logo: 'whatsapp', text: 'WhatsApp' }, { logo: 'googlesheets', text: 'Sheets' }],
    pops: [{ hue: 'lime', en: 'Lead Agent', he: 'סיווג ליד חם' }, { hue: 'cyan', en: 'Support Agent', he: 'ענה בוואטסאפ' }, { hue: 'orange', en: 'Report Agent', he: 'עדכן את הדוח' }],
    done: 'הסוכן באוויר. הלידים מטופלים לבד.',
  },
  {
    model: { Icon: OpenAiLogo, name: 'ChatGPT' },
    prompt: 'תרים לי קמפיין למבצע החדש',
    reply: 'בונה Campaign Agent: מודעות, דף נחיתה ומייל ללקוחות.',
    trigger: { Icon: Megaphone, text: 'בריף למבצע' },
    agent: { name: 'Campaign Agent', hue: 'orange' },
    tools: [{ logo: 'meta', text: 'Meta Ads' }, { logo: 'gmail', text: 'Gmail' }, { Icon: Globe, text: 'Landing' }],
    pops: [{ hue: 'orange', en: 'Ads Agent', he: 'כתב 3 מודעות' }, { hue: 'pink', en: 'Web Agent', he: 'העלה דף נחיתה' }, { hue: 'violet', en: 'Mail Agent', he: 'שלח ללקוחות' }],
    done: 'הקמפיין עלה. אתם בפגישה הבאה.',
  },
  {
    model: { logo: 'googlegemini', name: 'Gemini' },
    prompt: 'תשלח לי כל בוקר דוח מכירות',
    reply: 'בונה Report Agent: שולף נתונים, מחפש חריגות ושולח סיכום.',
    trigger: { Icon: Clock, text: 'כל בוקר ב־08:00' },
    agent: { name: 'Report Agent', hue: 'cyan' },
    tools: [{ logo: 'googlesheets', text: 'Sheets' }, { logo: 'gmail', text: 'Gmail' }, { logo: 'whatsapp', text: 'WhatsApp' }],
    pops: [{ hue: 'cyan', en: 'Data Agent', he: 'ניתח את המכירות' }, { hue: 'violet', en: 'Alert Agent', he: 'מצא חריגה אחת' }, { hue: 'lime', en: 'Report Agent', he: 'שלח סיכום בוקר' }],
    done: 'הדוח במייל לפני הקפה.',
  },
]
const HERO_T = { reply: 0.25, trigger: 0.7, agent: 1.15, tools: 1.6, pops: 2.5, done: 3.6, film: 4.3, fallback: 16 }
function useMedia(q) {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const f = () => setOn(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [q])
  return on
}

function HeroDemo() {
  const { motion } = useContext(Motion)
  const box = useRef(null)
  const visible = useOnScreen(box, { threshold: 0.2 })
  const [k, setK] = useState(0)
  const run = HERO_RUNS[k]
  const live = motion && visible
  const [typed, typedDone] = useTyped(run.prompt, live)
  const [phase, setPhase] = useState(reduceMotion) // false while typing, true once the build has started
  useEffect(() => { setPhase(reduceMotion) }, [k])
  useEffect(() => { if (typedDone) setPhase(true) }, [typedDone])
  // Once the workflow is built, the screen cuts to the film of the agents at work; when it ends, the next task starts.
  const wide = useMedia('(min-width: 640px)')
  const filmName = wide ? 'agents-wide' : 'agents-tall'
  const vid = useRef(null)
  const [film, setFilm] = useState(false)
  const next = () => setK((v) => (v + 1) % HERO_RUNS.length)
  useEffect(() => { setFilm(false) }, [k])
  useEffect(() => {
    if (!phase || !live || reduceMotion || film) return
    const id = setTimeout(() => setFilm(true), HERO_T.film * 1000)
    return () => clearTimeout(id)
  }, [phase, live, k, film])
  useEffect(() => {
    const v = vid.current
    if (!v) return
    if (film && live) v.play().catch(() => {})
    else v.pause()
  }, [film, live, filmName])
  useEffect(() => {
    const v = vid.current
    if (v && film) v.currentTime = 0
    if (!film || !live) return
    const id = setTimeout(next, HERO_T.fallback * 1000) // in case the video never reports its end
    return () => clearTimeout(id)
  }, [film])
  const halted = !live && !reduceMotion
  const popPlace = ['left-[-8%] top-[-14%]', 'left-[-15%] bottom-[16%]', 'bottom-[-21%] left-[36%]']
  const popFrom = ['translate(60%, 60%)', 'translate(80%, -20%)', 'translate(0, -80%)']
  return (
    <div ref={box} className={`stage relative ${halted ? 'halt' : ''}`}>
      <p className="sr-only">הדגמה: מבקשים מכלי AI לבנות סוכן, ה־Workflow נבנה ב־n8n, והסוכנים יוצאים לעבודה. {HERO_RUNS.map((r) => `${r.prompt}. ${r.done}`).join(' ')}</p>
      <div className="relative overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_30px_80px_-30px_rgb(60_40_140/0.45)]">
        <div className="flex items-center gap-2 border-b border-line bg-surface/70 px-3 py-2">
          {!reduceMotion && <MotionSwitch className="h-8 w-8" />}
          <span className="flex gap-2" aria-hidden="true"><span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" /></span>
          <span dir="ltr" aria-hidden="true" className="ms-auto flex items-center gap-1.5 font-mono text-[0.72rem] text-muted"><Mark {...run.model} className="h-3.5 w-3.5" />{run.model.name}<span className="opacity-40">+</span><img src={TOOL('n8n')} alt="" className="h-3.5 w-3.5" />n8n</span>
        </div>
        <div className="relative">
        <div key={k} aria-hidden="true" className="grid min-h-[22rem] grid-rows-[auto_1fr] sm:min-h-[25rem] sm:grid-cols-[1fr_1.1fr] sm:grid-rows-1">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:border-b-0 sm:border-e sm:p-5">
            <div className="max-w-[92%] self-start rounded-2xl rounded-tr-md bg-accent px-3.5 py-2.5 text-[0.95rem] font-medium leading-snug text-white sm:text-base">
              {typed}{!typedDone && <span className="caret" />}
            </div>
            {phase && (
              <div className="b flex max-w-[95%] items-start gap-2 self-end rounded-2xl rounded-tl-md bg-surface px-3.5 py-2.5 text-[0.92rem] leading-snug sm:text-[0.95rem]" style={d(HERO_T.reply)}>
                <Mark {...run.model} className="mt-0.5 h-4 w-4 shrink-0" />{run.reply}
              </div>
            )}
            {phase && (
              <p className="b mt-auto hidden items-center gap-2 font-display text-lg font-semibold text-[#138A4B] sm:flex" style={d(HERO_T.done)}>
                <CheckCircle size={22} weight="fill" className="shrink-0" />{run.done}
              </p>
            )}
          </div>
          <div className="wf relative flex flex-col items-center justify-center gap-0 p-4 sm:p-5">
            {phase && (
              <>
                <div className="b node-l flex items-center gap-2" style={d(HERO_T.trigger)}>
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#FFF1E6] text-[#E2761B]"><run.trigger.Icon size={16} weight="fill" /></span>
                  <span className="text-[0.9rem] font-semibold">{run.trigger.text}</span>
                </div>
                <span className="wire-v grow-y" style={d(HERO_T.trigger + 0.25)}><i className="packet" style={d(HERO_T.trigger + 0.3)} /></span>
                <div className="b node-l node-agent flex items-center gap-2.5" style={d(HERO_T.agent)}>
                  <Mascot hue={run.agent.hue} className="bob h-10 w-10 shrink-0" />
                  <div className="text-start">
                    <p dir="ltr" className="text-right font-mono text-[0.68rem] text-accent-hi">ai agent</p>
                    <p className="font-display text-[1rem] font-semibold leading-tight">{run.agent.name}</p>
                  </div>
                </div>
                <span className="wire-v grow-y" style={d(HERO_T.tools - 0.15)}><i className="packet" style={d(HERO_T.tools - 0.1)} /></span>
                <span className="wire-h grow-x" style={d(HERO_T.tools - 0.05)} />
                <div className="flex w-full justify-between gap-2">
                  {run.tools.map((t, i) => (
                    <div key={t.text} className="b node-l flex flex-1 flex-col items-center gap-1 !px-1.5 !py-2" style={d(HERO_T.tools + i * 0.12)}>
                      <Mark {...t} className="h-5 w-5" />
                      <span dir="ltr" className="text-center font-mono text-[0.7rem]">{t.text}</span>
                      <CheckCircle size={14} weight="fill" className="b text-[#138A4B]" style={d(HERO_T.pops + i * 0.15)} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {!reduceMotion && (
          <div className={`absolute inset-0 overflow-hidden bg-[#1B1530] transition-opacity duration-700 ${film ? 'opacity-100' : 'pointer-events-none opacity-0'}`} aria-hidden="true">
            <video ref={vid} key={filmName} src={VID(filmName)} poster={IMG(filmName)} muted playsInline preload="auto" onEnded={next} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
              <span dir="ltr" className="flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 font-mono text-xs text-white backdrop-blur"><span className="live-dot" />Agents running</span>
              <p className="hidden items-center gap-2 rounded-2xl bg-white/95 px-3.5 py-2 font-display text-base font-semibold text-ink shadow-lg sm:flex"><CheckCircle size={20} weight="fill" className="shrink-0 text-[#138A4B]" />{run.done}</p>
            </div>
          </div>
        )}
        </div>
      </div>
      {phase && run.pops.map((p, i) => (
        <div key={`${k}-${i}`} className={`pop pointer-events-none absolute z-10 hidden flex-col items-center sm:flex ${popPlace[i]}`} style={{ ...d(HERO_T.pops + i * 0.22), '--from': popFrom[i] }} aria-hidden="true">
          <Mascot hue={p.hue} wave={i === 1} className="bob h-24 w-24 drop-shadow-[0_10px_14px_rgb(40_20_90/0.25)]" />
          <span className="-mt-1 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-3 py-1 text-[0.8rem] font-semibold shadow-md">
            <span dir="ltr" className="font-mono text-accent-hi">{p.en}</span><span>{p.he}</span>
          </span>
        </div>
      ))}
      <div className="relative z-10 -mt-8 flex justify-around sm:hidden" aria-hidden="true">
        {phase && run.pops.map((p, i) => (
          <div key={`${k}-m${i}`} className="pop flex flex-col items-center" style={{ ...d(HERO_T.pops + i * 0.22), '--from': 'translate(0, -70%)' }}>
            <Mascot hue={p.hue} wave={i === 1} className="bob h-14 w-14 drop-shadow-[0_8px_10px_rgb(40_20_90/0.25)]" />
            <span className="-mt-0.5 whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-0.5 text-[0.75rem] font-semibold shadow">{p.he}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 flex min-h-[1.5rem] items-center justify-center gap-2 font-display text-base font-semibold text-[#138A4B] sm:hidden" aria-hidden="true">
        {phase && <span key={k} className="b flex items-center gap-2" style={d(HERO_T.done)}><CheckCircle size={20} weight="fill" />{run.done}</span>}
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- Task studio: the visitor gives the agent a task.
   Pick a task or type one. The agent shows its steps, then the thing it made. Illustrative, runs in the page. */
const TASKS = [
  {
    id: 'landing', chip: 'תבנה לי דף נחיתה למבצע', hue: 'pink', agent: 'Web Agent', model: { logo: 'claude', name: 'Claude' }, words: ['דף', 'אתר', 'נחיתה', 'עמוד'],
    steps: ['קורא את הבריף ומבין את הקהל', 'כותב כותרת, טקסט וקריאה לפעולה', 'בונה את הדף ומחבר טופס לידים', 'מעלה לאוויר ומחבר ל־CRM'],
  },
  {
    id: 'leads', chip: 'תנתח לי את הלידים של החודש', hue: 'lime', agent: 'Lead Agent', model: { logo: 'googlegemini', name: 'Gemini' }, words: ['ליד', 'לידים', 'נתח', 'ניתוח'],
    steps: ['שולף את הלידים מה־CRM', 'מסווג כל ליד לפי חום והתאמה', 'מתעדף למי לחזור קודם', 'שולח לכם רשימה מסודרת'],
  },
  {
    id: 'campaign', chip: 'תרים לי קמפיין לרשתות', hue: 'orange', agent: 'Campaign Agent', model: { Icon: OpenAiLogo, name: 'ChatGPT' }, words: ['קמפיין', 'מודעה', 'מודעות', 'פייסבוק', 'אינסטגרם', 'רשתות'],
    steps: ['מנסח שלוש גרסאות למודעה', 'מתאים תמונה לכל גרסה', 'מגדיר קהל ותקציב לבדיקה', 'מעלה ל־Meta ומדווח לכם'],
  },
  {
    id: 'support', chip: 'תענה ללקוחות בוואטסאפ', hue: 'cyan', agent: 'Support Agent', model: { logo: 'claude', name: 'Claude' }, words: ['וואטסאפ', 'לקוח', 'לקוחות', 'שירות', 'הודעות'],
    steps: ['קורא את ההודעה החדשה', 'מחפש תשובה בידע של העסק', 'עונה ללקוח בתוך שניות', 'מעביר אליכם רק את מה שדורש אתכם'],
  },
]
const STEP_GAP = 0.85

function TaskResult({ id }) {
  if (id === 'landing') return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-1.5"><i className="h-1.5 w-1.5 rounded-full bg-line" /><i className="h-1.5 w-1.5 rounded-full bg-line" /><i className="h-1.5 w-1.5 rounded-full bg-line" /><span dir="ltr" className="ms-2 font-mono text-[0.65rem] text-muted">your-sale.co.il</span></div>
      <div className="grid grid-cols-5 items-center gap-3 p-3">
        <div className="col-span-3">
          <p className="font-display text-lg font-semibold leading-tight">המבצע של החודש</p>
          <p className="mt-1 text-[0.8rem] text-muted">השאירו פרטים וקבלו הצעה אישית.</p>
          <span className="mt-2 inline-block rounded-full bg-accent px-3 py-1 text-[0.75rem] font-semibold text-white">להרשמה</span>
        </div>
        <div className="col-span-2 aspect-square overflow-hidden rounded-lg"><img src={IMG('p2')} alt="" className="h-full w-full object-cover" /></div>
      </div>
    </div>
  )
  if (id === 'leads') return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white text-[0.88rem]">
      {[['ליד מהטופס באתר', 'חם', 'bg-[#FFE4E4] text-[#C2261B]'], ['ליד מקמפיין בפייסבוק', 'פושר', 'bg-[#FFF1E0] text-[#B85C00]'], ['ליד מהוואטסאפ', 'חם', 'bg-[#FFE4E4] text-[#C2261B]'], ['ליד מהניוזלטר', 'קר', 'bg-[#E6F3FF] text-[#1D5FA8]']].map(([n, s, c], i) => (
        <li key={i} className="flex items-center justify-between gap-3 px-3 py-2"><span>{n}</span><span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-semibold ${c}`}>{s}</span></li>
      ))}
    </ul>
  )
  if (id === 'campaign') return (
    <div className="grid grid-cols-3 gap-2">
      {['p2', 'p7', 'p1'].map((n) => (
        <div key={n} className="overflow-hidden rounded-xl border border-line bg-white">
          <img src={IMG(n)} alt="" className="aspect-square w-full object-cover" />
          <p className="px-2 py-1.5 text-center text-[0.72rem] font-semibold text-accent-hi">לפרטים</p>
        </div>
      ))}
    </div>
  )
  return (
    <div className="space-y-2 rounded-xl border border-line bg-[#EFEAE2] p-3 text-[0.88rem]">
      <p className="max-w-[80%] rounded-xl rounded-tr-sm bg-white px-3 py-2">היי, מתי מתחיל המחזור הבא?</p>
      <p className="ms-auto max-w-[85%] rounded-xl rounded-tl-sm bg-[#D9FDD3] px-3 py-2">היי! אשמח לבדוק בשבילך. השאר/י שם, ונציג יחזור אלייך עוד היום.</p>
    </div>
  )
}

function TaskStudio() {
  const { motion } = useContext(Motion)
  const box = useRef(null)
  const visible = useOnScreen(box, { threshold: 0.25 })
  const [task, setTask] = useState(TASKS[0])
  const [prompt, setPrompt] = useState(TASKS[0].chip)
  const [runId, setRunId] = useState(0)
  const [draft, setDraft] = useState('')
  const start = (t, text) => { setTask(t); setPrompt(text); setRunId((v) => v + 1) }
  const onSubmit = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const t = TASKS.find((x) => x.words.some((w) => text.includes(w))) || TASKS[1]
    start(t, text)
    setDraft('')
  }
  const halted = !reduceMotion && (!visible || !motion)
  const doneAt = 0.6 + task.steps.length * STEP_GAP
  return (
    <div ref={box} className="grid gap-5 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-5">
        <p className="font-display text-xl font-semibold">בחרו משימה:</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {TASKS.map((t) => (
            <button key={t.id} type="button" onClick={() => start(t, t.chip)} aria-pressed={task.id === t.id && prompt === t.chip}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-start font-medium transition-colors ${task.id === t.id && prompt === t.chip ? 'border-accent bg-accent text-white' : 'border-line bg-white hover:border-accent'}`}>
              <Mascot hue={t.hue} className="h-6 w-6" />{t.chip}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="mt-5 flex items-center gap-2 rounded-2xl border-2 border-line bg-white p-1.5 ps-4 focus-within:border-accent">
          <label htmlFor="task-input" className="sr-only">או כתבו משימה משלכם</label>
          <input id="task-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="או כתבו משימה משלכם..." className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted" />
          <button type="submit" aria-label="שליחת המשימה לסוכן" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-white transition-transform active:scale-95"><PaperPlaneRight size={20} weight="fill" className="-scale-x-100" /></button>
        </form>
        <p className="mt-3 text-sm text-muted">הדגמה להמחשה. בקורס בונים סוכנים כאלה באמת, עם n8n, Make ומודלי שפה.</p>
      </div>

      <div className={`stage lg:col-span-7 ${halted ? 'halt' : ''}`} aria-live="polite">
        <div key={runId} className="rounded-[22px] border border-line bg-white p-4 shadow-[0_24px_60px_-30px_rgb(60_40_140/0.35)] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-accent px-3.5 py-2.5 font-medium text-white">{prompt}</div>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
            <Mascot hue={task.hue} className="bob h-14 w-14 shrink-0" />
            <div className="min-w-0 flex-1">
              <p dir="ltr" className="text-right font-mono text-xs text-accent-hi">{task.agent}</p>
              <p className="font-display text-lg font-semibold leading-tight">הסוכן עובד על זה</p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-xs"><Mark {...task.model} className="h-3.5 w-3.5" />{task.model.name}</span>
          </div>
          <ol className="mt-4 space-y-2">
            {task.steps.map((st, i) => (
              <li key={st} className="b relative flex items-center gap-2.5 text-[0.95rem]" style={d(0.3 + i * STEP_GAP)}>
                <span className="relative grid h-5 w-5 shrink-0 place-items-center">
                  <span className="leave absolute h-4 w-4 rounded-full border-2 border-accent border-t-transparent spin" style={d(0.3 + (i + 1) * STEP_GAP - 0.05)} />
                  <CheckCircle size={20} weight="fill" className="b absolute text-[#138A4B]" style={d(0.3 + (i + 1) * STEP_GAP)} />
                </span>
                {st}
              </li>
            ))}
          </ol>
          <div className="b mt-5" style={d(doneAt)}>
            <p className="mb-2 flex items-center gap-2 font-display font-semibold text-[#138A4B]"><Sparkle size={18} weight="fill" />מוכן. זה מה שהסוכן הכין:</p>
            <TaskResult id={task.id} />
          </div>
        </div>
      </div>
    </div>
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
        <CheckCircle size={56} weight="fill" className="text-[#138A4B]" aria-hidden="true" />
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
        <label className="flex gap-2.5"><input type="checkbox" name="consent_terms" required className="mt-0.5 h-4 w-4 flex-none accent-[rgb(var(--accent))]" /><span>קראתי ואני מאשר/ת את <a className="text-accent underline" href={PRIVACY_URL} target="_blank" rel="noopener">מדיניות הפרטיות</a> ואת <a className="text-accent underline" href={TERMS_URL} target="_blank" rel="noopener">תקנון האתר</a></span></label>
        <label className="flex gap-2.5"><input type="checkbox" name="consent_marketing" className="mt-0.5 h-4 w-4 flex-none accent-[rgb(var(--accent))]" /><span>מאשר/ת קבלת דיוור מהיחידה ללימודי חוץ</span></label>
        {errors.terms && <p className="text-[#C2412C]">{errors.terms}</p>}
      </div>
      <button type="submit" disabled={status === 'sending'} className="btn btn-accent w-full disabled:opacity-60">{status === 'sending' ? 'שולחים...' : <>{CTA}<Arrow /></>}</button>
      {errors.form && <p role="alert" className="text-[#C2412C]">{errors.form}</p>}
    </form>
  )
}

/* ---------------------------------------------------------------- Navigation */
function Nav() {
  const [open, setOpen] = useState(false)
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-white/80 backdrop-blur-md">
        <div className="page flex h-16 items-center justify-between gap-4">
          <a href="#home" className="shrink-0"><img src={LOGO('yechida-t')} alt="היחידה ללימודי חוץ" className="h-6 w-auto sm:h-7" /></a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="ניווט ראשי">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href} className="font-medium text-muted transition-colors hover:text-ink">{l.label}</a>)}
          </nav>
          <div className="flex items-center gap-1.5">
            <a href={`tel:${PHONE}`} className="hidden items-center gap-2 px-2 font-display text-lg font-semibold lg:flex"><Phone size={18} weight="fill" className="text-accent" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
            <a href="#contact" className="btn btn-accent !hidden !px-4 !py-2.5 !text-base sm:!inline-flex">{CTA}</a>
            <a href={`tel:${PHONE}`} aria-label={`חיוג ${PHONE}`} className="grid h-11 w-11 place-items-center rounded-full text-accent sm:hidden"><Phone size={22} weight="fill" /></a>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? 'סגירת התפריט' : 'פתיחת התפריט'} aria-expanded={open} className="grid h-11 w-11 place-items-center rounded-full lg:hidden">
              {open ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-30 bg-white px-5 pt-20 transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
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

/* ---------------------------------------------------------------- Hero: the course, and the computer where the agents are built */
function Hero({ heroRef }) {
  return (
    <section id="home" ref={heroRef} className="hero-bg relative overflow-hidden">
      <div className="page grid gap-12 pb-20 pt-24 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-24 lg:pt-32">
        <div className="lg:col-span-5">
          <p dir="ltr" className="text-right font-mono text-sm font-medium text-accent-hi">AI Agent &amp; Automation Specialist</p>
          <h1 className="mt-3 text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-[4.3rem]">קורס סוכני AI <span className="block text-accent">ואוטומציה</span></h1>
          <p className="mt-5 max-w-md text-lg sm:text-xl">AI כבר עושה את העבודה. השאלה אם אתם בונים אותו, או מחכים שיחליף אתכם. <span className="font-semibold">160 שעות, תעודה ממשלתית.</span></p>
          <div className="mt-7 flex items-center gap-3">
            <a href="#contact" className="btn btn-accent min-w-0 flex-1 !px-3 sm:flex-none sm:!px-6">{CTA}<Arrow /></a>
            <a href="#about" className="btn min-w-0 flex-1 border-2 border-ink/10 bg-white !px-3 transition-colors hover:border-accent sm:flex-none sm:!px-6">תנו משימה לסוכן</a>
          </div>
        </div>
        <div className="px-3 sm:px-8 lg:col-span-7 lg:px-6">
          <HeroDemo />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- The tools taught in the course */
const STACK = [{ Icon: OpenAiLogo, name: 'ChatGPT' }, { logo: 'claude', name: 'Claude' }, { logo: 'googlegemini', name: 'Gemini' }, { logo: 'n8n', name: 'n8n' }, { logo: 'make', name: 'Make' }]
function Stack() {
  return (
    <section className="border-y border-line bg-white" aria-label="הכלים בקורס">
      <div className="page flex flex-col items-center gap-5 py-7 lg:flex-row lg:justify-between">
        <p className="font-medium text-muted">עובדים עם הכלים שהשוק עובד איתם</p>
        <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:gap-x-10">
          {STACK.map((t) => (
            <li key={t.name} className="flex items-center gap-2 font-display text-xl font-semibold"><Mark {...t} className="h-6 w-6" />{t.name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Why now: the same day, without and with agents. Illustrative. */
const MANUAL_DAY = [
  ['08:30', 'מעתיקים לידים מהטופס לאקסל, אחד אחד'],
  ['11:00', 'עונים שוב על אותן שאלות בוואטסאפ'],
  ['14:30', 'בונים דוח ידני למנהל'],
  ['17:45', 'מגלים ליד חם ששכחתם לחזור אליו'],
  ['21:10', 'עוד לא סיימתם'],
]
const FEED = [
  { agent: 'Lead Agent', hue: 'lime', text: 'סיווג ליד חדש ורשם אותו ב־CRM' },
  { agent: 'Support Agent', hue: 'cyan', text: 'ענה ללקוח בוואטסאפ, תוך שניות' },
  { agent: 'Sales Agent', hue: 'orange', text: 'שלח הצעת מחיר ללקוח חם' },
  { agent: 'Finance Agent', hue: 'violet', text: 'הפיק את הדוח החודשי' },
  { agent: 'Scheduler Agent', hue: 'pink', text: 'קבע פגישה ביומן שלכם' },
  { agent: 'CX Agent', hue: 'cyan', text: 'זיהה לקוח לא מרוצה והעביר אליכם' },
  { agent: 'Report Agent', hue: 'lime', text: 'שלח למנהל סיכום בוקר' },
]
function LiveFeed() {
  const { motion } = useContext(Motion)
  const box = useRef(null)
  const visible = useOnScreen(box, { threshold: 0.3 })
  const [n, setN] = useState(3)
  useEffect(() => {
    if (!visible || !motion || reduceMotion) return
    const id = setInterval(() => setN((v) => v + 1), 1900)
    return () => clearInterval(id)
  }, [visible, motion])
  const rows = Array.from({ length: 4 }, (_, k) => ({ i: n - k, ...FEED[(n - k) % FEED.length] }))
  return (
    <ul ref={box} className="space-y-2.5" aria-label="הדגמה: פעולות שסוכנים מבצעים">
      {rows.map((r, k) => (
        <li key={r.i} className={`flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ${k === 0 ? 'feed-in' : ''}`} style={{ opacity: 1 - k * 0.16 }}>
          <Mascot hue={r.hue} className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <p dir="ltr" className="text-right font-mono text-xs text-accent-hi">{r.agent}</p>
            <p className="font-semibold leading-snug">{r.text}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted"><CheckCircle size={16} weight="fill" className="text-[#138A4B]" />{k === 0 ? 'now' : `${k * 2}m`}</span>
        </li>
      ))}
    </ul>
  )
}

function WhyNow() {
  return (
    <section className="tint-orange">
      <div className="page py-16 lg:py-24">
        <h2 className="h2 max-w-3xl">בזמן שאתם עושים את זה ידנית, <span className="text-[#E2761B]">מישהו אחר כבר בנה סוכן שעושה את זה.</span></h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">ארגונים כבר מחפשים אנשים שיודעים לבנות סוכני AI ואוטומציות. מי שנכנס עכשיו מוביל את השינוי. מי שמחכה ירדוף אחריו.</p>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[22px] border-2 border-dashed border-[#F0C9A8] bg-white/60 p-5 sm:p-7">
            <p dir="ltr" className="text-right font-mono text-sm text-muted">Without AI</p>
            <h3 className="mt-1 text-2xl">היום שלכם בלי סוכנים</h3>
            <ol className="mt-6 space-y-4">
              {MANUAL_DAY.map(([time, text], i) => (
                <li key={time} className={`flex items-baseline gap-4 ${i === MANUAL_DAY.length - 1 ? 'font-semibold text-[#D1342B]' : 'text-muted'}`}>
                  <span dir="ltr" className="w-12 shrink-0 font-mono text-sm">{time}</span>
                  <span className="text-lg">{text}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[22px] bg-accent p-5 text-white sm:p-7">
            <p dir="ltr" className="flex items-center justify-end gap-2 text-right font-mono text-sm text-white/80">With AI Agents · live<span className="live-dot" aria-hidden="true" /></p>
            <h3 className="mt-1 text-2xl">היום שלכם, כשהידע אצלכם</h3>
            <div className="mt-6 text-ink"><LiveFeed /></div>
            <p className="mt-6 text-lg">הלידים כבר מסווגים, הדוח כבר במייל, הלקוחות קיבלו מענה. <span className="font-display text-xl font-semibold">ואתם? מתחילים מהקפה.</span></p>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">הדגמה להמחשה.</p>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Give the agent a task, then what you learn to build */
function About() {
  return (
    <section id="about" className="tint-cyan">
      <div className="page py-16 lg:py-24">
        <h2 className="h2 max-w-3xl">תנו משימה לסוכן. <span className="text-[#0E8FC2]">ככה זה מרגיש כשהידע אצלכם.</span></h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">טריגר מפעיל את הסוכן, מודל שפה מחליט מה לעשות, והכלים מבצעים. בקורס לוקחים אתגר עסקי אמיתי ובונים סוכן שעושה את העבודה.</p>
        <div className="mt-10"><TaskStudio /></div>
        <ul className="mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c, i) => (
            <li key={c.title} className="rounded-2xl bg-white p-5">
              <Mascot hue={['lime', 'violet', 'orange', 'pink'][i]} className="h-10 w-10" />
              <p dir="ltr" className="mt-3 text-right font-mono text-[0.8rem] text-accent-hi">{c.en}</p>
              <h3 className="mt-1 text-lg leading-snug">{c.title}</h3>
              <p className="mt-2 text-muted">{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- The course in numbers */
function Numbers() {
  return (
    <section className="bg-accent text-white" aria-label="הקורס במספרים">
      <dl className="page grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-5 lg:py-14">
        {STATS.map(([n, label], i) => (
          <div key={label} className={`flex flex-col-reverse px-2 ${i === STATS.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <dt className="mt-1.5 leading-snug text-white/85">{label}</dt>
            <dd dir="ltr" className="text-right font-display text-[3rem] font-bold leading-none lg:text-[3.8rem]">{n}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/* ---------------------------------------------------------------- Projects: one agent, one clip, per project. Swipe on a phone, grid on a desktop. */
function Projects() {
  return (
    <section id="projects" className="bg-white py-16 lg:py-24">
      <div className="page">
        <h2 className="h2">8 פרויקטים. <span className="text-accent">8 סוכנים שעובדים.</span></h2>
        <p className="mt-4 max-w-xl text-lg text-muted">לאורך הקורס בונים שמונה מערכות עובדות, מאפס.</p>
      </div>
      <ol className="no-bar mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8 lg:mx-auto lg:grid lg:max-w-page lg:grid-cols-4 lg:gap-x-5 lg:gap-y-11 lg:overflow-visible">
        {PROJECTS.map(([title, text, en], i) => (
          <li key={title} className="w-[72%] shrink-0 snap-center sm:w-[42%] lg:w-auto">
            <div className="media aspect-[4/5] shadow-[0_18px_40px_-24px_rgb(60_40_140/0.5)]">
              <Clip name={`p${i + 1}`} alt={`סוכן בעבודה: ${title}`} />
            </div>
            <p dir="ltr" className="mt-4 text-right font-mono text-sm text-accent-hi">{String(i + 1).padStart(2, '0')} / {en}</p>
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
    <section id="syllabus" className="tint-lime">
      <div className="page grid gap-10 py-16 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="lg:col-span-4">
          <h2 className="h2">תוכנית הלימודים</h2>
          <p className="mt-4 text-lg text-muted">12 מודולים בשלושה שלבים. למידה עיונית, מעשית ופרויקט גמר. לקבלת התעודות נדרשות 80% נוכחות, מטלות שוטפות ועמידה במבחנים.</p>
          <div role="tablist" aria-label="שלבי הסילבוס" aria-orientation="vertical" onKeyDown={onKey} className="mt-8 flex flex-wrap gap-2 lg:flex-col">
            {PHASES.map((p, i) => (
              <button key={p.tab} id={`tab-${i}`} role="tab" type="button" aria-selected={tab === i} aria-controls="syllabus-panel" tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)}
                className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-start font-display text-lg font-semibold transition-colors duration-300 ${tab === i ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-white/70'}`}>
                {p.tab}<span dir="ltr" className="font-mono text-sm font-normal opacity-70">{p.en}</span>
              </button>
            ))}
          </div>
        </div>
        <ol id="syllabus-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} key={tab} className="fade-in grid gap-3 lg:col-span-8">
          {phase.modules.map(([title, text, en], i) => (
            <li key={title} className="grid grid-cols-[3rem_1fr] gap-x-3 rounded-2xl bg-white p-5 sm:grid-cols-[4rem_1fr]">
              <span dir="ltr" className="text-right font-display text-2xl font-bold text-[#5E9A0E] sm:text-3xl" aria-hidden="true">{String(offset + i + 1).padStart(2, '0')}</span>
              <div>
                <p dir="ltr" className="mb-1 text-right font-mono text-[0.8rem] text-muted">{en}</p>
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
    <section id="certificates" className="bg-white">
      <div className="page py-16 lg:py-24">
        <div className="grid gap-9 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="media aspect-[4/3] lg:col-span-5">
            <img src={IMG('m-grad')} alt="הסוכן עם כובע סיום, לצידו תעודה מגולגלת עם חותמת זהב" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="lg:col-span-7">
            <h2 className="h2">מסיימים עם <span className="text-accent">שתי תעודות</span></h2>
            <div className="mt-7 grid gap-3">
              {CERTS.map(([title, text]) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-surface p-5">
                  <Certificate size={32} weight="duotone" className="shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <h3 className="text-xl leading-snug">{title}</h3>
                    <p className="mt-1 text-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-5 grid grid-cols-3 gap-3">
              {RECOGNITION.map(([file, org]) => (
                <li key={file} className="grid h-20 place-items-center rounded-2xl border border-line bg-white px-3"><img src={LOGO(file)} alt={org} loading="lazy" className="max-h-11 w-auto max-w-full object-contain" /></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-14 text-center font-medium text-muted">עוד שותפים וגופים שאיתם עובדת היחידה ללימודי חוץ</p>
        <ul className="mt-6 grid grid-cols-3 items-center gap-x-6 gap-y-7 sm:grid-cols-7">
          {rest.map(([file, name]) => (
            <li key={file} className="flex justify-center"><img src={LOGO(file)} alt={name} loading="lazy" className="max-h-10 w-auto max-w-[6rem] object-contain" /></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Who it is for, and admission terms */
function Audience() {
  const Items = ({ items }) => (
    <ul className="mt-6 space-y-3.5">
      {items.map((t) => <li key={t} className="flex gap-3 text-lg"><Check size={20} weight="bold" className="mt-1 shrink-0 text-[#D6338A]" aria-hidden="true" />{t}</li>)}
    </ul>
  )
  return (
    <section className="tint-pink">
      <div className="page grid gap-5 py-16 md:grid-cols-2 lg:py-24">
        <div className="rounded-[22px] bg-white p-6 sm:p-8">
          <h2 className="h2">למי הקורס מתאים</h2>
          <p className="mt-4 text-muted">למי שרוצה ידע מקצועי ומעשי בבניית אפליקציות, מערכות אוטומציה וסוכני AI לצרכים עסקיים. בין היתר:</p>
          <Items items={AUDIENCE} />
        </div>
        <div className="rounded-[22px] bg-white p-6 sm:p-8">
          <h2 className="h2">תנאי קבלה</h2>
          <Items items={ADMISSION} />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- After the course, with the team clip */
function Roles() {
  return (
    <section className="bg-white">
      <div className="page grid gap-9 py-16 lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-24">
        <div className="media aspect-[4/3] lg:col-span-6">
          <Clip name="m-team" position="50% 60%" alt="חמישה סוכנים קטנים וצבעוניים עומדים על במה, לכל אחד אביזר אחר: אוזניות, זכוכית מגדלת, גרף, לוח שנה ומעטפה" />
        </div>
        <div className="lg:col-span-6">
          <h2 className="h2">לאן ממשיכים <span className="text-accent">אחרי הקורס</span></h2>
          <p className="mt-4 max-w-xl text-lg text-muted">לארגונים בינוניים וגדולים, או לעבודה כעצמאים שמטמיעים AI ואוטומציה אצל לקוחות.</p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {ROLES.map(([he, en]) => <li key={he} className="flex items-baseline gap-2 rounded-full bg-surface px-4 py-2"><span className="font-display font-semibold">{he}</span><span dir="ltr" className="font-mono text-xs text-muted">{en}</span></li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Funding */
function Funding() {
  const tint = ['bg-[#EAF8FE] text-[#0E78A8]', 'bg-[#F4FBE6] text-[#4E8A0A]', 'bg-[#FFF1E6] text-[#C45F12]']
  return (
    <section id="funding" className="tint-violet">
      <div className="page py-16 lg:py-24">
        <h2 className="h2">מסלולי מימון</h2>
        <p className="mt-4 max-w-xl text-lg text-muted">בשיחת הייעוץ בודקים יחד איזה מסלול מתאים לכם.</p>
        <div className="mt-9 grid gap-3 md:grid-cols-3">
          {TRACKS.map((t, i) => (
            <div key={t.id} className="rounded-[22px] bg-white p-6">
              <p className="font-medium text-muted">{t.name}</p>
              <p className={`mt-3 inline-block rounded-2xl px-3 py-1 font-display text-4xl font-bold ${tint[i % tint.length]}`}>{t.value}</p>
              <p className="mt-3 text-lg">{t.text}</p>
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
    <section id="faq" className="bg-white">
      <div className="page grid gap-8 py-16 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <h2 className="h2 lg:col-span-4">שאלות נפוצות</h2>
        <ul className="space-y-2.5 lg:col-span-8">
          {FAQS.map(([q, a], i) => (
            <li key={q} className="rounded-2xl bg-surface px-5">
              <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-4 text-start font-display text-lg font-semibold sm:text-xl">
                <span>{q}</span>
                <CaretDown size={18} weight="bold" className={`shrink-0 text-accent transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {open === i && <p className="fade-in pb-5 text-lg text-muted">{a}</p>}
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
    <section id="contact" ref={contactRef} className="bg-white">
      <div className="page pb-12 lg:pb-20">
        <div className="grid gap-8 rounded-[28px] bg-accent p-5 text-white sm:p-9 lg:grid-cols-2 lg:gap-14 lg:p-14">
          <div className="flex flex-col">
            <h2 className="h2">למדו לבנות AI, לפני שהשוק יתקדם בלעדיכם</h2>
            <p className="mt-4 max-w-md text-lg text-white/85">השאירו פרטים לשיחת ייעוץ והכוונה. נבדוק יחד התאמה, מסלול מימון ומועדי פתיחה.</p>
            <a href={`tel:${PHONE}`} className="mt-6 inline-flex items-center gap-3 self-start font-display text-4xl font-bold"><Phone size={28} weight="fill" aria-hidden="true" /><span dir="ltr">{PHONE}</span></a>
            <Mascot wave className="mt-auto hidden w-40 self-end pt-8 lg:block" />
          </div>
          <div className="rounded-[22px] bg-white p-5 text-ink sm:p-8"><LeadForm place="contact" full /></div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-line bg-white">
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
    <div className={`fixed inset-x-0 bottom-0 z-30 flex gap-2 bg-white/95 p-3 shadow-[0_-1px_0_rgb(var(--line))] backdrop-blur transition-transform duration-500 md:hidden ${show ? 'translate-y-0' : 'translate-y-full'}`}>
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
      <a href="#about" className="fixed start-4 top-[-80px] z-50 rounded-full bg-ink px-4 py-2 text-white transition-[top] focus:top-4">דילוג לתוכן</a>
      <Nav />
      <main>
        <Hero heroRef={heroRef} />
        <Stack />
        <WhyNow />
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
