import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn'

import { SettingOutlined } from '@ant-design/icons'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ImageInsert } from '@ckeditor/ckeditor5-image'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload'
import type { InputProps } from 'antd'
import { Dropdown, Input } from 'antd'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

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
        <Input.TextArea {...props} onChange={e => props.onChange?.(e.target.value)} />
      ) : (
        <div className="min-w-0 w-full">
          <CKEditor
            disabled={props.disabled}
            disableWatchdog
            config={{
              plugins: [Base64UploadAdapter, ImageInsert],
              language: locale === 'zh-CN' ? 'zh-cn' : undefined
            }}
            editor={ClassicEditor}
            data={props.value}
            onChange={(event, editor) => {
              props.onChange?.(editor.data.get())
            }}
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
