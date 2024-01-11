import 'i18next'
import { resources, defaultNS } from '@/i18n'

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: typeof defaultNS
    // custom resources type
    resources: (typeof resources)['vi']
    // other
  }
}
