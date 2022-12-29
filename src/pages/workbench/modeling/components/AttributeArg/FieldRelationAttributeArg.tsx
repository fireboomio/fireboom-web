import type { Field } from '@mrleebo/prisma-ast'
import { Input, message } from 'antd'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import type { Model } from '@/interfaces/modeling'
import type { AttributeHandlersProp } from '@/lib/helpers/PrismaSchemaProperties'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useEntities from '@/lib/hooks/useEntities'

import AttributeArgHelper from './AttributeArgHelper'
import AttributeArgSelector from './AttributeArgSelector'

const FieldRelationAttributeArg = ({
  args,
  updateAttrArgs,
  field,
  currentModelFields = []
}: AttributeHandlersProp) => {
  const intl = useIntl()
  const { entities } = useEntities()
  const { currentEntity } = useCurrentEntity()
  const referenceEntity = entities.find(e => e.name === field!.fieldType)

  const [isEditing, setEditing] = useImmer(false)

  const {
    name,
    fields: currentFields,
    references
  } = AttributeArgHelper.extractRelationAttributeArgs(args)

  const [nameValue, setNameValue] = useImmer<string | undefined>(name)

  useEffect(() => {
    setNameValue(name)
  }, [name])

  const handleFieldsDataChange = (selectedFields: string[] | string) => {
    updateAttrArgs(
      AttributeArgHelper.buildNewRelationArgs(nameValue, selectedFields as string[], references)
    )
  }

  const handleReferenceDataChange = (selectedFields: string[] | string) => {
    updateAttrArgs(
      AttributeArgHelper.buildNewRelationArgs(nameValue, currentFields, selectedFields as string[])
    )
  }

  const handleNameChange = () => {
    setEditing(false)
    const nameRegex = new RegExp('^"[A-Za-z0-9_]+"$')
    if (nameValue && !nameRegex.test(nameValue)) {
      void message.error(
        intl.formatMessage({ defaultMessage: 'name应为字符串，使用大小写字母或者下划线！' })
      )
      setNameValue(name)
      return
    }
    updateAttrArgs(AttributeArgHelper.buildNewRelationArgs(nameValue, currentFields, references))
  }

  const fieldsList = currentModelFields
    .map(item => ({
      label: item.name,
      value: item.name,
      comment: item.comment
    }))
    .filter(item => item.value !== field?.name)

  const referenceList = (referenceEntity as Model).properties
    .filter(p => p.type === 'field')
    .map(p => p as Field)
    .map(item => ({ label: item.name, value: item.name, comment: item.comment }))

  const handleFocus = () => {
    setEditing(true)
  }

  if (!referenceEntity) {
    void message.error(intl.formatMessage({ defaultMessage: '无法找到关联表实体类型！' }))
    return <></>
  }

  return (
    <div className="flex flex-row">
      <span>(</span>
      <span>name: </span>
      <span>(</span>
      {isEditing ? (
        <div className="w-12 h-7">
          <Input
            onChange={e => setNameValue(e.target.value)}
            autoFocus
            onBlur={handleNameChange}
            placeholder={intl.formatMessage({ defaultMessage: '请输入' })}
            value={nameValue}
            onPressEnter={handleNameChange}
            bordered={false}
            className="pl-0"
          />
        </div>
      ) : (
        <div className="text-[#ECA160]" onClick={handleFocus}>
          {nameValue ? nameValue : intl.formatMessage({ defaultMessage: '请输入' })}
        </div>
      )}
      <span>)</span>
      <span>,</span>
      <span>fields: </span>
      <AttributeArgSelector
        multiSelect={true}
        optionsMessage={intl.formatMessage(
          { defaultMessage: '从<{name}>选择字段' },
          { name: currentEntity.name }
        )}
        handleDataChange={handleFieldsDataChange}
        options={fieldsList}
        selectedOptionsValue={currentFields}
      />
      <span>,</span>
      <span>references: </span>
      <AttributeArgSelector
        multiSelect={true}
        optionsMessage={intl.formatMessage(
          { defaultMessage: '从<{name}>选择字段' },
          { name: referenceEntity.name }
        )}
        handleDataChange={handleReferenceDataChange}
        options={referenceList}
        selectedOptionsValue={references}
      />
      <span>)</span>
    </div>
  )
}

export default FieldRelationAttributeArg
