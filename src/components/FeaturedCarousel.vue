<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LiveVizCanvas from './LiveVizCanvas.vue'
import { ITEMS } from '../data/catalog'
import { useMouse } from '../composables/useMouse'
import { useTheme } from '../composables/useTheme'

const SLIDE_IDS = ['math', 'weather', 'cesium', 'museum']

const { t } = useI18n()
const mouse = useMouse()
const { theme } = useTheme()

const index = ref(0)
const paused = ref(false)
let timer = 0

const slides = computed(() =>
  SLIDE_IDS.map((id) => ({
    id,
    ...ITEMS[id],
    title: t(`items.${id}.title`),
    desc: t(`items.${id}.desc`),
    cta: t(`items.${id}.cta`),
    statusLabel: t(`status.${ITEMS[id].status}`),
  })),
)

const current = computed(() => slides.value[index.value])

function go(i) {
  const n = slides.value.length
  index.value = ((i % n) + n) % n
}

function next() {
  go(index.value + 1)
}

function prev() {
  go(index.value - 1)
}

function startTimer() {
  stopTimer()
  timer = window.setInterval(() => {
    if (!paused.value) next()
  }, 5200)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = 0
  }
}

watch(index, () => {
  if (!paused.value) startTimer()
})

onMounted(startTimer)
onUnmounted(stopTimer)
</script>

<template>
  <section
    id="featured"
    class="featured"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div
      class="featured-head"
      :style="{ transform: `translate3d(${mouse.px * 8}px, ${mouse.py * 4}px, 0)` }"
    >
      <p class="eyebrow">{{ t('featured.eyebrow') }}</p>
      <h2>{{ t('featured.title') }}</h2>
      <p class="lead">{{ t('featured.desc') }}</p>
    </div>

    <div class="stage-wrap" :style="{ '--accent': current.accent }">
      <button type="button" class="nav-btn nav-prev" :aria-label="t('featured.prev')" @click="prev">
        ‹
      </button>

      <div class="stage">
        <div class="visual" aria-hidden="true">
          <LiveVizCanvas :theme="theme" :mode="current.id" />
        </div>

        <div class="copy">
          <span class="badge">{{ current.statusLabel }}</span>
          <h3>{{ current.title }}</h3>
          <p>{{ current.desc }}</p>

          <a
            v-if="current.status === 'live' && current.url"
            class="pill"
            :href="current.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ current.cta }}
          </a>
          <button v-else type="button" class="pill pill-muted" disabled>
            {{ current.cta }}
          </button>
        </div>
      </div>

      <button type="button" class="nav-btn nav-next" :aria-label="t('featured.next')" @click="next">
        ›
      </button>

      <div class="dots" role="tablist">
        <button
          v-for="(slide, i) in slides"
          :key="slide.id"
          type="button"
          class="dot"
          :class="{ active: i === index }"
          :aria-label="slide.title"
          :aria-selected="i === index"
          @click="go(i)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.featured {
  position: relative;
  z-index: 2;
  padding: 0.5rem clamp(1.2rem, 5vw, 4.5rem) 3.5rem;
}

.featured-head {
  max-width: 36rem;
  margin-bottom: 1.75rem;
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.eyebrow {
  color: var(--text-dim);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.45rem;
}

.featured-head h2 {
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 0.55rem;
}

.lead {
  color: var(--text-muted);
  font-size: 1.02rem;
  line-height: 1.6;
}

.stage-wrap {
  position: relative;
  padding: 0 3rem 2.25rem;
}

.stage {
  position: relative;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(1.2rem, 3vw, 2.5rem);
  align-items: center;
  min-height: 280px;
}

.visual {
  position: relative;
  min-height: 280px;
  height: 100%;
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 1px solid var(--border-soft);
  background: color-mix(in srgb, var(--bg-soft) 70%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 15%, transparent);
}

.copy {
  max-width: 28rem;
  animation: fade 0.4s ease;
}

.copy .badge {
  display: inline-block;
  margin-bottom: 0.65rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  font-size: 0.72rem;
  background: var(--select-bg);
  color: var(--text-muted);
}

.copy h3 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
}

.copy p {
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 1.35rem;
}

.pill-muted {
  opacity: 0.55;
  cursor: not-allowed;
}

.nav-btn {
  position: absolute;
  top: 50%;
  z-index: 3;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-soft);
  border-radius: 50%;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  backdrop-filter: blur(8px);
  color: var(--text);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
}

.nav-prev {
  left: 0;
}

.nav-next {
  right: 0;
}

.nav-btn:hover {
  border-color: var(--accent);
  background: var(--select-bg);
  transform: translateY(-50%) scale(1.06);
}

.dots {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  display: flex;
  gap: 0.45rem;
}

.dot {
  width: 0.55rem;
  height: 0.55rem;
  border: none;
  border-radius: 999px;
  background: var(--text-dim);
  cursor: pointer;
  transition: width 0.25s ease, background-color 0.25s ease;
}

.dot.active {
  width: 1.35rem;
  background: var(--accent, var(--text));
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 860px) {
  .stage-wrap {
    padding: 0 2.4rem 2.25rem;
  }

  .stage {
    grid-template-columns: 1fr;
  }

  .visual {
    min-height: 220px;
  }

  .nav-btn {
    width: 2.2rem;
    height: 2.2rem;
  }
}
</style>
