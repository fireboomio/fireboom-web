import { Divider, Image, Radio } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { useAppIntl } from '@/providers/IntlProvider'

// import styles from './components/subs/subs.module.less'

export default function SettingMainAppearance() {
  const intl = useIntl()
  const { locale, setLocale } = useAppIntl()

  return (
    <>
      <div className="py-4 px-6">
        {/* <div className="text-medium text-lg py-4">
          <FormattedMessage defaultMessage="外观" />
        </div>
        <div className={`${styles['picture-box']} flex`}>
          <div>
            <Image src="/assets/system.svg" alt="图片不见了" />
            <div className="mt-2 text-center text-14px leading-5">
              {intl.formatMessage({ defaultMessage: '系统' })}
            </div>
          </div>
          <div className="ml-9">
            <Image src="/assets/light.svg" alt="图片不见了" />
            <div className="mt-2 text-center text-14px leading-5">
              {intl.formatMessage({ defaultMessage: '亮色' })}
            </div>
          </div>
          <div className="ml-9">
            <Image src="/assets/dark.svg" alt="图片不见了" />
            <div className="mt-2 text-center text-14px leading-5">
              {intl.formatMessage({ defaultMessage: '暗色' })}
            </div>
          </div>
          <div className="ml-9">
            <Image src="/assets/black.svg" alt="图片不见了" />
            <div className="mt-2 text-center text-14px leading-5">
              {intl.formatMessage({ defaultMessage: '黑色' })}
            </div>
          </div>
        </div>
        <Divider /> */}
        <div className="mt-4 text-medium text-lg py-4">
          <FormattedMessage defaultMessage="语言" />
        </div>
        <Radio.Group value={locale} onChange={e => setLocale(e.target.value)}>
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
