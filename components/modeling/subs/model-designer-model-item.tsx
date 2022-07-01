import type { Field } from '@mrleebo/prisma-ast'

import ModelDesignerColumnName from './designer-column-name'
import ModelDesignerColumnType from './designer-column-type'

interface Props {
  data: Field
  idx?: number
}

export default function ModelDesignerModelItem({ data, idx }: Props) {
  return (
    <div className="flex my-1.5 text-sm font-normal leading-7">
      <ModelDesignerColumnName data={data.name} />

      <ModelDesignerColumnType idx={idx} data={data.fieldType as string} />

      <div className="h-6 w-full hover:bg-[#F8F8F9]">{JSON.stringify(data.attributes)}</div>
    </div>
  )
}
