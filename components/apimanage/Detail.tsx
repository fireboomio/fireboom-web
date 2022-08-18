import { EditOutlined } from '@ant-design/icons'
import { Badge, Input, message, Select, Table } from 'antd'
import { parse, DefinitionNode, OperationDefinitionNode } from 'graphql'
import { FC, useEffect, useState } from 'react'

import IconFont from '@/components/iconfont'
import RcTab from '@/components/rc-tab'
import {
  FieldType,
  TableSource,
  ParameterT,
  OperationResp,
  DirTreeNode,
} from '@/interfaces/apimanage'
import requests, { getFetcher } from '@/lib/fetchers'
import { makePayload, parseParameters, parseGql, parseRbac } from '@/lib/gql-parser'
import { isEmpty } from '@/lib/utils'

import styles from './Detail.module.scss'

type DetailProps = { nodeId: number | undefined }

type Param = ParameterT & {
  source?: string
  directiveNames: string[]
  jsonSchema?: string
  remark?: string
}

const tabs = [
  {
    title: '请求参数',
    key: '0',
  },
  {
    title: '注入参数',
    key: '1',
  },
]

const columns = [
  {
    title: '字段名称',
    dataIndex: 'fieldName',
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
    render: (x: FieldType) => (
      <div>
        {x.isList ? (
          <span className="text-[#04B582]">
            List<span className="text-[#000000A6]">{`<${x.type}>`}</span>
          </span>
        ) : x.isScalar ? (
          <span className="text-[#E66B83]">{x.type}</span>
        ) : (
          <span className="text-[#177FFF]">
            Object<span className="text-[#000000A6]">{`<${x.type}>`}</span>
          </span>
        )}
      </div>
    ),
  },
]

