import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const FRONT = -Math.PI / 2 // model yaw (radians) that faces the camera
const TURN = Math.PI * 2

/* A real-time 3D model of the mascot. It turns slowly, leans toward the pointer and can be dragged to spin.
   The render loop runs only while the canvas is on screen. Loaded lazily, so three.js is not in the main bundle. */
export default function Mascot3D({ url }) {
  const mount = useRef(null)
  useEffect(() => {
    const el = mount.current
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
    camera.position.set(0, 0.15, 6.2)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x4a4466, 2.4))
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(2.5, 3, 4); scene.add(key)
    const rim = new THREE.DirectionalLight(0x8b7cff, 1.4); rim.position.set(-3, 1.5, -3); scene.add(rim)
    const fill = new THREE.DirectionalLight(0xc8ff4d, 0.6); fill.position.set(3, -1, -2); scene.add(fill)

    const group = new THREE.Group()
    scene.add(group)
    // The mesh ships as quantised arrays in JSON with a separate texture image.
    const bytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)).buffer
    let cancelled = false
    fetch(`${url}.json`).then((r) => r.json()).then((m) => {
      if (cancelled) return
      const q = new Uint16Array(bytes(m.position))
      const position = new Float32Array(q.length)
      for (let i = 0; i < q.length; i++) position[i] = m.min[i % 3] + (q[i] / 65535) * m.span
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
      geometry.setAttribute('normal', new THREE.BufferAttribute(new Int8Array(bytes(m.normal)), 3, true))
      geometry.setAttribute('uv', new THREE.BufferAttribute(new Uint16Array(bytes(m.uv)), 2, true))
      geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(bytes(m.index)), 1))
      geometry.center()
      const texture = new THREE.TextureLoader().load(`${url}.webp`, render)
      texture.flipY = false
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 4
      group.scale.setScalar(2.2 / m.span)
      group.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ map: texture, roughness: 0.95, metalness: 0 })))
      render()
    }).catch(() => {})

    let spin = FRONT, velocity = 0, dragging = false, lastX = 0, leanX = 0, leanY = 0, tx = 0, ty = 0, raf = 0, visible = false
    const clock = new THREE.Clock()
    const render = () => {
      const t = clock.getElapsedTime()
      spin += velocity
      velocity *= 0.94
      // when left alone it eases back to face the visitor, and sways
      if (!dragging) spin += (FRONT + Math.round((spin - FRONT) / TURN) * TURN - spin) * 0.03
      const sway = still ? 0 : Math.sin(t * 0.7) * 0.55
      leanX += (tx - leanX) * 0.06
      leanY += (ty - leanY) * 0.06
      group.rotation.y = spin + sway + leanX * 0.4
      group.rotation.x = leanY * 0.25
      group.position.y = still ? 0 : Math.sin(t * 1.6) * 0.07
      renderer.render(scene, camera)
    }
    const loop = () => { render(); raf = requestAnimationFrame(loop) }
    const start = () => { if (!raf && visible && !still) raf = requestAnimationFrame(loop) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    const size = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      render()
    }
    const ro = new ResizeObserver(size)
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop() })
    io.observe(el)

    const down = (e) => { dragging = true; lastX = e.clientX; el.setPointerCapture?.(e.pointerId) }
    const move = (e) => {
      const r = el.getBoundingClientRect()
      if (dragging) {
        const dx = e.clientX - lastX
        lastX = e.clientX
        spin += dx * 0.012
        velocity = dx * 0.004
        if (still) render()
      } else {
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2
      }
    }
    const up = () => { dragging = false }
    const leave = () => { tx = 0; ty = 0 }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    el.addEventListener('pointerleave', leave)

    return () => {
      cancelled = true
      stop(); ro.disconnect(); io.disconnect()
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('pointerleave', leave)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [url])
  return <div ref={mount} role="img" aria-label="מודל תלת-ממדי של הסוכן, אפשר לגרור כדי לסובב" className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing [&>canvas]:h-full [&>canvas]:w-full" />
}
