/* eslint-disable camelcase */
import { loader } from '@monaco-editor/react'
import { Button, Checkbox, Form, Input, message, Radio, Select } from 'antd'
import axios from 'axios'
import type { ReactNode } from 'react'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ReactJson from 'react-json-view'
import { useNavigate } from 'react-router-dom'
// import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import UrlInput from '@/components/UrlInput'
import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context/auth-context'
import requests, { getHeader } from '@/lib/fetchers'
import useEnvOptions from '@/lib/hooks/useEnvOptions'

import styles from './subs.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

interface Props {
  content: AuthProvResp
  onChange: (content: AuthProvResp) => void
  onTest: () => void
}

type Config = Record<string, ReactNode>

type FromValues = Record<string, number | string | readonly string[] | undefined>

export default function AuthMainEdit({ content, onChange, onTest }: Props) {
  const intl = useIntl()
  const options = useMemo(
    () => [
      { label: intl.formatMessage({ defaultMessage: '基于Cookie' }), value: 'cookieBased' },
      { label: intl.formatMessage({ defaultMessage: '基于Token' }), value: 'tokenBased' }
    ],
    [intl]
  )
  const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  // const dispatch = useContext(AuthDispatchContext)
  const [form] = Form.useForm()
  const issuer = Form.useWatch('issuer', form)
  const clientIdKind = Form.useWatch(['clientId', 'kind'], form)
  const clientSecretKind = Form.useWatch(['clientSecret', 'kind'], form)
  const jwksURL = Form.useWatch('jwksURL', form)
  const [value, setValue] = useImmer('')
  const config = content.config as unknown as Config
  const [isRadioShow, setIsRadioShow] = useImmer(config.jwks == 1)
  const [disabled, setDisabled] = useImmer(false)
  const navigate = useNavigate()
  const [jwksObj, setjwksObj] = useState<Object>({})
  const [jwksJSON, setJwksJSON] = useState<string>('')
  const currentInspecting = useRef<string>('')

  const envOptions = useEnvOptions()

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
    } else {
      if (!values.jwksURL && !values.userInfoEndpoint) {
        message.warning(intl.formatMessage({ defaultMessage: '未解析到jwksURL和用户端点' }))
        return
      }
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
    currentInspecting.current = url
    // 开始请求前，先清空现有数据
    form.setFieldValue('jwksURL', '')
    form.setFieldValue('userInfoEndpoint', '')
    form.setFieldValue('tokenEndpoint', '')
    form.setFieldValue('authorizationEndpoint', '')
    try {
      const res = await axios.get('/api/v1/common/proxy', { headers: getHeader(), params: { url } })
      // 如果当前url不是最新的，忽略本次请求
      if (currentInspecting.current !== url) {
        return
      }
      form.setFieldValue('jwksURL', res.data.jwks_uri)
      form.setFieldValue('userInfoEndpoint', res.data.userinfo_endpoint)
      form.setFieldValue('tokenEndpoint', res.data.token_endpoint)
      form.setFieldValue('authorizationEndpoint', res.data.authorization_endpoint)
    } finally {
      currentInspecting.current = ''
    }
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

        clientId: config.clientId || { kind: '0' },
        clientSecret: config.clientSecret || { kind: '0' },
        issuer: config.issuer,
        jwks: config.jwks,
        jwksJSON: config.jwksJSON,
        jwksURL: config.jwksURL,
        userInfoEndpoint: config.userInfoEndpoint,
        tokenEndpoint: config.tokenEndpoint,
        authorizationEndpoint: config.authorizationEndpoint,
        switchState: content.switchState
      }
    : {
        id: '',
        clientId: { kind: '0' },
        clientSecret: { kind: '0' },
        issuer: '',
        jwks: 0,
        jwksJSON: '',
        jwksURL: '',
        userInfoEndpoint: '',
        tokenEndpoint: '',
        authorizationEndpoint: '',
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
          validateTrigger="onChange"
          initialValues={initialValues}
        >
          <Form.Item
            label={intl.formatMessage({ defaultMessage: '供应商ID' })}
            name="id"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ defaultMessage: '供应商ID不能为空' })
              },
              {
                pattern: new RegExp('^\\w+$', 'g'),
                message: intl.formatMessage({ defaultMessage: '只允许包含字母，数字，下划线' })
              }
            ]}
          >
            <Input
              placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
              autoComplete="off"
              autoFocus={true}
            />
          </Form.Item>

          <Form.Item label={intl.formatMessage({ defaultMessage: 'App ID' })} required>
            <Input.Group compact className="!flex">
              <Form.Item name={['clientId', 'kind']} noStyle>
                <Select className="flex-0 w-100px">
                  <Select.Option value="0">
                    <FormattedMessage defaultMessage="值" />
                  </Select.Option>
                  <Select.Option value="1">
                    <FormattedMessage defaultMessage="环境变量" />
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['clientId', 'val']}
                noStyle
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ defaultMessage: 'App ID不能为空' })
                  }
                ]}
              >
                {clientIdKind === '0' ? (
                  <Input
                    className="flex-1"
                    placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                  />
                ) : (
                  <Select className="flex-1" options={envOptions} />
                )}
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label={intl.formatMessage({ defaultMessage: 'App Secret' })} required>
            <Input.Group compact className="!flex">
              <Form.Item name={['clientSecret', 'kind']} noStyle>
                <Select className="flex-0 w-100px">
                  <Select.Option value="0">
                    <FormattedMessage defaultMessage="值" />
                  </Select.Option>
                  <Select.Option value="1">
                    <FormattedMessage defaultMessage="环境变量" />
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={['clientSecret', 'val']}
                noStyle
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ defaultMessage: 'App Secret不能为空' })
                  }
                ]}
              >
                {clientSecretKind === '0' ? (
                  <Input
                    className="flex-1"
                    placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                  />
                ) : (
                  <Select className="flex-1" options={envOptions} />
                )}
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            label="Issuer"
            name="issuer"
            rules={[
              { required: true, message: intl.formatMessage({ defaultMessage: 'Issuer不能为空' }) },
              {
                // pattern: /^https?:\/\/[:.\w\d/]+$/,
                type: 'url',
                message: intl.formatMessage({ defaultMessage: '只允许输入链接' })
              }
            ]}
          >
            <UrlInput placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ defaultMessage: '服务发现地址' })}>
            <Input value={`${issuer as string}/.well-known/openid-configuration`} disabled />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ defaultMessage: 'JWKS' })} name="jwks">
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
            <Form.Item label={intl.formatMessage({ defaultMessage: 'jwksJSON' })} className="mb-5">
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
            <Form.Item label={intl.formatMessage({ defaultMessage: 'jwksURL' })} name="jwksURL">
              <Input
                disabled
                suffix={
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      window.open(jwksURL, '_blank')
                    }}
                  >
                    <FormattedMessage defaultMessage="浏览" />
                  </div>
                }
              />
            </Form.Item>
          )}
          <Form.Item
            label={intl.formatMessage({ defaultMessage: '用户端点' })}
            name="userInfoEndpoint"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item hidden name="tokenEndpoint">
            <Input disabled />
          </Form.Item>
          <Form.Item hidden name="authorizationEndpoint">
            <Input disabled />
          </Form.Item>
          <Form.Item label={intl.formatMessage({ defaultMessage: '是否开启' })} name="switchState">
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
              <span>
                <FormattedMessage defaultMessage="取消" />
              </span>
            </Button>
            {/*<Button className="ml-4 btn-test" onClick={onTest}>*/}
            {/*  <FormattedMessage defaultMessage="测试" />*/}
            {/*</Button>*/}
            <Button
              className="ml-4 btn-save"
              onClick={() => {
                form.submit()
              }}
            >
              <FormattedMessage defaultMessage="保存" />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
