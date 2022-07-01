import type { Enumerator, Field } from '@mrleebo/prisma-ast'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import { Entity } from '@/interfaces/modeling'

import ModelDesignerEnum from './model-designer-enum'
import ModelDesignerModel from './model-designer-model'

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
    <>
      {showType === 'model' && <ModelDesignerModel fields={fields as Field[]} />}
      {showType === 'enum' && <ModelDesignerEnum fields={fields as Enumerator[]} />}
    </>
  )
}
