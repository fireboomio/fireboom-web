import { PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Button } from 'antd'
import { useContext } from 'react'

import { EnumEntitiesContext } from '../model-context'

export default function ModelEnumBreadcumb() {
  const { enumEntities, setEnumEntities } = useContext(EnumEntitiesContext)
  function addEnumItem() {
    setEnumEntities(
      enumEntities.concat({ id: enumEntities.length + 1, name: '', note: '', isEditing: true })
    )
  }

  return (
    <div className="flex justify-start items-center my-4 border-b-1 pb-2">
      <Breadcrumb className="text-base flex-grow" separator=" ">
        <Breadcrumb.Item>Enum</Breadcrumb.Item>
        <Breadcrumb.Item>enum</Breadcrumb.Item>
      </Breadcrumb>
      <Button onClick={addEnumItem} icon={<PlusOutlined />} shape="circle" size="small" />
    </div>
  )
}
