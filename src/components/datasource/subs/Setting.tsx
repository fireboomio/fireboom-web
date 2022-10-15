/* eslint-disable react/prop-types */
import Editor from '@monaco-editor/react'
import { Select, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { parse } from 'graphql'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import type { DMFResp, ReplaceJSON } from '@/interfaces/datasource'
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

interface Model {
  name: string
  fields: Array<{ name: string; title: string }>
}

interface Props {
  schemaExtension: string
  replaceJSON: ReplaceJSON[]
}

const Setting: React.FC<Props> = ({ replaceJSON, schemaExtension }) => {
  const { id: currDBId } = useParams()
  const [data, setData] = useState<DataType[]>([])
  const [model, setModel] = useState<Model[]>([])
  const [tableOpts, setTableOpts] = useState<OptionT[]>([])
  const [inputOpts, setInputOpts] = useState<OptionT[]>([])
  const [outOpts, setOutOpts] = useState<OptionT[]>([])

  const columns: ColumnsType<DataType> = [
    {
      title: '表',
      dataIndex: 'table',
      key: 'table',
      render: (table: string) => (
        <Select defaultValue={table} style={{ width: 120 }} bordered={false} options={tableOpts} />
      )
    },
    { title: '字段', dataIndex: 'field', key: 'field' },
    { title: '响应类型', dataIndex: 'resType', key: 'resType' },
    { title: '输入类型', dataIndex: 'inputType', key: 'inputType' },
    {
      title: '是否开启',
      dataIndex: 'isOpen',
      key: 'isOpen',
      render: (isOpen: boolean) => <Switch className="w-8 h-2" checked={isOpen} />
    }
  ]

  useEffect(() => {
    setData(
      replaceJSON.map((x, idx) => ({
        key: idx.toString(),
        table: x.entityName,
        field: x.fieldName,
        resType: x.responseTypeReplacement,
        inputType: x.inputTypeReplacement,
        isOpen: true
      }))
    )
  }, [replaceJSON])

  useEffect(() => {
    if (!schemaExtension) return

    const ops = parse(schemaExtension, { noLocation: true }).definitions
    const inputOpts = ops
      .filter(op => op.kind === 'InputObjectTypeDefinition')
      .map(x => ({ label: x.name.value, value: x.name.value }))
    setInputOpts(inputOpts)

    const outOpts = ops
      .filter(op => op.kind === 'ObjectTypeDefinition')
      .map(x => ({ label: x.name.value, value: x.name.value }))
    setOutOpts(outOpts)
  }, [schemaExtension])

  useEffect(() => {
    void requests
      .get<unknown, DMFResp>(`/prisma/dmf/${currDBId ?? ''}`)
      .then(x => {
        const model = x.models.map(m => ({
          name: m.name,
          fields: m.fields.map(f => ({ name: f.name, title: f.title }))
        }))
        setModel(model)
        return model
      })
      .then(x => setTableOpts(x.map(m => ({ label: m.name, value: m.name }))))
  }, [currDBId])

  function makeField(x: DataType) {
    const fields = model.find(m => m.name === x.table)?.fields
    return fields?.map(x => ({ label: x.name, name: x.name }))
  }

  return (
    <div className="flex gap-6 h-[calc(100vh_-_190px)]">
      <div className="w-5/11">
        <div className="mb-1.5 py-1.5 pl-3 bg-[#F8F8F8] font-medium">自定义类型</div>
        <Editor language="graphql" value={schemaExtension} />
      </div>

      <div className="w-6/11">
        <div className="mb-1.5 py-1.5 pl-3 bg-[#F8F8F8] font-medium">字段类型映射</div>
        <Table size="small" columns={columns} dataSource={data} pagination={false} />

        <table className="w-full">
          <tr>
            <th>表</th>
            <th>字段</th>
            <th>响应类型</th>
            <th>输入类型</th>
            <th>是否开启</th>
          </tr>
          {data.map((x, idx) => (
            <tr key={idx}>
              <td>
                <Select
                  defaultValue={x.table}
                  style={{ width: 120 }}
                  bordered={true}
                  options={tableOpts}
                  value={x.table}
                />
              </td>
              <td>
                <Select
                  defaultValue={x.field}
                  style={{ width: 120 }}
                  bordered={true}
                  options={makeField(x)}
                />
              </td>
              <td>
                <Select
                  defaultValue={x.resType}
                  style={{ width: 120 }}
                  bordered={true}
                  options={outOpts}
                />
              </td>
              <td>
                <Select
                  defaultValue={x.inputType}
                  style={{ width: 120 }}
                  bordered={true}
                  options={inputOpts}
                />
              </td>
              <td>
                <Switch className="w-8 h-2" checked={x.isOpen} />
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  )
}

export default Setting
