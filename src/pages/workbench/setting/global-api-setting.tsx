import { Button, Form, InputNumber, Switch, message } from 'antd'
import { FormattedMessage, useIntl } from 'react-intl'

import { useApiGlobalSetting } from '@/hooks/store/api'
import { OperationType } from '@/interfaces/operation'
import requests from '@/lib/fetchers'
import type { ApiDocuments } from '@/services/a2s.namespace'

import { useRef } from 'react'
import styles from './index.module.less'

export default function APIGlobalSetting() {
  const intl = useIntl()
  const [form] = Form.useForm()
  const lock = useRef(false)
  const { data: globalSetting, mutate: refreshGlobalSetting } = useApiGlobalSetting()

  const onFinish = (values: ApiDocuments.Operation) => {
    if (lock.current) {
      return
    }
    requests.put<unknown, any>('/globalOperation', values).then(() => {
      message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
      refreshGlobalSetting()
    })
  }

  return (
    <div className='pt-6'>
      {globalSetting && (<Form
        className='common-form'
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        autoComplete="off"
        labelAlign="right"
        initialValues={globalSetting}
      >
        <Form.Item className={styles.tip} label={<FormattedMessage defaultMessage="性能设置" description="API性能设置" />} />
        <Form.Item
          label={intl.formatMessage({
            defaultMessage: '在 GraphQL 内转换',
            description: '在 GraphQL 内转换'
          })}
          name="graphqlTransformEnabled"
          valuePropName="checked"
        >
          <Switch
            checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
            unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
          />
        </Form.Item>
        <Form.Item className={styles.tip} label={<FormattedMessage defaultMessage="授权配置" description="API授权配置" />} />
        <Form.Item
          label={intl.formatMessage({
            defaultMessage: '查询授权',
            description: '查询是否需要授权'
          })}
          name={['authenticationConfigs', OperationType.Query.toString(), 'authRequired']}
          valuePropName="checked"
        >
          <Switch
            checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
            unCheckedChildren={intl.formatMessage({ defaultMessage: '匿名' })}
          />
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
        <Form.Item className={styles.tip} label={<FormattedMessage defaultMessage="缓存配置" />} />
        <Form.Item label={intl.formatMessage({ defaultMessage: '查询缓存' })}>
          <Form.Item noStyle name={['cacheConfig', 'enabled']} valuePropName="checked">
            <Switch
              checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
              unCheckedChildren={intl.formatMessage({
                defaultMessage: '关闭'
              })}
            />
          </Form.Item>
          <span className={styles.tip} style={{ marginLeft: 12 }}>
            <FormattedMessage defaultMessage="对查询进行缓存" />
          </span>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '最大时长' })}
          name={['cacheConfig', 'maxAge']}
        >
          <InputNumber
            addonAfter={intl.formatMessage({ defaultMessage: '秒' })}
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '重新校验时长' })}
          name={['cacheConfig', 'staleWhileRevalidate']}
        >
          <InputNumber
            addonAfter={intl.formatMessage({ defaultMessage: '秒' })}
          />
        </Form.Item>

        <Form.Item className={styles.tip} label={<FormattedMessage defaultMessage="实时配置" />} />
        <Form.Item label={intl.formatMessage({ defaultMessage: '实时查询' })}>
          <Form.Item noStyle name={['liveQueryConfig', 'enabled']} valuePropName="checked">
            <Switch
              checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
              unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
            />
          </Form.Item>
          <span className={styles.tip} style={{ marginLeft: 12 }}>
            <FormattedMessage defaultMessage="服务端实时查询" />
          </span>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '轮询间隔' })}
          name={['liveQueryConfig', 'pollingIntervalSeconds']}
        >
          <InputNumber
            addonAfter={intl.formatMessage({ defaultMessage: '秒' })}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 5, span: 12 }}>
          <Button
            className={'btn-save'}
            type="primary"
            onClick={() => {
              form.submit()
            }}
          >
            <FormattedMessage defaultMessage="保存" />
          </Button>
        </Form.Item>
      </Form>)}
    </div>
  )
}
