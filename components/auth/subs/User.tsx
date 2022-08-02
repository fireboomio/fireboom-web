import { Input, Button, Table, Divider } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { TableRowSelection } from 'antd/es/table/interface'
import { useState } from 'react'

import styles from './subs.module.scss'

interface DataType {
  id: number
  key: React.Key
  name: string
  age: number
  address: string
}

const handleDeleteRole = (id: number) => {
  data.filter((item) => {
    item.id !== id
  })
}
const handleLockRole = (id: number) => {
  data.filter((item) => {
    item.id !== id
  })
}
const columns: ColumnsType<DataType> = [
  {
    title: '用户',
    dataIndex: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'age',
  },
  {
    title: '邮箱',
    dataIndex: 'address',
  },
  {
    title: '状态',
    dataIndex: 'address',
  },
  {
    title: '最后登入时间',
    dataIndex: 'address',
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: (_, { id }) => (
      <div>
        <Button
          type="text"
          className="pl-0 text-red-500"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            void handleLockRole(id)
          }}
        >
          锁定
        </Button>
        <Button
          type="text"
          className="pl-0 text-red-500"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            void handleDeleteRole(id)
          }}
        >
          删除
        </Button>
      </div>
    ),
  },
]

const data: DataType[] = []
for (let i = 0; i < 16; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
    id: 0,
  })
}

export default function AuthMainUser() {
  const { Search } = Input
  const onSearch = (value: string) => console.log(value)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
          setSelectedRowKeys(newSelectedRowKeys)
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = []
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
          setSelectedRowKeys(newSelectedRowKeys)
        },
      },
    ],
  }
  return (
    <>
      <div>
        <div>
          <span className="text-base text-gray mr-4">用户列表</span>
          <span className={styles['auth-head']}>当前用户池的所有用户，在这里你可以对用户</span>
        </div>
        <Divider style={{ margin: 10 }} />
        <div className="flex justify-between items-center mb-4">
          <div>
            <Search
              placeholder="搜索用户名、邮箱或手机号"
              onSearch={onSearch}
              style={{ width: 250 }}
            />
          </div>
          <div className="flex items-center mb-4">
            <Button type="text">
              <span className="text-sm text-gray">导出全部</span>
            </Button>
            <Button type="text">
              <span className="text-sm text-gray">导入</span>
            </Button>
            <Button type="primary">
              <span className="text-sm text-gray">创建</span>
            </Button>
          </div>
        </div>
        <Divider style={{ margin: 0 }} />
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />;
      </div>
    </>
  )
}
