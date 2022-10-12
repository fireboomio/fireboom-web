import Editor from '@monaco-editor/react'
import { Descriptions, Select, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useContext, useEffect } from 'react'

import { DMFResp } from '@/interfaces/datasource'
import { DatasourceCurrDBContext } from '@/lib/context/datasource-context'
import requests from '@/lib/fetchers'

const { Option } = Select

interface DataType {
  key: string
  table: string
  field: string
  resType: string
  inputType: string
  isOpen: boolean
}

interface Props {}

const columns: ColumnsType<DataType> = [
  {
    title: '表',
    dataIndex: 'table',
    key: 'table',
    render: () => (
      <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
        <Option value="table">table</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    ),
  },
  {
    title: '字段',
    dataIndex: 'field',
    key: 'field',
    render: () => (
      <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
        <Option value="jack">Jack</Option>
        <Option value="table">table</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    ),
  },
  {
    title: '响应类型',
    dataIndex: 'resType',
    key: 'resType',
    render: () => (
      <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
        <Option value="table">table</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    ),
  },
  {
    title: '输入类型',
    key: 'inputType',
    dataIndex: 'inputType',
    render: () => (
      <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
        <Option value="table">table</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
    ),
  },
  {
    title: '是否开启',
    key: 'isOpen',
    render: () => <Switch className="w-8 h-2" />,
  },
]

const data: DataType[] = [
  {
    key: '1',
    table: 'John Brown',
    field: '123',
    resType: 'New York No. 1 ',
    inputType: '222',
    isOpen: true,
  },
  {
    key: '2',
    table: 'John Brown',
    field: '123',
    resType: 'New York No. 1 ',
    inputType: '222',
    isOpen: false,
  },
]

const Setting: React.FC<Props> = props => {
  const { currDBId } = useContext(DatasourceCurrDBContext)

  useEffect(() => {
    void requests
      .get<unknown, DMFResp>(`/prisma/dmf/${currDBId ?? ''}`)
      .then(x => console.log(x.models))
  }, [currDBId])

  return (
    <div className="flex">
      <Descriptions
        bordered
        layout="vertical"
        size="small"
        className="w-3/8 mr-10"
        labelStyle={{ width: '30%' }}
      >
        <Descriptions.Item label="自定义类型" contentStyle={{ padding: '0' }}>
          <Editor
            height="90vh"
            defaultLanguage="typescript"
            defaultValue="// some comment"
            className="h-425px py-4"
          />
        </Descriptions.Item>
      </Descriptions>

      <Descriptions
        bordered
        layout="vertical"
        size="small"
        className="w-5/8"
        labelStyle={{ width: '30%' }}
      >
        <Descriptions.Item label="字段类型映射" contentStyle={{ padding: '0' }}>
          <Table size="small" columns={columns} dataSource={data} pagination={false} />
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default Setting
