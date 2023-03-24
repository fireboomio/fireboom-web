import Editor, { loader } from '@monaco-editor/react'
import { Button, Form, InputNumber, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import type { Profile } from '@/hooks/store/storage'
import {
  FILE_EXTENSION_LIST,
  MIME_LIST,
  SCHEMA_FOR_JSON_SCHEMA
} from '@/lib/constants/fireBoomConstants'
import { isInputKey } from '@/lib/helpers/utils'

import styles from './[profile].module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

interface Props {
  profile: Profile
  onSave: (values: any) => void
}

export default function ProfileForm({ profile, onSave }: Props) {
  const intl = useIntl()
  const [form] = useForm()
  const maxAllowedUploadSizeBytes = Form.useWatch('maxAllowedUploadSizeBytes', form)
  const reset = () => {
    form.setFieldsValue({
      maxAllowedUploadSizeBytes:
        Math.round(((profile.maxAllowedUploadSizeBytes ?? 0) / 1024 / 1024) * 100) / 100,
      allowedMimeTypes: profile.allowedMimeTypes ?? [],
      allowedFileExtensions: profile.allowedFileExtensions ?? [],
      metadataJSONSchema: profile.metadataJSONSchema,
      maxAllowedFiles: profile.maxAllowedFiles
    })
  }
  useEffect(() => {
    reset()
  }, [profile])

  return (
    <Form
      className="common-form"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 12 }}
      form={form}
      onFinish={values => {
        onSave({
          ...values,
          maxAllowedUploadSizeBytes: Math.round(values.maxAllowedUploadSizeBytes * 1024 * 1024)
        })
      }}
    >
      <Form.Item
        tooltip={intl.formatMessage({ defaultMessage: '输入-1禁用限制' })}
        label={intl.formatMessage({ defaultMessage: '最大尺寸' })}
      >
        <div className="flex items-center">
          <Form.Item noStyle name="maxAllowedUploadSizeBytes">
            <InputNumber
              style={{ width: 200 }}
              addonAfter="M"
              max={1024}
              min={-1}
              placeholder={intl.formatMessage({ defaultMessage: '输入数值不大于1024M' })}
            />
          </Form.Item>
          <span className="ml-2 text-[#999]">
            {Math.round(maxAllowedUploadSizeBytes * 1024 * 1024)} Bytes
          </span>
        </div>
      </Form.Item>
      <Form.Item
        tooltip={intl.formatMessage({ defaultMessage: '输入-1禁用限制' })}
        label={intl.formatMessage({ defaultMessage: '文件数量' })}
        name="maxAllowedFiles"
      >
        <InputNumber
          style={{ width: 200 }}
          max={50}
          min={-1}
          placeholder={intl.formatMessage({ defaultMessage: '输入数值不大于50' })}
        />
      </Form.Item>
      <Form.Item label={intl.formatMessage({ defaultMessage: '文件类型' })} name="allowedMimeTypes">
        <Select
          mode="tags"
          options={MIME_LIST.map(x => ({
            label: x,
            value: x
          }))}
        />
      </Form.Item>
      <Form.Item
        label={intl.formatMessage({ defaultMessage: '文件后缀' })}
        name="allowedFileExtensions"
      >
        <Select
          mode="tags"
          options={FILE_EXTENSION_LIST.map(x => ({
            label: x,
            value: x
          }))}
        />
      </Form.Item>
      <Form.Item label={intl.formatMessage({ defaultMessage: 'META' })} name="metadataJSONSchema">
        <Editor
          options={{
            fixedOverflowWidgets: true,
            minimap: { enabled: false },
            lineNumbers: 'off'
          }}
          className={styles.editor}
          defaultLanguage="json"
          defaultPath="profile.json"
          onChange={v => {
            form.setFieldValue('metadataJSONSchema', v)
          }}
          beforeMount={monaco => {
            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              schemas: [
                {
                  uri: 'profile.json',
                  fileMatch: ['profile.json'],
                  schema: SCHEMA_FOR_JSON_SCHEMA
                }
              ]
            })
            const uri = monaco.Uri.parse('profile.json')
            // 如果已经有重名model则释放
            monaco.editor.getModel(uri)?.dispose()
            // 创建model
            monaco.editor.createModel('', 'json', uri)
          }}
          onMount={editor => {
            editor.onKeyUp(e => {
              if (isInputKey(e.keyCode)) {
                // editor.trigger('', 'editor.action.triggerSuggest', '')
              }
            })
          }}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 12 }}>
        <Button className={'btn-cancel mr-4'} onClick={reset}>
          <FormattedMessage defaultMessage="取消" />
        </Button>
        <Button
          className={'btn-save'}
          onClick={() => {
            form.submit()
          }}
        >
          <FormattedMessage defaultMessage="保存" />
        </Button>
      </Form.Item>
    </Form>
  )
}
