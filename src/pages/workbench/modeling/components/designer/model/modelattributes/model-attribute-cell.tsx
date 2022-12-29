import type { Field, ModelAttribute } from '@mrleebo/prisma-ast'
import type { AttributeArgument } from '@mrleebo/prisma-ast/src/getSchema'
import { message, Select } from 'antd'
import { useIntl } from 'react-intl'

import type { Model } from '@/interfaces/modeling'
import type { AttributeHandlersProp, AttributeType } from '@/lib/helpers/PrismaSchemaProperties'
import { PrismaSchemaProperties } from '@/lib/helpers/PrismaSchemaProperties'
import useDBSource from '@/lib/hooks/useDBSource'
import ModelIndexAttributeArg from '@/pages/workbench/modeling/components/AttributeArg/ModelIndexAttributeArg'
import ModelMapAttributeArg from '@/pages/workbench/modeling/components/AttributeArg/ModelMapAttributeArg'

const { Option } = Select

interface Props {
  currentModel: Model
  modelAttribute: ModelAttribute
  deleteEmptyAttributes: () => void
  handleUpdateAttribute: (attribute: ModelAttribute) => void
}

interface ModelAttributeOperateHandler {
  display: (props: AttributeHandlersProp) => JSX.Element
}

const modelAttributeNameActionMap: Record<string, ModelAttributeOperateHandler> = {
  index: {
    display: ModelIndexAttributeArg
  },
  id: {
    display: ModelIndexAttributeArg
  },
  unique: {
    display: ModelIndexAttributeArg
  },
  map: {
    display: ModelMapAttributeArg
  },
  ignore: {
    display: () => <></>
  }
}

const ModelAttributeCell = ({
  modelAttribute,
  currentModel,
  deleteEmptyAttributes,
  handleUpdateAttribute
}: Props) => {
  const intl = useIntl()
  const {
    config: { dbType }
  } = useDBSource()
  const { name: currentAttrName, args: currentAttrArgs } = modelAttribute
  const { properties } = currentModel
  const currentModelFields = properties.filter(p => p.type === 'field').map(f => f as Field)

  const modelAttributesMap: Record<string, AttributeType> = {}
  const prismaSchemaPropertyForDBType = PrismaSchemaProperties[dbType]
  if (!prismaSchemaPropertyForDBType) {
    void message.error(
      intl.formatMessage({ defaultMessage: '暂不支持数据库类型为[{dbType}]的数据源！' }, { dbType })
    )
    return <>N/A</>
  }
  prismaSchemaPropertyForDBType.model.attributes.forEach(attr => {
    // 过滤掉已经选过的属性
    modelAttributesMap[attr.name] = attr
    modelAttributesMap[attr.name].display = modelAttributeNameActionMap[attr.name]?.display
  })

  const modelAttributeSelectOptions = Object.keys(modelAttributesMap)

  const handleAttrNameSelect = (value: string) => {
    if (!value) {
      deleteEmptyAttributes()
      return
    }
    handleUpdateAttribute({
      ...modelAttribute,
      name: value
    })
  }

  const handleSelectBlur = () => {
    if (!modelAttribute.name) {
      deleteEmptyAttributes()
    }
  }

  const updateAttrArgs = (newArgs: AttributeArgument[]) => {
    handleUpdateAttribute({
      ...modelAttribute,
      args: newArgs
    })
  }

  const handleOperateAttrArgs = () => {
    const attrConfig: AttributeType = modelAttributesMap[currentAttrName]
    const hasArgs = attrConfig?.hasArgs
    const display = attrConfig?.display
    return hasArgs && display ? (
      display({ args: currentAttrArgs ?? [], updateAttrArgs, currentModelFields })
    ) : (
      <></>
    )
  }

  return (
    <div className="h-7 flex flex-row items-baseline gap-4">
      <div className="flex flex-row my-1.5 text-sm font-normal leading-7 hover:bg-[#F8F8F9]">
        <div className="cursor-pointer w-auto">
          {currentAttrName ? (
            <>@@{currentAttrName}</>
          ) : (
            <span className="flex flex-row">
              @@
              <Select
                autoFocus
                dropdownMatchSelectWidth={false}
                bordered={false}
                showArrow={false}
                defaultOpen
                onSelect={handleAttrNameSelect}
                onBlur={handleSelectBlur}
              >
                {modelAttributeSelectOptions.map(attrKey => (
                  <Option key={attrKey} value={attrKey}>
                    {attrKey}
                    <span className="ml-2 text-[#AFB0B4]">
                      {modelAttributesMap[attrKey].comment}
                    </span>
                  </Option>
                ))}
              </Select>
            </span>
          )}
        </div>
        <div className="flex">{handleOperateAttrArgs()}</div>
      </div>
      <div className="text-[#AFB0B4]">{modelAttributesMap[currentAttrName]?.comment}</div>
    </div>
  )
}

export default ModelAttributeCell
