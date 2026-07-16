<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  theme: {
    type: String,
    default: 'dark',
  },
})

const canvasRef = ref(null)

const PALETTES = {
  dark: ['#5eb7b7', '#e8a87c', '#85c1e9', '#f5c26b', '#e07a5f', '#7d9cdb', '#6ec6a8'],
  light: ['#4a90a4', '#c98b6a', '#6ba3c9', '#d4a84b', '#c46b55', '#6b8cc4', '#5aaa8a'],
  campus: ['#2d6a4f', '#52b788', '#74c69d', '#95d5b2', '#40916c', '#7eb8da', '#b7e4c7'],
  children: ['#ff9ecd', '#7ec8e3', '#ffd678', '#b8e986', '#c9a0ff', '#ffb4a2', '#a0e7e5'],
  tech: ['#5ce1ff', '#3d8bfd', '#00ffa3', '#7c5cff', '#2ee6d6', '#4fc3f7', '#82aaff'],
}

let raf = 0
let particles = []
let mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false }
let width = 0
let height = 0
let dpr = 1
let reducedMotion = false
let currentColors = PALETTES.dark
let ctx = null

function getColors(theme) {
  return PALETTES[theme] || PALETTES.dark
}

function createParticles(w, h) {
  const count = Math.min(480, Math.floor((w * h) / 2400))
  const cx = w * 0.62
  const cy = h * 0.42
  const list = []
  const colors = currentColors
  const base = Math.min(w, h)

  for (let i = 0; i < count; i++) {
    const t = i / count
    const angle = t * Math.PI * 2.4 + Math.random() * 0.4
    const radius = 36 + t * base * 0.4 + (Math.random() - 0.5) * 40
    const x = cx + Math.cos(angle) * radius * 1.2
    const y = cy + Math.sin(angle) * radius * 0.7

    list.push({
      x,
      y,
      ox: x,
      oy: y,
      vx: 0,
      vy: 0,
      r: 1.4 + Math.random() * 4.2,
      color: colors[i % colors.length],
      alpha: 0.4 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.01,
      mass: 0.6 + Math.random() * 0.8,
    })
  }

  return list
}

function recolorParticles() {
  const colors = currentColors
  particles.forEach((p, i) => {
    p.color = colors[i % colors.length]
  })
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return

  width = window.innerWidth
  height = window.innerHeight
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  particles = createParticles(width, height)

  if (!mouse.active) {
    mouse.x = mouse.tx = width * 0.62
    mouse.y = mouse.ty = height * 0.42
  }
}

function onPointerMove(e) {
  mouse.tx = e.clientX
  mouse.ty = e.clientY
  mouse.active = true
}

function onPointerLeave() {
  mouse.active = false
  mouse.tx = width * 0.62
  mouse.ty = height * 0.42
}

function draw(time) {
  if (!ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  mouse.x += (mouse.tx - mouse.x) * 0.18
  mouse.y += (mouse.ty - mouse.y) * 0.18

  // 全局视差：整个漩涡随鼠标偏移
  const panX = (mouse.x / width - 0.5) * 48
  const panY = (mouse.y / height - 0.5) * 32

  const influence = Math.min(width, height) * 0.28
  const influenceSq = influence * influence

  for (const p of particles) {
    const homeX = p.ox + panX * p.mass
    const homeY = p.oy + panY * p.mass

    const driftAmp = reducedMotion ? 0 : 1
    const driftX = Math.cos(time * p.speed + p.phase) * 10 * driftAmp
    const driftY = Math.sin(time * p.speed * 1.15 + p.phase) * 8 * driftAmp

    let targetX = homeX + driftX
    let targetY = homeY + driftY

    const dx = p.x - mouse.x
    const dy = p.y - mouse.y
    const distSq = dx * dx + dy * dy

    if (mouse.active && distSq < influenceSq && distSq > 0.01) {
      const dist = Math.sqrt(distSq)
      const strength = (1 - dist / influence) ** 2
      const push = strength * 90 * p.mass
      targetX += (dx / dist) * push
      targetY += (dy / dist) * push
    }

    p.vx += (targetX - p.x) * 0.12
    p.vy += (targetY - p.y) * 0.12
    p.vx *= 0.78
    p.vy *= 0.78
    p.x += p.vx
    p.y += p.vy
  }

  // 邻近连线，增强网络可视化感
  for (let i = 0; i < particles.length; i += 2) {
    const a = particles[i]
    for (let j = i + 1; j < Math.min(i + 12, particles.length); j++) {
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 70) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = a.color
        ctx.globalAlpha = (1 - d / 70) * 0.22
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }

  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.alpha
    ctx.fill()
  }

  ctx.globalAlpha = 1
}

function loop(time) {
  draw(time)
  raf = requestAnimationFrame(loop)
}

watch(
  () => props.theme,
  (value) => {
    currentColors = getColors(value)
    if (particles.length) recolorParticles()
  },
  { immediate: true },
)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  currentColors = getColors(props.theme)

  resize()
  raf = requestAnimationFrame(loop)

  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', onPointerLeave)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('mouseleave', onPointerLeave)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-canvas" aria-hidden="true" />
</template>

<style scoped>
.particle-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
