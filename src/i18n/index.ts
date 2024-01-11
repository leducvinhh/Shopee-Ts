import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import PRODUCT_VI from '@/locales/vi/product.json'
import PRODUCT_EN from '@/locales/en/product.json'
import HOME_VI from '@/locales/vi/home.json'
import HOME_EN from '@/locales/en/home.json'

export const resources = {
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI
  },
  en: {
    home: HOME_EN,
    product: PRODUCT_EN
  }
} as const

export const defaultNS = 'home'

i18n.use(initReactI18next).init({
  ns: ['product', 'home'],
  resources,
  defaultNS,
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
