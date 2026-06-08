import { useEffect, useRef, memo } from 'react'
import { useContent } from '../context/ContentContext'

/**
 * Рендерит logo.png с удалённым фоном через Canvas API с оптимизированным разрешением,
 * предвычисленными тенями и быстрым попиксельным алгоритмом без лишних вычислений Math.sqrt.
 */
const EagleLogo = memo(function EagleLogo({ className, style }) {
  const canvasRef = useRef(null)
  const { theme } = useContent()

  // Константы размеров для рендеринга и тени
  const targetSize = 650
  const shadowBlur = 45
  const padding = shadowBlur * 1.5 // Буфер, чтобы тень не обрезалась краями canvas

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.onload = () => {
      const canvasWidth = targetSize + padding * 2
      const canvasHeight = targetSize + padding * 2

      canvas.width  = canvasWidth
      canvas.height = canvasHeight

      // Создаём вспомогательный canvas для быстрого ресайза и фильтрации фона
      const offscreen = document.createElement('canvas')
      offscreen.width = targetSize
      offscreen.height = targetSize
      const oCtx = offscreen.getContext('2d', { willReadFrequently: true })

      // Рисуем уменьшенную копию логотипа на вспомогательном холсте
      oCtx.drawImage(img, 0, 0, targetSize, targetSize)

      const imageData = oCtx.getImageData(0, 0, targetSize, targetSize)
      const d = imageData.data

      // Берём цвет фона из угла (0,0)
      const bgR = d[0], bgG = d[1], bgB = d[2]

      const THRESHOLD = 50
      const FADE = 60
      const THRESHOLD_SQ = THRESHOLD * THRESHOLD
      const FADE_LIMIT_SQ = (THRESHOLD + FADE) * (THRESHOLD + FADE)

      // Оптимизированный попиксельный обход: Math.sqrt вызывается только в зоне перехода
      for (let i = 0; i < d.length; i += 4) {
        const dr = d[i]     - bgR
        const dg = d[i + 1] - bgG
        const db = d[i + 2] - bgB
        const distSq = dr * dr + dg * dg + db * db

        if (distSq < THRESHOLD_SQ) {
          d[i + 3] = 0 // Полностью прозрачный
        } else if (distSq < FADE_LIMIT_SQ) {
          const dist = Math.sqrt(distSq)
          const t = (dist - THRESHOLD) / FADE
          d[i + 3] = Math.round(t * t * d[i + 3]) // Зона плавного перехода
        }
      }

      oCtx.putImageData(imageData, 0, 0)

      // Рендерим тень один раз прямо на основном холсте
      ctx.shadowColor = theme === 'light' ? 'rgba(138,88,16,0.45)' : 'rgba(232,149,26,0.85)'
      ctx.shadowBlur = shadowBlur
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      // Рисуем изображение поверх тени
      ctx.drawImage(offscreen, padding, padding)
    }
    img.src = theme === 'light' ? '/assets/digital_logo_light_no_bg.png' : '/assets/digital_logo_dark.png'
  }, [theme])

  // Вычисляем масштаб и отрицательные маргины, чтобы скомпенсировать паддинг тени
  const scaleFactor = (targetSize + padding * 2) / targetSize
  const marginPercent = -(padding / targetSize) * 100

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        ...style,
        width: `${scaleFactor * 100}%`,
        margin: `${marginPercent}%`,
        willChange: 'transform',
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden'
      }}
      aria-label="SAQ Eagle"
    />
  )
})

export default EagleLogo
