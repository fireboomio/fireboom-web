import type { Field } from '@mrleebo/prisma-ast'

import ModelDesignerColumnName from './designer-column-name'
import ModelDesignerColumnType from './designer-column-type'

interface Props {
  fields: Field[]
}

export default function ModelDesignerModel({ fields }: Props) {
  return (
    <>
      {fields?.map((field, idx) => (
        <div key={idx} className="flex my-1.5 text-sm font-normal leading-7">
          <ModelDesignerColumnName data={field.name} />
          <ModelDesignerColumnType idx={idx} data={field.fieldType as string} />
          <div className="h-6 w-full hover:bg-[#F8F8F9]">{JSON.stringify(field.attributes)}</div>
        </div>
      ))}
    </>
  )
}
