import { Button, Checkbox, Form, Input, InputNumber, message, Space, Switch } from 'antd'
import { OperationTypeNode } from 'graphql/index'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { mutateApi, useApiGlobalSetting } from '@/hooks/store/api'
import { OperationType } from '@/interfaces/operation'
// import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { useAPIManager } from '@/pages/workbench/apimanage/[...path]/store'
import type { ApiDocuments } from '@/services/a2s.namespace'

import styles from './index.module.less'
import { debounce } from 'lodash'

interface Props {
  operationType?: OperationTypeNode
  operationName?: string
  onClose?: () => void
  type: 'global' | 'panel'
}

export default function Index(props: Props) {
  const intl = useIntl()
  // const { onRefreshMenu } = useContext(WorkbenchContext)
  const [apiSetting, setApiSetting] = useState<ApiDocuments.Operation>()
  const [form] = Form.useForm()
  const { data: globalSetting, mutate: refreshGlobalSetting } = useApiGlobalSetting()
  useEffect(() => {
    if (props.operationName) {
      void requests
        .get<unknown, ApiDocuments.Operation>(`/operation/${props.operationName}`)
        .then(result => {
          setApiSetting(result)
          form.setFieldsValue(result)
        })
    }
  }, [props.operationName])
  useEffect(() => {
    let setting: Partial<ApiDocuments.Operation>
    if (apiSetting?.configCustomized) {
      setting = {
        ...apiSetting,
        cacheConfig: {
          ...apiSetting.cacheConfig,
          staleWhileRevalidate:
            apiSetting.cacheConfig?.staleWhileRevalidate ??
            globalSetting?.cacheConfig.staleWhileRevalidate ??
            30,
          maxAge: apiSetting.cacheConfig?.maxAge ?? globalSetting?.cacheConfig.maxAge ?? 120
        },
        liveQueryConfig: {
          ...apiSetting.liveQueryConfig,
          pollingIntervalSeconds:
            apiSetting.liveQueryConfig?.pollingIntervalSeconds ??
            globalSetting?.liveQueryConfig?.pollingIntervalSeconds ??
            10
        }
      }
    } else if (globalSetting) {
      setting = globalSetting
      setting.authenticationRequired = !!{
        [OperationTypeNode.QUERY]: globalSetting?.authenticationQueriesRequired,
        [OperationTypeNode.MUTATION]: globalSetting?.authenticationMutationsRequired,
        [OperationTypeNode.SUBSCRIPTION]: globalSetting?.authenticationSubscriptionsRequired
      }[props.operationType || OperationTypeNode.QUERY]
    }
    form.setFieldsValue(setting)
  }, [apiSetting, globalSetting])

  const { refreshAPI } = useAPIManager()
  const onChange = debounce((changedValues: ApiDocuments.Operation, allValues: ApiDocuments.Operation) => {
    // 全局配置需要手动保存
    if (props.type !== 'panel') {
      return
    }
    // 修改开关的情况下，只修改开关容纳后保存
    if (changedValues.configCustomized !== undefined) {
      void requests.put<unknown, any>(`/operation`, {
        configCustomized: changedValues.configCustomized,
        path: props.operationName
      })
      setApiSetting({ ...apiSetting!, configCustomized: changedValues.configCustomized })

      // 刷新API菜单
      void mutateApi()
      refreshAPI()
      return
    }
    setApiSetting({ ...apiSetting!, ...changedValues })
    void requests
      .put<unknown, any>(`/operation`, {
        ...changedValues,
        path: props.operationName
      })
      .then(() => {
        // 如果修改的是实时查询，则需要刷新api面板=
        if (changedValues.liveQueryConfig?.enabled !== undefined) {
          void mutateApi()
          refreshAPI()
        }
        // 如果修改的是开启授权，则需要刷新当前api页面
        if (
          changedValues.authenticationConfig?.authRequired !== undefined ||
          changedValues.authenticationQueriesRequired !== undefined ||
          changedValues.authenticationMutationsRequired !== undefined ||
          changedValues.authenticationSubscriptionsRequired !== undefined
        ) {
          refreshAPI()
        }
      })

    // .then(() => {
    //   message.success('保存成功')
    //   props.onClose?.()
    // })
  }, 500)

  // let setting = globalSetting
  // if (apiSetting?.enabled) {
  //   setting = apiSetting
  // }
  // if (!setting) {
  //   return null
  // }

  const onFinish = (values: ApiDocuments.Operation) => {
    void requests.put<unknown, any>('/globalOperation', values).then(() => {
      message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
      void refreshGlobalSetting()
      props.onClose?.()
    })
  }

  const disabled = !apiSetting?.configCustomized && props.type !== 'global'
  const isGlobal = props.type === 'global'
  // 限流字段
  const rateLimitField = 'rateLimit'
  const rateLimitEnabled = Form.useWatch([rateLimitField, 'enabled'], form)
  return (
    <div className={styles[props.type]}>
      <Form
        form={form}
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 15 }}
        onFinish={onFinish}
        autoComplete="off"
        labelAlign="left"
        onValuesChange={onChange}
      >
        {!isGlobal && (
          <>
            <Form.Item
              // noStyle
              name="configCustomized"
              valuePropName="checked"
            >
              <Checkbox>
                <FormattedMessage defaultMessage="使用独立配置" />
              </Checkbox>
            </Form.Item>

            <div className={styles.splitLine} />
          </>
        )}
        {isGlobal ? (
          <>
            <div className={styles.tip}>
              <FormattedMessage defaultMessage="授权配置" description="API授权配置" />
            </div>
            <Form.Item
              label={intl.formatMessage({
                defaultMessage: '查询授权',
                description: '查询是否需要授权'
              })}
            >
              <>
                <Form.Item
                  noStyle
                  name={['authenticationConfigs', OperationType.Query.toString(), 'authRequired']}
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({ defaultMessage: '匿名' })}
                  />
                </Form.Item>
              </>
            </Form.Item>
            <Form.Item label={intl.formatMessage({ defaultMessage: '变更授权' })}>
              <>
                <Form.Item
                  noStyle
                  name={[
                    'authenticationConfigs',
                    OperationType.Mutation.toString(),
                    'authRequired'
                  ]}
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({ defaultMessage: '匿名' })}
                  />
                </Form.Item>
              </>
            </Form.Item>
            <Form.Item label={intl.formatMessage({ defaultMessage: '订阅授权' })}>
              <>
                <Form.Item
                  noStyle
                  name={[
                    'authenticationConfigs',
                    OperationType.Subscription.toString(),
                    'authRequired'
                  ]}
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({
                      defaultMessage: '匿名'
                    })}
                  />
                </Form.Item>
              </>
            </Form.Item>
          </>
        ) : (
          <Form.Item label={intl.formatMessage({ defaultMessage: '接口授权' })}>
            <>
              <Form.Item
                noStyle
                name={['authenticationConfig', 'authRequired']}
                valuePropName="checked"
              >
                <Switch
                  disabled={disabled}
                  checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                  unCheckedChildren={intl.formatMessage({ defaultMessage: '匿名' })}
                />
              </Form.Item>
            </>
          </Form.Item>
        )}

        <>
          {props.operationType === OperationTypeNode.QUERY || props.type === 'global' ? (
            <>
              {props.type === 'panel' ? <div className={styles.splitLine} /> : ''}
              <div className={styles.tip}>
                <FormattedMessage defaultMessage="缓存配置" />
              </div>

              <Form.Item label={intl.formatMessage({ defaultMessage: '查询缓存' })}>
                <>
                  <Form.Item noStyle name={['cacheConfig', 'enabled']} valuePropName="checked">
                    <Switch
                      disabled={disabled}
                      checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                      unCheckedChildren={intl.formatMessage({
                        defaultMessage: '关闭'
                      })}
                    />
                  </Form.Item>
                  <span className={styles.tip} style={{ marginLeft: 12 }}>
                    <FormattedMessage defaultMessage="对查询进行缓存" />
                  </span>
                </>
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ defaultMessage: '最大时长' })}
                name={['cacheConfig', 'maxAge']}
              >
                <InputNumber
                  disabled={disabled}
                  addonAfter={intl.formatMessage({ defaultMessage: '秒' })}
                />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ defaultMessage: '重新校验时长' })}
                name={['cacheConfig', 'staleWhileRevalidate']}
              >
                <InputNumber
                  disabled={disabled}
                  addonAfter={intl.formatMessage({ defaultMessage: '秒' })}
                />
              </Form.Item>
            </>
          ) : null}

          {props.operationType === OperationTypeNode.QUERY || props.type === 'global' ? (
            <>
              {props.type === 'panel' ? <div className={styles.splitLine} /> : ''}
              <div className={styles.tip}>
                <FormattedMessage defaultMessage="实时配置" />
              </div>

              <Form.Item label={intl.formatMessage({ defaultMessage: '实时查询' })}>
                <>
                  <Form.Item noStyle name={['liveQueryConfig', 'enabled']} valuePropName="checked">
                    <Switch
                      disabled={disabled}
                      checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                      unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                    />
                  </Form.Item>
                  <span className={styles.tip} style={{ marginLeft: 12 }}>
                    <FormattedMessage defaultMessage="服务端实时查询" />
                  </span>
                </>
              </Form.Item>

              <Form.Item
                label={intl.formatMessage({ defaultMessage: '轮询间隔' })}
                name={['liveQueryConfig', 'pollingIntervalSeconds']}
              >
                <InputNumber
                  disabled={disabled}
                  addonAfter={intl.formatMessage({ defaultMessage: '秒' })}
                />
              </Form.Item>
            </>
          ) : null}
        </>
        {!isGlobal && (
          <>
            <div className={styles.splitLine} />
            {/* 限流配置 */}
            <div className={styles.tip}>
              <FormattedMessage defaultMessage="限流配置" />
            </div>
            <Space className="w-full" align="center">
              <Form.Item
                wrapperCol={{ span: 24 }}
                name={[rateLimitField, 'enabled']}
                valuePropName="checked"
              >
                <Checkbox>
                  <FormattedMessage defaultMessage="启用" />
                </Checkbox>
              </Form.Item>
              {rateLimitEnabled && (
                <>
                  <Form.Item
                    className="w-28"
                    name={[rateLimitField, 'perSecond']}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ defaultMessage: '不能为空' })
                      },
                      {
                        min: 1
                      }
                    ]}
                  >
                    <InputNumber
                      min={1}
                      precision={0}
                      defaultValue={60}
                      placeholder={intl.formatMessage({ defaultMessage: '60' })}
                      suffix={intl.formatMessage({ defaultMessage: '秒' })}
                    />
                  </Form.Item>
                  <Form.Item
                    className="w-28"
                    name={[rateLimitField, 'requests']}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ defaultMessage: '不能为空' })
                      },
                      {
                        min: 0
                      }
                    ]}
                  >
                    <InputNumber
                      min={0}
                      precision={0}
                      defaultValue={120}
                      placeholder={intl.formatMessage({ defaultMessage: '100' })}
                      suffix={intl.formatMessage({ defaultMessage: '次' })}
                    />
                  </Form.Item>
                </>
              )}
            </Space>
          </>
        )}
        {isGlobal ? (
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              className={'btn-save'}
              type="primary"
              onClick={() => {
                form.submit()
              }}
            >
              <FormattedMessage defaultMessage="保存" />
            </Button>
            <Button className={'btn-cancel ml-4'} onClick={props.onClose}>
              <FormattedMessage defaultMessage="取消" />
            </Button>
          </Form.Item>
        ) : null}
      </Form>
    </div>
  )
}
