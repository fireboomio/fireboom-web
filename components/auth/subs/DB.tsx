import { Select } from 'antd'
import { useEffect, useState } from 'react'

import IconFont from '@/components/iconfont'

interface OptionType {
  label: string
  value: string
}

export default function AuthDB() {
  const [options, setOptions] = useState<OptionType[]>()

  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  useEffect(() => {
    const opts = [
      { label: 'aaa', value: 'aaa' },
      { label: 'bbb', value: 'bbb' },
    ]
    setOptions(opts)
  }, [])

  return (
    <>
      <div className="flex items-center my-6">
        <div className="text-base mr-4">数据库</div>
        <Select
          size="middle"
          defaultValue=""
          style={{ width: 270 }}
          onChange={handleChange}
          options={options}
        />
        <div className="ml-6 text-[#00000040]">
          <IconFont type="icon-zhuyi" style={{ fontSize: '14px', color: '#00000040' }} />
          <span className="ml-2">配置数据库且导入表结构后，该模块方可正常使用</span>
        </div>
      </div>

      <div
        className="px-6 py-4 rounded bg-[#E0202017] text-[#000000D9]"
        style={{ border: '1px solid #E02020' }}
      >
        所选数据库暂无预制表结构不完整，是否覆盖
      </div>

      <div className="flex px-8 py-3">
        <div>数据库：</div>
      </div>
    </>
  )
}
