<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CATEGORIES, ITEMS, getItemsByCategory } from '../data/catalog'
import MagneticCard from './MagneticCard.vue'

const props = defineProps({
  category: { type: String, default: 'tools' },
  item: { type: String, default: 'math' },
})

const emit = defineEmits(['update:category', 'update:item'])

const { t, tm } = useI18n()

const categoryIds = CATEGORIES.map((c) => c.id)

const itemIds = computed(() => getItemsByCategory(props.category))

const meta = computed(() => ITEMS[props.item] ?? ITEMS.math)

const isLive = computed(() => meta.value.status === 'live')

const tags = computed(() => {
  const list = tm(`items.${props.item}.tags`)
  return Array.isArray(list) ? list : []
})

watch(
  () => props.category,
  (cat) => {
    const ids = getItemsByCategory(cat)
    if (!ids.includes(props.item)) {
      emit('update:item', ids[0])
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
        <span class="badge">{{ t(`status.${ITEMS[id].status}`) }}</span>
      </button>
    </div>

    <div class="panel" :key="item">
      <div
        class="copy"
        :style="{
          transform: 'translate3d(calc(var(--mnx) * 10px), calc(var(--mny) * 6px), 0)',
        }"
      >
        <p class="chapter">{{ t(`categories.${category}.chapter`) }}</p>
        <h2>{{ t(`items.${item}.title`) }}</h2>
        <p class="desc">{{ t(`items.${item}.desc`) }}</p>

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

      <div class="cards">
        <MagneticCard
          v-for="(tag, i) in tags"
          :key="tag"
          :href="isLive ? meta.url : null"
          :disabled="!isLive"
          :delay="`${i * 70}ms`"
        >
          <span
            class="icon"
            aria-hidden="true"
            :style="{ color: meta.accent }"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path :d="meta.icon" />
            </svg>
          </span>
          <span class="card-text">
            <strong>{{ tag }}</strong>
            <small>{{ t(`categories.${category}.title`) }}</small>
          </span>
        </MagneticCard>
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
  margin-bottom: 1.25rem;
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
  transition: color 0.2s ease, transform 0.2s ease;
}

.item-tab:hover {
  color: var(--text-muted);
  transform: translateY(-1px);
}

.item-tab.active {
  color: var(--text);
  font-weight: 600;
}

.badge {
  font-size: 0.68rem;
  font-weight: 500;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: var(--select-bg);
  color: var(--text-muted);
}

.item-tab.soon .badge {
  opacity: 0.85;
}

.panel {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: start;
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
  margin-bottom: 1.6rem;
}

.pill-muted {
  opacity: 0.55;
  cursor: not-allowed;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--icon-bg);
  flex-shrink: 0;
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.card-text strong {
  font-size: 1.05rem;
  font-weight: 600;
}

.card-text small {
  color: var(--card-hint);
  font-size: 0.82rem;
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
}
</style>
