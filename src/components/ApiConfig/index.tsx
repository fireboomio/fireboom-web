import { Button, Checkbox, Form, InputNumber, message, Switch } from 'antd'
import { OperationTypeNode } from 'graphql/index'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { mutateApi, useApiGlobalSetting } from '@/hooks/store/api'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { useAPIManager } from '@/pages/workbench/apimanage/[id]/store'

import styles from './index.module.less'

interface Props {
  operationType?: OperationTypeNode
  id?: number
  onClose?: () => void
  type: 'global' | 'panel'
}

interface Setting {
  enable: boolean
  authenticationRequired: boolean
  authenticationQueriesRequired: boolean
  authenticationMutationsRequired: boolean
  authenticationSubscriptionsRequired: boolean
  cachingEnable: boolean
  cachingMaxAge: number
  cachingStaleWhileRevalidate: number
  liveQueryEnable: boolean
  liveQueryPollingIntervalSeconds: number
}

export default function Index(props: Props) {
  const intl = useIntl()
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const [apiSetting, setApiSetting] = useState<Setting>()
  const [form] = Form.useForm()
  const { data: globalSetting, mutate: refreshGlobalSetting } = useApiGlobalSetting()
  useEffect(() => {
    if (props.id) {
      void requests.get<unknown, Setting>(`/operateApi/setting/${props.id}`).then(result => {
        setApiSetting(result)
        form.setFieldsValue(result)
      })
    }
  }, [props.id])
  useEffect(() => {
    let setting
    if (apiSetting?.enable) {
      setting = apiSetting
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
  const onChange = (changedValues: Setting, allValues: Setting) => {
    // 全局配置需要手动保存
    if (props.type !== 'panel') {
      return
    }
    // 修改开关的情况下，只修改开关容纳后保存
    if (changedValues.enable !== undefined) {
      void requests.put<unknown, any>(`/operateApi/setting/${props.id}`, {
        ...apiSetting,
        enable: changedValues.enable,
        settingType: props.id ? 1 : 2,
        id: props.id || 0
      })
      setApiSetting({ ...apiSetting!, enable: changedValues.enable })

      // 刷新API菜单
      void mutateApi()
      refreshAPI()
      return
    }
    setApiSetting({ ...apiSetting!, ...changedValues })
    void requests
      .put<unknown, any>(`/operateApi/setting/${props.id}`, {
        ...allValues,
        settingType: props.id ? 1 : 2,
        id: props.id || 0
      })
      .then(() => {
        // 如果修改的是实时查询，则需要刷新api面板=
        if (changedValues.liveQueryEnable !== undefined) {
          void mutateApi()
          refreshAPI()
        }
        // 如果修改的是开启授权，则需要刷新当前api页面
        if (
          changedValues.authenticationRequired !== undefined ||
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
  // if (apiSetting?.enable) {
  //   setting = apiSetting
  // }
  // if (!setting) {
  //   return null
  // }

  const onFinish = (values: Setting) => {
    void requests
      .put<unknown, any>('/operateApi/setting', {
        ...values,
        settingType: props.id ? 1 : 2,
        id: props.id || 0
      })
      .then(() => {
        message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
        void refreshGlobalSetting()
        props.onClose?.()
      })
  }

  const disabled = !apiSetting?.enable && props.type !== 'global'

  return (
    <div className={styles[props.type]}>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        autoComplete="off"
        labelAlign="left"
        onValuesChange={onChange}
      >
        {props.type !== 'global' ? (
          <>
            <Form.Item
              // noStyle
              name="enable"
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
                <Form.Item noStyle name="authenticationQueriesRequired" valuePropName="checked">
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                  />
                </Form.Item>
                <span className={styles.tip} style={{ marginLeft: 12 }}>
                  <FormattedMessage defaultMessage="查询是否需要登录" />
                </span>
              </>
            </Form.Item>
            <Form.Item label={intl.formatMessage({ defaultMessage: '变更授权' })}>
              <>
                <Form.Item noStyle name="authenticationMutationsRequired" valuePropName="checked">
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                  />
                </Form.Item>
                <span className={styles.tip} style={{ marginLeft: 12 }}>
                  <FormattedMessage defaultMessage="变更是否需要登录" />
                </span>
              </>
            </Form.Item>
            <Form.Item label={intl.formatMessage({ defaultMessage: '订阅授权' })}>
              <>
                <Form.Item
                  noStyle
                  name="authenticationSubscriptionsRequired"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                    unCheckedChildren={intl.formatMessage({
                      defaultMessage: '关闭'
                    })}
                  />
                </Form.Item>
                <span className={styles.tip} style={{ marginLeft: 12 }}>
                  <FormattedMessage defaultMessage="订阅是否需要登录" />
                </span>
              </>
            </Form.Item>
          </>
        ) : (
          <Form.Item label={intl.formatMessage({ defaultMessage: '开启授权' })}>
            <>
              <Form.Item noStyle name="authenticationRequired" valuePropName="checked">
                <Switch
                  disabled={disabled}
                  checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                  unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                />
              </Form.Item>
              <span className={styles.tip} style={{ marginLeft: 12 }}>
                <FormattedMessage defaultMessage="是否需要登录" />
              </span>
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
                  <Form.Item noStyle name="cachingEnable" valuePropName="checked">
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
                name="cachingMaxAge"
              >
                <InputNumber
                  disabled={disabled}
                  addonAfter={intl.formatMessage({ defaultMessage: '秒' })}
                />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ defaultMessage: '重新校验时长' })}
                name="cachingStaleWhileRevalidate"
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
                  <Form.Item noStyle name="liveQueryEnable" valuePropName="checked">
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
                name="liveQueryPollingIntervalSeconds"
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
