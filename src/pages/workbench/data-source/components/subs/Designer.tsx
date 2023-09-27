import { omit } from 'lodash'
import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import useCustom from '@/hooks/custom'
import { usePrompt } from '@/hooks/prompt'
import { mutateDataSource } from '@/hooks/store/dataSource'
import { useValidate } from '@/hooks/validate'
import { DataSourceKind } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'
// import { restExampleJson } from '@/pages/workbench/data-source/components/subs/exampleFile'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { isDatabaseKind } from '@/utils/datasource'

// import createFile from '@/utils/uploadLocal'
import iconAli from '../assets/ali.svg'
import iconCockroachDB from '../assets/CockroachDB.svg'
import iconFunction from '../assets/Function.svg'
import iconGraphalAPI from '../assets/GraphalAPI.svg'
import iconCustomGraphQL from '../assets/GraphQL.svg'
import iconMongoDB from '../assets/MongoDB.svg'
import iconMySQL from '../assets/MySQL.svg'
import iconPlanetscale from '../assets/Planetscale.svg'
import iconPostgreSQL from '../assets/PostgreSQL.svg'
import iconPrisma from '../assets/Prisma.svg'
import iconProxy from '../assets/Proxy.svg'
import iconRabbitMQ from '../assets/RabbitMQ.svg'
import iconRESTAPI from '../assets/RESTAPI.svg'
import iconRocketMQ from '../assets/RocketMQ.svg'
import iconSQLite from '../assets/SQLite.svg'
import iconSQLServer from '../assets/SQLServer.svg'
import styles from './Designer.module.less'

type DataSourceItem = {
  name: string
  logo?: string
  icon: string
  onClick?: () => void
  kind?: DataSourceKind
  isCustom?: boolean
  coming?: boolean
}

