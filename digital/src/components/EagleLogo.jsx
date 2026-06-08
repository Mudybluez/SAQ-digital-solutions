import { useEffect, useRef, memo } from 'react'

/**
 * Рендерит logo.png с удалённым фоном через Canvas API.
 * Определяет цвет фона по верхнему-левому пикселю,
 * затем делает похожие пиксели прозрачными.
 */
const EagleLogo = memo(function EagleLogo({ className, style }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    const img = new Image()
    img.onload = () => {
      const W = img.naturalWidth
      const H = img.naturalHeight
      canvas.width  = W
      canvas.height = H
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, W, H)
      const d = imageData.data

      // Берём цвет фона из угла (0,0)
      const bgR = d[0], bgG = d[1], bgB = d[2]

      // Порог: пиксели ближе THRESHOLD к цвету фона → прозрачные
      // FADE: зона плавного перехода (антиалиасинг краёв)
      const THRESHOLD = 50
      const FADE      = 60

      for (let i = 0; i < d.length; i += 4) {
        const dr   = d[i]     - bgR
        const dg   = d[i + 1] - bgG
        const db   = d[i + 2] - bgB
        const dist = Math.sqrt(dr * dr + dg * dg + db * db)

        if (dist < THRESHOLD) {
          d[i + 3] = 0                                               // полностью прозрачный
        } else if (dist < THRESHOLD + FADE) {
          const t  = (dist - THRESHOLD) / FADE
          d[i + 3] = Math.round(t * t * d[i + 3])                   // плавный переход
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }
    img.src = '/logo.png'
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        ...style,
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden'
      }}
      aria-label="SAQ Eagle"
    />
  )
})

export default EagleLogo
