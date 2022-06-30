import type { Field } from '@mrleebo/prisma-ast'

import ModelDesignerColumnName from './designer-column-name'
import ModelDesignerColumnType from './designer-column-type'

interface Props {
  data: Field
}

export default function ModelDesignerModelItem({ data }: Props) {
  function handleClickType() {
    console.log('type')
  }

  return (
    <div className="flex my-1.5 text-sm font-normal leading-7">
      <ModelDesignerColumnName data={data.name} />

      <ModelDesignerColumnType data={data.fieldType as string} onClick={handleClickType} />

      <div className="h-6 w-full hover:bg-[#F8F8F9]">{JSON.stringify(data.attributes)}</div>
    </div>
  )
}
