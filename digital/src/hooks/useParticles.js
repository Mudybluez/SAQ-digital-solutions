import { useEffect, useRef } from 'react'

// Cached reduced-motion preference (doesn't change at runtime)
const prefersReduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useParticles(canvasRef) {
  const activeRef = useRef(true)

  useEffect(() => {
    // Skip entirely for users who prefer reduced motion
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let particles = [], animId, W, H

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()

    const handleResize = () => { resize(); init() }
    window.addEventListener('resize', handleResize, { passive: true })

    function make() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        size:   Math.random() * 1.6 + 0.2,
        speedY: -(Math.random() * 0.28 + 0.05),
        speedX: (Math.random() - 0.5) * 0.10,
        opacity: Math.random() * 0.5 + 0.1,
        dir:  Math.random() > 0.5 ? 1 : -1,
        dSpeed: Math.random() * 0.002 + 0.001,
        r: 228 + Math.floor(Math.random() * 20 - 10),
        g: 120 + Math.floor(Math.random() * 50),
        b: 10  + Math.floor(Math.random() * 25),
      }
    }

    function init() {
      // Cap at 80 particles max — was up to ~400 before
      const count = Math.min(Math.floor(W * H / 14000), 80)
      particles = Array.from({ length: count }, make)
    }
    init()

    function tick() {
      if (!activeRef.current) return
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.speedY; p.x += p.speedX
        p.opacity += p.dir * p.dSpeed
        if (p.opacity <= 0.05 || p.opacity >= 0.75) p.dir *= -1
        if (p.y < -4) { particles[i] = make(); particles[i].y = H + 4; continue }
        const isLight = document.documentElement.classList.contains('light')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${isLight ? 138 : p.r},${isLight ? 88 : p.g},${isLight ? 16 : p.b},${p.opacity.toFixed(2)})`
        ctx.fill()
      }
      animId = requestAnimationFrame(tick)
    }
    tick()

    // ── Page Visibility API: pause RAF when tab is hidden
    function handleVisibility() {
      if (document.hidden) {
        activeRef.current = false
        cancelAnimationFrame(animId)
      } else {
        activeRef.current = true
        tick()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      activeRef.current = false
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [canvasRef])
}
