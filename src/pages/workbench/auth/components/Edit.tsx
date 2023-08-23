/* eslint-disable camelcase */
import type { JSONValue } from '@antv/x6'
import { loader } from '@monaco-editor/react'
import { Button, Form, Input, message, Radio, Select, Switch } from 'antd'
import copy from 'copy-to-clipboard'
import { cloneDeep, debounce } from 'lodash'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
// import ReactJson from 'react-json-view'
import { useNavigate } from 'react-router-dom'

// import useSWRImmutable from 'swr/immutable'
import Error50x from '@/components/ErrorPage/50x'
import { CopyOutlined } from '@/components/icons'
import JsonEditor from '@/components/JsonEditor'
import UrlInput from '@/components/UrlInput'
import { useValidate } from '@/hooks/validate'
import { VariableKind } from '@/interfaces/common'
import { AuthToggleContext } from '@/lib/context/auth-context'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests, { proxy } from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import useEnvOptions from '@/lib/hooks/useEnvOptions'
import { useConfigurationVariable } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

import imgAuth0 from '../assets/Auth0.png'
import imgAuthing from '../assets/Authing.png'
import imgGithub from '../assets/Github.png'
import imgGoogle from '../assets/google.png'
import imgKeycloak from '../assets/Keycloak.png'
import imgOkta from '../assets/okta.png'
import imgOpenID from '../assets/OpenID.png'
import { defaultAuth } from '../defaults'
import styles from './subs.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

