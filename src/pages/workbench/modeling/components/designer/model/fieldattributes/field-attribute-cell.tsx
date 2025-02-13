import type { Attribute, Field } from '@mrleebo/prisma-ast'
import type { AttributeArgument } from '@mrleebo/prisma-ast/src/getSchema'
import { message, Select } from 'antd'
import { useIntl } from 'react-intl'

import type { Entity } from '@/interfaces/modeling'
import { PRISMA_BASE_TYPES } from '@/lib/constants/prismaConstants'
import type { AttributeHandlersProp, AttributeType } from '@/lib/helpers/PrismaSchemaProperties'
import { usePrismaSchemaProperties } from '@/lib/helpers/PrismaSchemaProperties'
import useDBSource from '@/lib/hooks/useDBSource'
import useEntities from '@/lib/hooks/useEntities'
import FieldDefaultAttributeArg from '@/pages/workbench/modeling/components/AttributeArg/FieldDefaultAttributeArg'
import FieldNormalAttributeArg from '@/pages/workbench/modeling/components/AttributeArg/FieldNormalAttributeArg'
import FieldRelationAttributeArg from '@/pages/workbench/modeling/components/AttributeArg/FieldRelationAttributeArg'
import ModelMapAttributeArg from '@/pages/workbench/modeling/components/AttributeArg/ModelMapAttributeArg'
import RemoveButton from '@/pages/workbench/modeling/components/RemoveButton'
import { databaseKindNameMap } from '@/utils/datasource'

interface FieldAttributeHandlers {
  display: (props: AttributeHandlersProp) => JSX.Element
}

const fieldAttributeNameActionMap: Record<string, FieldAttributeHandlers> = {
  id: {
    display: () => <></>
  },
  default: {
    display: FieldDefaultAttributeArg
  },
  unique: {
    display: () => <></>
  },
  updatedAt: {
    display: () => <></>
  },
  relation: {
    display: FieldRelationAttributeArg
  },
  ignore: {
    display: () => <></>
  },
  map: {
    display: ModelMapAttributeArg
  }
}

interface Props {
  field: Field
  fields: Field[]
  fieldAttribute: Attribute
  updateAttrArgs: (newArgs: AttributeArgument[]) => void
  handleRemoveClick: () => void
  handleAttrNameSelect: (value: string) => void
}

const FieldAttributeCell = ({
  field,
  fields,
  fieldAttribute,
  handleAttrNameSelect,
  handleRemoveClick,
  updateAttrArgs
}: Props) => {
  const intl = useIntl()
  const PrismaSchemaProperties = usePrismaSchemaProperties()
  const { realKind } = useDBSource()
  const { entities } = useEntities()
  const referenceEntity = entities.find(e => e.name === field.fieldType)

  let fieldType = field.fieldType as string
  if (typeof field.fieldType === 'string') {
    if (!PRISMA_BASE_TYPES.includes(fieldType)) {
      fieldType = (referenceEntity as Entity).type === 'enum' ? 'Enum' : 'Model'
    }
  } else {
    fieldType = 'Unsupported'
  }

  const prismaSchemaPropertyForDBType = PrismaSchemaProperties[realKind as number]
  if (!prismaSchemaPropertyForDBType) {
    void message.error(
      intl.formatMessage(
        { defaultMessage: '暂不支持数据库类型为[{dbType}]的数据源！' },
        { dbType: databaseKindNameMap[realKind as keyof typeof databaseKindNameMap] }
      )
    )
    return <>N/A</>
  }

  const attributesOptions = prismaSchemaPropertyForDBType.fieldType

  const attributes = attributesOptions[fieldType].attributes
  const existAttributes = field.attributes?.map(fa => fa.name) ?? []

  const fieldAttributesMap: Record<string, AttributeType> = {}
  attributes.forEach(a => {
    fieldAttributesMap[a.name] = a
    fieldAttributesMap[a.name].display = fieldAttributeNameActionMap[a.name]?.display
  })

  const filteredAttrSelectOptions = Object.keys(fieldAttributesMap).filter(
    an => !existAttributes.includes(an)
  )

  const handleOperateAttrArgs = () => {
    const attrConfig: AttributeType = fieldAttributesMap[fieldAttribute.name]
    const hasArgs = attrConfig?.hasArgs
    const display = attrConfig?.display
    if (hasArgs) {
      if (display) {
        return display({
          args: fieldAttribute.args ?? [],
          updateAttrArgs,
          field,
          currentModelFields: fields
        })
      }
      return (
        <FieldNormalAttributeArg args={fieldAttribute.args ?? []} updateAttrArgs={updateAttrArgs} />
      )
    }
    return <></>
  }

  return (
    <RemoveButton handleRemoveClick={handleRemoveClick}>
      <div className="flex flex-row mr-3 text-[#1B25C9]">
        <div>
          @
          {fieldAttribute.name ? (
            <>{fieldAttribute.name}</>
          ) : (
            <Select
              autoFocus
              dropdownMatchSelectWidth={false}
              showSearch
              onSelect={handleAttrNameSelect}
              onBlur={() => handleAttrNameSelect(fieldAttribute.name)}
              bordered={false}
              showArrow={false}
              defaultOpen
            >
              {filteredAttrSelectOptions.map((attr, idx) => (
                <Select.Option key={idx} value={attr}>
                  {attr}
                  <span className="ml-2 text-[#AFB0B4]">{fieldAttributesMap[attr]?.comment}</span>
                </Select.Option>
              ))}
            </Select>
          )}
        </div>
        <div className="flex">{handleOperateAttrArgs()}</div>
      </div>
    </RemoveButton>
  )
}

export default FieldAttributeCell
