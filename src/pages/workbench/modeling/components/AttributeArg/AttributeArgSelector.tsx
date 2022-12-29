import { Select } from 'antd'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import styles from '../index.module.less'

interface Props {
  options: { label?: string; value: string; comment?: string }[]
  selectedOptionsValue: string[]
  argName?: string
  multiSelect?: boolean
  inputable?: boolean
  inputQuote?: boolean
  argIsFunction?: boolean
  handleDataChange: (values: string[] | string) => void
  optionsMessage?: string
}

const TagRender = ({ value }: { value?: string }) => {
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return <span color={value} onMouseDown={onPreventMouseDown} style={{ marginRight: 3 }} />
}

const AttributeArgSelector = ({
  options,
  selectedOptionsValue,
  handleDataChange,
  argName,
  inputable,
  multiSelect = false,
  inputQuote = false,
  argIsFunction = false,
  optionsMessage
}: Props) => {
  const intl = useIntl()
  const [isSelected, setSelected] = useImmer(selectedOptionsValue.length !== 0)
  const [selectOptions, setSelectOptions] = useImmer(options)

  useEffect(() => {
    setSelectOptions(options)
  }, [options])

  useEffect(() => {
    setSelected(selectedOptionsValue.length !== 0)
  }, [selectedOptionsValue])

  const handleSearch = (v: string) => {
    if (v) {
      const newValue = { label: v, value: inputQuote ? `"${v}"` : v }
      if (!options.find(o => o.label === v)) {
        setSelectOptions([newValue, ...options])
      } else {
        setSelectOptions(options)
      }
    } else {
      setSelectOptions(options)
    }
  }

  const onChange = (values: string[] | string) => {
    setSelectOptions(options)
    handleDataChange(values)
  }

  return (
    <div className={styles['parent-content']}>
      {argName && <span>{argName}:&nbsp;</span>}
      <div className={styles['parent-select']}>
        {multiSelect && <span>[</span>}
        {isSelected ? (
          <span className={`${styles['select-content']} text-[#ECA160] w-max`}>
            {selectedOptionsValue.join(', ')}
            {argIsFunction && '()'}
          </span>
        ) : (
          <span className={styles['to-choose']}>
            {intl.formatMessage({ defaultMessage: '待选择' })}
          </span>
        )}
        <div className={styles['child-select']}>
          <Select
            value={selectedOptionsValue}
            bordered={false}
            mode={multiSelect ? 'multiple' : undefined}
            showSearch={!multiSelect && inputable}
            showArrow={false}
            dropdownMatchSelectWidth={false}
            onChange={onChange}
            onSearch={!multiSelect && inputable ? handleSearch : undefined}
            dropdownRender={menu => (
              <>
                {optionsMessage && (
                  <div className="w-full ml-3 mr-10 mb-2 text-[#ECA160]">{optionsMessage}</div>
                )}
                {menu}
              </>
            )}
            tagRender={TagRender}
          >
            {selectOptions.map((item, index) => (
              <Select.Option label={item.label} key={index} value={item.value}>
                <span>
                  {item.value}
                  {item.comment && <span className="ml-2 text-[#AFB0B4]">{item.comment}</span>}
                </span>
              </Select.Option>
            ))}
          </Select>
        </div>
        {multiSelect && <span>]</span>}
      </div>
    </div>
  )
}

export default AttributeArgSelector
