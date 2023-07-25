import Editor, { loader } from '@monaco-editor/react'
import { Button, Form, InputNumber, Select, Switch } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useCallback, useContext, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import type { Profile } from '@/hooks/store/storage'
import jsonInit from '@/lib/ai/jsonInit'
import {
  FILE_EXTENSION_LIST,
  MIME_LIST,
  SCHEMA_FOR_JSON_SCHEMA
} from '@/lib/constants/fireBoomConstants'
import { GlobalContext } from '@/lib/context/globalContext'
import { makeSuggest } from '@/lib/helpers/utils'

import styles from './[profile].module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

interface Props {
  storageName: string
  profile: Profile
  onSave: (values: Profile) => void
}

export default function ProfileForm({ storageName, profile, onSave }: Props) {
  const intl = useIntl()
  const { id, profile: profileName } = useParams()
  const [form] = useForm<Profile>()
  const maxAllowedUploadSizeBytes = Form.useWatch('maxAllowedUploadSizeBytes', form)
  const { vscode } = useContext(GlobalContext)
  const reset = useCallback(() => {
    form.setFieldsValue({
      requireAuthentication: profile.requireAuthentication,
      maxAllowedUploadSizeBytes:
        Math.round(((profile.maxAllowedUploadSizeBytes ?? 0) / 1024 / 1024) * 100) / 100,
      allowedMimeTypes: profile.allowedMimeTypes ?? [],
      allowedFileExtensions: profile.allowedFileExtensions ?? [],
      metadataJSONSchema: profile.metadataJSONSchema,
      maxAllowedFiles: profile.maxAllowedFiles,
      hooks: profile.hooks
    })
  }, [profile, form])
  useEffect(() => {
    reset()
  }, [profile, reset])

  return (
    <Form
      className="common-form overflow-auto"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 12 }}
      form={form}
      onFinish={async values => {
        if (
          values?.hooks?.preUpload &&
          !(await vscode.checkHookExist(`uploads/${storageName}/${profileName}/preUpload`))
        ) {
          return
        }
        if (
          values?.hooks?.postUpload &&
          !(await vscode.checkHookExist(`uploads/${storageName}/${profileName}/postUpload`))
        ) {
          return
        }
        onSave({
          ...values,
          maxAllowedUploadSizeBytes: Math.round(values.maxAllowedUploadSizeBytes * 1024 * 1024)
        })
      }}
    >
      <Form.Item
        name="requireAuthentication"
        label={intl.formatMessage({ defaultMessage: '匿名访问' })}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
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
        tooltip={intl.formatMessage({ defaultMessage: '仅SDK限制，输入-1禁用限制' })}
        label={intl.formatMessage({ defaultMessage: '文件数量限制' })}
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
            jsonInit(monaco)
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
            makeSuggest(editor)
            // editor.setPosition({ lineNumber: 1, column: 1 })
            editor.focus()
            editor.trigger('', 'editor.action.inlineSuggest.trigger', '')
            editor.setValue(form.getFieldValue('metadataJSONSchema'))
          }}
        />
      </Form.Item>

      <Form.Item label={intl.formatMessage({ defaultMessage: '前置钩子' })}>
        <div className="flex items-center">
          <Form.Item noStyle valuePropName="checked" name={['hooks', 'preUpload']}>
            <Switch />
          </Form.Item>
          <span
            className="ml-10 text-[#4C7BFE] cursor-pointer"
            onClick={() => vscode.show(`uploads/${storageName}/${profileName}/preUpload`)}
          >
            编辑
          </span>
        </div>
      </Form.Item>
      <Form.Item
        name={['hooks', 'postUpload']}
        label={intl.formatMessage({ defaultMessage: '后置钩子' })}
      >
        <div className="flex items-center">
          <Form.Item noStyle valuePropName="checked" name={['hooks', 'postUpload']}>
            <Switch />
          </Form.Item>
          <span
            className="ml-10 text-[#4C7BFE] cursor-pointer"
            onClick={() => vscode.show(`uploads/${storageName}/${profileName}/postUpload`)}
          >
            编辑
          </span>
        </div>
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
