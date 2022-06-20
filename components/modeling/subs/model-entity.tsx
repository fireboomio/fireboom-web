import { Button } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import { EntitiesContext } from '../model-context'
import TableItem from './table-item'

export default function ModelEntity() {
  const entities = useContext(EntitiesContext)
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
