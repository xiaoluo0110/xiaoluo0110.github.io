<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  theme: { type: String, default: 'dark' },
  mode: { type: String, default: 'hero' }, // hero | math | weather | cesium | museum
})

const canvasRef = ref(null)

const ACCENTS = {
  dark: '#6eb5e0',
  light: '#3d7ea6',
  campus: '#2d6a4f',
  children: '#ff9ecd',
  tech: '#5ce1ff',
}

let raf = 0
let ctx = null
let w = 0
let h = 0
let dpr = 1
let t0 = 0
let mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
let nodes = []
let trails = []

function accent() {
  return ACCENTS[props.theme] || ACCENTS.dark
}

function hexAlpha(hex, a) {
  const n = hex.replace('#', '')
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  const parent = canvas.parentElement
  w = parent.clientWidth
  h = parent.clientHeight
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  seed()
}

function seed() {
  const count = props.mode === 'hero' ? 70 : 55
  nodes = Array.from({ length: count }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0012,
    vy: (Math.random() - 0.5) * 0.0012,
    r: 1.2 + Math.random() * 2.4,
    phase: Math.random() * Math.PI * 2,
    layer: i % 3,
  }))
  trails = Array.from({ length: 18 }, () => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.002 + Math.random() * 0.004,
    amp: 0.04 + Math.random() * 0.08,
    phase: Math.random() * Math.PI * 2,
  }))
}

function onMove(e) {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouse.tx = (e.clientX - rect.left) / rect.width
  mouse.ty = (e.clientY - rect.top) / rect.height
}

function drawGrid(c, time) {
  const col = hexAlpha(accent(), 0.12)
  c.strokeStyle = col
  c.lineWidth = 1
  const ox = (mouse.x - 0.5) * 30
  const oy = (mouse.y - 0.5) * 20
  const step = 36

  c.beginPath()
  for (let x = -step; x < w + step; x += step) {
    const dx = x + ox + Math.sin(time * 0.0004 + x * 0.01) * 4
    c.moveTo(dx, 0)
    c.lineTo(dx + (mouse.x - 0.5) * 18, h)
  }
  for (let y = -step; y < h + step; y += step) {
    const dy = y + oy
    c.moveTo(0, dy)
    c.lineTo(w, dy + (mouse.y - 0.5) * 10)
  }
  c.stroke()
}

function drawWave(c, time) {
  const a = accent()
  c.beginPath()
  for (let i = 0; i <= w; i += 3) {
    const nx = i / w
    const wave =
      Math.sin(nx * 8 + time * 0.0025 + mouse.x * 4) * (28 + mouse.y * 40) +
      Math.sin(nx * 17 - time * 0.0035) * 12
    const y = h * 0.55 + wave
    if (i === 0) c.moveTo(i, y)
    else c.lineTo(i, y)
  }
  c.strokeStyle = hexAlpha(a, 0.85)
  c.lineWidth = 2
  c.stroke()

  c.lineTo(w, h)
  c.lineTo(0, h)
  c.closePath()
  const g = c.createLinearGradient(0, h * 0.4, 0, h)
  g.addColorStop(0, hexAlpha(a, 0.22))
  g.addColorStop(1, hexAlpha(a, 0))
  c.fillStyle = g
  c.fill()
}

function drawBars(c, time) {
  const a = accent()
  const n = 28
  const gap = 4
  const bw = (w - gap * (n + 1)) / n
  for (let i = 0; i < n; i++) {
    const nx = i / n
    const dist = Math.abs(nx - mouse.x)
    const boost = Math.max(0, 1 - dist * 3)
    const val =
      0.2 +
      0.55 * Math.abs(Math.sin(time * 0.002 + i * 0.45 + mouse.y * 3)) +
      boost * 0.35
    const bh = val * h * 0.42
    const x = gap + i * (bw + gap)
    const y = h * 0.78 - bh
    c.fillStyle = hexAlpha(a, 0.25 + boost * 0.45)
    c.fillRect(x, y, bw, bh)
  }
}

function drawNetwork(c) {
  const a = accent()
  const pts = nodes.map((n) => ({
    x: n.x * w,
    y: n.y * h,
    r: n.r,
  }))

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x
      const dy = pts[i].y - pts[j].y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 110) {
        c.strokeStyle = hexAlpha(a, (1 - d / 110) * 0.35)
        c.lineWidth = 1
        c.beginPath()
        c.moveTo(pts[i].x, pts[i].y)
        c.lineTo(pts[j].x, pts[j].y)
        c.stroke()
      }
    }
  }

  const mx = mouse.x * w
  const my = mouse.y * h
  for (const p of pts) {
    const dx = p.x - mx
    const dy = p.y - my
    const d = Math.sqrt(dx * dx + dy * dy)
    if (d < 140) {
      c.strokeStyle = hexAlpha(a, (1 - d / 140) * 0.55)
      c.beginPath()
      c.moveTo(p.x, p.y)
      c.lineTo(mx, my)
      c.stroke()
    }
    c.beginPath()
    c.arc(p.x, p.y, p.r + (d < 90 ? 1.5 : 0), 0, Math.PI * 2)
    c.fillStyle = hexAlpha(a, d < 90 ? 0.95 : 0.55)
    c.fill()
  }

  c.beginPath()
  c.arc(mx, my, 5, 0, Math.PI * 2)
  c.fillStyle = hexAlpha(a, 0.9)
  c.fill()
  c.beginPath()
  c.arc(mx, my, 18, 0, Math.PI * 2)
  c.strokeStyle = hexAlpha(a, 0.35)
  c.stroke()
}

