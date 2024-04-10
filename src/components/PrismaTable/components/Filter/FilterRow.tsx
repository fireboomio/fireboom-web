import type { Enums, SchemaModel } from '@paljs/types'
import type { InputRef } from 'antd'
import { DatePicker, Input, Select } from 'antd'
import dayjs from 'dayjs'
import { isEqual } from 'lodash'
import { useEffect, useRef } from 'react'
import { useImmer } from 'use-immer'

import type { FieldType } from '@/components/PrismaTable/components/Filter/FilterHelper'
import { filterOperators } from '@/components/PrismaTable/components/Filter/FilterHelper'
import language from '@/components/PrismaTable/libs/language'
import type { FilterState, FilterValueType } from '@/components/PrismaTable/libs/types'

import iconDel from './assets/del.svg'

const { Option } = Select

const getFilterOperators = (type: FieldType) => {
  return Object.keys(filterOperators).filter(
    o => Array.isArray(filterOperators[o].onlyInType) ? filterOperators[o].onlyInType!.includes(type) : !filterOperators[o].notExistsInType.includes(type)
  )
}

interface FilterRowProps {
  currentModel: SchemaModel
  enums: Enums[]
  models: SchemaModel[]
  filter: FilterState
  deleteFilter: () => void
  updateFilter: (filter: FilterState) => void
}

const FilterRow = ({
  enums,
  filter,
  currentModel,
  models,
  deleteFilter,
  updateFilter
}: FilterRowProps) => {
  const [fieldNameSelectValue, setFieldNameSelectValue] = useImmer<string>(filter.field.name)
  const [inputValue, setInputValue] = useImmer<FilterValueType | undefined>(filter.value)
  const [operatorSelectValue, setOperatorSelectValue] = useImmer<string>(filter.operator)

  useEffect(() => {
    if (operatorSelectValue !== filter.operator) {
      setOperatorSelectValue(filter.operator)
    }
    if (fieldNameSelectValue !== filter.field.name) {
      setFieldNameSelectValue(filter.field.name)
    }
    if (!isEqual(inputValue, filter.value)) {
      setInputValue(filter.value)
    }
  }, [filter])

  const fields = currentModel?.fields.filter(f => f.filter) ?? []
  const [relationFieldNameSelectValue, setRelationFieldNameSelectValue] = useImmer<
    string | undefined
  >(undefined)

  const getRelationFields = () => {
    const relation = currentModel.fields.find(f => f.name === fieldNameSelectValue)
    if (relation?.kind === 'object') {
      return models
        .find(m => m.id === relation.type)
        ?.fields.filter(f => f.filter && f.kind !== 'object')
    }
  }

  const selectedField = fields.find(f => f.name === fieldNameSelectValue) ?? filter.field
  useEffect(() => {
    setRelationFieldNameSelectValue(
      filter.relationField?.name ?? getRelationFields()?.map(f => f.name)[0]
    )
  }, [filter, fieldNameSelectValue])

  const relationField = getRelationFields()?.find(f => f.name === relationFieldNameSelectValue)
  const getFilterFieldType = (): FieldType => {
    if (relationField) {
      return relationField.kind === 'enum' ? 'Enum' : (relationField.type as FieldType)
    }
    if (selectedField) {
      return selectedField.kind === 'enum' ? 'Enum' : (selectedField.type as FieldType)
    }
    return 'String'
  }

  const fieldType = getFilterFieldType()
  const enumOptions =
    fieldType === 'Enum' ? enums.find(e => e.name === selectedField.type)?.fields ?? [] : []
  const operators = getFilterOperators(fieldType)

  const relationFieldsOptions = getRelationFields()

  useEffect(() => {
    let filterValue = inputValue
    if (!filterValue) return

    if (['Int', 'BigInt', 'Decimal', 'Float'].includes(fieldType)) {
      filterValue = ['in', 'notIn'].includes(operatorSelectValue)
        ? String(filterValue)
            .split(',')
            .filter(v => v)
            .map(v => Number(v))
        : isNaN(Number(filterValue))
        ? ''
        : Number(filterValue)
    }
    if ('String' === fieldType) {
      filterValue = ['in', 'notIn'].includes(operatorSelectValue)
        ? String(filterValue)
            .split(',')
            .filter(v => v)
        : filterValue
    }
    updateFilter({
      field: selectedField,
      relationField,
      operator: operatorSelectValue,
      value: filterValue
    })
  }, [inputValue, selectedField, relationField, operatorSelectValue])

  return (
    <div className="w-full flex flex-row items-baseline gap-3">
      <div className="w-468px flex flex-row gap-2 justify-between mb-2">
        <Select
          dropdownMatchSelectWidth={false}
          className="w-140px flex-shrink-0"
          value={fieldNameSelectValue || fields[0].name}
          onSelect={setFieldNameSelectValue}
        >
          {fields.map((field, idx) => (
            <Option key={idx} value={field.name}>
              {field.name}
            </Option>
          ))}
        </Select>
        {relationFieldsOptions && (
          <Select
            dropdownMatchSelectWidth={false}
            className="w-106px flex-shrink-0"
            value={relationFieldNameSelectValue || relationFieldsOptions[0].name}
            onSelect={setRelationFieldNameSelectValue}
          >
            {relationFieldsOptions.map((field, idx) => (
              <Option key={idx} value={field.name}>
                {field.name}
              </Option>
            ))}
          </Select>
        )}
        <Select
          dropdownMatchSelectWidth={false}
          className="w-106px flex-shrink-0"
          value={operatorSelectValue || operators[0]}
          onSelect={setOperatorSelectValue}
        >
          {operators.map((op, idx) => (
            <Option key={idx} value={op}>
              {op}
            </Option>
          ))}
        </Select>
        <FilterValue
          enums={enumOptions}
          handleValueChange={setInputValue}
          inputValue={inputValue}
          fieldType={fieldType}
        />
      </div>
      <div className="cursor-pointer" onClick={deleteFilter}>
        <img src={iconDel} alt="删除" />
      </div>
    </div>
  )
}