const reqColumns = [
  {
    title: '参数名',
    dataIndex: 'name',
  },
  {
    title: '位置',
    dataIndex: 'position',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '必须',
    dataIndex: 'isRequired',
    render: (x: boolean) => <div>{x ? '是' : '否'}</div>,
  },
  {
    title: 'jsonSchema',
    dataIndex: 'jsonSchema',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
]

const injectColumns = [
  { title: '参数名', dataIndex: 'name' },
  { title: '类型', dataIndex: 'type' },
  { title: '来源', dataIndex: 'source' },
]

const Detail: FC<DetailProps> = ({ nodeId }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [gqlQueryDef, setGqlQueryDef] = useState<readonly OperationDefinitionNode[]>(undefined!)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [gqlSchemaDef, setGqlSchemaDef] = useState<readonly DefinitionNode[]>(undefined!)
  const [node, setNode] = useState<DirTreeNode>()
  const [dataSource, setDataSource] = useState<TableSource[] | undefined>([])
  const [reqDataSource, setReqDataSource] = useState<ParameterT[]>([])
  const [tabActiveKey, setTabActiveKey] = useState('0')
  const [editRemark, setEditRemark] = useState(false)
  const [rbac, setRbac] = useState<{ key: string; value: string[] | undefined }>()
  const [method, setMethod] = useState<'POST' | 'GET'>()

  useEffect(() => {
    getFetcher<string>('/operateApi/getGenerateSchema')
      // .then((res) => {
      //   const ast = buildSchema(res, { noLocation: true })
      //   console.log('ast', ast)
      //   return res
      // })
      .then(res => parse(res, { noLocation: true }).definitions)
      .then(def => setGqlSchemaDef(def))
      .catch((err: Error) => {
        throw err
      })
  }, [])

  // useEffect(() => {
  //   if (!nodeId || nodeId === 0) return

  //   void getFetcher<OperationResp>(`/operateApi/${nodeId}`).then(res => setNode(res))
  // }, [nodeId])

  useEffect(() => {
    if (!nodeId || nodeId === 0) return
    getFetcher<OperationResp>(`/operateApi/${nodeId}`)
      .then(res => {
        setNode(res as DirTreeNode)
        return res
      })
      .then(res => parse(res.content, { noLocation: true }).definitions)
      .then(def => setGqlQueryDef(def as readonly OperationDefinitionNode[]))
      .then(() => setMethod(gqlQueryDef?.at(0)?.operation === 'query' ? 'GET' : 'POST'))
      .catch((err: Error) => {
        throw err
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId])

  useEffect(() => {
    // console.log(gqlSchemaDef, 'schema')
    // console.log(gqlQueryDef, 'query')
    if (!gqlQueryDef || !gqlSchemaDef) return

    try {
      setDataSource(parseGql(gqlSchemaDef, gqlQueryDef[0]))
      setReqDataSource(parseParameters(gqlQueryDef[0].variableDefinitions))
      setRbac(parseRbac(gqlQueryDef.at(0)?.directives))
    } catch (err: unknown) {
      void message.error('解析失败')
      // eslint-disable-next-line no-console
      console.error(err)
      // throw err
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gqlQueryDef, gqlSchemaDef])

  const makeDS = (ds: ParameterT[]): Param[] => {
    return ds.map(x => {
      if (isEmpty(x.directives)) return { ...x, directiveNames: [] }
      return {
        ...x,
        // @ts-ignore
        source: x.directives.map(x => makePayload(x.name, x.args)).join(', '),
        // @ts-ignore
        directiveNames: x.directives.map(x => x.name),
        jsonSchema: x.directives?.find(x => x.name === 'jsonSchema')?.payload?.join(', '),
        // @ts-ignore
        remark: x.directives
          .filter(x => !['jsonSchema'].includes(x.name))
          .map(x => makePayload(x.name, x.args))
          .join(', '),
      }
    })
  }

  const filterReqDS = (ds: Param[]) => {
    const filterNames = ['hooksVariable', 'jsonSchema']
    return ds.filter(
      x =>
        x.directiveNames.length === 0 ||
        x.directiveNames.filter(n => filterNames.includes(n)).length !== 0
    )
  }

  const filterInjectDS = (ds: Param[]) => {
    const filterNames = [
      'internal',
      'fromClaim',
      'injectCurrentDateTime',
      'injectEnvironmentVariable',
      'injectGeneratedUUID',
    ]
    return ds
      .filter(x => x.directiveNames.length !== 0)
      .filter(x => x.directiveNames.filter(n => filterNames.includes(n)).length !== 0)
  }

  const isInternal = (data: TableSource[] | undefined) => {
    if (!data) return false
    if (data.length === 0) return false
    return data[0].directiveNames?.includes('internalOperation')
  }

  function updateRemark(value: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    void requests
      .put<unknown, DirTreeNode>(`/operateApi/${node!.id}`, { ...node, remark: value })
      .then(res => setNode(res))
    setEditRemark(false)
  }

  if (!node || node.isDir) return <></>

  return (
    <>
      <div className="flex items-center">
        <div className={'flex items-center flex-shrink-0 space-x-1'}>
          {editRemark ? (
            <Input
              placeholder="请输入备注"
              size="small"
              defaultValue={node.remark || node.title}
              onPressEnter={e => updateRemark(e.target.value)}
              onKeyUp={(e: React.KeyboardEvent) => e.key == 'Escape' && setEditRemark(false)}
              onBlur={() => setEditRemark(false)}
            />
          ) : (
            <span className="text-12px  text-[#5F6269] leading-17px">
              {node.remark || node.title}
            </span>
          )}
          <EditOutlined onClick={() => setEditRemark(!editRemark)} />
        </div>
        <div className="flex items-center flex-1">
          <div className="flex items-center space-x-1 ml-4">
            <span className="text-[#AFB0B4]">{node.id}</span>
            <IconFont
              type="icon-fuzhi"
              className="text-[#AFB0B4]"
              onClick={() => void navigator.clipboard.writeText(`${node.id}`)}
            />
          </div>
          <div className="flex items-center space-x-1 ml-7">
            {isInternal(dataSource) ? (
              <>
                <Badge status="error" />
                <span className="text-[#000000D9] leading-20px">非公开</span>
              </>
            ) : (
              <>
                <Badge status="success" color="#1BDD8A" />
                <span className="text-[#000000D9] leading-20px">公开</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-[#5F6269] ${styles.label}`}>{method}</span>
        <span className="flex-1 text-[#000000D9]">{node?.path ?? ''}</span>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-[#5F6269] ${styles.label}`}>用户角色</span>
        <div className="flex-1 flex items-center">
          <Select className="w-160px" value={rbac?.key ?? ''} dropdownClassName="hidden" />
          <Select
            className="flex-1"
            mode="multiple"
            value={rbac?.value ?? []}
            dropdownClassName="hidden"
          />
        </div>
      </div>

      <div className="mt-42px">
        <RcTab tabs={tabs} onTabClick={setTabActiveKey} activeKey={tabActiveKey} />
        {tabActiveKey === '0' ? (
          <Table
            size="middle"
            className="mt-6"
            columns={reqColumns}
            dataSource={filterReqDS(makeDS(reqDataSource))}
            pagination={false}
          />
        ) : (
          <Table
            size="middle"
            className="mt-6"
            columns={injectColumns}
            dataSource={filterInjectDS(makeDS(reqDataSource))}
            pagination={false}
          />
        )}
      </div>

      <div className="my-10.5">
        <div className="text-[#5F6269] leading-22px text-16px">返回响应</div>
        <div className="mt-3">
          <span className={styles.caption}>成功（201）</span>
          <div className={`${styles.content}`}>
            <div className="leading-20px text-[#5F6269]">
              <span>HTTP 状态码：201</span>
              <span className="ml-82px">内容格式：JSON</span>
            </div>
            <Table
              size="middle"
              className="mt-6"
              rowClassName="text-[#000000A6]"
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Detail
