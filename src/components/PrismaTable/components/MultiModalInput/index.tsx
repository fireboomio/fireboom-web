import { SettingOutlined } from '@ant-design/icons'
import type { InputProps } from 'antd'
import { Dropdown, Input } from 'antd'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import RichTextInput from '@/components/RichTextInput'
import { useAppIntl } from '@/providers/IntlProvider'

interface MultiModalInputProps
  extends Pick<InputProps, 'autoFocus' | 'placeholder' | 'className' | 'disabled'> {
  value?: string
  onChange?: (value: string) => void
}

enum Modal {
  Simple,
  TextArea,
  RichText
}

const MultiModalInput = (props: MultiModalInputProps) => {
  const [modal, setModal] = useState(Modal.Simple)
  const { locale } = useAppIntl()

  return (
    <div className="flex items-start">
      {modal === Modal.Simple ? (
        <Input {...props} onChange={e => props.onChange?.(e.target.value)} />
      ) : modal === Modal.TextArea ? (
        <Input.TextArea
          {...props}
          onChange={e => props.onChange?.(e.target.value)}
          autoSize={{
            minRows: 3,
            maxRows: 10
          }}
        />
      ) : (
        <div className="min-w-0 w-full">
          <RichTextInput
            disabled={props.disabled}
            language={locale === 'zh-CN' ? 'zh-cn' : undefined}
            value={props.value}
            onChange={props.onChange}
          />
        </div>
      )}
      <Dropdown
        menu={{
          items: [
            {
              key: Modal.Simple,
              label: <FormattedMessage defaultMessage="单行文本" />,
              className: modal === Modal.Simple ? 'bg-gray-300' : '',
              onClick: () => setModal(Modal.Simple)
            },
            {
              key: Modal.TextArea,
              label: <FormattedMessage defaultMessage="多行文本" />,
              className: modal === Modal.TextArea ? 'bg-gray-300' : '',
              onClick: () => setModal(Modal.TextArea)
            },
            {
              key: Modal.RichText,
              label: <FormattedMessage defaultMessage="富文本" />,
              className: modal === Modal.RichText ? 'bg-gray-300' : '',
              onClick: () => setModal(Modal.RichText)
            }
          ]
        }}
      >
        <SettingOutlined className="ml-2 mt-2.5 no-shrink" />
      </Dropdown>
    </div>
  )
}

export default MultiModalInput
