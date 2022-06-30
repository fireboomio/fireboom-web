import type { Enumerator } from '@mrleebo/prisma-ast'
import { useImmer } from 'use-immer'

import { Enum } from '@/interfaces/modeling'

import ModelEnumDesignerItem from './model-enum-designer-item'

interface Props {
  entity: Enum
}

export default function ModelEnumDesigner({ entity }: Props) {
  const [fields, _setFields] = useImmer<Enumerator[]>(
    entity.enumerators.filter((e) => e.type === 'enumerator') as Enumerator[]
  )

  console.log('enum', fields)

  return (
    <div>
      {fields?.map((field, idx) => (
        <ModelEnumDesignerItem key={idx} data={field} />
      ))}
    </div>
  )
}
