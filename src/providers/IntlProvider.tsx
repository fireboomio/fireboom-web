import type { ReactNode } from 'react'
import { createContext, useEffect, useState } from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'

interface IntlProviderProps {
  children?: ReactNode
}

function loadLangs(lang: string) {
  return window.fetch(`/lang/${lang}.json`).then(resp => resp.json())
}

const LOCALE_STORE_KEY = 'user.locale'

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
  const browserLanguage = window.navigator.language
  const [locale, setLocale] = useState(
    localStorage.getItem(LOCALE_STORE_KEY) || browserLanguage || 'en'
  )
  const [messages, setMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (locale) {
      loadLangs(locale).then(json => {
        setMessages(json)
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
          {children}
        </ReactIntlProvider>
      )}
    </IntlContext.Provider>
  )
}

export default IntlProvider
