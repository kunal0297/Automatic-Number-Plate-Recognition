import React, { useEffect, useRef } from 'react'

type Props = {
  backgroundColor?: string
  className?: string
  children?: React.ReactNode
}

// Canvas-based vortex effect inspired by your original Vortex demo API.
// Particles orbit the center with subtle noise and additive blending.
export function Vortex({ backgroundColor = 'black', className = '', children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d', { alpha: true })!

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    let raf = 0

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.scale(dpr, dpr)

    const center = { x: w / 2, y: h / 2 }
    const PARTICLES = Math.floor((w * h) / 22000) // density-based

    type P = { r: number; a: number; s: number; hue: number }
    const particles: P[] = []
    for (let i = 0; i < PARTICLES; i++) {
      particles.push({
        r: 40 + Math.random() * Math.max(w, h), // radius from center
        a: Math.random() * Math.PI * 2, // angle
        s: 0.002 + Math.random() * 0.004, // speed
        hue: 200 + Math.random() * 160, // blue→violet→teal spread
      })
    }

    const draw = () => {
      // fade trail for smooth motion
      ctx.fillStyle = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'

      for (const p of particles) {
        // slow vortex pull toward center
        p.r *= 0.9995
        // angular velocity + subtle noise wobble
        p.a += p.s + (Math.sin(p.a * 3) * 0.0009)

        const x = center.x + Math.cos(p.a) * p.r
        const y = center.y + Math.sin(p.a) * p.r

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 28)
        grad.addColorStop(0, `hsla(${p.hue}, 90%, 60%, 0.45)`)
        grad.addColorStop(1, 'hsla(0,0%,0%,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, y, 28, 0, Math.PI * 2)
        ctx.fill()

        // respawn when too close to center
        if (p.r < 60) {
          p.r = Math.max(w, h) * (0.7 + Math.random() * 0.6)
          p.a = Math.random() * Math.PI * 2
        }
      }

      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(draw)
    }

    // prime background
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, w, h)
    draw()

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [backgroundColor])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
      <div className="fixed inset-0 -z-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)' }} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}


