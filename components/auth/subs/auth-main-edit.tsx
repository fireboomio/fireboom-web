import { RightOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Radio } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvItem } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context'

import styles from './auth-common-main.module.scss'

interface Props {
  content: AuthProvItem
}
export default function AuthMainCheck({ content }: Props) {
  const { handleToggleDesigner } = useContext(AuthToggleContext)

  const [value, setValue] = useImmer(1)
  const [open, setOpen] = useImmer(1)
  const [isRadioShow, setIsRadioShow] = useImmer(true)
  const { TextArea } = Input
  if (!content) {
    return <></>
  }
  const onFinish = (values: object) => {
    console.log('Success:', values)
  }

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo)
  }
  const onChangeRadio = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setValue(e.target.value)
    setIsRadioShow(!isRadioShow)
  }
  const onOpenRadio = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setOpen(e.target.value)
  }
  return (
    <>
      <div className="pb-3 flex items-center justify-between border-gray border-b">
        <div className="h-7">
          <span className="ml-2 font-bold">
            系统默认 <span className="text-xs text-gray-500/80">main</span>
          </span>
        </div>
        <div className="flex justify-center items-center">
          <Divider type="vertical" />
          <Button className={styles['center-btn']}>
            <span>取消</span>
          </Button>
          <Button className={styles['save-btn']}>
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
          name="basic"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 11 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          validateTrigger="onBlur"
          labelAlign="left"
          className="ml-3"
        >
          <Form.Item label="供应商ID">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App ID" required>
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="App Secret" required>
            <Input.Password placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="Issuer" required>
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="服务发现地址">
            <Input disabled />
          </Form.Item>
          <Form.Item label="JWKS">
            <Radio.Group onChange={onChangeRadio} value={value}>
              <Radio value={1} defaultChecked={true} className="mr-18">
                URL
              </Radio>
              <Radio value={2}>JSON</Radio>
            </Radio.Group>
          </Form.Item>
          {isRadioShow ? (
            <div>
              <Form.Item label="jwksURL">
                <Input suffix="浏览" disabled />
              </Form.Item>
            </div>
          ) : (
            <Form.Item label="jwksJSON">
              <TextArea rows={4} />
            </Form.Item>
          )}
          <Form.Item label="用户端点">
            <Input placeholder="请输入..." />
          </Form.Item>
          <Form.Item label="是否开启">
            <Radio.Group onChange={onOpenRadio} value={open}>
              <Radio value={1} defaultChecked={true} className="mr-6.5">
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
