import type { Enumerator } from '@mrleebo/prisma-ast'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { Enum } from '@/interfaces/modeling'

import ModelDesignerColumnName from './designer-column-name'

interface Props {
  enumEntity: Enum
}

export default function ModelDesignerEnum({ enumEntity }: Props) {
  const [fields, setFields] = useImmer<Enumerator[]>(
    enumEntity.enumerators.filter(e => e.type === 'enumerator') as Enumerator[]
  )

  useEffect(
    () => setFields(enumEntity.enumerators.filter(e => e.type === 'enumerator') as Enumerator[]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enumEntity]
  )

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
