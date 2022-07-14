// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { AppleOutlined } from '@ant-design/icons'
import { Badge, Select, Table } from 'antd'
import { parse, DefinitionNode, OperationDefinitionNode } from 'graphql'
import { FC, useEffect, useState } from 'react'

import { FieldType } from '@/interfaces/apimanage'
import { getFetcher } from '@/lib/fetchers'
import { parseArgs, parseQuery } from '@/lib/gql-parser'
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
    render: (x: FieldType, _) => (
      <div>
        {x.isList ? (
          <span className="text-[#04B582]">
            List<span className="text-[#000000A6]">{`<${x.kind}>`}</span>
          </span>
        ) : x.isScalar ? (
          <span className="text-[#E66B83]">{x.kind}</span>
        ) : (
          <span className="text-[#177FFF]">
            Object<span className="text-[#000000A6]">{`<${x.kind}>`}</span>
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
    dataIndex: 'pos',
  },
  {
    title: '类型',
    dataIndex: 'kind',
  },
  {
    title: '必须',
    dataIndex: 'isRequired',
    render: (x: boolean) => <div>{x ? '是' : '否'}</div>,
  },
]

const Detail: FC<DetailProps> = ({ path }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [gqlQueryDef, setGqlQueryDef] = useState<OperationDefinitionNode[]>(undefined!)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [gqlSchemaDef, setGqlSchemaDef] = useState<DefinitionNode[]>(undefined!)
  const [dataSource, setDataSource] = useState([])
  const [reqDataSource, setReqDataSource] = useState([])

  useEffect(() => {
    getFetcher<string>('/api/v1/gql-schema')
      // .then((res) => {
      //   const ast = buildSchema(res, { noLocation: true })
      //   console.log('ast', ast)
      //   return res
      // })
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
      .then((res) => parse(res as string, { noLocation: true }).definitions)
      .then((def) => setGqlQueryDef(def))
      .catch((err: Error) => {
        throw err
      })
  }, [path])

  useEffect(() => {
    // console.log(gqlSchemaDef, 'schema')
    // console.log(gqlQueryDef, 'query')
    if (!gqlQueryDef || !gqlSchemaDef) return
    setDataSource(parseQuery(gqlSchemaDef, gqlQueryDef[0]))
    setReqDataSource(parseArgs(gqlQueryDef[0].variableDefinitions))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gqlQueryDef, gqlSchemaDef])

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
            <div className="leading-20px text-[#5F6269]">
              <span>HTTP 状态码：201</span>
              <span className="ml-82px">内容格式：JSON</span>
            </div>
            <Table
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
