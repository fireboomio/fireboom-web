import { App, Input, message } from 'antd'
import { omit } from 'lodash'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'
import { restExampleJson } from '@/pages/workbench/data-source/components/subs/exampleFile'
import uploadLocal from '@/utils/uploadLocal'

import iconAli from '../assets/ali.svg'
import iconCockroachDB from '../assets/CockroachDB.svg'
import iconFaas from '../assets/Faas.svg'
import iconGraphalAPI from '../assets/GraphalAPI.svg'
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

export default function Designer() {
  const intl = useIntl()
  const initData = useMemo<
    {
      name: string
      items: {
        name: string
        logo?: string
        icon: string
        sourceType?: number
        dbType?: string
        dbSchema?: string
        coming?: boolean
      }[]
    }[]
  >(
    () => [
      {
        name: 'API',
        items: [
          { name: 'REST API', icon: iconRESTAPI, sourceType: 2 },
          { name: 'GraphQL API', icon: iconGraphalAPI, sourceType: 3 }
        ]
      },
      {
        name: intl.formatMessage({ defaultMessage: '数据库' }),
        items: [
          { name: 'MySQL', icon: iconMySQL, sourceType: 1, dbType: 'MySQL', dbSchema: 'mysql' },
          { name: 'Sqlite', icon: iconSQLite, sourceType: 1, dbType: 'SQLite', dbSchema: 'sqlite' },
          {
            name: 'PostgreSQL',
            icon: iconPostgreSQL,
            sourceType: 1,
            dbType: 'PostgreSQL',
            dbSchema: 'postgresql'
            // coming: true
          },
          {
            name: 'MongoDB',
            icon: iconMongoDB,
            sourceType: 1,
            dbType: 'MongoDB',
            dbSchema: 'mongodb',
            coming: true
          },
          {
            name: 'CockroachDB',
            icon: iconCockroachDB,
            sourceType: 1,
            dbType: 'CockroachDB',
            dbSchema: 'cockroachdb',
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
          }
          // {
          //   name: 'MariaDB',
          //   icon: iconMariaDB,
          //   sourceType: 1,
          //   dbSchema: 'mysql',
          //   dbType: 'MariaDB',
          //   coming: true
          // }
        ]
      },
      {
        name: intl.formatMessage({ defaultMessage: '消息队列' }),
        items: [
          { name: 'RabbitMQ', icon: iconRabbitMQ, coming: true },
          { name: 'RocketMQ', icon: iconRocketMQ, coming: true },
          {
            name: intl.formatMessage({ defaultMessage: '阿里云物联网平台' }),
            icon: iconAli,
            coming: true
          }
        ]
      },
      {
        name: intl.formatMessage({ defaultMessage: '自定义' }),
        items: [
          { name: 'node.js', icon: iconNode, sourceType: 4 },
          { name: 'Faas', icon: iconFaas, sourceType: 4, coming: true }
        ]
      }
    ],
    [intl]
  )
  // 解析图标
  const iconMap = useMemo<Record<string, string>>(() => {
    const iconMap: Record<string, string> = {}
    initData.forEach(({ items }) => {
      items.forEach(({ sourceType, dbType, icon }) => {
        iconMap[`${sourceType}_${dbType ?? ''}`.toLowerCase()] = icon
      })
    })
    return iconMap
  }, [initData])
  const dispatch = useContext(DatasourceDispatchContext)
  const { handleToggleDesigner, handleCreate, handleSave } = useContext(DatasourceToggleContext)
  const [data, setData] = useState(initData)
  const [examples, setExamples] = useState([])
  const inputValue = useRef<string>('')

  useEffect(() => {
    const exampleList = [
      {
        coming: true,
        name: 'example_pgsql',
        sourceType: 1,
        config: {
          apiNamespace: 'example_pgsql',
          dbType: 'postgresql',
          appendType: '0',
          databaseUrl: {
            key: '',
            kind: '0',
            val: 'anson:1234qwer!@139.196.89.94:5433/dbc32d0e6ba2c141c196fe42bb389034b8anson'
          },
          schemaExtension: '',
          replaceJSONTypeFieldConfiguration: null,
          host: '',
          dbName: '',
          port: '',
          userName: {
            key: '',
            kind: '',
            val: ''
          },
          password: {
            key: '',
            kind: '',
            val: ''
          }
        },
        enabled: false,
        createTime: '',
        updateTime: '',
        deleteTime: ''
      },
      {
        name: 'example_restApi',
        sourceType: 2,
        config: {
          apiNameSpace: 'example_restApi',
          filePath: 'example_rest.json',
          baseURL: '',
          jwtType: '',
          secret: {
            key: '',
            kind: '',
            val: ''
          },
          signingMethod: '',
          tokenPoint: '',
          statusCodeUnions: false,
          headers: []
        },
        enabled: false,
        createTime: '',
        updateTime: '',
        deleteTime: '',
        onSelect: () => {
          uploadLocal('1', JSON.stringify(restExampleJson), 'example_rest.json')
        }
      },
      {
        name: 'example_graphqlApi',
        sourceType: 3,
        config: {
          apiNameSpace: 'example_graphqlApi',
          url: 'https://countries.trevorblades.com/',
          loadSchemaFromString: '',
          internal: false,
          customFloatScalars: null,
          customIntScalars: null,
          skipRenameRootFields: null,
          headers: []
        },
        enabled: false,
        createTime: '',
        updateTime: '',
        deleteTime: ''
      },
      {
        name: 'example_customer',
        sourceType: 4,
        config: {
          apiNamespace: 'example_customer',
          serverName: 'example_customer',
          enableGraphQLEndpoint: false,
          schema:
            "new GraphQLSchema({\n\t\t\t\tquery: new GraphQLObjectType({\n\t\t\t\t\tname: 'RootQueryType',\n\t\t\t\t\tfields: {\n\t\t\t\t\t\thello: {\n\t\t\t\t\t\t\ttype: GraphQLString,\n\t\t\t\t\t\t\tresolve() {\n\t\t\t\t\t\t\t\treturn 'world';\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t},\n\t\t\t\t}),\n\t\t\t}"
        },
        enabled: false,
        createTime: '',
        updateTime: '',
        deleteTime: ''
      }
    ]
    setExamples(exampleList as any)

    setData(x =>
      x.concat({
        name: intl.formatMessage({ defaultMessage: '示例数据源' }),
        items: exampleList.map(x => {
          return {
            coming: x.coming,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            name: x.name,
            icon: iconMap[`${x.sourceType}_${x.config.dbType ?? ''}`.toLowerCase()],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            sourceType: x.sourceType,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            dbType: x.config.dbType
          }
        })
      })
    )
  }, [])
  const { modal } = App.useApp()

  function createCustom() {
    const { destroy } = modal.confirm({
      title: intl.formatMessage({ defaultMessage: '请输入数据源名称' }),
      content: (
        <Input
          autoFocus
          required
          placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
          onChange={e => {
            inputValue.current = e.target.value.replace(/ /g, '')
          }}
        />
      ),
      okText: intl.formatMessage({ defaultMessage: '创建' }),
      cancelText: intl.formatMessage({ defaultMessage: '取消' }),
      okButtonProps: {
        async onClick() {
          if (!inputValue.current) {
            message.error(intl.formatMessage({ defaultMessage: '请输入数据源名称' }))
            return
          }
          let data = {
            name: inputValue.current,
            config: { apiNamespace: inputValue.current, serverName: inputValue.current },
            sourceType: 4,
            enabled: false
          } as any
          const result = await requests.post<unknown, number>('/dataSource', data)
          data.id = result
          handleSave(data)
          destroy()
        }
      }
    })
  }

  async function handleClick(sourceType: number, dbType: string, dbSchema: string, name: string) {
    if (sourceType === 4) {
      return createCustom()
    }
    let data = {
      id: 0,
      name: '',
      config: { dbType, dbSchema },
      sourceType: sourceType,
      enabled: false
    } as DatasourceResp

    if (name.startsWith('example_')) {
      // @ts-ignore
      data = examples.find(x => x.name === name)
    }
    // @ts-ignore
    await data.onSelect?.()

    handleCreate(omit(data, ['onSelect']) as DatasourceResp)
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
                className="border rounded cursor-pointer flex bg-[#F8F9FD] border-gray-300/20 min-w-53 py-9px pl-4 transition-shadow text-[#333333] w-53 items-center relative hover:shadow-lg"
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onClick={() => !x.coming && handleClick(x.sourceType, x.dbType, x.dbSchema, x.name)}
              >
                {/* <Image
                    height={28}
                    width={28}
                    src={`/assets/${x.logo}`}
                    alt={x.name}
                    preview={false}
                  /> */}
                <div className="bg-white rounded-3xl h-7 shadow w-7 inline-flex items-center justify-center">
                  <img alt="" src={x.icon} />
                </div>
                <span className={'ml-3' + (x.coming ? ' text-[#787D8B]' : '')}>{x.name}</span>
                {x.coming && (
                  <div className={styles.coming}>
                    {intl.formatMessage({ defaultMessage: '即将' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
