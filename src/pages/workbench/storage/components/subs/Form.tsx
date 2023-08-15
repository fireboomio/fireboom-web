import { Alert, Button, Form, Input, message, Switch } from 'antd'
import { useContext, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import InputOrFromEnvWithItem from '@/components/InputOrFromEnv'
import { mutateStorage, useStorageList } from '@/hooks/store/storage'
import { useValidate } from '@/hooks/validate'
import { StorageSwitchContext } from '@/lib/context/storage-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import type { ApiDocuments } from '@/services/a2s.namespace'

import imgAli from '../assets/ali.png'
import imgGoogle from '../assets/google.png'
import imgMinio from '../assets/minio.png'
import imgTencent from '../assets/tencent.png'
import styles from './subs.module.less'

interface Props {
  content?: ApiDocuments.Storage
  showErr?: boolean
}
const supportList = [
  {
    img: imgAli,
    link: 'https://help.aliyun.com/product/31815.html'
  },
  {
    img: imgTencent,
    link: 'https://cloud.tencent.com/document/product/436'
  },
  {
    img: imgGoogle,
    link: 'https://cloud.google.com/storage/docs'
  },
  {
    img: imgMinio,
    link: 'https://docs.min.io/docs/minio-quickstart-guide.html'
  }
]

export default function StorageForm({ content, showErr }: Props) {
  console.log(content)
  const intl = useIntl()
  const { ruleMap } = useValidate()
  const { handleSwitch } = useContext(StorageSwitchContext)
  const navigate = useNavigate()
  const { onRefreshMenu } = useContext(WorkbenchContext)

  const [form] = Form.useForm<ApiDocuments.Storage>()
  const [testing, setTesting] = useState(false)
  const storageList = useStorageList()
  // useEffect(() => {
  //   form.resetFields()
  // }, [content])

  const { loading, fun: onFinish } = useLock(
    async (values: ApiDocuments.Storage) => {
      if (
        storageList?.find(item => {
          return item.name === values.name && item.name !== content?.name
        })
      ) {
        message.error(intl.formatMessage({ defaultMessage: '名称不能重复' }))
        return
      }
      // const payload = {
      //   name: values.name,
      //   config: { ...values, uploadProfiles: content?.config.uploadProfiles },
      //   useSSL: true
      // }

      if (content) {
        await requests.put('/storage', values)
      } else {
        await requests.post<unknown, ApiDocuments.Storage>('/storage', values)
      }
      await mutateStorage()
      navigate(`/workbench/storage/${values.name}`, { replace: true })
      handleSwitch('detail', values.name)
    },
    [content, handleSwitch, intl, navigate, storageList]
  )

  const onFinishFailed = (_errorInfo: object) => {
    void message.error(intl.formatMessage({ defaultMessage: '保存失败！' }))
  }

  const handleTest = async () => {
    setTesting(true)
    const values = form.getFieldsValue()
    try {
      await requests.post('/storageClient/ping', values)
      message.success(intl.formatMessage({ defaultMessage: '连接成功' }))
    } catch (error) {
      //
    }
    setTesting(false)
  }

  return (
    <div className={`${styles['form-contain']} flex`}>
      <div className="flex-1">
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
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
          className="ml-3"
          initialValues={{
            enabled: true,
            ...content
          }}
        >
          <Form.Item name="enabled" hidden valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({ defaultMessage: '名称' })}
            rules={[
              { required: true, message: intl.formatMessage({ defaultMessage: '请输入名称' }) },
              ...ruleMap.name
            ]}
            name="name"
          >
            <Input
              disabled={!!content?.name}
              placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
            />
          </Form.Item>
          <InputOrFromEnvWithItem
            formItemProps={{
              name: 'endpoint',
              label: intl.formatMessage({ defaultMessage: '服务地址' })
            }}
            required
            inputProps={{
              addonBefore: 'http(s)://'
            }}
          />
          {/* <Form.Item
            label={intl.formatMessage({ defaultMessage: '服务地址' })}
            name={['endPoint', 'staticVariableContent']}
            rules={[
              { required: true, message: intl.formatMessage({ defaultMessage: '请输入服务地址' }) }
            ]}
          >
            <Input
              addonBefore="http(s)://"
              placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
            />
          </Form.Item> */}

          <InputOrFromEnvWithItem
            formItemProps={{
              name: 'accessKeyID',
              label: 'App ID'
            }}
            required
          />
          {/* <Form.Item label="App ID" required>
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
          </Form.Item> */}
          <InputOrFromEnvWithItem
            formItemProps={{
              name: 'secretAccessKey',
              label: 'App Secret'
            }}
            required
          />
          {/* <Form.Item label="App Secret" required>
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
          </Form.Item> */}
          <InputOrFromEnvWithItem
            formItemProps={{
              name: 'bucketLocation',
              label: intl.formatMessage({ defaultMessage: '区域' })
            }}
            required
          />
          {/* <Form.Item
            label={intl.formatMessage({ defaultMessage: '区域' })}
            name={['bucketLocation', 'staticVariableContent']}
            rules={[
              { required: true, message: intl.formatMessage({ defaultMessage: '请输入区域' }) }
            ]}
          >
            <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
          </Form.Item> */}
          <InputOrFromEnvWithItem
            formItemProps={{
              name: 'bucketName',
              label: intl.formatMessage({ defaultMessage: '桶名称' })
            }}
            required
          />
          {/* <Form.Item
            label={intl.formatMessage({ defaultMessage: '桶名称' })}
            name={['bucketName', 'staticVariableContent']}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ defaultMessage: '请输入bucketName' })
              }
            ]}
          >
            <Input placeholder={intl.formatMessage({ defaultMessage: '请输入' })} />
          </Form.Item> */}
          <Form.Item
            label={intl.formatMessage({ defaultMessage: '开启SSL' })}
            style={{ marginTop: '29px' }}
            name="useSSL"
            valuePropName="checked"
          >
            <Switch className={styles['switch-set-btn']} size="small" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 7, span: 17 }}>
            <Button
              className="btn-cancel"
              onClick={() => {
                // 无id的情况下取消，后退到前一个页面
                if (!content?.name) {
                  navigate(-1)
                  return
                }
                handleSwitch('detail', content?.name)
              }}
            >
              <span>{intl.formatMessage({ defaultMessage: '取消' })}</span>
            </Button>
            <Button className="ml-4 btn-test" onClick={() => handleTest()} loading={testing}>
              <FormattedMessage defaultMessage="测试" />
            </Button>
            <Button loading={loading} className="ml-4 btn-save" onClick={() => form.submit()}>
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
  )
}
