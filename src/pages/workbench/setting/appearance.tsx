import { Radio } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { useConfigContext } from '@/lib/context/ConfigContext'
import { useAppIntl } from '@/providers/IntlProvider'

export default function SettingMainAppearance() {
  const intl = useIntl()
  const { locale, setLocale } = useAppIntl()
  const { updateGlobalSetting } = useConfigContext()

  return (
    <>
      <div className="py-4 px-6">
        <div className="mt-4 text-medium text-lg py-4">
          <FormattedMessage defaultMessage="语言" />
        </div>
        <Radio.Group
          value={locale}
          onChange={e => {
            const locale = e.target.value
            setLocale(locale)
            updateGlobalSetting({ appearance: { language: locale.replace(/-/g, '_') } })
          }}
        >
          <Radio className="min-w-30" value="zh-CN">
            {intl.formatMessage({ defaultMessage: '中文' })}
          </Radio>
          <Radio className="min-w-30" value="en">
            English
          </Radio>
        </Radio.Group>
      </div>
    </>
  )
}
