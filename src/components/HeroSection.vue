<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMouse } from '../composables/useMouse'
import { useTheme } from '../composables/useTheme'
import LiveVizCanvas from './LiveVizCanvas.vue'

const emit = defineEmits(['explore', 'about', 'select'])

const { t, tm } = useI18n()
const mouse = useMouse()
const { theme } = useTheme()

const focuses = ['tools', 'spatial', 'scenarios']

const pillars = computed(() => {
  const list = tm('hero.pillars')
  return Array.isArray(list) ? list : []
})

const stack = computed(() => {
  const list = tm('about.stack')
  return Array.isArray(list) ? list : []
})

const brandShift = computed(() => ({
  transform: `translate3d(${mouse.px * 14}px, ${mouse.py * 10}px, 0)`,
}))

const panelShift = computed(() => ({
  transform: `translate3d(${mouse.px * -8}px, ${mouse.py * -5}px, 0)`,
}))
</script>

<template>
  <section id="home" class="hero">
    <div class="brand" :style="brandShift">
      <p class="role">{{ t('hero.role') }}</p>
      <h1>{{ t('hero.title') }}</h1>
      <p class="subtitle">{{ t('hero.subtitle') }}</p>
      <p class="position">{{ t('hero.position') }}</p>

      <ul v-if="pillars.length" class="pillars" aria-label="focus">
        <li v-for="item in pillars" :key="item">{{ item }}</li>
      </ul>

      <div class="cta-row">
        <button type="button" class="pill" @click="emit('explore')">
          {{ t('hero.start') }}
        </button>
        <button type="button" class="pill pill-ghost" @click="emit('about')">
          {{ t('hero.about') }}
        </button>
      </div>

      <p v-if="stack.length" class="stack-row">
        <span v-for="item in stack" :key="item" class="stack-chip">{{ item }}</span>
      </p>
    </div>

    <div class="viz-stack" :style="panelShift">
      <div class="viz-frame">
        <LiveVizCanvas :theme="theme" mode="hero" />
        <div class="viz-caption">
          <span>{{ t('viz.live') }}</span>
          <small>{{ t('viz.capability') }}</small>
          <small class="hint">{{ t('viz.hint') }}</small>
        </div>
      </div>

      <aside class="panel" aria-label="focus">
        <p class="panel-eyebrow">{{ t('focus.eyebrow') }}</p>
        <div class="focus-list">
          <button
            v-for="(id, i) in focuses"
            :key="id"
            type="button"
            class="focus-item"
            @click="emit('select', id)"
          >
            <span class="idx">0{{ i + 1 }}</span>
            <span class="body">
              <strong>{{ t(`focus.items.${id}.title`) }}</strong>
              <span class="keywords">{{ tm(`focus.items.${id}.keywords`).join(' · ') }}</span>
            </span>
            <span class="arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.15fr);
  gap: clamp(1.25rem, 3.5vw, 3rem);
  align-items: center;
  padding: 6.5rem clamp(1.2rem, 5vw, 4.5rem) 2.5rem;
}

.brand {
  max-width: 36rem;
  transition: transform 0.15s ease-out;
  will-change: transform;
}

.role {
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  margin-bottom: 0.85rem;
}

.brand h1 {
  font-size: clamp(2.8rem, 7vw, 4.6rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin-bottom: 1rem;
}

.subtitle {
  color: var(--text-muted);
  font-size: clamp(0.98rem, 1.8vw, 1.12rem);
  line-height: 1.65;
  margin-bottom: 0.65rem;
  max-width: 32rem;
}

.position {
  color: var(--text-dim);
  font-size: 0.9rem;
  line-height: 1.55;
  margin-bottom: 1.1rem;
  max-width: 32rem;
}

.pillars {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  list-style: none;
  margin: 0 0 1.35rem;
  padding: 0;
}

.pillars li {
  padding: 0.28rem 0.7rem;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  background: color-mix(in srgb, var(--bg) 55%, transparent);
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.15rem;
}

.pill-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border-soft);
}

.pill-ghost:hover {
  background: var(--select-bg);
  border-color: var(--accent);
}

.stack-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.55rem;
  max-width: 34rem;
}

.stack-chip {
  color: var(--text-dim);
  font-size: 0.72rem;
  letter-spacing: 0.03em;
}

.stack-chip:not(:last-child)::after {
  content: '/';
  margin-inline-start: 0.55rem;
  opacity: 0.45;
}

.viz-stack {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.viz-frame {
  position: relative;
  height: clamp(240px, 38vh, 380px);
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 1px solid var(--border-soft);
  background: color-mix(in srgb, var(--bg-soft) 80%, transparent);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent),
    0 20px 50px rgba(0, 0, 0, 0.18);
}

.viz-caption {
  position: absolute;
  right: 0.85rem;
  bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
  pointer-events: none;
}

.viz-caption span {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  padding: 0.2rem 0.45rem;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  border-radius: 4px;
  background: color-mix(in srgb, var(--bg) 65%, transparent);
}

.viz-caption small {
  color: var(--text-dim);
  font-size: 0.7rem;
}

.viz-caption .hint {
  opacity: 0.8;
}

.panel {
  padding: 0.75rem 0.95rem 0.25rem;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--bg) 60%, transparent);
  backdrop-filter: blur(10px);
}

.panel-eyebrow {
  color: var(--accent);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.focus-list {
  display: flex;
  flex-direction: column;
}

.focus-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.65rem 0.8rem;
  align-items: center;
  width: 100%;
  padding: 0.65rem 0.1rem;
  border: none;
  border-top: 1px solid var(--border-soft);
  background: transparent;
  color: var(--text);
  text-align: start;
  cursor: pointer;
  transition: padding-inline-start 0.25s ease, background-color 0.25s ease;
}

.focus-item:hover {
  padding-inline-start: 0.4rem;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--accent) 10%, transparent),
    transparent 75%
  );
}

.focus-item:hover .arrow {
  transform: translateX(4px);
  color: var(--accent);
}

.idx {
  font-size: 0.75rem;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.body strong {
  font-size: 0.95rem;
  font-weight: 600;
}

.keywords {
  color: var(--text-dim);
  font-size: 0.7rem;
}

.arrow {
  color: var(--text-dim);
  transition: transform 0.25s ease, color 0.25s ease;
}

@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 6rem;
    align-items: start;
  }

  .viz-frame {
    height: 240px;
  }
}
</style>
