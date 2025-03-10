import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal, Popover, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import type { Enum } from '@/interfaces/modeling'
import { UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import { PRISMA_BASE_TYPES } from '@/lib/constants/prismaConstants'
import EnumDesigner from '@/pages/workbench/modeling/components/designer/enum'

import styles from '../index.module.less'

interface Props {
  options: { label?: string; value: string; comment?: string }[]
  selectedValue: string
  handleDataChange: (values: string) => void
  isArray: boolean
  isOptional: boolean
  addNewEnum: (newEnum: Enum) => void
}

const TagRender = ({ value }: { value?: string }) => {
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return <span color={value} onMouseDown={onPreventMouseDown} style={{ marginRight: 3 }} />
}

const FieldTypeSelector = ({
  options,
  selectedValue,
  handleDataChange,
  isArray,
  isOptional,
  addNewEnum
}: Props) => {
  const intl = useIntl()
  const [selectOptions, setSelectOptions] = useImmer(options)

  const [newEnumModalVisible, setNewEnumModalVisible] = useImmer(false)

  useEffect(() => {
    setSelectOptions(options)
  }, [options])

  const onChange = (values: string) => {
    setSelectOptions(options)
    handleDataChange(values)
  }

  const handleSearch = (v: string) => {
    if (v) {
      setSelectOptions(options.filter(o => o.label?.toLowerCase().includes(v.toLowerCase())))
    } else {
      setSelectOptions(options)
    }
  }

  const [delaySubmit, setDelaySubmit] = useState<string>()
  useEffect(() => {
    if (delaySubmit) {
      handleDataChange(delaySubmit)
    }
    setDelaySubmit(undefined)
  }, [delaySubmit])

  const handleSaveEnum = (newEnum: Enum) => {
    // 延迟提交新枚举，以避免新枚举的保存和model的保存同时进行，导致model保存失败或者model保存成功但是枚举保存失败
    addNewEnum(newEnum)
    setNewEnumModalVisible(false)
    setTimeout(() => {
      setDelaySubmit(newEnum.name)
    }, 100)
  }

  const content = (
    <div className={`${styles['parent-select']} max-w-full`}>
      {
        <div className={`flex flex-row ${styles['parent-select']}`}>
          <div
            className={`overflow-hidden overflow-ellipsis ${
              PRISMA_BASE_TYPES.includes(selectedValue) ? 'text-[#1BB659]' : 'text-[#99109B]'
            }`}
          >
            {selectedValue}
            {isArray ? '[]' : ''}
            {isOptional ? '?' : ''}
          </div>
        </div>
      }
      <div className={styles['child-select']}>
        <Select
          value={selectedValue}
          bordered={false}
          showArrow={false}
          dropdownMatchSelectWidth={false}
          onChange={onChange}
          showSearch
          onSearch={handleSearch}
          tagRender={TagRender}
          dropdownRender={menu => (
            <div className="divide-y">
              {menu}
              <div className="text-center">
                <Button
                  className="w-full"
                  icon={<PlusOutlined />}
                  type="link"
                  onClick={() => setNewEnumModalVisible(true)}
                >
                  {intl.formatMessage({ defaultMessage: '新增枚举类型' })}
                </Button>
              </div>
            </div>
          )}
        >
          {selectOptions.map((item, index) => (
            <Select.Option label={item.label} key={index} value={item.value}>
              <span className={PRISMA_BASE_TYPES.includes(item.value) ? '' : 'text-[#99109B]'}>
                {item.value}
              </span>
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  )

  return (
    <div className={`${styles['parent-content']} max-w-full`}>
      {selectedValue.length > 10 ? (
        <Popover content={selectedValue} trigger="hover">
          {content}
        </Popover>
      ) : (
        content
      )}
      <Modal
        width={800}
        title={intl.formatMessage({ defaultMessage: '新增枚举' })}
        closable
        destroyOnClose
        open={newEnumModalVisible}
        onCancel={() => setNewEnumModalVisible(false)}
        footer={<></>}
      >
        <div className="min-h-xs">
          <EnumDesigner
            showTitle
            savedEnum={{
              type: 'enum',
              name: UNTITLED_NEW_ENTITY,
              enumerators: [],
              id: 0
            }}
            saveEnum={handleSaveEnum}
            isEditing={true}
          />
        </div>
      </Modal>
    </div>
  )
}

export default FieldTypeSelector
