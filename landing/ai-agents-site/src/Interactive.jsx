import { useEffect, useRef, useState } from 'react'
import { Bot } from 'lucide-react'
import { PROJECTS } from './data.js'

/* Feature card 1 — stacked shuffler of the course projects */
export function ProjectShuffler() {
  const [order, setOrder] = useState(() => PROJECTS.map((_, i) => i))
  useEffect(() => {
    const t = setInterval(() => setOrder((prev) => [...prev.slice(1), prev[0]]), 3000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="relative h-44 w-full">
      {PROJECTS.map((item, idx) => {
        const pos = order.indexOf(idx)
        const shown = pos < 3
        const o = shown ? pos : 3
        return (
          <div
            key={item.title}
            aria-hidden={pos !== 0}
            style={{
              transform: `translate(${-o * 14}px, ${o * 14}px) scale(${1 - o * 0.05})`,
              zIndex: 10 - o,
              opacity: shown ? 1 - o * 0.28 : 0,
              transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease',
            }}
            className="absolute inset-0 rounded-3xl border border-white/10 bg-surface-2 p-5 shadow-xl shadow-black/40"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">{item.tag}</span>
              <span className="font-mono text-xs text-muted" dir="ltr">0{idx + 1} / 08</span>
            </div>
            <div className="mt-4 font-display text-lg font-semibold leading-tight text-ink">{item.title}</div>
            <div className="mt-3 flex items-center gap-1.5" dir="ltr">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full" style={{ background: i < 24 - o * 7 ? '#C8FF4D' : '#2A3040' }} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* Feature card 2 — signature animation, re-skinned for AI agents:
   tasks fall from a server rack into a terminal line, scan-line ripples, cycling run status */
export function AgentRain() {
  const statuses = [
    { text: 'ליד חדש נכנס מהטופס', label: 'טריגר', tone: 'accent' },
    { text: 'הסוכן מסווג · כוונה גבוהה', label: 'ניתוח', tone: 'primary' },
    { text: 'נפתח ב-CRM + הודעת וואטסאפ', label: 'ביצוע', tone: 'primary' },
    { text: 'הריצה הושלמה · 1.4s', label: 'הושלם', tone: 'ok' },
  ]
  const [idx, setIdx] = useState(0)
  const [count, setCount] = useState(214)
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => {
        const n = (i + 1) % statuses.length
        if (n === statuses.length - 1) setCount((c) => c + 1)
        return n
      })
    }, 2300)
    return () => clearInterval(t)
  }, [])
  const drops = [
    { left: '12%', delay: '0s', dur: '2.6s', size: 15 }, { left: '25%', delay: '1.3s', dur: '3s', size: 12 },
    { left: '38%', delay: '0.6s', dur: '2.8s', size: 17 }, { left: '50%', delay: '1.8s', dur: '2.4s', size: 13 },
    { left: '62%', delay: '0.9s', dur: '3.1s', size: 16 }, { left: '75%', delay: '2s', dur: '2.7s', size: 12 },
    { left: '88%', delay: '0.4s', dur: '2.9s', size: 15 },
  ]
  const ripples = [{ left: '22%', delay: '0.2s' }, { left: '50%', delay: '1s' }, { left: '78%', delay: '1.8s' }]
  const s = statuses[idx]
  const toneText = s.tone === 'ok' ? 'text-emerald-400' : s.tone === 'accent' ? 'text-accent' : 'text-primary'
  const toneDot = s.tone === 'ok' ? 'bg-emerald-400' : s.tone === 'accent' ? 'bg-accent' : 'bg-primary'
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-3xl border border-accent/25" style={{ background: 'linear-gradient(180deg, #14122B 0%, #1B1840 70%, #231F55 100%)' }}>
      <div className="absolute -top-8 -left-6 h-20 w-32 rounded-full bg-accent/30 blur-2xl" />
      <div className="absolute top-2 right-10 h-14 w-24 rounded-full bg-primary/15 blur-xl" />

      <div className="absolute inset-x-4 top-3 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">סוכן לידים · פעיל</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-sm font-bold tabular-nums text-ink">{count}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-white/50">ריצות היום</span>
        </div>
      </div>

      {/* server rack (source) */}
      <svg className="absolute inset-x-3 top-9 h-5" viewBox="0 0 400 20" preserveAspectRatio="none">
        <rect x="0" y="5" width="400" height="10" rx="3" fill="#8B7CFF" fillOpacity="0.22" />
        <rect x="0" y="5" width="400" height="1.5" fill="#8B7CFF" fillOpacity="0.5" />
        {[48, 100, 152, 200, 248, 300, 352].map((x, i) => (
          <g key={x}>
            <rect x={x - 12} y="8" width="24" height="4" rx="1" fill="#0B0A1A" fillOpacity="0.7" />
            <circle cx={x + 7} cy="10" r="1.2" fill={i % 2 ? '#C8FF4D' : '#5CE1E6'}>
              <animate attributeName="opacity" values="1;0.2;1" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>

      {/* falling tasks (code brackets) */}
      <div className="absolute inset-x-3 top-[52px] h-24">
        {drops.map((d, i) => (
          <svg key={i} className="absolute top-0" style={{ left: d.left, width: d.size, height: d.size, animation: `rain-fall ${d.dur} cubic-bezier(.4,0,.8,.6) ${d.delay} infinite` }} viewBox="0 0 24 24" fill="none" stroke={i % 3 === 0 ? '#C8FF4D' : '#B4AAFF'} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6 2.5 12 8 18M16 6l5.5 6-5.5 6" />
          </svg>
        ))}
      </div>

      {/* terminal line (surface) + scan-line ripples */}
      <div className="absolute inset-x-3 bottom-[36px] h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="absolute inset-x-3 bottom-[34px] h-1">
        {ripples.map((r, i) => (
          <span key={i} className="absolute top-0 h-[3px] w-5 rounded-full bg-primary/70" style={{ left: r.left, animation: `rain-ripple 2.4s ease-out ${r.delay} infinite` }} />
        ))}
      </div>

      <div className="absolute inset-x-4 bottom-3 z-20 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`relative h-2 w-2 rounded-full ${toneDot}`}>
            {s.tone === 'accent' && <span className={`absolute inset-0 animate-ping rounded-full ${toneDot}`} />}
          </span>
          <span key={s.text} className={`truncate font-mono text-[10px] ${toneText}`} style={{ animation: 'rain-fadein 0.35s ease-out' }}>{s.text}</span>
        </div>
        <span className={`whitespace-nowrap ps-2 font-mono text-[9px] uppercase tracking-[0.2em] ${toneText}`}>{s.label}</span>
      </div>
    </div>
  )
}

/* Feature card 3 — an agent's cursor books a meeting in the calendar */
export function AgentScheduler() {
  const days = ['ש', 'ו', 'ה', 'ד', 'ג', 'ב', 'א'] // rendered LTR so the week reads right-to-left
  const active = 4
  const [step, setStep] = useState(0)
  const boxRef = useRef(null)
  useEffect(() => {
    const t = setInterval(() => setStep((p) => (p + 1) % 5), 1400)
    return () => clearInterval(t)
  }, [])
  const col = (i) => `calc(20px + (100% - 40px) * ${(i + 0.5) / 7})`
  const cursor = [
    { left: '12%', top: '120%', opacity: 0 },
    { left: col(0), top: '46%', opacity: 1 },
    { left: col(active), top: '46%', opacity: 1 },
    { left: col(active), top: '46%', opacity: 1 },
    { left: '52%', top: '80%', opacity: 1 },
  ][step]
  return (
    <div ref={boxRef} dir="ltr" className="relative h-44 w-full overflow-hidden rounded-3xl border border-white/10 bg-surface-2 p-5">
      <div className="mb-3 flex items-center justify-between" dir="rtl">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">שבוע 47 · נובמבר</span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">תיאום שיחה</span>
      </div>
      <div className="mb-4 grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <div key={d} className={`flex h-9 flex-col items-center justify-center rounded-xl text-xs font-medium transition-all duration-300 ${step >= 3 && i === active ? 'scale-110 bg-primary text-deep shadow-lg shadow-primary/30' : 'bg-white/5 text-ink'}`}>
            <span className={`font-mono text-[9px] ${step >= 3 && i === active ? 'text-deep/70' : 'text-muted'}`}>{d}</span>
            <span className="font-display text-sm font-semibold">{22 - i}</span>
          </div>
        ))}
      </div>
      <div dir="rtl" className={`w-full rounded-2xl py-2.5 text-center text-xs font-medium transition-all duration-300 ${step === 4 ? 'scale-[1.02] bg-accent text-white shadow-md shadow-accent/30' : 'bg-white/5 text-muted'}`}>
        {step >= 3 ? '✓ השיחה תואמה ונכנסה ליומן' : 'הסוכן בוחר מועד פנוי'}
      </div>
      <div className="pointer-events-none absolute transition-all duration-500 ease-out" style={{ left: cursor.left, top: cursor.top, opacity: cursor.opacity, transform: step === 3 ? 'scale(0.85)' : 'scale(1)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 3L19 12L12 13L9 20L5 3Z" fill="#C8FF4D" stroke="#07080B" strokeWidth="1.5" strokeLinejoin="round" /></svg>
      </div>
    </div>
  )
}

/* Animated counter — IntersectionObserver + rAF */
export function CountUp({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true
      if (reduce) return setValue(end)
      const t0 = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / duration)
        setValue(Math.round(end * (1 - Math.pow(1 - t, 3))))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])
  return <span ref={ref} className="tabular-nums">{prefix}{value}{suffix}</span>
}
