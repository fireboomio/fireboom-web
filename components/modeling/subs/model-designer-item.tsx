import type { Field } from '@mrleebo/prisma-ast'

import ModelDesignerItemName from './designer-item-name'
import ModelDesignerItemType from './designer-item-type'

interface Props {
  data: Field
}

export default function ModelDesignerItem({ data }: Props) {
  function handleClickType() {
    console.log('type')
  }

  return (
    <div className="flex my-1.5 text-sm font-normal leading-7">
      <ModelDesignerItemName data={data.name} />

      <ModelDesignerItemType data={data.fieldType as string} onClick={handleClickType} />

      <div className="h-6 w-full hover:bg-[#F8F8F9]">{JSON.stringify(data.attributes)}</div>
    </div>
  )
}
