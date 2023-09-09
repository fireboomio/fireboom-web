import { Button, Checkbox, Form, InputNumber, message, Switch } from 'antd'
import { OperationTypeNode } from 'graphql/index'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { mutateApi, useApiGlobalSetting } from '@/hooks/store/api'
import { OperationType } from '@/interfaces/operation'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { useAPIManager } from '@/pages/workbench/apimanage/[...path]/store'
import type { ApiDocuments } from '@/services/a2s.namespace'

import styles from './index.module.less'

interface Props {
  operationType?: OperationTypeNode
  operationName?: string
  onClose?: () => void
  type: 'global' | 'panel'
}

export default function Index(props: Props) {
  const intl = useIntl()
  const { onRefreshMenu } = useContext(WorkbenchContext)
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
  const onChange = (changedValues: ApiDocuments.Operation, allValues: ApiDocuments.Operation) => {
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
  }

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
        {props.type !== 'global' ? (
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
        ) : null}
        {props.type === 'global' ? (
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
        {props.type === 'global' ? (
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
