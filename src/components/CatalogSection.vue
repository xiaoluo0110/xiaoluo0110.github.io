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

const itemIds = computed(() => {
  const ids = getItemsByCategory(props.category)
  return [...ids].sort((a, b) => {
    const rank = (id) => (ITEMS[id].status === 'live' ? 0 : 1)
    return rank(a) - rank(b)
  })
})

const meta = computed(() => ITEMS[props.item] ?? ITEMS.math)

const isLive = computed(() => meta.value.status === 'live')

const tags = computed(() => {
  const list = tm(`items.${props.item}.tags`)
  return Array.isArray(list) ? list : []
})

const vizMode = computed(() => {
  const id = props.item
  if (id === 'arcgis' || id === 'cesium' || id === 'threejs') return id === 'threejs' ? 'cesium' : id
  if (id === 'geography') return 'cesium'
  if (id === 'physics') return 'math'
  return id
})

watch(
  () => props.category,
  (cat) => {
    const ids = getItemsByCategory(cat)
    const sorted = [...ids].sort((a, b) => {
      const rank = (id) => (ITEMS[id].status === 'live' ? 0 : 1)
      return rank(a) - rank(b)
    })
    if (!sorted.includes(props.item)) {
      emit('update:item', sorted[0])
    }
  },
)

function selectCategory(id) {
  emit('update:category', id)
}

function selectItem(id) {
  emit('update:item', id)
}
</script>

<template>
  <section id="catalog" class="catalog">
    <div
      class="cat-tabs"
      role="tablist"
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

    <p class="cat-desc">{{ t(`categories.${category}.desc`) }}</p>

    <div class="item-tabs" role="tablist">
      <button
        v-for="id in itemIds"
        :key="id"
        type="button"
        role="tab"
        class="item-tab"
        :class="{ active: item === id, soon: ITEMS[id].status === 'soon' }"
        :aria-selected="item === id"
        @click="selectItem(id)"
      >
        {{ t(`items.${id}.title`) }}
        <span class="badge" :class="ITEMS[id].status">{{ t(`status.${ITEMS[id].status}`) }}</span>
      </button>
    </div>

    <div class="panel" :key="item" :style="{ '--accent': meta.accent }">
      <div
        class="copy"
        :style="{
          transform: 'translate3d(calc(var(--mnx) * 10px), calc(var(--mny) * 6px), 0)',
        }"
      >
        <p class="chapter">{{ t(`categories.${category}.chapter`) }}</p>
        <h2>{{ t(`items.${item}.title`) }}</h2>
        <p class="desc">{{ t(`items.${item}.desc`) }}</p>

        <p class="highlights-label">{{ t('catalog.highlights') }}</p>
        <ul class="tag-list">
          <li v-for="tag in tags" :key="tag">{{ tag }}</li>
        </ul>

        <a
          v-if="isLive"
          class="pill"
          :href="meta.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t(`items.${item}.cta`) }}
        </a>
        <button v-else type="button" class="pill pill-muted" disabled>
          {{ t(`items.${item}.cta`) }}
        </button>
      </div>

      <div class="preview" :class="{ soon: !isLive }">
        <LiveVizCanvas :theme="theme" :mode="vizMode" />
        <div class="preview-mask">
          <span>{{ isLive ? t('catalog.previewLive') : t('catalog.previewSoon') }}</span>
          <a
            v-if="isLive"
            class="preview-link"
            :href="meta.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t(`items.${item}.cta`) }}
          </a>
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

.cat-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  margin-bottom: 0.7rem;
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.cat-tab {
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 500;
  cursor: pointer;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.cat-tab:hover {
  color: var(--text-muted);
}

.cat-tab.active {
  color: var(--text);
  border-bottom-color: var(--text);
}

.cat-desc {
  color: var(--text-dim);
  font-size: 0.9rem;
  line-height: 1.55;
  max-width: 40rem;
  margin-bottom: 1.35rem;
}

.item-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.25rem;
  margin-bottom: 2.25rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--border-soft);
}

.item-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: none;
  background: transparent;
  color: var(--text-dim);
  font-size: clamp(0.85rem, 1.4vw, 0.98rem);
  font-weight: 400;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
}

.item-tab:hover {
  color: var(--text-muted);
  transform: translateY(-1px);
}

.item-tab.active {
  color: var(--text);
  font-weight: 600;
}

.item-tab.soon {
  opacity: 0.62;
}

.item-tab.soon.active {
  opacity: 0.85;
}

.badge {
  font-size: 0.68rem;
  font-weight: 500;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: var(--select-bg);
  color: var(--text-muted);
}

.badge.live {
  color: var(--accent, var(--text));
  background: color-mix(in srgb, var(--accent, var(--text)) 16%, transparent);
}

.badge.soon {
  opacity: 0.8;
}

.panel {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: stretch;
  animation: rise 0.45s ease both;
}

.copy {
  transition: transform 0.2s ease-out;
  will-change: transform;
}

.copy .chapter {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-bottom: 0.35rem;
}

.copy h2 {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin-bottom: 1rem;
}

.desc {
  max-width: 34rem;
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.65;
  margin-bottom: 1.25rem;
}

.highlights-label {
  color: var(--text-dim);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.55rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  list-style: none;
  margin: 0 0 1.5rem;
  padding: 0;
}

.tag-list li {
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.8rem;
  background: color-mix(in srgb, var(--bg) 50%, transparent);
}

.pill-muted {
  opacity: 0.55;
  cursor: not-allowed;
}

.preview {
  position: relative;
  min-height: 280px;
  border-radius: var(--radius-card);
  overflow: hidden;
  border: 1px solid var(--border-soft);
  background: color-mix(in srgb, var(--bg-soft) 75%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 14%, transparent);
}

.preview.soon {
  filter: saturate(0.75);
}

.preview-mask {
  position: absolute;
  inset-inline-end: 0.85rem;
  bottom: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
  pointer-events: none;
}

.preview-mask span {
  padding: 0.22rem 0.5rem;
  border-radius: 4px;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  color: var(--text-muted);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.preview-link {
  pointer-events: auto;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: var(--text);
  color: var(--bg);
  font-size: 0.78rem;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.preview-link:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.preview.soon .preview-mask span {
  border-color: var(--border-soft);
  color: var(--text-dim);
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

@media (max-width: 860px) {
  .panel {
    grid-template-columns: 1fr;
  }

  .preview {
    min-height: 220px;
  }
}
</style>
