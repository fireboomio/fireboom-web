import type { Enumerator } from '@mrleebo/prisma-ast'

import ModelDesignerColumnName from './designer-column-name'

interface Props {
  fields: Enumerator[]
}

export default function ModelDesignerEnum({ fields }: Props) {
  return (
    <>
      {fields?.map((field, idx) => (
        <div key={idx} className="flex my-1.5 text-sm font-normal leading-7">
          <ModelDesignerColumnName data={field.name} />
          <ModelDesignerColumnName
            className="max-w-250px text-color-[#5F626999]"
            data={field.comment?.replace(/^\/\/\s+/, '') ?? ''}
          />
        </div>
      ))}
    </>
  )
}
