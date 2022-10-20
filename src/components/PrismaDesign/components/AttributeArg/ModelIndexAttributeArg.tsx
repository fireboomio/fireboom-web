import type { AttributeArgument } from '@mrleebo/prisma-ast'

import AttributeArgHelper from '@/components/PrismaDesign/components/AttributeArg/AttributeArgHelper'
import AttributeArgSelector from '@/components/PrismaDesign/components/AttributeArg/AttributeArgSelector'
import { PRISMA_BASE_TYPES } from '@/lib/constants/prismaConstants'
import type { AttributeHandlersProp } from '@/lib/helpers/PrismaSchemaProperties'

const ModelIndexAttributeArg = ({
  args,
  updateAttrArgs,
  currentModelFields
}: AttributeHandlersProp) => {
  const { fields } = AttributeArgHelper.extractIndexAttributeArgs(args)
  const fieldsOptions = (currentModelFields || [])
    .filter(f => PRISMA_BASE_TYPES.includes(f.fieldType as string))
    .map(f => {
      return {
        label: f.name,
        value: f.name
      }
    })

  const selected = fields ? (typeof fields === 'object' ? fields : [fields]) : []

  const handleChange = (selectedFields: string[] | string) => {
    const newArgs: AttributeArgument[] = [
      {
        type: 'attributeArgument',
        value: {
          type: 'keyValue',
          key: 'fields',
          value: {
            type: 'array',
            args: selectedFields as string[]
          }
        }
      }
    ]
    updateAttrArgs(newArgs)
  }

  return (
    <div className="flex">
      <span>(</span>
      <AttributeArgSelector
        argName="fields"
        multiSelect={true}
        options={fieldsOptions}
        selectedOptionsValue={selected}
        handleDataChange={handleChange}
      />
      <span>)</span>
    </div>
  )
}

export default ModelIndexAttributeArg
