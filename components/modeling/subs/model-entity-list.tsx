import { AppleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { Entity } from '@/interfaces'
import { ModelingContext } from '@/lib/context'

import ModelEntityItem from './model-entity-item'
import styles from './model-entity-list.module.scss'

export default function ModelEntityList() {
  const { blocks, setBlocks } = useContext(ModelingContext)
  const [entities, setEntities] = useImmer([] as Entity[])

  useEffect(() => {
    setEntities(blocks.filter((b) => ['enum', 'model'].includes(b.type)) as Entity[])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks])

  function addModel() {
    const data = { id: 5, name: '', type: 'model', properties: [] } as Entity
    setBlocks(blocks.concat(data))
  }

  function addEnum() {
    const data = { id: 5, name: '', type: 'enum', enumerators: [] } as Entity
    setBlocks(blocks.concat(data))
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

      <div className="mt-3">
        {entities.map((entity) => (
          <ModelEntityItem key={entity.name} entity={entity} />
        ))}
      </div>
    </>
  )
}
