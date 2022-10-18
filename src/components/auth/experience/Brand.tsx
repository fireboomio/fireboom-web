import { Button, Form, Input, message } from 'antd'
import { useEffect, useState } from 'react'

import Error404 from '@/components/ErrorPage/404'
import type { BrandType } from '@/interfaces/experience'
import requests from '@/lib/fetchers'

interface Props {
  data?: BrandType
  // handleTopToggleDesigner: (authType: AuthListType) => void
}

// eslint-disable-next-line react/prop-types
const Brand: React.FC<Props> = ({ data }) => {
  const [state, setState] = useState<BrandType | undefined>(data)
  const [form] = Form.useForm()

  useEffect(() => {
    setState(data)
  }, [data])

  function handleFinish(values: BrandType) {
    void requests
      .post('/auth/brand', {
        branding: {
          logoUrl: values?.logo,
          slogan: values?.slogan
        },
        color: {
          isDarkModeEnabled: values?.darkMode,
          primaryColor: values?.color
        }
      })
      .then(() => message.success('保存成功'))
  }

  if (!state) return <Error404 />

  return (
    <div className="w-1/2 pr-6">
      <Form form={form} name="basic" initialValues={state} onFinish={handleFinish}>
        <div className="text-xs text-[#AFB0B4] mb-4.5">颜色</div>
        <div className="text-sm mb-2">
          <span className="text-[#E13D5BFF]">{'//'}</span> 品牌颜色
        </div>
        <Form.Item name="color">
          <Input />
        </Form.Item>

        <div className="text-xs text-[#AFB0B4] mb-4.5 mt-8">品牌订制区</div>
        <div className="text-sm mt-4 mb-2">
          <span className="text-[#E13D5BFF]">{'//'}</span> logo图片URL
        </div>
        <Form.Item name="logo">
          <Input />
        </Form.Item>

        <div className="text-sm mt-4 mb-2">
          <span className="text-[#E13D5BFF]">{'//'}</span> 标语
        </div>
        <Form.Item name="slogan">
          <Input />
        </Form.Item>

        <Button className="float-right mt-10" type="primary" htmlType="submit">
          保存
        </Button>
      </Form>
    </div>
  )
}

export default Brand
