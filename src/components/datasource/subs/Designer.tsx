import { Input, Modal } from 'antd'
import { useContext, useEffect, useRef, useState } from 'react'

import IconFont from '@/components/iconfont'
import getDefaultCode from '@/components/Ide/getDefaultCode'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'

import iconAli from '../assets/ali.svg'
import iconCockroachDB from '../assets/CockroachDB.svg'
import iconFaas from '../assets/Faas.svg'
import iconGraphalAPI from '../assets/GraphalAPI.svg'
import iconMariaDB from '../assets/MariaDB.svg'
import iconMongoDB from '../assets/MongoDB.svg'
import iconMySQL from '../assets/MySQL.svg'
import iconNode from '../assets/node.js.svg'
import iconPlanetscale from '../assets/Planetscale.svg'
import iconPostgreSQL from '../assets/PostgreSQL.svg'
import iconRabbitMQ from '../assets/RabbitMQ.svg'
import iconRESTAPI from '../assets/RESTAPI.svg'
import iconRocketMQ from '../assets/RocketMQ.svg'
import iconSQLite from '../assets/SQLite.svg'
import iconSQLServer from '../assets/SQLServer.svg'
import styles from './Designer.module.less'

const initData: {
  name: string
  items: {
    name: string
    logo?: string
    icon: string
    sourceType?: number
    dbType?: string
    coming?: boolean
  }[]
}[] = [
  {
    name: 'API',
    items: [
      { name: 'REST API', icon: iconRESTAPI, sourceType: 2 },
      { name: 'GraphQL API', icon: iconGraphalAPI, sourceType: 3 }
    ]
  },
  {
    name: '数据库',
    items: [
      { name: 'PostgreSQL', icon: iconPostgreSQL, sourceType: 1, dbType: 'PostgreSQL' },
      { name: 'MySQL', icon: iconMySQL, sourceType: 1, dbType: 'MySQL' },
      { name: 'MongoDB', icon: iconMongoDB, sourceType: 1, dbType: 'MongoDB' },
      { name: 'Sqlite', icon: iconSQLite, sourceType: 1, dbType: 'SQLite' },
      {
        name: 'CockroachDB',
        icon: iconCockroachDB,
        sourceType: 1,
        dbType: 'CockroachDB',
        coming: true
      },
      {
        name: 'SQL Server',
        icon: iconSQLServer,
        sourceType: 1,
        dbType: 'SQL Server',
        coming: true
      },
      {
        name: 'Plantscale',
        icon: iconPlanetscale,
        sourceType: 1,
        dbType: 'Plantscale',
        coming: true
      },
      {
        name: 'MariaDB',
        icon: iconMariaDB,
        sourceType: 1,
        dbType: 'MariaDB',
        coming: true
      }
    ]
  },
  {
    name: '消息队列',
    items: [
      { name: 'RabbitMQ', icon: iconRabbitMQ, coming: true },
      { name: 'RocketMQ', icon: iconRocketMQ, coming: true },
      { name: '阿里云物联网平台', icon: iconAli, coming: true }
    ]
  },
  {
    name: '自定义',
    items: [
      { name: 'node.js', icon: iconNode, sourceType: 4 },
      { name: 'Faas', icon: iconFaas, sourceType: 4, coming: true }
    ]
  }
]

const iconMap: Record<string, string> = {}
initData.forEach(({ items }) => {
  items.forEach(({ sourceType, dbType, icon }) => {
    iconMap[`${sourceType}_${dbType ?? ''}`.toLowerCase()] = icon
  })
})

export default function Designer() {
  const dispatch = useContext(DatasourceDispatchContext)
  const { handleToggleDesigner, handleCreate } = useContext(DatasourceToggleContext)
  const [data, setData] = useState(initData)
  const [examples, setExamples] = useState([])
  const inputValue = useRef<string>('')

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
            icon: iconMap[`${x.config.sourceType}_${x.config.config.dbType ?? ''}`.toLowerCase()],
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

  function createCustom() {
    Modal.info({
      title: '请输入文件夹名称',
      content: (
        <Input
          autoFocus
          placeholder="请输入"
          onChange={e => {
            inputValue.current = e.target.value
          }}
        />
      ),
      okText: '创建',
      onOk: async () => {
        if (!inputValue.current) {
          return
        }
        let data = {
          id: Date.now(),
          name: inputValue.current,
          config: { apiNamespace: inputValue.current, serverName: inputValue.current },
          sourceType: 4,
          switch: 0
        } as DatasourceResp
        data.id = Date.now()
        handleCreate(data)
      }
    })
  }
  function handleClick(sourceType: number, dbType: string, name: string) {
    if (sourceType === 4) {
      return createCustom()
    }
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
                className="border rounded cursor-pointer bg-[#F8F9FD] border-gray-300/20 min-w-53 py-9px pl-4 transition-shadow text-[#333333] w-53 hover:shadow-lg flex items-center relative"
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onClick={() => !x.coming && handleClick(x.sourceType, x.dbType, x.name)}
              >
                {/* <Image
                    height={28}
                    width={28}
                    src={`/assets/${x.logo}`}
                    alt={x.name}
                    preview={false}
                  /> */}
                <div className="bg-white rounded-3xl h-7 shadow w-7 inline-flex items-center justify-center">
                  {x.logo ? (
                    <IconFont type={x.logo} style={{ fontSize: '16px' }} />
                  ) : (
                    <img alt="" src={x.icon} />
                  )}
                </div>
                <span className={'ml-3' + (x.coming ? ' text-[#787D8B]' : '')}>{x.name}</span>
                {x.coming && <div className={styles.coming}>即将</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
