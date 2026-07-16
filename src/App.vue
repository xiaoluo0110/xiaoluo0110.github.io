<script setup>
import { ref, watch } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import ParticleCanvas from './components/ParticleCanvas.vue'
import HeroSection from './components/HeroSection.vue'
import FeaturedCarousel from './components/FeaturedCarousel.vue'
import CatalogSection from './components/CatalogSection.vue'
import AboutSection from './components/AboutSection.vue'
import { useTheme } from './composables/useTheme'
import { useMouse } from './composables/useMouse'
import { ITEMS, CATALOG_NAV_IDS } from './data/catalog'

const { theme } = useTheme()
useMouse()

const activeCategory = ref('tools')
const activeItem = ref('math')
const activeNav = ref('home')

const orbs = [
  { x: 18, y: 28, size: 140, speed: 1, color: 'rgba(94, 183, 183, 0.2)' },
  { x: 72, y: 22, size: 180, speed: 1.4, color: 'rgba(232, 168, 124, 0.16)' },
  { x: 58, y: 68, size: 220, speed: 0.8, color: 'rgba(133, 193, 233, 0.14)' },
]

function onNavigate(target) {
  if (target === 'focus') {
    activeNav.value = 'home'
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  activeNav.value = target

  if (CATALOG_NAV_IDS.includes(target)) {
    activeCategory.value = target
    const first = Object.keys(ITEMS).find((k) => ITEMS[k].category === target)
    if (first) activeItem.value = first
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }

  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function startExplore() {
  onNavigate('featured')
}

function goAbout() {
  onNavigate('about')
}

function onFocusSelect(categoryId) {
  onNavigate(categoryId)
}

watch(activeCategory, (cat) => {
  if (CATALOG_NAV_IDS.includes(activeNav.value)) {
    activeNav.value = cat
  }
})
</script>

<template>
  <div class="page">
    <ParticleCanvas :theme="theme" />
    <div class="vignette" aria-hidden="true" />

    <div class="orb-layer" aria-hidden="true">
      <span
        v-for="(orb, i) in orbs"
        :key="i"
        class="orb"
        :style="{
          left: `${orb.x}%`,
          top: `${orb.y}%`,
          width: `${orb.size}px`,
          height: `${orb.size}px`,
          background: orb.color,
          transform: `translate3d(calc(var(--mnx) * ${-22 * orb.speed}px), calc(var(--mny) * ${-16 * orb.speed}px), 0)`,
        }"
      />
    </div>

    <SiteHeader :active="activeNav" @navigate="onNavigate" />

    <main>
      <HeroSection
        @explore="startExplore"
        @about="goAbout"
        @select="onFocusSelect"
      />

      <FeaturedCarousel />

      <CatalogSection
        v-model:category="activeCategory"
        v-model:item="activeItem"
      />

      <AboutSection />
    </main>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  background: var(--bg);
  overflow: hidden;
}

.vignette {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 55% at 58% 40%, transparent 0%, var(--bg) 78%),
    linear-gradient(180deg, transparent 55%, var(--bg) 100%);
  opacity: 0.92;
}

.orb-layer {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(28px);
  transition: transform 0.25s ease-out;
  will-change: transform;
}

main {
  position: relative;
  z-index: 2;
}
</style>
