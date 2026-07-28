<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme, THEMES } from '../composables/useTheme'
import { CATALOG_NAV_IDS } from '../data/catalog'

defineProps({
  active: { type: String, default: 'home' },
})

const { t, locale } = useI18n()
const { theme, setTheme } = useTheme()

const emit = defineEmits(['navigate'])

const openMenu = ref(null)
const menusRoot = ref(null)

const langs = [
  { value: 'zh', label: '中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'th', label: 'ไทย' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'ms', label: 'Bahasa Melayu' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
]

function applyDocumentDir(value) {
  document.documentElement.dir = value === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = value
}

const links = [
  { id: 'home', labelKey: 'nav.home' },
  { id: 'featured', labelKey: 'nav.featured' },
  { id: 'tools', labelKey: 'nav.tools' },
  { id: 'spatial', labelKey: 'nav.spatial' },
  { id: 'scenarios', labelKey: 'nav.scenarios' },
  { id: 'about', labelKey: 'nav.about' },
]

const contacts = [
  { key: 'qq', value: '1211571826', href: null },
  { key: 'email', value: '1211571826@qq.com', href: 'mailto:1211571826@qq.com' },
  { key: 'douyin', value: '5173372329294', href: null },
  { key: 'twitter', value: 'Debbie12115', href: 'https://x.com/Debbie12115' },
]

const themeLabel = computed(() => t(`theme.${theme.value}`))
const langLabel = computed(() => langs.find((l) => l.value === locale.value)?.label ?? '中文')

function toggleMenu(id) {
  openMenu.value = openMenu.value === id ? null : id
}

function pickTheme(id) {
  setTheme(id)
  openMenu.value = null
}

function pickLang(value) {
  locale.value = value
  localStorage.setItem('locale', value)
  applyDocumentDir(value)
  openMenu.value = null
}

function onDocClick(e) {
  if (!menusRoot.value) return
  if (!menusRoot.value.contains(e.target)) {
    openMenu.value = null
  }
}

onMounted(() => {
  applyDocumentDir(locale.value)
  document.addEventListener('click', onDocClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
})
</script>

<template>
  <header class="header">
    <nav class="nav-left" aria-label="Primary">
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${CATALOG_NAV_IDS.includes(link.id) ? 'catalog' : link.id}`"
        class="nav-link"
        :class="{ active: active === link.id }"
        @click.prevent="emit('navigate', link.id)"
      >
        {{ t(link.labelKey) }}
      </a>
    </nav>

    <div ref="menusRoot" class="nav-right">
      <div class="menu">
        <button
          type="button"
          class="menu-btn"
          :aria-expanded="openMenu === 'theme'"
          @click.stop="toggleMenu('theme')"
        >
          {{ themeLabel }}
          <span class="caret" aria-hidden="true">▾</span>
        </button>
        <div v-if="openMenu === 'theme'" class="menu-panel" role="listbox">
          <button
            v-for="id in THEMES"
            :key="id"
            type="button"
            class="menu-item"
            :class="{ active: theme === id }"
            role="option"
            :aria-selected="theme === id"
            @click="pickTheme(id)"
          >
            {{ t(`theme.${id}`) }}
          </button>
        </div>
      </div>

      <div class="menu">
        <button
          type="button"
          class="menu-btn"
          :aria-expanded="openMenu === 'lang'"
          @click.stop="toggleMenu('lang')"
        >
          {{ langLabel }}
          <span class="caret" aria-hidden="true">▾</span>
        </button>
        <div v-if="openMenu === 'lang'" class="menu-panel" role="listbox">
          <button
            v-for="lang in langs"
            :key="lang.value"
            type="button"
            class="menu-item"
            :class="{ active: locale === lang.value }"
            role="option"
            :aria-selected="locale === lang.value"
            @click="pickLang(lang.value)"
          >
            {{ lang.label }}
          </button>
        </div>
      </div>

      <div class="menu">
        <button
          type="button"
          class="menu-btn"
          :aria-expanded="openMenu === 'contact'"
          @click.stop="toggleMenu('contact')"
        >
          {{ t('contact.label') }}
        </button>
        <div v-if="openMenu === 'contact'" class="menu-panel contact-panel" role="menu">
          <p class="contact-name">{{ t('contact.name') }}</p>
          <a
            v-for="item in contacts"
            :key="item.key"
            class="contact-item"
            :href="item.href || undefined"
            :role="item.href ? 'menuitem' : undefined"
            @click="!item.href && $event.preventDefault()"
          >
            <span class="k">{{ t(`contact.${item.key}`) }}</span>
            <span class="v">{{ item.value }}</span>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem clamp(1.2rem, 4vw, 3rem);
  background: linear-gradient(to bottom, var(--header-bg), transparent);
  backdrop-filter: blur(8px);
}

.nav-left {
  display: flex;
  gap: 1.15rem;
  flex-wrap: wrap;
}

.nav-link {
  position: relative;
  color: var(--nav);
  font-size: 0.92rem;
  font-weight: 400;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--nav-active);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.35rem;
  height: 1.5px;
  background: var(--nav-active);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
}

.menu {
  position: relative;
}

.menu-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  background: var(--select-bg);
  color: var(--text);
  font-size: 0.88rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.menu-btn:hover,
.menu-btn[aria-expanded='true'] {
  border-color: var(--accent);
}

.caret {
  font-size: 0.7rem;
  opacity: 0.7;
}

.menu-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  inset-inline-end: 0;
  min-width: 148px;
  max-height: min(70vh, 420px);
  overflow-y: auto;
  padding: 0.4rem;
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  background: var(--bg);
  color: var(--text);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.28);
  z-index: 30;
}

.menu-item {
  display: block;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text);
  font-size: 0.88rem;
  text-align: start;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.menu-item:hover {
  background: var(--select-bg);
}

.menu-item.active {
  background: color-mix(in srgb, var(--accent) 22%, transparent);
  color: var(--text);
  font-weight: 600;
}

.contact-panel {
  min-width: 240px;
  padding: 0.85rem 0.95rem;
}

.contact-name {
  margin-bottom: 0.7rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--border-soft);
  font-weight: 600;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  padding: 0.45rem 0;
  color: var(--text);
}

.contact-item .k {
  color: var(--text-dim);
  font-size: 0.72rem;
  letter-spacing: 0.04em;
}

.contact-item .v {
  font-size: 0.9rem;
  word-break: break-all;
}

.contact-item[href]:hover .v {
  color: var(--accent);
}

@media (max-width: 720px) {
  .nav-left {
    gap: 0.7rem;
  }

  .nav-link {
    font-size: 0.78rem;
  }

  .menu-btn {
    font-size: 0.78rem;
    padding: 0.4rem 0.75rem;
  }
}
</style>
