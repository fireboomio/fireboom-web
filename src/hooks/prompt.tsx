import type { InputRef } from 'antd'
import { App, Input, message } from 'antd'
import { useRef } from 'react'
import { useIntl } from 'react-intl'

import type { Validator } from '@/hooks/validate'

interface PromptOptions {
  title: string
  validator?: Validator
}

export function usePrompt(): (
  options: PromptOptions
) => Promise<{ confirm: boolean; value?: string }> {
  const { modal } = App.useApp()
  const intl = useIntl()
  const inputRef = useRef<InputRef>(null)
  return async (options: PromptOptions) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => inputRef.current?.focus?.(), 100)
      let value = ''
      const { destroy } = modal.confirm({
        title: options.title,
        content: (
          <Input
            ref={inputRef}
            autoFocus
            onChange={e => {
              value = e.target.value
            }}
            placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
          />
        ),
        onOk: () => {
          resolve({ confirm: true, value })
        },
        onCancel: () => {
          resolve({ confirm: false })
        },
        okButtonProps: {
          onClick: () => {
            if (options.validator) {
              const error = options.validator(value)
              if (error) {
                message.error(error)
                return
              }
            }
            destroy()
            resolve({ confirm: true, value })
          }
        }
      })
    })
  }
}
