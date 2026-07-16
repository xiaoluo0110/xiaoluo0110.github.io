import { ref, watch, onMounted } from 'vue'

export const THEMES = ['dark', 'light', 'campus', 'children', 'tech']

const theme = ref('dark')

export function useTheme() {
  const applyTheme = (value) => {
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem('theme', value)
  }

  const setTheme = (value) => {
    if (THEMES.includes(value)) {
      theme.value = value
    }
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')
    if (THEMES.includes(saved)) {
      theme.value = saved
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      theme.value = 'light'
    }
    applyTheme(theme.value)
  })

  watch(theme, (value) => applyTheme(value))

  return { theme, setTheme, themes: THEMES }
}
