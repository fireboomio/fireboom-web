/* eslint-disable camelcase */
import { loader } from '@monaco-editor/react'
import { Button, Form, Input, message, Radio, Select, Switch } from 'antd'
import copy from 'copy-to-clipboard'
import { debounce } from 'lodash'
import type { ReactNode } from 'react'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import ReactJson from 'react-json-view'
import { useNavigate } from 'react-router-dom'
// import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import Error50x from '@/components/ErrorPage/50x'
import { CopyOutlined } from '@/components/icons'
import UrlInput from '@/components/UrlInput'
import { useValidate } from '@/hooks/validate'
import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context/auth-context'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests, { proxy } from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import useEnvOptions from '@/lib/hooks/useEnvOptions'

import imgAuth0 from '../assets/Auth0.png'
import imgAuthing from '../assets/Authing.png'
import imgGithub from '../assets/Github.png'
import imgGoogle from '../assets/google.png'
import imgKeycloak from '../assets/Keycloak.png'
import imgOkta from '../assets/okta.png'
import imgOpenID from '../assets/OpenID.png'
import styles from './subs.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

interface Props {
  content: AuthProvResp
  onChange: (content: AuthProvResp) => void
  onTest: () => void
}

type Config = Record<string, ReactNode>

type FromValues = Record<string, number | string | readonly string[] | undefined>

const supportList = [
  {
    img: imgAuth0,
    link: 'https://auth0.com/docs/'
  },
  {
    img: imgAuthing,
    link: 'https://docs.authing.cn/'
  },
  {
    img: imgGithub,
    link: 'https://docs.github.com/en/developers/apps/building-oauth-apps'
  },
  {
    img: imgKeycloak,
    link: 'https://www.keycloak.org/documentation.html'
  },
  {
    img: imgOpenID,
    link: 'https://openid.net/developers/specs/'
  },
  {
    img: imgGoogle,
    link: 'https://developers.google.com/identity/protocols/oauth2'
  },
  {
    img: imgOkta,
    link: 'https://developer.okta.com/docs/guides'
  }
]

