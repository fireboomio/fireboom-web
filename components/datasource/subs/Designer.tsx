import { Image } from 'antd'
import { useContext } from 'react'

import { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext,
} from '@/lib/context/datasource-context'

import styles from './Designer.module.scss'

const data = [
  {
    name: 'API',
    items: [
      { name: 'REST API', logo: 'api-rest.svg', sourceType: 2 },
      { name: 'GraphQL API', logo: 'api-graphql.svg', sourceType: 3 },
    ],
  },
  {
    name: '数据库',
    items: [
      { name: 'PostgreSQL', logo: 'api-db.svg', sourceType: 1, dbType: 'PGSQL' },
      { name: 'MySQL', logo: 'api-db.svg', sourceType: 1, dbType: 'MySql' },
    ],
  },
  { name: '自定义', items: [{ name: '自定义', logo: 'api-custom.svg', sourceType: 4 }] },
]

export default function Designer() {
  const dispatch = useContext(DatasourceDispatchContext)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)

  function handleClick(sourceType: number, dbType: string) {
    const data = {
      id: Date.now(),
      name: '',
      config: { dbType: dbType },
      sourceType: sourceType,
      switch: 0,
    } as DatasourceResp
    dispatch({ type: 'added', data: data })
    handleToggleDesigner('form', data.id, sourceType)
  }

  return (
    <>
      {data.map(category => (
        <div key={category.name} className="my-42px">
          <div className={`text-lg ${styles['title']}`}>
            <span className="pl-2.5">{category.name}</span>
          </div>
          <div className="flex flex-wrap gap-x-9.5 gap-y-5 items-center my-4">
            {category.items.map(x => (
              <>
                <div
                  key={x.name}
                  className="cursor-pointer text-[#333333FF] border border-gray-300/20 bg-[#FDFDFDFF] py-3.5 pl-4 min-w-53 w-53"
                  // @ts-ignore
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  onClick={() => handleClick(x.sourceType, x.dbType)}
                >
                  <Image
                    height={28}
                    width={28}
                    src={`/assets/${x.logo}`}
                    alt={x.name}
                    preview={false}
                  />
                  <span className="ml-3">{x.name}</span>
                </div>
              </>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
