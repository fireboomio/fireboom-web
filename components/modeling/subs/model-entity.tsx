import { Button } from 'antd'
import { useImmer } from 'use-immer'

import type { Entity } from '@/interfaces/model'

import TableItem from './table-item'

interface Props {
  entities: Entity[]
}

export default function ModelEntity({ entities }: Props) {
  const [tables, setTables] = useImmer(entities)

  function addTable() {
    setTables((_) => tables.concat({ name: '' }))
  }

  return (
    <>
      <div className="flex justify-between p-4 my-3">
        <span className="text-sm font-medium leading-20px">所有实体</span>
        <Button type="primary" shape="circle" size="small" onClick={addTable}>
          +
        </Button>
      </div>

      <div className="mt-3">
        {tables.map((entity) => (
          <TableItem key={entity.name} entity={entity}></TableItem>
        ))}
      </div>
    </>
  )
}
