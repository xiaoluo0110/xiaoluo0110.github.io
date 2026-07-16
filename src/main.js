import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { messages } from './i18n/messages'
import './styles/main.css'

const savedLocale = localStorage.getItem('locale') || 'zh'

document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = savedLocale

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
})

createApp(App).use(i18n).mount('#app')
