import type { Enumerator } from '@mrleebo/prisma-ast'

import ModelDesignerColumnName from './designer-column-name'

interface Props {
  data: Enumerator
}

export default function ModelDesignerEnumItem({ data }: Props) {
  return (
    <div className="flex my-1.5 text-sm font-normal leading-7">
      <ModelDesignerColumnName data={data.name} />
      <ModelDesignerColumnName data={data.comment?.replace(/^\/\/\s+/, '') ?? ''} />
    </div>
  )
}
