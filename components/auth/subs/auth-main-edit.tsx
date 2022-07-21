/* eslint-disable camelcase */
import { RightOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Radio } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext, AuthDispatchContext } from '@/lib/context'
import requests from '@/lib/fetchers'

import styles from './auth-common-main.module.scss'
interface FromValues {
  [key: string]: number | string | boolean
}
interface Props {
  content: AuthProvResp
}
interface Response {
  status: number
  data: { result: AuthProvResp[]; [key: string]: number | string | boolean | object }
  [key: string]: number | string | boolean | object
}

export default function AuthMainCheck({ content }: Props) {
  const { handleToggleDesigner } = useContext(AuthToggleContext)
  const dispatch = useContext(AuthDispatchContext)
  const [disabled, setDisabled] = useImmer(true)
  const [form] = Form.useForm()
  const [value, setValue] = useImmer(1)
  const [open, setOpen] = useImmer(0)
  const [isRadioShow, setIsRadioShow] = useImmer(true)
  const { TextArea } = Input
  if (!content) {
    return <></>
  }
  const onFinish = async (values: object) => {
    console.log('Success:', values)
    console.log(JSON.stringify(values))
    await requests.put('/auth', { ...content, config: JSON.stringify(values) })
    const auth: Response = await requests.get('/auth')
    console.log('autu', auth)
    dispatch({
      type: 'fetched',
      data: [].slice.call(auth, 0),
    })
    handleToggleDesigner('data', content.id)
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

  const onChangeRadio = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValue(e.target.value)
    setIsRadioShow(!isRadioShow)
  }
  const onOpenRadio = () => {
    if (content.switch_state) {
      setOpen(content.switch_state)
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }
  return (
    <>
      <div className="pb-3 flex items-center justify-between border-gray border-b">
        <div className="h-7">
          <span className="ml-2 font-bold">
            {content.name} <span className="text-xs text-gray-500/80">main</span>
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Divider type="vertical" />
          <Button className={styles['center-btn']}>
            <span>取消</span>
          </Button>
          <Button
            disabled={disabled}
            className={styles['save-btn']}
            onClick={() => {
              form.submit()
              handleToggleDesigner('data', content.id)
            }}
          >
            <span>保存</span>
          </Button>
        </div>
      </div>
      <div
        className={`${styles['db-check-setting']}  mt-2 cursor-pointer`}
        onClick={() => {
          handleToggleDesigner('setting', content.id)
        }}
      >
        <span className=" w-19 h-5 float-right">
          前往管理 <RightOutlined />
        </span>
      </div>
      <div className={`${styles['edit-form-contain']} py-6 rounded-xl mb-4`}>
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 11 }}
          onFinish={(values) => {
            void onFinish(values)
          }}
          onValuesChange={onValuesChange}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
          labelAlign="left"
          className="ml-3"
        >
          <Form.Item label="供应商ID" name="auth_supplier">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App ID" required name="app_id">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App Secret" required name="app_secret">
            <Input.Password placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="Issuer" required name="issuer">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="服务发现地址" name="service_address">
            <Input />
          </Form.Item>
          <Form.Item label="JWKS" name="jwks">
            <Radio.Group onChange={onChangeRadio} value={value}>
              <Radio value={1} defaultChecked={true} className="mr-18">
                URL
              </Radio>
              <Radio value={2}>JSON</Radio>
            </Radio.Group>
          </Form.Item>
          {isRadioShow ? (
            <div>
              <Form.Item label="jwksURL" name="jwks_url">
                <Input suffix="浏览" />
              </Form.Item>
            </div>
          ) : (
            <Form.Item label="jwksJSON" name="jwks_json">
              <TextArea rows={4} />
            </Form.Item>
          )}
          <Form.Item label="用户端点" name="user_point">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="是否开启" name="switch_state">
            <Radio.Group onChange={onOpenRadio} value={open}>
              <Radio value={1} className="mr-6.5">
                基于Cookie
              </Radio>
              <Radio value={2}>基于Token</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
