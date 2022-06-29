import type { Model, Field } from '@mrleebo/prisma-ast'
import { useImmer } from 'use-immer'

import ModelDesignerItem from './model-designer-item'

interface Props {
  properties: Model['properties']
}

export default function ModelDesigner({ properties }: Props) {
  const [fields, _setFields] = useImmer<Field[]>(
    properties.filter((p) => p.type === 'field') as Field[]
  )

  console.log('fields', fields)

  return (
    <>
      {fields?.map((field, idx) => (
        <ModelDesignerItem key={idx} data={field} />
      ))}
    </>
  )
}
