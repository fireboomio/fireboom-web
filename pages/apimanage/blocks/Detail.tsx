/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { AppleOutlined } from '@ant-design/icons'
import { Badge, Select, Table } from 'antd'
import { parse, buildSchema, DefinitionNode, VariableDefinitionNode, TypeNode } from 'graphql'
import { FC, useCallback, useEffect, useState } from 'react'

import { TableSource } from '@/interfaces/apimanage'
import { getFetcher } from '@/lib/fetchers'
import RcTab from 'pages/components/rc-tab'

import styles from './Detail.module.scss'

type DetailProps = {
  path: string
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
  },
]

const reqColumns = [
  {
    title: '参数名',
    dataIndex: 'name',
  },
  {
    title: '位置',
    dataIndex: 'pos',
  },
  {
    title: '类型',
    dataIndex: 'kind',
  },
  {
    title: '必须',
    dataIndex: 'required',
    render: (x) => <div>{x ? '是' : '否'}</div>,
  },
]

const Detail: FC<DetailProps> = ({ path }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [gqlQueryDef, setGqlQueryDef] = useState<DefinitionNode[]>(undefined!)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [gqlSchemaDef, setGqlSchemaDef] = useState<DefinitionNode[]>(undefined!)
  const [dataSource, setDataSource] = useState([])
  const [reqDataSource, setReqDataSource] = useState([])

  useEffect(() => {
    getFetcher<string>('/api/v1/gql-schema')
      .then((res) => {
        const ast = buildSchema(res, { noLocation: true })
        console.log('ast', ast)
        return res
      })
      .then((res) => parse(res, { noLocation: true }).definitions)
      .then((def) => setGqlSchemaDef(def))
      .catch((err: Error) => {
        throw err
      })
  }, [])

  useEffect(() => {
    if (!path) return
    // getFetcher(`/api/v1/operateApi/${path}`)
    getFetcher('/api/v1/gql-query-str')
      .then((res) => parse(res, { noLocation: true }).definitions)
      .then((def) => setGqlQueryDef(def))
      .catch((err: Error) => {
        throw err
      })
  }, [path])

  const getType = useCallback((typeDef: TypeNode) => {
    let required = false

    const inner = (node: TypeNode, depth = 0): string => {
      switch (node.kind) {
        case 'NamedType':
          return node.name.value
        case 'ListType':
          return inner(node.type, depth++)
        case 'NonNullType':
          if (depth === 0) required = true
          return inner(node.type, depth++)
      }
    }
    const kind = inner(typeDef)

    return {
      kind,
      required,
    }
  }, [])

  const parseType = useCallback(
    (selection, parent): string => {
      const fieldName = selection.name.value
      const parentFieldName = parent?.name?.value
      // const allQuery = gqlSchemaDef.find((i) => i.name.value === 'Query')

      let rv = ''
      if (!parent) {
        console.log('^^^^^^^^ parse root', selection)
        const rootQuery = gqlSchemaDef
          .filter((i) => i.kind === 'ObjectTypeDefinition')
          .find((i) => i.name.value === 'Query')
          .fields.find((i) => i.name.value === fieldName)
        console.log(rootQuery, 'rootQuery')

        switch (rootQuery.type.kind) {
          case 'NamedType':
            rv = 'Object'
            break
          case 'ListType':
            rv = 'List'
            break
          default:
            break
        }
      } else {
        console.log(parentFieldName, fieldName)
        console.log('^^^^^^^^ parse type', selection)
        console.log('^^^^^^^^ parent type', parent)

        const parentQueryName = gqlSchemaDef
          .filter((i) => i.kind === 'ObjectTypeDefinition')
          .find((i) => i.name.value === 'Query')
          .fields.find((i) => i.name.value === parentFieldName).type.name.value
        console.log(parentQueryName, 'parentQueryName')
        const bbb = gqlSchemaDef
          .filter((i) => i.kind === 'ObjectTypeDefinition')
          .find((i) => i.name.value === parentQueryName)
          .fields.find((i) => i.name.value === fieldName)
        console.log(bbb, 'bbb')
        rv = bbb.type.type.name?.value ?? 'bbb'
      }

      console.log('$$$$$$$$ parseType end')
      return rv
    },
    [gqlSchemaDef]
  )

  const parseQuery = useCallback((selection, nodes: string[] = []): TableSource[] => {
    const selectionSet = selection.selectionSet
    if (!selectionSet) return undefined
    const rv = selectionSet.selections.map((subSelection) => {
      const newNodes = nodes.concat(subSelection.name.value)
      return {
        key: newNodes.join('-'),
        fieldName: subSelection.name.value,
        // fieldType: parseType(subSelection, newNodes),
        children: parseQuery(subSelection, newNodes),
      }
    })
    return rv as TableSource[]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!gqlQueryDef || !gqlSchemaDef) return
    setDataSource(parseQuery(gqlQueryDef[0]))
    setReqDataSource(parseArgs(gqlQueryDef[0].variableDefinitions))

    const rv: TableSource[] = parseQuery(gqlQueryDef[0])
    console.log(gqlSchemaDef, 'schema')
    console.log(gqlQueryDef, 'query')
    console.log('rv', rv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gqlQueryDef, gqlSchemaDef])

  const parseArgs = useCallback((varDefs: VariableDefinitionNode[]) => {
    return varDefs.map((x) => ({
      key: x.variable.name.value,
      name: x.variable.name.value,
      pos: 'path',
      ...getType(x.type),
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="flex items-center">
        <div className={`flex items-center space-x-1 ${styles.label}`}>
          <span className="text-12px  text-[#5F6269] leading-17px">注册接口</span>
          <AppleOutlined />
        </div>
        <div className="flex items-center flex-1">
          <div className="flex items-center space-x-1">
            <span className="text-[#AFB0B4]">#23234456</span>
            <AppleOutlined />
            <AppleOutlined />
          </div>
          <div className="flex items-center space-x-1 ml-7">
            <Badge status="success" color="#1BDD8A" />
            <span className="text-[#000000D9] leading-20px">公开</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-[#5F6269] ${styles.label}`}>POST</span>
        <span className="flex-1 text-[#000000D9]">/user/reg</span>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-[#5F6269] ${styles.label}`}>用户角色</span>
        <div className="flex-1 flex items-center">
          <Select className="w-160px" />
          <Select className="flex-1" allowClear />
        </div>
      </div>
      <div className="mt-42px">
        <RcTab tabs={tabs} />
        <Table
          className="mt-6"
          columns={reqColumns}
          dataSource={reqDataSource}
          pagination={false}
        />
      </div>
      <div className="my-10.5">
        <div className="text-[#5F6269] leading-22px text-16px">返回响应</div>
        <div className="mt-3">
          <span className={styles.caption}>成功（201）</span>
          <div className={`${styles.content}`}>
            <div className="leading-20px text-[##5F6269]">
              <span>HTTP 状态码：201</span>
              <span className="ml-82px">内容格式：JSON</span>
            </div>
            <Table className="mt-6" columns={columns} dataSource={dataSource} pagination={false} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Detail
