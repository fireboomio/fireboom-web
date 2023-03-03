import { useMemo } from 'react'
import { useIntl } from 'react-intl'

export default function ApiEmpty() {
  const intl = useIntl()
  const hotkeys = useMemo(
    () => [
      {
        keys: ['alt/^', 'h'],
        desc: intl.formatMessage({ defaultMessage: '打开快捷键提示' })
      },
      {
        keys: ['alt/^', 'b'],
        desc: intl.formatMessage({ defaultMessage: '批量新建API' })
      },
      {
        keys: ['alt/^', 'm'],
        desc: intl.formatMessage({ defaultMessage: '切换API设计和模型设计' })
      },
      {
        keys: ['ctrl/^', 'k'],
        desc: intl.formatMessage({ defaultMessage: '搜索API' })
      }
    ],
    [intl]
  )
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      {hotkeys.map((item, index) => (
        <div key={item.desc} className="w-full flex mt-6">
          <div className="text-right w-1/2 mr-3">
            {item.keys.map(key => (
              <span
                key={key}
                className="ml-1 px-2 py-1 rounded-4px bg-[#f4f4f4] border border-solid border-[#e8e8e8]"
              >
                {key}
              </span>
            ))}
          </div>
          <div className="text-[#757575]">{item.desc}</div>
        </div>
      ))}
    </div>
  )
}
