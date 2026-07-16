<script setup>
import { ref } from 'vue'

defineProps({
  href: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  delay: { type: String, default: '0ms' },
})

const el = ref(null)
const tilt = ref({ x: 0, y: 0 })

function onMove(e) {
  const node = el.value
  if (!node) return
  const rect = node.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  tilt.value = { x: py * -8, y: px * 10 }
}

function onLeave() {
  tilt.value = { x: 0, y: 0 }
}
</script>

<template>
  <component
    :is="href && !disabled ? 'a' : 'div'"
    ref="el"
    class="magnetic-card"
    :class="{ disabled, link: Boolean(href) && !disabled }"
    :href="href && !disabled ? href : undefined"
    :target="href && !disabled ? '_blank' : undefined"
    :rel="href && !disabled ? 'noopener noreferrer' : undefined"
    :style="{
      '--delay': delay,
      transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translate3d(calc(var(--mnx) * 6px), calc(var(--mny) * -4px), 0)`,
    }"
    @pointermove="onMove"
    @pointerleave="onLeave"
  >
    <slot />
  </component>
</template>

<style scoped>
.magnetic-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.95rem 1.15rem;
  border-radius: var(--radius-card);
  background: var(--card-bg);
  color: var(--card-text);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.25s ease,
    opacity 0.25s ease;
  animation: rise 0.5s ease both;
  animation-delay: var(--delay);
  will-change: transform;
  transform-style: preserve-3d;
}

.magnetic-card.link {
  cursor: pointer;
}

.magnetic-card.link:hover {
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14);
}

.magnetic-card.disabled {
  opacity: 0.72;
  cursor: default;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