interface FilterValueProps {
  enums: string[]
  inputValue: FilterValueType | undefined
  handleValueChange: (value: FilterValueType) => void
  fieldType: FieldType
}

const FilterValue = ({ inputValue, handleValueChange, fieldType, enums }: FilterValueProps) => {
  const [inputString, setInputString] = useImmer<string>(
    typeof inputValue === 'object' ? (inputValue as string[]).join(',') : (inputValue as string)
  )

  useEffect(() => {
    setInputString(
      typeof inputValue === 'object' ? (inputValue as string[]).join(',') : (inputValue as string)
    )
  }, [inputValue])

  const inputRef = useRef<InputRef>(null)
  const handleInputChange = ({ target: { value } }: { target: { value: string } }) => {
    setInputString(value)
    handleValueChange(value)
  }

  const handleInputBlur = () => {
    handleValueChange(inputString)
  }

  switch (fieldType) {
    case 'DateTime': {
      const defaultDate = inputValue ? dayjs(inputValue as string, 'YYYY-MM-DD') : dayjs()
      return (
        <DatePicker
          defaultValue={defaultDate}
          className="w-full"
          onChange={(_: unknown, dateString: string) => handleValueChange(dateString)}
        />
      )
    }
    case 'Boolean':
      return (
        <Select
          defaultValue={inputValue}
          dropdownMatchSelectWidth={false}
          className="w-full"
          onSelect={(value: boolean) => handleValueChange(value)}
        >
          <Option value={true}>{language.yes}</Option>
          <Option value={false}>{language.no}</Option>
        </Select>
      )
    case 'Enum':
      return (
        <Select
          defaultValue={inputValue}
          dropdownMatchSelectWidth={false}
          className="w-full"
          onSelect={handleValueChange}
        >
          {enums.map(e => {
            return (
              <Option key={e} value={e}>
                {e}
              </Option>
            )
          })}
        </Select>
      )
    default:
      return (
        <Input
          ref={inputRef}
          autoFocus
          value={inputString}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
      )
  }
}

export default FilterRow
