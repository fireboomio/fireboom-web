import { Button, message, Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'

import IconFont from '@/components/iconfont'
import requests, { getFetcher } from '@/lib/fetchers'

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
  const [isComplete, setIsComplete] = useState(true)

  const handleChange = (value: string) => {
    setSelectedDB(value)
  }

  const dbName = useMemo(() => {
    const opt = options?.find(x => x.value === selectedDB)
    return opt?.label
  }, [options, selectedDB])

  useEffect(() => {
    void getFetcher('/oauth/dblist').then(res => {
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const opts = res.dbs.map(x => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        label: x.name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        value: x.id.toString()
      }))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setOptions(opts)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      setSelectedDB(opts.at(0)?.value)
    })
  }, [])

  useEffect(() => {
    if (!selectedDB) return

    void getFetcher<{ exist: string[]; notExist: string[] }>(
      `/oauth/tables/${selectedDB ?? ''}`
    ).then(res => {
      const oks = res.exist.map(x => ({ name: x, isOk: true }))
      const nooks = res.notExist.map(x => ({ name: x, isOk: false }))
      setIsComplete(nooks.length === 0)
      setTables(oks.concat(nooks))
    })
  }, [selectedDB])

  function handleImport() {
    void requests
      .post(`/oauth/tables/${selectedDB ?? ''}/import`)
      .then(() => message.success('导入成功!'))
  }

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
        {isComplete ? (
          <>
            <a download={'预置'} href={`/api/v1/oauth/tables/${selectedDB ?? ''}/export`}>
              下载
            </a>{' '}
            预置表结构，手工导入
          </>
        ) : (
          <>
            所选数据库暂无预制表结构，是否导入？
            <Button type="primary" onClick={handleImport}>
              导入
            </Button>
          </>
        )}
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