export default function Designer() {
  const intl = useIntl()
  const dict = useDict()
  const { addScript } = useCustom()
  const { validateName } = useValidate()
  const navigate = useNavigate()

  const prompt = usePrompt()

  const addPrisma = async () => {
    const { confirm, value } = await prompt({
      title: intl.formatMessage({ defaultMessage: `请输入 {name} 数据源名称` }, { name: 'Prisma' }),
      validator: (v: string) => {
        return validateName(v)
      }
    })
    if (!confirm) {
      return
    }
    try {
      await requests.post<any, Partial<ApiDocuments.Datasource>>('/datasource', {
        name: value,
        kind: DataSourceKind.Prisma,
        enabled: false,
        customDatabase: {
          databaseUrl: {
            staticVariableContent: `${value}.prisma`
          }
        }
      })
      await mutateDataSource()
      navigate(`/workbench/data-source/${value}`)
    } catch (error) {
      //
    }
  }

  const initData = [
    {
      name: 'API',
      items: [
        { name: 'REST API', icon: iconRESTAPI, kind: DataSourceKind.Restful, isCustom: true },
        {
          name: 'GraphQL API',
          icon: iconGraphalAPI,
          kind: DataSourceKind.Graphql
        }
      ]
    },
    {
      name: intl.formatMessage({ defaultMessage: '数据库' }),
      items: [
        { name: 'MySQL', icon: iconMySQL, kind: DataSourceKind.MySQL },
        { name: 'Sqlite', icon: iconSQLite, kind: DataSourceKind.SQLite },
        {
          name: 'PostgreSQL',
          icon: iconPostgreSQL,
          kind: DataSourceKind.PostgreSQL
        },
        {
          name: 'SQL Server',
          icon: iconSQLServer,
          kind: DataSourceKind.SQLServer
        },
        {
          name: 'MongoDB',
          icon: iconMongoDB,
          kind: DataSourceKind.MongoDB
        },
        {
          name: 'Prisma',
          icon: iconPrisma,
          kind: DataSourceKind.Prisma,
          onClick: addPrisma
        },
        {
          name: 'CockroachDB',
          icon: iconCockroachDB,
          kind: DataSourceKind.Unsupported,
          coming: true
        },
        {
          name: 'Plantscale',
          icon: iconPlanetscale,
          kind: DataSourceKind.Unsupported,
          coming: true
        }
      ]
    },
    {
      name: intl.formatMessage({ defaultMessage: '消息队列' }),
      items: [
        { name: 'RabbitMQ', icon: iconRabbitMQ, coming: true, kind: DataSourceKind.Unsupported },
        { name: 'RocketMQ', icon: iconRocketMQ, coming: true, kind: DataSourceKind.Unsupported },
        {
          name: intl.formatMessage({ defaultMessage: '阿里云物联网平台' }),
          icon: iconAli,
          coming: true,
          kind: DataSourceKind.Unsupported
        }
      ]
    },
    {
      name: intl.formatMessage({ defaultMessage: '脚本' }),
      items: [
        {
          name: 'GraphQL',
          icon: iconCustomGraphQL,
          onClick: () => addScript('GraphQL 数据源', dict.customize)
        },
        {
          name: 'Function',
          icon: iconFunction,
          onClick: () => addScript('Function 接口', dict.function)
        },
        {
          name: 'Proxy',
          icon: iconProxy,
          onClick: () => addScript('Proxy 接口', dict.proxy)
        }
      ]
    }
  ]
  // 解析图标
  // const iconMap = useMemo<Record<string, string>>(() => {
  //   const iconMap: Record<string, string> = {}
  //   initData.forEach(({ items }) => {
  //     items.forEach(({ sourceType, dbType, icon }) => {
  //       iconMap[`${sourceType}_${dbType ?? ''}`.toLowerCase()] = icon
  //     })
  //   })
  //   return iconMap
  // }, [initData])
  const { handleCreate, handleSave } = useContext(DatasourceToggleContext)
  // const [data, setData] = useState(initData)
  const [examples, setExamples] = useState([])

  // useEffect(() => {
  //   const exampleList = [
  //     {
  //       coming: true,
  //       name: 'example_pgsql',
  //       sourceType: 1,
  //       config: {
  //         apiNamespace: 'example_pgsql',
  //         dbType: 'postgresql',
  //         appendType: '0',
  //         databaseUrl: {
  //           key: '',
  //           kind: '0',
  //           val: 'anson:1234qwer!@139.196.89.94:5433/dbc32d0e6ba2c141c196fe42bb389034b8anson'
  //         },
  //         schemaExtension: '',
  //         replaceJSONTypeFieldConfiguration: null,
  //         host: '',
  //         dbName: '',
  //         port: '',
  //         userName: {
  //           key: '',
  //           kind: '',
  //           val: ''
  //         },
  //         password: {
  //           key: '',
  //           kind: '',
  //           val: ''
  //         }
  //       },
  //       enabled: false,
  //       createTime: '',
  //       updateTime: '',
  //       deleteTime: ''
  //     },
  //     {
  //       name: 'example_restApi',
  //       sourceType: 2,
  //       config: {
  //         apiNameSpace: 'example_restApi',
  //         filePath: 'example_rest.json',
  //         baseURL: '',
  //         jwtType: '',
  //         secret: {
  //           key: '',
  //           kind: '',
  //           val: ''
  //         },
  //         signingMethod: '',
  //         tokenPoint: '',
  //         statusCodeUnions: false,
  //         headers: []
  //       },
  //       enabled: false,
  //       createTime: '',
  //       updateTime: '',
  //       deleteTime: '',
  //       onSelect: () => {
  //         createFile('1', JSON.stringify(restExampleJson), 'example_rest.json')
  //       }
  //     },
  //     {
  //       name: 'example_graphqlApi',
  //       sourceType: 3,
  //       config: {
  //         apiNameSpace: 'example_graphqlApi',
  //         url: 'https://countries.trevorblades.com/',
  //         loadSchemaFromString: '',
  //         internal: false,
  //         customFloatScalars: null,
  //         customIntScalars: null,
  //         skipRenameRootFields: null,
  //         headers: []
  //       },
  //       enabled: false,
  //       createTime: '',
  //       updateTime: '',
  //       deleteTime: ''
  //     },
  //     {
  //       name: 'example_customer',
  //       sourceType: 4,
  //       config: {
  //         apiNamespace: 'example_customer',
  //         serverName: 'example_customer',
  //         enableGraphQLEndpoint: false,
  //         schema:
  //           "new GraphQLSchema({\n\t\t\t\tquery: new GraphQLObjectType({\n\t\t\t\t\tname: 'RootQueryType',\n\t\t\t\t\tfields: {\n\t\t\t\t\t\thello: {\n\t\t\t\t\t\t\ttype: GraphQLString,\n\t\t\t\t\t\t\tresolve() {\n\t\t\t\t\t\t\t\treturn 'world';\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t},\n\t\t\t\t}),\n\t\t\t}"
  //       },
  //       enabled: false,
  //       createTime: '',
  //       updateTime: '',
  //       deleteTime: ''
  //     }
  //   ]
  //   setExamples(exampleList as any)

  //   // setData(x =>
  //   //   x.concat({
  //   //     name: intl.formatMessage({ defaultMessage: '示例数据源' }),
  //   //     items: exampleList.map(x => {
  //   //       return {
  //   //         coming: x.coming,
  //   //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //   //         name: x.name,
  //   //         icon: iconMap[`${x.sourceType}_${x.config.dbType ?? ''}`.toLowerCase()],
  //   //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //   //         sourceType: x.sourceType,
  //   //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  //   //         dbType: x.config.dbType
  //   //       }
  //   //     })
  //   //   })
  //   // )
  // }, [iconMap, intl])

  // async function createCustom() {
  //   if (!vscode.isHookServerSelected) {
  //     await Modal.confirm({
  //       title: intl.formatMessage({ defaultMessage: '温馨提示' }),
  //       content: intl.formatMessage({ defaultMessage: '当前未选择钩子语言，是否前往创建？' }),
  //       onOk() {
  //         navigate('/workbench/sdk-template')
  //       }
  //     })
  //   } else {
  //     const { confirm, value } = await prompt({
  //       title: '请输入数据源名称',
  //       validator: validateName
  //     })
  //     if (!confirm) {
  //       return
  //     }
  //     const data: Partial<ApiDocuments.Datasource> = {
  //       name: value,
  //       kind: DataSourceKind.Graphql,
  //       enabled: false,
  //       customGraphql: {
  //         customized: true,
  //         endpoint: '',
  //         headers: {},
  //         schemaFilepath: ''
  //       }
  //     }
  //     await requests.post('/datasource', data)
  //     await vscode.checkHookExist(`${dict.customize}/customize/${value}`, false, true)
  //     handleSave(data)
  //   }
  // }

  async function handleClick(item: DataSourceItem) {
    if (item.onClick) {
      return item.onClick()
    }
    // if (item.kind === DataSourceKind.Graphql && item.isCustom) {
    //   return createCustom()
    // }
    let data: Partial<ApiDocuments.Datasource>

    if (item.name.startsWith('example_')) {
      // @ts-ignore
      data = examples.find(x => x.name === name)
    } else {
      data = {
        name: '',
        kind: item.kind,
        enabled: false
      }
      if (item.kind === DataSourceKind.Restful) {
        data.customRest = {
          baseUrl: '',
          headers: {},
          oasFilepath: ''
        }
      } else if (item.kind === DataSourceKind.Graphql) {
        data.customGraphql = {
          customized: false,
          endpoint: '',
          headers: {},
          schemaFilepath: ''
        }
      } else if (isDatabaseKind(item)) {
        data.customDatabase = {
          kind: 0
        }
      }
    }
    // @ts-ignore
    await data.onSelect?.()

    handleCreate(omit(data, ['onSelect']) as ApiDocuments.Datasource)
  }

  return (
    <>
      {initData.map(category => (
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
                onClick={() => !x.coming && handleClick(x)}
              >
                {/* <Image
                    height={28}
                    width={28}
                    src={`${import.meta.env.BASE_URL}assets/${x.logo}`}
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
