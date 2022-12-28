import { ConfigProvider } from 'antd'
import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useState } from 'react'
import { createIntl, createIntlCache, IntlProvider as ReactIntlProvider } from 'react-intl'

interface IntlProviderProps {
  children?: ReactNode
}

function loadLangs(lang: string) {
  return window.fetch(`/lang/${lang}.json`).then(resp => resp.json())
}

const LOCALE_STORE_KEY = 'user.locale'
const browserLanguage = window.navigator.language
const defaultLocale = localStorage.getItem(LOCALE_STORE_KEY) || browserLanguage || 'en'

console.log('defaultLocale', defaultLocale)

// This is optional but highly recommended
// since it prevents memory leak
const cache = createIntlCache()
let _locale: string = defaultLocale
let _messages: Record<string, string> = {}

export const intl = createIntl(
  {
    locale: _locale,
    messages: _messages,
    defaultLocale
  },
  cache
)

export type IntlState = {
  locale: string
  setLocale: (locale: string) => void
  messages: Record<string, string>
}

const IntlContext = createContext<IntlState>(
  // @ts-ignore
  null
)

const IntlProvider = ({ children }: IntlProviderProps) => {
  const [locale, _setLocale] = useState(defaultLocale)
  const [messages, setMessages] = useState<Record<string, string>>({})

  const setLocale = useCallback((locale: string) => {
    _setLocale(locale)
    _locale = locale
  }, [])

  useEffect(() => {
    if (locale) {
      loadLangs(locale).then(json => {
        setMessages(json)
        _messages = json
      })
    }
  }, [locale])

  return (
    <IntlContext.Provider
      value={{
        locale,
        setLocale,
        messages
      }}
    >
      {messages && (
        <ReactIntlProvider messages={messages} locale={locale} defaultLocale={browserLanguage}>
          <ConfigProvider
            locale={{
              locale
            }}
          >
            {children}
          </ConfigProvider>
        </ReactIntlProvider>
      )}
    </IntlContext.Provider>
  )
}

export default IntlProvider
