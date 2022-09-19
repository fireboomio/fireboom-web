import { Button, Form, Input, Switch } from 'antd'
import { useEffect, useState } from 'react'

import { OtherType } from '@/interfaces/experience'
import requests from '@/lib/fetchers'

interface Props {
  data?: OtherType
  // handleTopToggleDesigner: (authType: AuthListType) => void
}

// eslint-disable-next-line react/prop-types
const Other: React.FC<Props> = ({ data }) => {
  const [state, setState] = useState<OtherType | undefined>(data)
  const [form] = Form.useForm()

  useEffect(() => {
    setState(data)
  }, [data])

  function handleFinish(values: OtherType) {
    void requests.post('/auth/otherConfig', {
      enabled: values?.enabled,
      contentUrl: values?.contractUrl,
    })
  }

  if (!state) return <></>

  return (
    <div className="w-1/2 pr-6">
      <Form form={form} name="basic" initialValues={state} onFinish={handleFinish}>
        <div className="text-xs text-[#AFB0B4] mb-4.5">使用条款</div>
        <div className="text-sm mb-2">
          <span className="text-[#E13D5BFF]">{'//'}</span> 开启使用条款
        </div>
        <div className="flex justify-between items-center py-10px px-3 bg-[#F8F9FB]">
          <span className="pr-8 text-sm text-[#5F6269]">添加使用产品的法律协议</span>
          <Form.Item valuePropName="checked" name="enabled">
            <Switch className="ml-8" size="small" />
          </Form.Item>
        </div>

        <div className="text-sm mt-4 mb-2">
          <span className="text-[#E13D5BFF]">{'//'}</span> 使用条款
        </div>
        <Form.Item name="contractUrl">
          <Input />
        </Form.Item>

        <Form.Item>
          <Button className="float-right mt-10" type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Other
