<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

interface ScratchStamp {
  x: number
  y: number
  r: number
  bornAt: number
}

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    maskBottom?: boolean
    watermark?: boolean
    interactive?: boolean
  }>(),
  {
    maskBottom: true,
    watermark: true,
    interactive: true,
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const hasScratchedOnce = ref(false)
const isHovering = ref(false)

const HOLD_MS = 1450
const FADE_MS = 1050
const TOTAL_LIFE_MS = HOLD_MS + FADE_MS

let cleanCanvas: HTMLCanvasElement | null = null
let foilCanvas: HTMLCanvasElement | null = null
let maskCanvas: HTMLCanvasElement | null = null
let revealCanvas: HTMLCanvasElement | null = null

let imgW = 460
let imgH = 650
let splitY = 160
let rafId: number | null = null
let stamps: ScratchStamp[] = []
let lastPoint: { x: number; y: number } | null = null
let pointerCanvasPos: { x: number; y: number } | null = null

function drawWatermarks(ctx: CanvasRenderingContext2D, w: number, h: number, alpha = 0.22) {
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(-Math.PI / 6)
  ctx.font = `800 ${Math.max(13, Math.round(w * 0.045))}px Montserrat, sans-serif`
  ctx.fillStyle = `rgba(23, 221, 242, ${alpha})`
  ctx.textAlign = 'center'
  for (let y = -h; y <= h; y += Math.round(h * 0.22)) {
    ctx.fillText('AMOSTRA · MÉTODO CONSTRUINDO PONTES', 0, y)
  }
  ctx.restore()
}

function buildFoilLayer(img: HTMLImageElement, w: number, h: number): HTMLCanvasElement {
  const foil = document.createElement('canvas')
  foil.width = w
  foil.height = h
  const fctx = foil.getContext('2d')!

  // Fundo base: imagem limpa no cabeçalho + imagem borrada abaixo de splitY
  fctx.drawImage(img, 0, 0, w, h)

  if (props.maskBottom) {
    fctx.save()
    fctx.beginPath()
    fctx.rect(0, splitY, w, h - splitY)
    fctx.clip()
    fctx.filter = 'blur(11px) saturate(0.75) brightness(0.72)'
    fctx.drawImage(img, 0, 0, w, h)
    fctx.restore()

    // Véu metálico / raspadinha cobalt-navy
    const grad = fctx.createLinearGradient(0, splitY - 12, 0, h)
    grad.addColorStop(0, 'rgba(5, 42, 131, 0.35)')
    grad.addColorStop(0.14, 'rgba(5, 42, 131, 0.82)')
    grad.addColorStop(1, 'rgba(2, 11, 58, 0.94)')
    fctx.fillStyle = grad
    fctx.fillRect(0, splitY, w, h - splitY)

    // Textura diagonal metálica da raspadinha
    fctx.save()
    fctx.beginPath()
    fctx.rect(0, splitY, w, h - splitY)
    fctx.clip()
    fctx.strokeStyle = 'rgba(121, 221, 245, 0.09)'
    fctx.lineWidth = 2
    for (let d = -h; d < w + h; d += 14) {
      fctx.beginPath()
      fctx.moveTo(d, splitY)
      fctx.lineTo(d + h, h)
      fctx.stroke()
    }

    // Linha tracejada separando o cabeçalho visível da área raspável
    fctx.strokeStyle = 'rgba(23, 221, 242, 0.5)'
    fctx.lineWidth = 1.5
    fctx.setLineDash([6, 6])
    fctx.beginPath()
    fctx.moveTo(14, splitY + 1)
    fctx.lineTo(w - 14, splitY + 1)
    fctx.stroke()
    fctx.setLineDash([])

    if (props.interactive) {
      // Chamada visual central impressa na própria película raspável
      const centerX = w / 2
      const centerY = splitY + (h - splitY) * 0.48
      const pillW = Math.min(w - 40, 290)
      const pillH = 62

      fctx.fillStyle = 'rgba(2, 11, 58, 0.78)'
      fctx.strokeStyle = 'rgba(23, 221, 242, 0.55)'
      fctx.lineWidth = 1.5
      fctx.beginPath()
      fctx.roundRect(centerX - pillW / 2, centerY - pillH / 2, pillW, pillH, 18)
      fctx.fill()
      fctx.stroke()

      fctx.fillStyle = '#17ddf2'
      fctx.font = '800 13px Montserrat, sans-serif'
      fctx.textAlign = 'center'
      fctx.fillText('RASPADINHA INTERATIVA', centerX, centerY - 6)

      fctx.fillStyle = 'rgba(244, 247, 255, 0.92)'
      fctx.font = '600 11.5px Montserrat, sans-serif'
      fctx.fillText('Passe o dedo ou mouse · some em 2,5s', centerX, centerY + 14)
    }

    fctx.restore()
  }

  if (props.watermark) {
    drawWatermarks(fctx, w, h, 0.16)
  }

  return foil
}

function drawFrame(now: number) {
  const canvas = canvasRef.value
  if (!canvas || !foilCanvas || !cleanCanvas || !maskCanvas || !revealCanvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Remove carimbos expirados
  stamps = stamps.filter((s) => now - s.bornAt < TOTAL_LIFE_MS)

  // 1. Base: película de raspadinha
  ctx.clearRect(0, 0, imgW, imgH)
  ctx.drawImage(foilCanvas, 0, 0)

  // 2. Se houver áreas raspadas ativas, recorta o conteúdo nítido temporariamente
  if (stamps.length > 0) {
    const mctx = maskCanvas.getContext('2d')!
    const rctx = revealCanvas.getContext('2d')!

    mctx.clearRect(0, 0, imgW, imgH)
    for (const s of stamps) {
      const age = now - s.bornAt
      let alpha = 1
      if (age > HOLD_MS) {
        const t = (age - HOLD_MS) / FADE_MS
        alpha = Math.max(0, 1 - t * t)
      }
      if (alpha <= 0.01) continue

      const rg = mctx.createRadialGradient(s.x, s.y, s.r * 0.25, s.x, s.y, s.r)
      rg.addColorStop(0, `rgba(255,255,255,${alpha})`)
      rg.addColorStop(0.72, `rgba(255,255,255,${alpha * 0.92})`)
      rg.addColorStop(1, 'rgba(255,255,255,0)')
      mctx.fillStyle = rg
      mctx.beginPath()
      mctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      mctx.fill()
    }

    rctx.clearRect(0, 0, imgW, imgH)
    rctx.globalCompositeOperation = 'source-over'
    rctx.drawImage(maskCanvas, 0, 0)
    rctx.globalCompositeOperation = 'source-in'
    rctx.drawImage(cleanCanvas, 0, 0)
    rctx.globalCompositeOperation = 'source-over'

    ctx.drawImage(revealCanvas, 0, 0)
  }

  // 3. Cursor visual de "moeda / lupa" quando o ponteiro está ativo sobre a área raspável
  if (props.interactive && isHovering.value && pointerCanvasPos) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(pointerCanvasPos.x, pointerCanvasPos.y, 44, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(23, 221, 242, 0.72)'
    ctx.lineWidth = 1.75
    ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.restore()
  }

  if (stamps.length > 0 || (props.interactive && isHovering.value)) {
    rafId = requestAnimationFrame(drawFrame)
  } else {
    rafId = null
  }
}

function scheduleRender() {
  if (rafId === null) {
    rafId = requestAnimationFrame(drawFrame)
  }
}

function getCanvasCoords(clientX: number, clientY: number) {
  const canvas = canvasRef.value
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height) return null
  return {
    x: ((clientX - rect.left) / rect.width) * imgW,
    y: ((clientY - rect.top) / rect.height) * imgH,
  }
}

function addScratchStroke(x: number, y: number, radius = 56) {
  const now = performance.now()
  if (lastPoint) {
    const dx = x - lastPoint.x
    const dy = y - lastPoint.y
    const dist = Math.hypot(dx, dy)
    const step = 14
    if (dist > step) {
      const steps = Math.min(20, Math.ceil(dist / step))
      for (let i = 1; i <= steps; i++) {
        const px = lastPoint.x + (dx * i) / steps
        const py = lastPoint.y + (dy * i) / steps
        stamps.push({ x: px, y: py, r: radius, bornAt: now })
      }
    } else {
      stamps.push({ x, y, r: radius, bornAt: now })
    }
  } else {
    stamps.push({ x, y, r: radius, bornAt: now })
  }
  // Limita buffer em movimento intenso mantendo 60fps
  if (stamps.length > 180) {
    stamps = stamps.slice(-180)
  }
  lastPoint = { x, y }
  hasScratchedOnce.value = true
  scheduleRender()
}

function handlePointerEnter(e: PointerEvent) {
  if (!props.interactive) return
  isHovering.value = true
  const pt = getCanvasCoords(e.clientX, e.clientY)
  if (pt) {
    pointerCanvasPos = pt
    lastPoint = pt
    addScratchStroke(pt.x, pt.y, 58)
  }
}

function handlePointerMove(e: PointerEvent) {
  if (!props.interactive) return
  const pt = getCanvasCoords(e.clientX, e.clientY)
  if (!pt) return
  isHovering.value = true
  pointerCanvasPos = pt
  addScratchStroke(pt.x, pt.y, e.pointerType === 'touch' ? 66 : 56)
}

function handlePointerDown(e: PointerEvent) {
  if (!props.interactive) return
  const pt = getCanvasCoords(e.clientX, e.clientY)
  if (!pt) return
  isHovering.value = true
  pointerCanvasPos = pt
  lastPoint = pt
  addScratchStroke(pt.x, pt.y, 68)
}

function handlePointerLeave() {
  isHovering.value = false
  lastPoint = null
  pointerCanvasPos = null
}

function handleTouchMove(e: TouchEvent) {
  if (!props.interactive || e.touches.length === 0) return
  const touch = e.touches[0]
  const pt = getCanvasCoords(touch.clientX, touch.clientY)
  if (!pt) return
  isHovering.value = true
  pointerCanvasPos = pt
  addScratchStroke(pt.x, pt.y, 68)
}

function handleTouchEnd() {
  isHovering.value = false
  lastPoint = null
  pointerCanvasPos = null
}

function initCanvases() {
  const canvas = canvasRef.value
  if (!canvas) return

  const img = new Image()
  img.decoding = 'async'
  img.onload = () => {
    imgW = img.naturalWidth || 460
    imgH = img.naturalHeight || 650
    splitY = props.maskBottom ? Math.round(imgH * 0.27) : imgH

    canvas.width = imgW
    canvas.height = imgH

    cleanCanvas = document.createElement('canvas')
    cleanCanvas.width = imgW
    cleanCanvas.height = imgH
    const cctx = cleanCanvas.getContext('2d')!
    cctx.drawImage(img, 0, 0, imgW, imgH)
    if (props.watermark) {
      drawWatermarks(cctx, imgW, imgH, 0.22)
    }

    foilCanvas = buildFoilLayer(img, imgW, imgH)

    maskCanvas = document.createElement('canvas')
    maskCanvas.width = imgW
    maskCanvas.height = imgH

    revealCanvas = document.createElement('canvas')
    revealCanvas.width = imgW
    revealCanvas.height = imgH

    stamps = []
    drawFrame(performance.now())
  }
  img.src = props.src
}

onMounted(initCanvases)
watch(() => props.src, initCanvases)

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
    class="relative select-none overflow-hidden"
    :class="interactive ? 'cursor-grab active:cursor-grabbing' : ''"
    style="touch-action: pan-y;"
    @contextmenu.prevent
    @dragstart.prevent
  >
    <canvas
      ref="canvasRef"
      role="img"
      :aria-label="alt"
      class="block h-auto w-full select-none"
      :class="interactive ? 'pointer-events-auto' : 'pointer-events-none'"
      @pointerenter="handlePointerEnter"
      @pointermove="handlePointerMove"
      @pointerdown="handlePointerDown"
      @pointerleave="handlePointerLeave"
      @touchmove.passive="handleTouchMove"
      @touchend="handleTouchEnd"
    />
  </div>
</template>
