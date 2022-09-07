import { Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

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

  const databases = useMemo(() => {
    return [
      { name: 'aaa', isOk: true },
      { name: 'bbb', isOk: false },
    ]
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
        className="px-6 py-4 text-base rounded bg-[#E0202017] text-[#000000D9]"
        style={{ border: '1px solid #E02020' }}
      >
        所选数据库暂无预制表结构不完整，是否覆盖
      </div>

      <div className="mt-7 ">
        <div className="px-8 py-3 text-base text-[#787D8B]">
          <span>数据库：</span>
          <span>sss</span>
        </div>
        <div style={{ border: '1px solid rgba(95,98,105,0.1)' }} />

        <div className="flex items-center">
          <div>
            {databases.map(x => (
              <div key={x.name} className="flex items-center mt-3 mx-8 my-1.5 text-base">
                <div className="mr-4">✅</div>
                <div className="text-base text-[#000000D9]">{x.name}</div>
              </div>
            ))}
          </div>

          <div>
            {databases.map(x => (
              <div key={x.name} className="flex items-center mt-3 mx-8 my-1.5 text-base">
                <div className="mr-4">❎</div>
                <div className="text-base text-[#000000D9]">{x.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
