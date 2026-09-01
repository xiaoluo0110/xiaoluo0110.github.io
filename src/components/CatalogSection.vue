<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CATEGORIES, ITEMS, getItemsByCategory } from '../data/catalog'
import LiveVizCanvas from './LiveVizCanvas.vue'
import { useTheme } from '../composables/useTheme'

const props = defineProps({
  category: { type: String, default: 'tools' },
  item: { type: String, default: 'math' },
})

const emit = defineEmits(['update:category', 'update:item'])

const { t, tm } = useI18n()
const { theme } = useTheme()

const categoryIds = CATEGORIES.map((c) => c.id)

function sortItemIds(ids) {
  return [...ids].sort((a, b) => {
    const rank = (id) => (ITEMS[id].status === 'live' ? 0 : 1)
    return rank(a) - rank(b)
  })
}

const itemIds = computed(() => sortItemIds(getItemsByCategory(props.category)))

const cards = computed(() =>
  itemIds.value.map((id) => {
    const meta = ITEMS[id]
    const tags = tm(`items.${id}.tags`)
    return {
      id,
      ...meta,
      title: t(`items.${id}.title`),
      desc: t(`items.${id}.desc`),
      cta: t(`items.${id}.cta`),
      statusLabel: t(`status.${meta.status}`),
      tags: Array.isArray(tags) ? tags : [],
      vizMode: vizModeFor(id),
    }
  }),
)

watch(
  () => props.category,
  (cat) => {
    const sorted = sortItemIds(getItemsByCategory(cat))
    if (!sorted.includes(props.item)) {
      emit('update:item', sorted[0])
    }
  },
)

function vizModeFor(id) {
  if (id === 'arcgis' || id === 'cesium') return id
  if (id === 'threejs' || id === 'geography' || id === 'history') return 'cesium'
  if (id === 'physics' || id === 'chemistry') return 'math'
  if (id === 'trading') return 'weather'
  return id
}

function selectCategory(id) {
  emit('update:category', id)
}

function onCardActivate(id) {
  emit('update:item', id)
}
</script>

<template>
  <section id="catalog" class="catalog">
    <div class="catalog-layout">
      <aside class="catalog-sidebar">
        <div
          class="cat-tabs"
          role="tablist"
          aria-orientation="vertical"
          :style="{ transform: 'translate3d(calc(var(--mnx) * 4px), 0, 0)' }"
        >
          <button
            v-for="id in categoryIds"
            :key="id"
            type="button"
            role="tab"
            class="cat-tab"
            :class="{ active: category === id }"
            :aria-selected="category === id"
            @click="selectCategory(id)"
          >
            {{ t(`categories.${id}.label`) }}
          </button>
        </div>
      </aside>

      <div class="catalog-main">
        <div class="catalog-head">
          <p class="cat-desc">{{ t(`categories.${category}.desc`) }}</p>
          <p class="chapter">{{ t(`categories.${category}.chapter`) }} · {{ t(`categories.${category}.title`) }}</p>
        </div>

        <div class="card-row" :key="category">
          <article
            v-for="(card, i) in cards"
            :key="card.id"
            class="project-card"
            :class="{ soon: card.status === 'soon', active: item === card.id }"
            :style="{
              '--accent': card.accent,
              '--delay': `${i * 70}ms`,
            }"
            @mouseenter="onCardActivate(card.id)"
            @focusin="onCardActivate(card.id)"
          >
            <div class="card-visual" aria-hidden="true">
              <LiveVizCanvas :theme="theme" :mode="card.vizMode" />
              <span class="badge" :class="card.status">{{ card.statusLabel }}</span>
            </div>

            <div class="card-body">
              <h3>{{ card.title }}</h3>
              <p class="card-desc">{{ card.desc }}</p>
              <ul class="tag-list">
                <li v-for="tag in card.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
              </ul>

              <a
                v-if="card.status === 'live' && card.url"
                class="pill card-cta"
                :href="card.url"
                target="_blank"
                rel="noopener noreferrer"
                @click="onCardActivate(card.id)"
              >
                {{ card.cta }}
              </a>
              <button v-else type="button" class="pill card-cta pill-muted" disabled>
                {{ card.cta }}
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.catalog {
  position: relative;
  z-index: 2;
  padding: 0 clamp(1.2rem, 5vw, 4.5rem) 3.5rem;
}

