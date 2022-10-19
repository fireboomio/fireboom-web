import { Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { useEffect, useState } from 'react'

import requests from '@/lib/fetchers'

interface TableType {
  name: string
  size: string
  modifyTime: string
  permission: string
  owner: string
}

const columns: ColumnsType<TableType> = [
  { title: '文件名', dataIndex: 'name', key: 'name' },
  { title: '大小', dataIndex: 'size', key: 'size' },
  { title: '修改时间', dataIndex: 'modifyTime', key: 'address' },
  { title: '权限', dataIndex: 'permission', key: 'permission' },
  { title: '所有者', dataIndex: 'owner', key: 'owner' },
  { title: '', dataIndex: '', key: '' }
]

export default function FileList() {
  const [data, setData] = useState<TableType[]>([])
  // const [path, setPath] = useState<string>('')

  useEffect(() => {
    void requests.get<unknown, { path: string; files: TableType[] }>('/file/1').then(x => {
      console.log(x)
      // setPath(x.path)
      setData(x.files)
    })
  }, [])

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 738, y: 455 }}
        onRow={rcd => {
          return {
            onClick: event => {
              console.log(rcd)
            },
            onDoubleClick: event => {},
            onContextMenu: event => {},
            onMouseEnter: event => {},
            onMouseLeave: event => {}
          }
        }}
      />
    </>
  )
}
