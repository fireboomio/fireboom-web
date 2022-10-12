import Editor from '@monaco-editor/react'
import { Select, Table } from 'antd'
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

interface Props {
  schemaExtension: string
  replaceJSON: string
}

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
    // render: () => (
    //   <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
    //     <Option value="jack">Jack</Option>
    //     <Option value="table">table</Option>
    //     <Option value="Yiminghe">yiminghe</Option>
    //   </Select>
    // ),
  },
  {
    title: '响应类型',
    dataIndex: 'resType',
    key: 'resType',
    // render: () => (
    //   <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
    //     <Option value="table">table</Option>
    //     <Option value="lucy">Lucy</Option>
    //     <Option value="Yiminghe">yiminghe</Option>
    //   </Select>
    // ),
  },
  {
    title: '输入类型',
    key: 'inputType',
    dataIndex: 'inputType',
    // render: () => (
    //   <Select defaultValue="table" style={{ width: 120 }} bordered={false}>
    //     <Option value="table">table</Option>
    //     <Option value="lucy">Lucy</Option>
    //     <Option value="Yiminghe">yiminghe</Option>
    //   </Select>
    // ),
  },
  {
    title: '是否开启',
    key: 'isOpen',
    // render: () => <Switch className="w-8 h-2" />,
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
    <div className="flex gap-6 h-[calc(100vh_-_190px)]">
      <div className="w-5/11 ">
        <div className="mb-1.5 py-1.5 pl-3 bg-[#F8F8F8] font-medium">自定义类型</div>
        <Editor defaultLanguage="typescript" defaultValue="// some comment" />
      </div>

      <div className="w-6/11">
        <div className="mb-1.5 py-1.5 pl-3 bg-[#F8F8F8] font-medium">字段类型映射</div>
        <Table size="small" columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  )
}

export default Setting
