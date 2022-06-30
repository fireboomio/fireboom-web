import type { Field } from '@mrleebo/prisma-ast'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import { Model } from '@/interfaces/modeling'
import { ModelingDispatchContext } from '@/lib/context'

import ModelDesignerItem from './model-designer-item'

interface Props {
  entity: Model
}

export default function ModelDesigner({ entity }: Props) {
  const [fields, _setFields] = useImmer<Field[]>(
    entity.properties.filter((p) => p.type === 'field') as Field[]
  )
  const dispatch = useContext(ModelingDispatchContext)

  // TODO:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => dispatch({ type: 'changed', data: entity }), [entity])

  console.log('fields', fields)

  return (
    <div>
      {fields?.map((field, idx) => (
        <ModelDesignerItem key={idx} data={field} />
      ))}
    </div>
  )
}
