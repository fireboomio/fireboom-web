import type { Enumerator, Field } from '@mrleebo/prisma-ast'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import { Entity } from '@/interfaces/modeling'

import ModelDesignerEnumItem from './model-designer-enum-item'
import ModelDesignerModelItem from './model-designer-model-item'

interface Props {
  entity: Entity
  showType: 'model' | 'enum'
}

function filterFields(entity: Entity): Field[] | Enumerator[] | undefined {
  if ('properties' in entity) {
    return entity.properties.filter((p) => p.type === 'field') as Field[]
  } else if ('enumerators' in entity) {
    return entity.enumerators.filter((e) => e.type === 'enumerator') as Enumerator[]
  }
}

export default function ModelDesigner({ entity, showType }: Props) {
  const [fields, setFields] = useImmer<Field[] | Enumerator[] | undefined>(undefined)
  // const dispatch = useContext(ModelingDispatchContext)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setFields(filterFields(entity)), [entity])

  // TODO:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => dispatch({ type: 'changed', data: entity }), [entity])

  console.log('fields', fields)

  return (
    <div>
      {fields?.map((field, idx) => {
        switch (showType) {
          case 'model':
            return <ModelDesignerModelItem key={idx} idx={idx} data={field as Field} />
          case 'enum':
            return <ModelDesignerEnumItem key={idx} data={field as Enumerator} />
          default:
            break
        }
      })}
    </div>
  )
}
