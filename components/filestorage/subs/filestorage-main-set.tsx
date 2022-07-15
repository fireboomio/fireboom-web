import { Button, Form, Input, Switch, Divider } from 'antd'
import { useImmer } from 'use-immer'

import type { FileStorageResp } from '@/interfaces/filestorage'
import requests from '@/lib/fetchers'

import styles from './filestorage-common-main.module.scss'

interface FromValues {
  [key: string]: number | string | boolean
}
interface Props {
  content: FileStorageResp
}
interface Response {
  status: number
  data: { result: FileStorageResp[]; [key: string]: number | string | boolean | object }
  [key: string]: number | string | boolean | object
}

export default function StorageMainSet({ content }: Props) {
  const [disabled, setDisabled] = useImmer(true)
  const [form] = Form.useForm()
  const connectSwitchOnChange = () => {
    console.log('switch change')
  }
  const onFinish = async (values: object) => {
    console.log('Success:', values)
    console.log(JSON.stringify(values))
    await requests.put('/auth', { ...content, config: JSON.stringify(values) })
    const auth: Response = await requests.get('/auth')
    console.log(auth)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }

  const onValuesChange = (changedValues: object, allValues: FromValues) => {
    console.log(allValues)
    for (const key in allValues) {
      if ((allValues[key] as string) == undefined || allValues[key] == '') {
        setDisabled(true)
        return
      }
    }
    setDisabled(false)
  }

  if (!content) {
    return <></>
  }
  return (
    <>
      <div className="pb-2 flex items-center justify-between border-gray border-b">
        <div>
          <span className="text-base leading-5 font-bold">设置</span>
        </div>
        <div className="flex justify-center items-center">
          <Switch
            defaultChecked
            checkedChildren="开启"
            unCheckedChildren="关闭"
            onChange={connectSwitchOnChange}
            className={styles['switch-check-btn']}
          />
          <Divider type="vertical" />
          <Button className={styles['center-btn']}>
            <span>取消</span>
          </Button>
          <Button
            disabled={disabled}
            className={styles['save-btn']}
            onClick={() => {
              form.submit()
            }}
          >
            <span>保存</span>
          </Button>
        </div>
      </div>

      <div className={`${styles['form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 11 }}
          onFinish={(values) => {
            void onFinish(values as object)
          }}
          onValuesChange={onValuesChange}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
          labelAlign="left"
          className="ml-3"
        >
          <Form.Item label="名称">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="服务地址">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App ID" required>
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App Secret" required>
            <Input.Password placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="区域">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="bucketName">
            <Input placeholder="请输入..." />
          </Form.Item>

          <Form.Item label="开启SSL" style={{ marginTop: '29px' }} rules={[{ required: true }]}>
            <Switch defaultChecked className={styles['switch-set-btn']} size="small" />
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