function drawGlobe(c, time) {
  const a = accent()
  const cx = w * 0.5 + (mouse.x - 0.5) * 40
  const cy = h * 0.48 + (mouse.y - 0.5) * 30
  const R = Math.min(w, h) * 0.32

  c.strokeStyle = hexAlpha(a, 0.55)
  c.lineWidth = 1.5
  c.beginPath()
  c.arc(cx, cy, R, 0, Math.PI * 2)
  c.stroke()

  for (let i = -3; i <= 3; i++) {
    const k = i / 3.5
    c.beginPath()
    for (let a0 = 0; a0 <= Math.PI * 2; a0 += 0.08) {
      const lat = k * Math.PI * 0.4
      const x = cx + Math.cos(a0 + time * 0.0006) * Math.cos(lat) * R
      const y = cy + Math.sin(lat) * R * 0.95 + Math.sin(a0) * 4 * k
      if (a0 === 0) c.moveTo(x, y)
      else c.lineTo(x, y)
    }
    c.strokeStyle = hexAlpha(a, 0.2)
    c.stroke()
  }

  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2 + time * 0.0005
    c.beginPath()
    c.ellipse(cx, cy, Math.abs(Math.cos(ang)) * R, R, 0, 0, Math.PI * 2)
    c.strokeStyle = hexAlpha(a, 0.18)
    c.stroke()
  }
}

function drawOrbit(c, time) {
  const a = accent()
  const cx = w * 0.52
  const cy = h * 0.48
  for (let ring = 1; ring <= 4; ring++) {
    const rx = 40 + ring * 28
    const ry = 18 + ring * 14
    c.beginPath()
    c.ellipse(cx, cy, rx, ry, -0.4, 0, Math.PI * 2)
    c.strokeStyle = hexAlpha(a, 0.2 + ring * 0.05)
    c.stroke()
    const ang = time * 0.001 * (0.4 + ring * 0.15) + ring
    const x = cx + Math.cos(ang) * rx
    const y = cy + Math.sin(ang) * ry
    c.beginPath()
    c.arc(x, y, 3, 0, Math.PI * 2)
    c.fillStyle = hexAlpha(a, 0.9)
    c.fill()
  }
}

function stepNodes() {
  for (const n of nodes) {
    const ax = (mouse.x - n.x) * 0.00015
    const ay = (mouse.y - n.y) * 0.00015
    n.vx += ax + (Math.random() - 0.5) * 0.00005
    n.vy += ay + (Math.random() - 0.5) * 0.00005
    n.vx *= 0.98
    n.vy *= 0.98
    n.x += n.vx
    n.y += n.vy
    if (n.x < 0 || n.x > 1) n.vx *= -1
    if (n.y < 0 || n.y > 1) n.vy *= -1
    n.x = Math.max(0, Math.min(1, n.x))
    n.y = Math.max(0, Math.min(1, n.y))
  }
}

function drawHud(c) {
  const a = accent()
  c.fillStyle = hexAlpha(a, 0.7)
  c.font = '11px JetBrains Mono, monospace'
  const x = (mouse.x * 360 - 180).toFixed(2)
  const y = (90 - mouse.y * 180).toFixed(2)
  c.fillText(`X ${x}   Y ${y}`, 14, 22)
  c.fillText(`MODE ${props.mode.toUpperCase()}`, 14, 38)
  c.strokeStyle = hexAlpha(a, 0.35)
  c.strokeRect(10, 8, 132, 38)
}

function draw(time) {
  if (!ctx) return
  mouse.x += (mouse.tx - mouse.x) * 0.12
  mouse.y += (mouse.ty - mouse.y) * 0.12

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  drawGrid(ctx, time)
  stepNodes()

  const mode = props.mode
  if (mode === 'weather') {
    drawWave(ctx, time)
    drawBars(ctx, time)
  } else if (mode === 'cesium') {
    drawGlobe(ctx, time)
    drawNetwork(ctx)
  } else if (mode === 'museum') {
    drawOrbit(ctx, time)
    drawNetwork(ctx)
  } else if (mode === 'math') {
    drawWave(ctx, time)
    drawNetwork(ctx)
  } else {
    drawWave(ctx, time)
    drawBars(ctx, time)
    drawNetwork(ctx)
  }

  drawHud(ctx)
}

function loop(time) {
  if (!t0) t0 = time
  draw(time)
  raf = requestAnimationFrame(loop)
}

watch(
  () => props.theme,
  () => {},
)

watch(
  () => props.mode,
  () => seed(),
)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  resize()
  raf = requestAnimationFrame(loop)
  window.addEventListener('resize', resize)
  canvas.addEventListener('pointermove', onMove, { passive: true })
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  canvasRef.value?.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <canvas ref="canvasRef" class="live-viz" aria-hidden="true" />
</template>

<style scoped>
.live-viz {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}
</style>
