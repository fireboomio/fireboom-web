import { useContext, useEffect, useState } from 'react'

import IconFont from '@/components/iconfont'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'

import styles from './Designer.module.less'

const initData = [
  {
    name: 'API',
    items: [
      { name: 'REST API', logo: 'icon-shujuyuantubiao3', sourceType: 2 },
      { name: 'GraphQL API', logo: 'icon-QLweixuanzhong1', sourceType: 3 }
    ]
  },
  {
    name: '数据库',
    items: [
      { name: 'PostgreSQL', logo: 'icon-shujuyuantubiao2', sourceType: 1, dbType: 'PostgreSQL' },
      { name: 'MySQL', logo: 'icon-shujuyuantubiao1', sourceType: 1, dbType: 'MySQL' },
      { name: 'MongoDB', logo: 'icon-shujuyuantubiao4', sourceType: 1, dbType: 'MongoDB' },
      { name: 'Sqlite', logo: 'icon-shujuyuantubiao3', sourceType: 1, dbType: 'SQLite' }
    ]
  },
  { name: '自定义', items: [{ name: '自定义', logo: 'icon-wenjian', sourceType: 4 }] }
]

export default function Designer() {
  const dispatch = useContext(DatasourceDispatchContext)
  const { handleToggleDesigner, handleCreate } = useContext(DatasourceToggleContext)
  const [data, setData] = useState(initData)
  const [examples, setExamples] = useState([])

  useEffect(() => {
    void requests
      .get('/dataSource/example')
      .then(xs => {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        setExamples(xs.map(x => x.config))
        return xs
      })
      .then(xs =>
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        xs.map(x => {
          return {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            name: x.config.name,
            logo: 'icon-QLweixuanzhong1',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            sourceType: x.config.sourceType,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            dbType: x.config.config.dbType
          }
        })
      )
      .then(xx => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        setData(x => x.concat({ name: '示例数据源', items: xx }))
      })
  }, [])

  function handleClick(sourceType: number, dbType: string, name: string) {
    let data = {
      id: Date.now(),
      name: '',
      config: { dbType: dbType },
      sourceType: sourceType,
      switch: 0
    } as DatasourceResp

    if (name.startsWith('example_')) {
      // @ts-ignore
      data = examples.find(x => x.name === name)
    }

    data.id = Date.now()
    handleCreate(data)
  }

  return (
    <>
      {data.map(category => (
        <div key={category.name} className="mb-12">
          <div className={`text-lg ${styles['title']}`}>
            <span className="pl-2.5">{category.name}</span>
          </div>

          <div className="flex flex-wrap my-4 gap-x-9.5 gap-y-5 items-center">
            {category.items.map(x => (
              <div
                key={x.name}
                className="border rounded cursor-pointer bg-[#F8F9FD] border-gray-300/20 min-w-53 py-9px pl-4 transition-shadow text-[#333333] w-53 hover:shadow-lg flex items-center"
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onClick={() => handleClick(x.sourceType, x.dbType, x.name)}
              >
                {/* <Image
                    height={28}
                    width={28}
                    src={`/assets/${x.logo}`}
                    alt={x.name}
                    preview={false}
                  /> */}
                <div className="bg-white rounded-3xl h-7 shadow w-7 inline-flex items-center justify-center">
                  <IconFont type={x.logo} style={{ fontSize: '16px' }} />
                </div>
                <span className="ml-3">{x.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
