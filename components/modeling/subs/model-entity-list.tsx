import { Button } from 'antd'
import { useContext } from 'react'

import { EntitiesContext } from '../model-context'
import ModelEntityItem from './model-entity-item'

export default function ModelEntityList() {
  const { entities, setEntities } = useContext(EntitiesContext)

  function addTable() {
    setEntities(entities.concat({ id: 4, name: '' }))
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
        {entities.map((entity) => (
          <ModelEntityItem key={entity.name} entity={entity}></ModelEntityItem>
        ))}
      </div>
    </>
  )
}
