import { FullscreenExitOutlined, FullscreenOutlined, SettingOutlined } from '@ant-design/icons'
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
  const [modal, setModal] = useState(() => {
    const value = props.value
    if (!value) {
      return Modal.Simple
    }
    if (/<[^>]+>/g.test(value)) {
      return Modal.RichText
    }
    if (/\n/g.test(value)) {
      return Modal.TextArea
    }
    return Modal.Simple
  })
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { locale } = useAppIntl()

  function enterFullScreen() {
    const $editor = document.querySelector<HTMLDivElement>('.multi-modal-rich-text .ck-editor')
    if ($editor) {
      $editor.style.width = '90vw'
      $editor.style.transform = `translateX(-30vw)`
      setIsFullScreen(true)
    }
  }

  function leaveFullScreen() {
    const $editor = document.querySelector<HTMLDivElement>('.multi-modal-rich-text .ck-editor')
    if ($editor) {
      $editor.style.width = ''
      $editor.style.transform = ''
    }
    setIsFullScreen(false)
  }

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
        <div className="min-w-0 w-full multi-modal-rich-text">
          <RichTextInput
            className=""
            disabled={props.disabled}
            language={locale === 'zh-CN' ? 'zh-cn' : undefined}
            value={props.value}
            onChange={props.onChange}
          />
          {isFullScreen && (
            <FullscreenExitOutlined
              className="cursor-pointer"
              onClick={leaveFullScreen}
              style={{
                position: 'absolute',
                right: 'calc(-30vw + 12px)',
                top: '12px',
                zIndex: 100
              }}
            />
          )}
        </div>
      )}
      <div className="mt-2 5 ml-2 no-shrink">
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
          <SettingOutlined />
        </Dropdown>
        {modal === Modal.RichText && (
          <FullscreenOutlined className="mt-3 cursor-pointer" onClick={enterFullScreen} />
        )}
      </div>
    </div>
  )
}

export default MultiModalInput
