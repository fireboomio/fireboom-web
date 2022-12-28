import { Alert, Button, Form, Input, message, Select, Switch } from 'antd'
import { useContext, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import type { StorageConfig, StorageResp } from '@/interfaces/storage'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import useEnvOptions from '@/lib/hooks/useEnvOptions'

import styles from './subs.module.less'

interface Props {
  content?: StorageResp
  showErr?: boolean
}

export default function StorageForm({ content, showErr }: Props) {
  const intl = useIntl()
  const { handleSwitch } = useContext(StorageSwitchContext)
  const navigate = useNavigate()
  const { onRefreshMenu } = useContext(WorkbenchContext)

  const config = useMemo(() => content?.config, [content])

  const [form] = Form.useForm()
  const accessKeyIDKind = Form.useWatch(['accessKeyID', 'kind'], form)
  const secretAccessKeyKind = Form.useWatch(['secretAccessKey', 'kind'], form)
  const [testing, setTesting] = useState(false)
  const envOptions = useEnvOptions()

  useEffect(() => {
    form.resetFields()
  }, [content])

  const onFinish = async (values: StorageConfig) => {
    const payload = { name: values.name, config: values, useSSL: true }

    let resp: StorageResp
    if (content) {
      resp = await requests.put('/storageBucket ', { ...payload, id: content.id })
    } else {
      resp = await requests.post<unknown, StorageResp>('/storageBucket ', payload)
    }
    navigate(`/workbench/storage/${resp.id}`, { replace: true })
    onRefreshMenu('storage')
    handleSwitch('detail', resp.id)
  }

  const onFinishFailed = (_errorInfo: object) => {
    void message.error(intl.formatMessage({ defaultMessage: '保存失败！' }))
  }

  const handleTest = () => {
    setTesting(true)
    const values = form.getFieldsValue()
    void requests
      .post('/s3Upload/checkConn', {
        config: { ...values },
        name: values.name
      })
      .then((x: any) => {
        if (x?.status) {
          message.success(intl.formatMessage({ defaultMessage: '连接成功' }))
        } else {
          message.error(x?.msg || intl.formatMessage({ defaultMessage: '连接失败' }))
        }
      })
      .finally(() => {
        setTesting(false)
      })
  }

  return (
    <div className={`${styles['form-contain']}`}>
      {showErr && (
        <div className="-mt-4 pb-4">
          <Alert
            className="w-full"
            message={<FormattedMessage defaultMessage="配置信息有误，无法连接，请修改后再试" />}
            type="error"
          />
        </div>
      )}
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 11 }}
        onFinish={values => void onFinish(values as StorageConfig)}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        validateTrigger="onBlur"
        className="ml-3"
        initialValues={{ accessKeyID: { kind: '0' }, secretAccessKey: { kind: '0' }, ...config }}
      >
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '名称' })}
          rules={[
            { required: true, message: intl.formatMessage({ defaultMessage: '请输入名称' }) }
          ]}
          name="name"
        >
          <Input placeholder={intl.formatMessage({ defaultMessage: '请输入...' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '服务地址' })}
          name="endPoint"
          rules={[
            { required: true, message: intl.formatMessage({ defaultMessage: '请输入服务地址' }) }
          ]}
        >
          <Input
            addonBefore="http(s)://"
            placeholder={intl.formatMessage({ defaultMessage: '请输入...' })}
          />
        </Form.Item>
        <Form.Item label="App ID">
          <Input.Group compact className="!flex">
            <Form.Item name={['accessKeyID', 'kind']} noStyle>
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
              name={['accessKeyID', 'val']}
              noStyle
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ defaultMessage: 'App ID不能为空' })
                }
              ]}
            >
              {accessKeyIDKind === '0' ? (
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
        <Form.Item label="App Secret">
          <Input.Group compact className="!flex">
            <Form.Item name={['secretAccessKey', 'kind']} noStyle>
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
              name={['secretAccessKey', 'val']}
              noStyle
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ defaultMessage: 'App Secret不能为空' })
                }
              ]}
            >
              {secretAccessKeyKind === '0' ? (
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
          label={intl.formatMessage({ defaultMessage: '区域' })}
          name="bucketLocation"
          rules={[
            { required: true, message: intl.formatMessage({ defaultMessage: '请输入区域' }) }
          ]}
        >
          <Input placeholder={intl.formatMessage({ defaultMessage: '请输入...' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '桶名称' })}
          name="bucketName"
          rules={[
            { required: true, message: intl.formatMessage({ defaultMessage: '请输入bucketName' }) }
          ]}
        >
          <Input placeholder={intl.formatMessage({ defaultMessage: '请输入...' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ defaultMessage: '开启SSL' })}
          style={{ marginTop: '29px' }}
          name="useSSL"
          valuePropName="checked"
        >
          <Switch className={styles['switch-set-btn']} size="small" />
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
              handleSwitch('detail', content?.id)
            }}
          >
            <span>取消</span>
          </Button>
          <Button className="ml-4 btn-test" onClick={() => handleTest()} loading={testing}>
            <FormattedMessage defaultMessage="测试" />
          </Button>
          <Button className="ml-4 btn-save" onClick={() => form.submit()}>
            <FormattedMessage defaultMessage="保存" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