interface Props {
  content: ApiDocuments.Authentication
  onChange: (content: ApiDocuments.Authentication) => void
  onTest: () => void
}

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
  const { globalSetting } = useContext(ConfigContext)
  const { ruleMap } = useValidate()
  const { handleBottomToggleDesigner } = useContext(AuthToggleContext)
  const { getConfigurationValue } = useConfigurationVariable()
  // const dispatch = useContext(AuthDispatchContext)
  const [form] = Form.useForm<ApiDocuments.Authentication>()
  const name = Form.useWatch('name', form)
  const issuer = Form.useWatch(['issuer', 'staticVariableContent'], form)
  const clientIdKind = Form.useWatch(['oidcConfig', 'clientId', 'kind'], form)
  const clientSecretKind = Form.useWatch(['oidcConfig', 'clientSecret', 'kind'], form)
  const tokenBased = Form.useWatch('jwksProviderEnabled', form)
  const cookieBased = Form.useWatch('oidcConfigEnabled', form)
  const jwksURL = Form.useWatch(['jwksProvider', 'jwksURL', 'staticVariableContent'], form)
  const jwksKind = Form.useWatch('jwks', form)
  // const [isRadioShow, setIsRadioShow] = useImmer(config.jwks == 1)
  // const [disabled, setDisabled] = useImmer(false)
  const navigate = useNavigate()
  const [jwksObj, setjwksObj] = useState<Object>({})
  const [jwksJSON, setJwksJSON] = useState<string>('')
  const currentInspecting = useRef<string>('')

  const envOptions = useEnvOptions()

  useEffect(() => {
    if (content.jwksProvider.jwksJson) {
      try {
        setjwksObj(JSON.parse(String(content.jwksProvider.jwksJson.staticVariableContent || '{}')))
      } catch (e) {
        setjwksObj({})
        console.error(e)
      }
      setJwksJSON(JSON.stringify(jwksObj))
    }
  }, [content.jwksProvider])

  const { loading, fun: onFinish } = useLock(
    async (values: Partial<ApiDocuments.Authentication>) => {
      if (values.jwks === 1) {
        // @ts-ignore
        delete values.jwksProvider!.jwksUrl
        values.jwksProvider!.jwksJson.kind = VariableKind.Static
      } else {
        if (
          !values.jwksProvider?.jwksUrl &&
          !values.jwksProvider?.userInfoEndpoint?.staticVariableContent
        ) {
          message.warning(intl.formatMessage({ defaultMessage: '未解析到jwksURL和用户端点' }))
          return
        }
        values.jwksProvider!.jwksUrl.kind = VariableKind.Static
        // @ts-ignore
        delete values.jwksProvider!.jwksJson
      }
      delete values.jwks
      values.enabled = true
      const newValues = { ...values }
      // const newContent = { ...content, switchState, name: values.id }
      if (!content.name) {
        // const req = { ...newContent, config: newValues }
        // Reflect.deleteProperty(req, 'id')
        await requests.post('/authentication', newValues)
      } else {
        await requests.put('/authentication', newValues)
      }
      // @ts-ignore
      onChange(newValues)
      handleBottomToggleDesigner('data', content.name)
    },
    [content, handleBottomToggleDesigner, jwksJSON, onChange]
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
      form.setFieldsValue({
        jwksProvider: {
          jwksUrl: {
            staticVariableContent: ''
          },
          userInfoEndpoint: {
            staticVariableContent: ''
          }
        }
      })
      // form.setFieldValue('tokenEndpoint', '')
      // form.setFieldValue('authorizationEndpoint', '')
      const res = await proxy(url)
      // 如果当前url不是最新的，忽略本次请求
      if (currentInspecting.current !== url) {
        return
      }
      form.setFieldsValue({
        jwksProvider: {
          jwksUrl: {
            staticVariableContent: res.jwks_uri
          },
          userInfoEndpoint: {
            staticVariableContent: res.userinfo_endpoint
          }
        }
      })
      // form.setFieldValue('tokenEndpoint', res.token_endpoint)
      // form.setFieldValue('authorizationEndpoint', res.authorization_endpoint)
    }, 1000),
    [form]
  )

  useEffect(() => {
    if (issuer) {
      inspect(issuer)
    }
  }, [inspect, issuer])

  if (!content) {
    return <Error50x />
  }

  const initialValues = content.name ? content : cloneDeep(defaultAuth)

  const saveJwksJSON = (json: JSONValue) => {
    const str = JSON.stringify(json, null, 2)
    setJwksJSON(str)
    form.setFieldsValue({
      jwksProvider: {
        jwksJson: {
          kind: VariableKind.Static,
          staticVariableContent: str
        }
      }
    })
  }

  return (
    <>
      <div className={`${styles['db-check-setting']}  mt-2 cursor-pointer`}>
        <span className=" h-5 w-19 float-right">{/* 前往管理 <RightOutlined /> */}</span>
      </div>
      <div className={`${styles['edit-form-contain']} py-6 rounded-xl mb-4 flex`}>
        <div className="w-3/5">
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 17 }}
            onFinish={onFinish}
            autoComplete="new-password"
            validateTrigger="onChange"
            initialValues={{
              ...initialValues,
              jwks: content.jwksProvider?.jwksJson?.staticVariableContent ? 1 : 0
            }}
          >
            <Form.Item
              label={intl.formatMessage({ defaultMessage: '供应商名称' })}
              name="name"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ defaultMessage: '供应商名称不能为空' })
                },
                ...ruleMap.name
              ]}
            >
              <Input
                placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                autoComplete="off"
                autoFocus={true}
                disabled={!!content.name}
              />
            </Form.Item>
            <Form.Item
              label="Issuer"
              name={['issuer', 'staticVariableContent']}
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
                    : `${issuer}/.well-known/openid-configuration`
                }
                disabled
              />
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ defaultMessage: '用户端点' })}
              name={['jwksProvider', 'userInfoEndpoint', 'staticVariableContent']}
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
                <Form.Item noStyle name="oidcConfigEnabled" valuePropName="checked">
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                  />
                </Form.Item>
                <div className="ml-2 text-12px text-[#333]">授权码模式</div>
              </div>
            </Form.Item>

            <Form.Item
              label={intl.formatMessage({ defaultMessage: 'App ID' })}
              required={cookieBased}
            >
              <Input.Group compact className="!flex">
                <Form.Item name={['oidcConfig', 'clientId', 'kind']} noStyle>
                  <Select className="flex-0 w-100px" disabled={!cookieBased}>
                    <Select.Option value={0}>
                      <FormattedMessage defaultMessage="值" />
                    </Select.Option>
                    <Select.Option value={1}>
                      <FormattedMessage defaultMessage="环境变量" />
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name={[
                    'oidcConfig',
                    'clientId',
                    clientIdKind === VariableKind.Static
                      ? 'staticVariableContent'
                      : 'environmentVariableName'
                  ]}
                  noStyle
                  rules={
                    cookieBased
                      ? [
                          {
                            required: true,
                            message: intl.formatMessage({ defaultMessage: 'App ID不能为空' })
                          }
                        ]
                      : []
                  }
                >
                  {clientIdKind === VariableKind.Static ? (
                    <Input
                      className="flex-1"
                      placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
                      disabled={!cookieBased}
                    />
                  ) : (
                    <Select className="flex-1" options={envOptions} />
                  )}
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item
              label={intl.formatMessage({ defaultMessage: 'App Secret' })}
              required={cookieBased}
            >
              <Input.Group compact className="!flex">
                <Form.Item name={['oidcConfig', 'clientSecret', 'kind']} noStyle>
                  <Select className="flex-0 w-100px" disabled={!cookieBased}>
                    <Select.Option value={0}>
                      <FormattedMessage defaultMessage="值" />
                    </Select.Option>
                    <Select.Option value={1}>
                      <FormattedMessage defaultMessage="环境变量" />
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name={[
                    'oidcConfig',
                    'clientSecret',
                    clientIdKind === VariableKind.Static
                      ? 'staticVariableContent'
                      : 'environmentVariableName'
                  ]}
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
                  {clientSecretKind === VariableKind.Static ? (
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
            {name && cookieBased && (
              <Form.Item label={intl.formatMessage({ defaultMessage: '登录回调地址' })}>
                <div className="flex items-center">
                  {getConfigurationValue(globalSetting.nodeOptions.publicNodeUrl)}
                  /auth/cookie/callback/{name}
                  <CopyOutlined
                    className="cursor-pointer ml-4"
                    onClick={() => {
                      copy(
                        `${getConfigurationValue(
                          globalSetting.nodeOptions.publicNodeUrl
                        )}/auth/cookie/callback/${name}`
                      )
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
                <Form.Item noStyle name="jwksProviderEnabled" valuePropName="checked">
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                  />
                </Form.Item>
                <div className="ml-2 text-12px text-[#333]">隐式模式</div>
              </div>
            </Form.Item>
            <Form.Item label={intl.formatMessage({ defaultMessage: 'JWKS' })} name="jwks">
              <Radio.Group disabled={!tokenBased}>
                <Radio value={0}>URL</Radio>
                <Radio value={1}>JSON</Radio>
              </Radio.Group>
            </Form.Item>
            {jwksKind === 1 ? (
              <Form.Item
                label={intl.formatMessage({ defaultMessage: 'jwksJSON' })}
                className="mb-5"
                name={['jwksProvider', 'jwksJson', 'staticVariableContent']}
              >
                {/* <ReactJson
                  onEdit={saveJwksJSON}
                  onAdd={saveJwksJSON}
                  onDelete={saveJwksJSON}
                  src={jwksObj}
                  iconStyle="triangle"
                  name={false}
                  style={{
                    wordBreak: 'break-word'
                  }}
                /> */}
                <JsonEditor value={jwksObj as JSONValue} onChange={saveJwksJSON} />
              </Form.Item>
            ) : (
              <Form.Item
                label={intl.formatMessage({ defaultMessage: 'jwksURL' })}
                name={['jwksProvider', 'jwksUrl', 'staticVariableContent']}
              >
                <Input
                  disabled
                  suffix={
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        window.open(jwksURL, '_blank')
                      }}
                    >
                      <FormattedMessage defaultMessage="访问" />
                    </div>
                  }
                />
              </Form.Item>
            )}
            {/* <Form.Item hidden name="tokenEndpoint">
              <Input disabled />
            </Form.Item>
            <Form.Item hidden name="authorizationEndpoint">
              <Input disabled />
            </Form.Item> */}
            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button
                className="btn-cancel"
                onClick={() => {
                  // 无id的情况下取消，后退到前一个页面
                  if (!content?.name) {
                    navigate(-1)
                    return
                  }
                  handleBottomToggleDesigner('data', content.name)
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
