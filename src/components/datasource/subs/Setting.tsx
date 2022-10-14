/* eslint-disable react/prop-types */
import Editor from '@monaco-editor/react'
import { Select, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { DMFResp, ReplaceJSON } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'

interface OptionT {
  label: string
  value: string
}

interface DataType {
  key: string
  table: string
  field: string
  resType: string
  inputType: string
  isOpen: boolean
}

interface Props {
  schemaExtension: string
  replaceJSON: ReplaceJSON[]
}

const Setting: React.FC<Props> = ({ replaceJSON, schemaExtension }) => {
  const { id: currDBId } = useParams()
  const [data, setData] = useState<DataType[]>([])
  const [tableOpts, setTableOpts] = useState<OptionT[]>([])

  const columns: ColumnsType<DataType> = [
    {
      title: '表',
      dataIndex: 'table',
      key: 'table',
      render: (table: string) => (
        <Select defaultValue={table} style={{ width: 120 }} bordered={false} options={tableOpts} />
      ),
    },
    { title: '字段', dataIndex: 'field', key: 'field' },
    { title: '响应类型', dataIndex: 'resType', key: 'resType' },
    { title: '输入类型', dataIndex: 'inputType', key: 'inputType' },
    {
      title: '是否开启',
      dataIndex: 'isOpen',
      key: 'isOpen',
      render: (isOpen: boolean) => <Switch className="w-8 h-2" checked={isOpen} />,
    },
  ]

  useEffect(() => {
    setData(
      replaceJSON.map((x, idx) => ({
        key: idx.toString(),
        table: x.entityName,
        field: x.fieldName,
        resType: x.responseTypeReplacement,
        inputType: x.inputTypeReplacement,
        isOpen: true,
      }))
    )
  }, [replaceJSON])

  useEffect(() => {
    void requests
      .get<unknown, DMFResp>(`/prisma/dmf/${currDBId ?? ''}`)
      .then(x => {
        console.log('mm', x.models)
        return x
      })
      .then(x => setTableOpts(x.models.map(m => ({ label: m.name, value: m.name }))))
  }, [currDBId])

  return (
    <div className="flex gap-6 h-[calc(100vh_-_190px)]">
      <div className="w-5/11 ">
        <div className="mb-1.5 py-1.5 pl-3 bg-[#F8F8F8] font-medium">自定义类型</div>
        <Editor language="graphql" value={schemaExtension} />
      </div>

      <div className="w-6/11">
        <div className="mb-1.5 py-1.5 pl-3 bg-[#F8F8F8] font-medium">字段类型映射</div>
        <Table size="small" columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  )
}

export default Setting
