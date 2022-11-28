/* eslint-disable camelcase */
import { loader } from '@monaco-editor/react'
import { Button, Checkbox, Form, Input, Radio } from 'antd'
import axios from 'axios'
import type { ReactNode } from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import ReactJson from 'react-json-view'
import { useNavigate } from 'react-router-dom'
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
  onTest: () => void
}

type Config = Record<string, ReactNode>

type FromValues = Record<string, number | string | readonly string[] | undefined>

const options = [
  { label: '基于Cookie', value: 'cookieBased' },
  { label: '基于Token', value: 'tokenBased' }
]

export default function AuthMainEdit({ content, onChange, onTest }: Props) {
  const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  const dispatch = useContext(AuthDispatchContext)
  const [form] = Form.useForm()
  const [value, setValue] = useImmer('')
  const config = content.config as unknown as Config
  const [isRadioShow, setIsRadioShow] = useImmer(config.jwks == 1)
  const [disabled, setDisabled] = useImmer(false)
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useImmer(
    '' as string | number | readonly string[] | undefined
  )
  const [jwksObj, setjwksObj] = useState<Object>({})
  const [jwksJSON, setJwksJSON] = useState<string>('')
  const [jwksUrl, setJwksUrl] = useState<string>('')
  const [endPoint, setEndPoint] = useState<string>('')
  const currentInspecting = useRef<string>('')

  useEffect(() => {
    try {
      setjwksObj(JSON.parse(String(config.jwksJSON || '{}')))
    } catch (e) {
      setjwksObj({})
      console.error(e)
    }
    setJwksJSON(JSON.stringify(jwksObj))
  }, [content])

  if (!content) {
    return <Error50x />
  }
  const onFinish = async (values: FromValues) => {
    if (values.jwks == 1) {
      values.jwksJSON = jwksJSON
    }
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

  const inspect = async (host: string) => {
    const url = `${host.replace(/\/+$/, '')}/.well-known/openid-configuration`
    try {
      new URL(url)
    } catch (e) {
      return
    }
    // 当前url已经在解析，忽略本次请求
    if (currentInspecting.current === url) {
      return
    }
    currentInspecting.current = url
    // 开始请求前，先清空现有数据
    setJwksUrl('')
    setEndPoint('')
    const res = await axios.get(url)
    // 如果当前url不是最新的，忽略本次请求
    if (currentInspecting.current !== url) {
      return
    }
    setJwksUrl(res.data.jwks_uri)
    setEndPoint(res.data.userinfo_endpoint)
  }

  const onValuesChange = (changedValues: object, allValues: FromValues) => {
    void inspect(String(allValues.issuer))
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

  const saveJwksJSON = ({ updated_src }: { updated_src: Object }) => {
    setJwksJSON(JSON.stringify(updated_src))
  }

  return (
    <>
      <div className={`${styles['db-check-setting']}  mt-2 cursor-pointer`}>
        <span className=" h-5 w-19 float-right">{/* 前往管理 <RightOutlined /> */}</span>
      </div>
      <div className={`${styles['edit-form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          form={form}
          style={{ width: '90%' }}
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 11 }}
          onFinish={values => {
            void onFinish(values)
          }}
          onValuesChange={onValuesChange}
          autoComplete="new-password"
          validateTrigger="onBlur"
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
                // pattern: /^https?:\/\/[:.\w\d/]+$/,
                type: 'url',
                message: '只允许输入链接'
              }
            ]}
          >
            <Input placeholder="请输入..." value={inputValue} />
          </Form.Item>
          <Form.Item label="服务发现地址">
            <Input value={jwksUrl} disabled />
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
            <Form.Item label="jwksJSON" className="mb-5">
              <ReactJson
                onEdit={saveJwksJSON}
                onAdd={saveJwksJSON}
                onDelete={saveJwksJSON}
                src={jwksObj}
                iconStyle="triangle"
                name={false}
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
            <Input disabled value={endPoint} />
          </Form.Item>
          <Form.Item label="是否开启" name="switchState">
            <Checkbox.Group options={options} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button
              className="btn-cancel"
              onClick={() => {
                // 无id的情况下取消，后退到前一个页面
                if (!content?.id) {
                  navigate(-1)
                  return
                }
                handleBottomToggleDesigner('data', content.id)
              }}
            >
              <span>取消</span>
            </Button>
            <Button className="ml-4 btn-test" onClick={onTest}>
              测试
            </Button>
            <Button
              className="ml-4 btn-save"
              onClick={() => {
                form.submit()
              }}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