export default function AuthMainEdit({ content, onChange, onTest }: Props) {
  const intl = useIntl()
  const { system: globalConfig } = useContext(ConfigContext)
  const { ruleMap } = useValidate()
  const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  // const dispatch = useContext(AuthDispatchContext)
  const [form] = Form.useForm()
  const id = Form.useWatch('id', form)
  const issuer = Form.useWatch('issuer', form)
  const clientIdKind = Form.useWatch(['clientId', 'kind'], form)
  const clientSecretKind = Form.useWatch(['clientSecret', 'kind'], form)
  const tokenBased = Form.useWatch('tokenBased', form)
  const cookieBased = Form.useWatch('cookieBased', form)
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

  const { loading, fun: onFinish } = useLock(
    async (values: FromValues) => {
      if (values.jwks == 1) {
        values.jwksJSON = jwksJSON
      } else {
        if (!values.jwksURL && !values.userInfoEndpoint) {
          message.warning(intl.formatMessage({ defaultMessage: '未解析到jwksURL和用户端点' }))
          return
        }
      }
      const switchState = []
      if (values.cookieBased) {
        switchState.push('cookieBased')
      }
      if (values.tokenBased) {
        switchState.push('tokenBased')
      }
      const newValues = { ...config, ...values }
      const newContent = { ...content, switchState, name: values.id }
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
    },
    [config, content, handleBottomToggleDesigner, jwksJSON, onChange]
  )

  const inspect = useCallback(
    debounce(async (host: string) => {
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
      const res = await proxy(url)
      // 如果当前url不是最新的，忽略本次请求
      if (currentInspecting.current !== url) {
        return
      }
      form.setFieldValue('jwksURL', res.jwks_uri)
      form.setFieldValue('userInfoEndpoint', res.userinfo_endpoint)
      form.setFieldValue('tokenEndpoint', res.token_endpoint)
      form.setFieldValue('authorizationEndpoint', res.authorization_endpoint)
    }, 1000),
    [form]
  )

  if (!content) {
    return <Error50x />
  }

  const typeChange = (value: string) => {
    setValue(value)
    setIsRadioShow(value == '1')
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
        switchState: content.switchState,
        cookieBased: content.switchState.includes('cookieBased'),
        tokenBased: content.switchState.includes('tokenBased')
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
        cookieBased: false,
        tokenBased: false
      }

  const saveJwksJSON = ({ updated_src }: { updated_src: Object }) => {
    setJwksJSON(JSON.stringify(updated_src))
  }

  return (
    <>
      <div className={`${styles['db-check-setting']}  mt-2 cursor-pointer`}>
        <span className=" h-5 w-19 float-right">{/* 前往管理 <RightOutlined /> */}</span>
      </div>
      <div className={`${styles['edit-form-contain']} py-6 rounded-xl mb-4 flex flex-column`}>
        <div className="w-3/5">
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
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
                ...ruleMap.name
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
            <Form.Item
              label="Issuer"
              name="issuer"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ defaultMessage: 'Issuer不能为空' })
                },
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
              <Input
                value={
                  !issuer
                    ? intl.formatMessage({ defaultMessage: '请先输入 Issuer 地址' })
                    : `${issuer as string}/.well-known/openid-configuration`
                }
                disabled
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ defaultMessage: '用户端点' })}
              name="userInfoEndpoint"
            >
              <Input
                placeholder={intl.formatMessage({ defaultMessage: '请先输入 Issuer 地址' })}
                disabled
              />
            </Form.Item>
            <Form.Item
              label={
                <div className={styles.switchLabel}>
                  {intl.formatMessage({ defaultMessage: '基于cookie' })}
                </div>
              }
              className="pt-5"
            >
              <div className="flex items-center">
                <Form.Item noStyle name="cookieBased" valuePropName="checked">
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                  />
                </Form.Item>
                <div className="ml-2 text-12px text-[#333]">授权码模式</div>
              </div>
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ defaultMessage: 'App Secret' })}
              required={cookieBased}
            >
              <Input.Group compact className="!flex">
                <Form.Item name={['clientSecret', 'kind']} noStyle>
                  <Select className="flex-0 w-100px" disabled={!cookieBased}>
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
                  rules={
                    cookieBased
                      ? [
                          {
                            required: true,
                            message: intl.formatMessage({ defaultMessage: 'App Secret不能为空' })
                          }
                        ]
                      : []
                  }
                >
                  {clientSecretKind === '0' ? (
                    <Input
                      disabled={!cookieBased}
                      className="flex-1"
                      placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                    />
                  ) : (
                    <Select className="flex-1" options={envOptions} />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
            {id && cookieBased && (
              <Form.Item label={intl.formatMessage({ defaultMessage: '登录回调地址' })}>
                <div className="flex items-center">
                  {globalConfig.apiPublicAddr}/auth/cookie/callback/{id}
                  <CopyOutlined
                    className="cursor-pointer ml-4"
                    onClick={() => {
                      copy(`${globalConfig.apiPublicAddr}/auth/cookie/callback/${id}`)
                      message.success(intl.formatMessage({ defaultMessage: '复制成功' }))
                    }}
                  />
                </div>
              </Form.Item>
            )}
            <Form.Item
              label={
                <div className={styles.switchLabel}>
                  {intl.formatMessage({ defaultMessage: '基于Token' })}
                </div>
              }
              className="pt-5"
            >
              <div className="flex items-center">
                <Form.Item noStyle name="tokenBased" valuePropName="checked">
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                  />
                </Form.Item>
                <div className="ml-2 text-12px text-[#333]">隐式模式</div>
              </div>
            </Form.Item>
            <Form.Item label={intl.formatMessage({ defaultMessage: 'JWKS' })} name="jwks">
              <Radio.Group
                disabled={!tokenBased}
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
              <Form.Item
                label={intl.formatMessage({ defaultMessage: 'jwksJSON' })}
                className="mb-5"
              >
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
            <Form.Item hidden name="tokenEndpoint">
              <Input disabled />
            </Form.Item>
            <Form.Item hidden name="authorizationEndpoint">
              <Input disabled />
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
                loading={loading}
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
        <div className={`w-2/5 ${styles.supportList}`}>
          <div className="title">{intl.formatMessage({ defaultMessage: '我们支持' })}</div>
          {supportList.map((item, index) => (
            <a
              key={index}
              className={styles.supportItem}
              href={item.link}
              target="_blank"
              rel="noreferrer"
            >
              <img src={item.img} alt="" className="w-40" />
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