.catalog-layout {
  display: grid;
  grid-template-columns: minmax(7.5rem, 9.5rem) minmax(0, 1fr);
  gap: clamp(1.25rem, 3vw, 2.5rem);
  align-items: start;
}

.catalog-sidebar {
  position: sticky;
  top: 5.5rem;
}

.cat-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.cat-tab {
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.35;
  text-align: start;
  cursor: pointer;
  padding: 0.65rem 0.85rem;
  border-inline-start: 2px solid transparent;
  border-radius: 0 10px 10px 0;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.cat-tab:hover {
  color: var(--text-muted);
  background: color-mix(in srgb, var(--select-bg) 70%, transparent);
}

.cat-tab.active {
  color: var(--text);
  border-inline-start-color: var(--text);
  background: color-mix(in srgb, var(--select-bg) 85%, transparent);
}

.catalog-main {
  min-width: 0;
}

.catalog-head {
  margin-bottom: 1.25rem;
}

.cat-desc {
  color: var(--text-dim);
  font-size: 0.9rem;
  line-height: 1.55;
  max-width: 44rem;
  margin-bottom: 0.55rem;
}

.chapter {
  color: var(--text-muted);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
}

.card-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  align-items: stretch;
  animation: rise 0.4s ease both;
}

.project-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-card);
  background: color-mix(in srgb, var(--bg) 62%, transparent);
  backdrop-filter: blur(8px);
  overflow: hidden;
  transition:
    border-color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease,
    opacity 0.25s ease;
  animation: rise 0.45s ease both;
  animation-delay: var(--delay);
}

.project-card:hover,
.project-card.active {
  border-color: color-mix(in srgb, var(--accent) 45%, var(--border-soft));
  transform: translateY(-3px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
}

.project-card.soon {
  opacity: 0.78;
}

.project-card.soon:hover {
  opacity: 0.9;
}

.card-visual {
  position: relative;
  height: 148px;
  border-bottom: 1px solid var(--border-soft);
  background: color-mix(in srgb, var(--bg-soft) 80%, transparent);
  overflow: hidden;
}

.project-card.soon .card-visual {
  filter: saturate(0.7);
}

.badge {
  position: absolute;
  top: 0.65rem;
  inset-inline-end: 0.65rem;
  font-size: 0.68rem;
  font-weight: 500;
  padding: 0.14rem 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  color: var(--text-muted);
  border: 1px solid var(--border-soft);
  backdrop-filter: blur(6px);
}

.badge.live {
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 35%, transparent);
  background: color-mix(in srgb, var(--accent) 14%, var(--bg));
}

.card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem 1.05rem 1.1rem;
  gap: 0.55rem;
}

.card-body h3 {
  font-size: 1.08rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.card-desc {
  color: var(--text-muted);
  font-size: 0.86rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  list-style: none;
  margin: 0.15rem 0 0.35rem;
  padding: 0;
}

.tag-list li {
  padding: 0.2rem 0.55rem;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  color: var(--text-dim);
  font-size: 0.7rem;
}

.card-cta {
  margin-top: auto;
  align-self: flex-start;
  font-size: 0.82rem;
  padding: 0.45rem 0.95rem;
}

.pill-muted {
  opacity: 0.55;
  cursor: not-allowed;
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

@media (max-width: 1100px) {
  .card-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .catalog-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .catalog-sidebar {
    position: static;
  }

  .cat-tabs {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem 0.75rem;
  }

  .cat-tab {
    width: auto;
    padding: 0.45rem 0.85rem;
    border-inline-start: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
  }

  .cat-tab.active {
    border-inline-start-color: transparent;
    border-bottom-color: var(--text);
    background: transparent;
  }

  .card-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .card-row {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.85rem;
    padding-bottom: 0.35rem;
    -webkit-overflow-scrolling: touch;
  }

  .project-card {
    flex: 0 0 min(78vw, 280px);
    scroll-snap-align: start;
  }

  .card-visual {
    height: 132px;
  }
}
</style>
