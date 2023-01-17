import { Button, Form, Input } from 'antd'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { setAuthKey } from '@/lib/fetchers'

interface AuthenticationProps {
  children: ReactElement
}

const Authentication = (props: AuthenticationProps) => {
  const intl = useIntl()
  const [authed, setAuthed] = useState(false)
  const onSubmit = ({ key }: { key: string }) => {
    setAuthKey(key)
    setAuthed(true)
  }
  return authed ? (
    props.children
  ) : (
    <div className="flex flex-col h-screen bg-warm-gray-200 w-screen items-center justify-center">
      <div>
        <Form className="flex w-200 items-center" layout="inline" onFinish={onSubmit}>
          <Form.Item
            name="key"
            className="!flex-1"
            rules={[
              { required: true, message: intl.formatMessage({ defaultMessage: '请输入密钥' }) }
            ]}
          >
            <Input
              className="flex-1"
              placeholder={intl.formatMessage({ defaultMessage: '请输入密钥' })}
              required
              size="large"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="ml-2" size="large" type="primary">
              <FormattedMessage defaultMessage="提交" />
            </Button>
          </Form.Item>
        </Form>
        <p className="mt-2 text-dark-400">
          <FormattedMessage defaultMessage="密钥可以在 Fireboom 启动日志中查找关键词"></FormattedMessage>
          <code className="rounded-sm bg-gray-500 text-white ml-1 py-0.5 px-1">
            Fireboom production key is
          </code>
        </p>
      </div>
    </div>
  )
}

export default Authentication
