import { Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import IconFont from '@/components/iconfont'
import { DatasourceResp } from '@/interfaces/datasource'
import { getFetcher } from '@/lib/fetchers'

interface OptionType {
  label: string
  value: string
}

interface TableT {
  name: string
  isOk: boolean
}

export default function AuthDB() {
  const [options, setOptions] = useState<OptionType[]>()
  const [selectedDB, setSelectedDB] = useState<string>()
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [tables, setTables] = useState<TableT[]>([])

  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }

  const dbName = useMemo(() => {
    const opt = options?.find(x => x.value === selectedDB)
    return opt?.label
  }, [options, selectedDB])

  useEffect(() => {
    void getFetcher<DatasourceResp[]>('/dataSource').then(res => {
      const opts = res.map(x => ({
        label: x.name,
        value: x.id.toString(),
      }))
      setOptions(opts)
      setSelectedDB(opts.at(0)?.value)
    })
  }, [])

  useEffect(() => {
    if (!selectedDB) return

    void getFetcher<{ exist: string[]; notExist: string[] }>(
      `/oauth/tables/${selectedDB ?? ''}`
    ).then(res => {
      console.log(res)
      const oks = res.exist.map(x => ({ name: x, isOk: true }))
      const nooks = res.notExist.map(x => ({ name: x, isOk: false }))
      setTables(oks.concat(nooks))
    })
  }, [selectedDB])

  return (
    <>
      <div className="flex items-center my-6">
        <div className="text-base mr-4">数据库</div>
        <Select
          size="middle"
          value={selectedDB ?? ''}
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
          <span>{dbName}</span>
        </div>
        <div style={{ border: '1px solid rgba(95,98,105,0.1)' }} />

        <div className="flex items-center">
          <div>
            {tables
              .filter(x => x.isOk === true)
              .map(x => (
                <div key={x.name} className="flex items-center mt-3 mx-8 my-1.5 text-base">
                  <div className="mr-4">✅</div>
                  <div className="text-base text-[#000000D9]">{x.name}</div>
                </div>
              ))}
          </div>

          <div>
            {tables
              .filter(x => x.isOk === false)
              .map(x => (
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
