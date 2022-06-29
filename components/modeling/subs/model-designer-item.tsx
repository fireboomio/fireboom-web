import type { Field } from '@mrleebo/prisma-ast'

import ModelDesignerItemName from './designer-item-name'
import ModelDesignerItemType from './designer-item-type'
import styles from './model-designer.module.scss'

interface Props {
  data: Field
}

export default function ModelDesignerItem({ data }: Props) {
  function handleClickName() {
    console.log('name')
  }

  function handleClickType() {
    console.log('type')
  }

  return (
    <div className="flex my-3 text-sm font-normal leading-4">
      <ModelDesignerItemName data={data.name} onClick={handleClickName} />

      <ModelDesignerItemType data={data.fieldType as string} onClick={handleClickType} />

      <div className={`${styles['item-col']} ${styles['item-col-attributes']}`}>
        {JSON.stringify(data.attributes)}
      </div>
    </div>
  )
}
