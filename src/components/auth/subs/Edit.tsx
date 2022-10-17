/* eslint-disable camelcase */
import Editor, { loader } from '@monaco-editor/react'
import { Button, Checkbox, Divider, Form, Input, Radio } from 'antd'
import type { ReactNode } from 'react'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import type { AuthProvResp } from '@/interfaces/auth'
import { AuthDispatchContext, AuthToggleContext } from '@/lib/context/auth-context'
import requests from '@/lib/fetchers'

import styles from './subs.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

interface Props {
  content: AuthProvResp
  onChange: (content: AuthProvResp) => void
}

type Config = Record<string, ReactNode>

type FromValues = Record<string, number | string | readonly string[] | undefined>

const options = [
  { label: '基于Cookie', value: 'cookieBased' },
  { label: '基于Token', value: 'tokenBased' }
]

export default function AuthMainEdit({ content, onChange }: Props) {
  const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  const dispatch = useContext(AuthDispatchContext)
  const [form] = Form.useForm()
  const [value, setValue] = useImmer('')
  const config = content.config as unknown as Config
  const [isRadioShow, setIsRadioShow] = useImmer(config.jwks == 1)
  const [disabled, setDisabled] = useImmer(false)
  const [inputValue, setInputValue] = useImmer(
    '' as string | number | readonly string[] | undefined
  )

  if (!content) {
    return <Error50x />
  }
  const onFinish = async (values: FromValues) => {
    const newValues = { ...config, ...values }
    const newContent = { ...content, switchState: values.switchState, name: values.id }
    if (content.name == '') {
      const req = { ...newContent, config: newValues }
      Reflect.deleteProperty(req, 'id')
      const result = await requests.post<unknown, number>('/auth', req)
      content.id = result
    } else {
      await requests.put('/auth', {
        ...newContent,
        config: newValues
      })
    }
    void requests
      .get<unknown, AuthProvResp[]>('/auth')
      .then(res => {
        onChange(res.filter(row => row.id === content.id)[0])
      })
      .then(() => {
        handleBottomToggleDesigner('data', content.id)
      })
  }

  const typeChange = (value: string) => {
    setValue(value)
    setIsRadioShow(value == '1')
  }

  const onValuesChange = (changedValues: object, allValues: FromValues) => {
    setInputValue(allValues.issuer)
    for (const key in allValues) {
      if ((allValues[key] as string) == undefined) {
        setDisabled(true)
        return
      }
    }
    setDisabled(false)
  }

  const initialValues = content.name
    ? {
        id: config.id,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        issuer: config.issuer,
        jwks: config.jwks,
        jwksJSON: config.jwksJSON,
        switchState: content.switchState
      }
    : {
        id: '',
        clientId: '',
        clientSecret: '',
        issuer: '',
        jwks: 0,
        jwksJSON: '',
        switchState: []
      }

  return (
    <>
      <div className="pb-3 flex items-center justify-between border-gray border-b">
        {content.name == '' ? (
          <div className="h-7">
            <span className="ml-2 font-bold">
              系统默认 <span className="text-xs text-gray-500/80">openid</span>
            </span>
          </div>
        ) : (
          <div className="h-7">
            <span className="ml-2 font-bold">
              {content.name}
              <span className="text-xs text-gray-500/80">{content.authSupplier}</span>
            </span>
          </div>
        )}
        <div className="flex justify-center items-center">
          <Divider type="vertical" />
          <Button
            className={styles['center-btn']}
            onClick={() => {
              handleBottomToggleDesigner('data', content.id)
            }}
          >
            <span>取消</span>
          </Button>
          <Button
            disabled={disabled}
            className={styles['save-btn']}
            onClick={() => {
              form.submit()
            }}
          >
            {content.name == '' ? '创建' : '保存'}
          </Button>
        </div>
      </div>
      <div className={`${styles['db-check-setting']}  mt-2 cursor-pointer`}>
        <span className=" w-19 h-5 float-right">{/* 前往管理 <RightOutlined /> */}</span>
      </div>
      <div className={`${styles['edit-form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          form={form}
          style={{ width: '90%' }}
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 11 }}
          onFinish={values => {
            void onFinish(values)
          }}
          onValuesChange={onValuesChange}
          autoComplete="new-password"
          validateTrigger="onBlur"
          labelAlign="left"
          initialValues={initialValues}
        >
          <Form.Item
            label="供应商ID"
            name="id"
            rules={[
              { required: true, message: '供应商ID不能为空' },
              {
                pattern: new RegExp('^\\w+$', 'g'),
                message: '只允许包含字母，数字，下划线'
              }
            ]}
          >
            <Input placeholder="请输入..." autoComplete="off" autoFocus={true} />
          </Form.Item>
          <Form.Item
            label="App ID"
            name="clientId"
            rules={[
              { required: true, message: 'App ID不能为空' },
              {
                pattern: new RegExp('^\\w+$', 'g'),
                message: '只允许包含字母，数字，下划线'
              }
            ]}
          >
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item
            label="App Secret"
            name="clientSecret"
            rules={[
              { required: true, message: 'App Secret不能为空' },
              {
                pattern: new RegExp('^\\w+$', 'g'),
                message: '只允许包含字母，数字，下划线'
              }
            ]}
          >
            <Input.Password placeholder="请输入..." />
          </Form.Item>
          <Form.Item
            label="Issuer"
            name="issuer"
            rules={[
              { required: true, message: 'Issuer不能为空' },
              {
                pattern: /^https?:\/\/[.\w\d/]+$/,
                message: '只允许输入链接'
              }
            ]}
          >
            <Input placeholder="请输入..." value={inputValue} />
          </Form.Item>
          <Form.Item label="服务发现地址">
            <Input value={`${inputValue as string}/.well-known/openid-configuration`} disabled />
          </Form.Item>
          <Form.Item label="JWKS" name="jwks">
            <Radio.Group
              onChange={e => {
                typeChange(e.target.value as string)
              }}
              value={value}
            >
              <Radio value={0}>URL</Radio>
              <Radio value={1}>JSON</Radio>
            </Radio.Group>
          </Form.Item>
          {isRadioShow ? (
            <Form.Item label="jwksJSON" name="jwksJSON">
              <Editor
                height="20vh"
                defaultLanguage="typescript"
                defaultValue="// some comment"
                className={styles['monaco-edit']}
              />
            </Form.Item>
          ) : (
            <Form.Item label="jwksURL">
              <Input
                disabled
                value={`${inputValue as string}/.well-known/jwks.json`}
                suffix="浏览"
              />
            </Form.Item>
          )}
          <Form.Item label="用户端点">
            <Input disabled value={`${inputValue as string}/me`} />
          </Form.Item>
          <Form.Item label="是否开启" name="switchState">
            <Checkbox.Group options={options} />
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
