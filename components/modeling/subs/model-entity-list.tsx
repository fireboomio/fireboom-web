import { AppleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import React, { useContext } from 'react'

import type { Entity } from '@/interfaces'
import { ModelingContext, ModelingDispatchContext } from '@/lib/context'

import styles from './model-entity-list.module.scss'

export default function ModelEntityList({ children }: React.PropsWithChildren) {
  const blocks = useContext(ModelingContext)
  const dispatch = useContext(ModelingDispatchContext)

  const getNextId = () => Math.max(...blocks.map((b) => b.id)) + 1

  function addModel() {
    const data = { id: getNextId(), name: '', type: 'model', properties: [] } as Entity
    dispatch({ type: 'added', data: data })
  }

  function addEnum() {
    const data = { id: getNextId(), name: '', type: 'enum', enumerators: [] } as Entity
    dispatch({ type: 'added', data: data })
  }

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <span onClick={addModel}>模型</span>,
          icon: <AppleOutlined />,
        },
        {
          key: '2',
          label: <span onClick={addEnum}>枚举</span>,
          icon: <AppleOutlined />,
        },
      ]}
    />
  )

  return (
    <>
      <div className="flex justify-between items-center p-4 my-3 border-[#5f62691a] border-b-1 border-t-1">
        <span className="text-sm font-medium leading-5">所有实体</span>
        <Dropdown overlay={menu} placement="bottomRight">
          <Button
            className={styles['add-btn']}
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
          />
        </Dropdown>
      </div>

      {children}
    </>
  )
}
