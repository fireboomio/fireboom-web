import { Button, Input } from 'antd'
import { useEffect, useState } from 'react'

import { BrandType } from '@/interfaces/experience'
import requests from '@/lib/fetchers'

interface Props {
  data?: BrandType
  // handleTopToggleDesigner: (authType: AuthListType) => void
}

// eslint-disable-next-line react/prop-types
const Brand: React.FC<Props> = ({ data }) => {
  const [state, setState] = useState<BrandType | undefined>(data)

  useEffect(() => {
    setState(data)
  }, [data])

  function save() {
    void requests.post('/auth/brand', {
      branding: {
        logoUrl: state?.logo,
        slogan: state?.slogan,
      },
      color: {
        isDarkModeEnabled: state?.darkMode,
        primaryColor: state?.color,
      },
    })
  }

  if (!state) return <></>

  return (
    <div className="w-1/2 pr-6">
      <div className="text-xs text-[#AFB0B4] mb-4.5">颜色</div>
      <div className="text-sm mb-2">
        <span className="text-[#E13D5BFF]">{'//'}</span> 品牌颜色
      </div>
      <Input defaultValue={state.color} />

      {/* <div className="mt-4">开启深色模式</div>
      <div className="flex items-center py-10px px-3 bg-[#F8F9FB]">
        <span className="pr-8 text-sm text-[#5F6269]">
          基于品牌颜色和logto的算法，应用将会有一个自动生成的深色模式。当然，你可以自定义和修改
        </span>
        <Switch className="ml-8" size="small" />
      </div> */}

      <div className="text-xs text-[#AFB0B4] mb-4.5 mt-8">品牌订制区</div>
      {/* <div className="text-sm mb-4">
        <span className="text-[#E13D5BFF]">{'//'}</span> 样式
      </div> */}

      <div className="text-sm mt-4 mb-2">
        <span className="text-[#E13D5BFF]">{'//'}</span> logo图片URL
      </div>
      <Input defaultValue={state.logo} />

      <div className="text-sm mt-4 mb-2">
        <span className="text-[#E13D5BFF]">{'//'}</span> 标语
      </div>
      <Input defaultValue={state.slogan} />

      <Button className="float-right mt-10" type="primary" onClick={save}>
        保存
      </Button>
    </div>
  )
}

export default Brand
