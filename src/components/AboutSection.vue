<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMouse } from '../composables/useMouse'

const { t, tm } = useI18n()
const mouse = useMouse()

const craft = ['vue', 'gis', 'engine', 'viz']

const scenarios = computed(() => {
  const list = tm('about.scenarios')
  return Array.isArray(list) ? list : []
})

const contacts = [
  { key: 'qq', value: '1211571826', href: null },
  { key: 'email', value: '1211571826@qq.com', href: 'mailto:1211571826@qq.com' },
]
</script>

<template>
  <section id="about" class="about">
    <div
      class="about-main"
      :style="{ transform: `translate3d(${mouse.px * 8}px, ${mouse.py * 5}px, 0)` }"
    >
      <p class="eyebrow">{{ t('about.eyebrow') }}</p>
      <h2>{{ t('about.title') }}</h2>
      <p class="bio">{{ t('about.bio') }}</p>
      <p class="desc">{{ t('about.desc') }}</p>

      <div v-if="scenarios.length" class="scenarios">
        <p class="scenarios-title">{{ t('about.scenariosTitle') }}</p>
        <ul>
          <li v-for="item in scenarios" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="contact-block">
        <p class="contact-cta">{{ t('about.contactCta') }}</p>
        <div class="contact-list">
          <a
            v-for="item in contacts"
            :key="item.key"
            class="contact-item"
            :href="item.href || undefined"
            @click="!item.href && $event.preventDefault()"
          >
            <span class="k">{{ t(`contact.${item.key}`) }}</span>
            <span class="v">{{ item.value }}</span>
          </a>
        </div>
      </div>
    </div>

    <div class="craft">
      <h3>{{ t('about.craftTitle') }}</h3>
      <ul>
        <li
          v-for="(key, i) in craft"
          :key="key"
          :style="{
            transform: `translate3d(${mouse.px * -(6 + i * 3)}px, ${mouse.py * (3 + i)}px, 0)`,
          }"
        >
          <strong>{{ t(`about.craft.${key}.label`) }}</strong>
          <span>{{ t(`about.craft.${key}.desc`) }}</span>
        </li>
      </ul>
      <p class="stack">{{ tm('about.stack').join('  /  ') }}</p>
    </div>
  </section>
</template>

<style scoped>
.about {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  padding: 2rem clamp(1.2rem, 5vw, 4.5rem) 5.5rem;
  align-items: start;
}

.about-main {
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.eyebrow {
  color: var(--accent);
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.55rem;
}

.about-main h2 {
  font-size: clamp(1.7rem, 3.5vw, 2.3rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.bio {
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  line-height: 1.55;
  letter-spacing: -0.01em;
  margin-bottom: 1rem;
  max-width: 34rem;
}

.desc {
  color: var(--text-muted);
  line-height: 1.75;
  font-size: 1.02rem;
  max-width: 36rem;
  margin-bottom: 1.5rem;
}

.scenarios {
  margin-bottom: 1.75rem;
}

.scenarios-title {
  color: var(--text-dim);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
}

.scenarios ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
}

.scenarios li {
  padding: 0.32rem 0.7rem;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.82rem;
  background: color-mix(in srgb, var(--bg) 50%, transparent);
}

.contact-block {
  padding-top: 1.1rem;
  border-top: 1px solid var(--border-soft);
  max-width: 28rem;
}

.contact-cta {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  color: var(--text);
}

.contact-item .k {
  color: var(--text-dim);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.contact-item .v {
  font-size: 0.92rem;
}

.contact-item[href]:hover .v {
  color: var(--accent);
}

.craft h3 {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.craft ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.craft li {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border-soft);
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.craft strong {
  font-size: 1.05rem;
  font-weight: 600;
}

.craft span {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.stack {
  color: var(--text-dim);
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  line-height: 1.7;
}

@media (max-width: 860px) {
  .about {
    grid-template-columns: 1fr;
  }
}
</style>
