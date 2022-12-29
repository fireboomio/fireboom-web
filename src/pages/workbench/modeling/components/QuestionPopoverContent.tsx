import { Radio, Space } from 'antd'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

export type ArrayOrOptionalRadioValue = 'optional' | 'isArray' | undefined

interface QuestionPopoverContentProps {
  radioValue: ArrayOrOptionalRadioValue
  handleRadioChange: (value: ArrayOrOptionalRadioValue) => void
}

const QuestionPopoverContent = ({ radioValue, handleRadioChange }: QuestionPopoverContentProps) => {
  const intl = useIntl()
  const [value, setValue] = useImmer(radioValue)

  const handleRadioClick = (clickValue: ArrayOrOptionalRadioValue) => {
    setValue(value === clickValue ? undefined : clickValue)
    handleRadioChange(value === clickValue ? undefined : clickValue)
  }
  return (
    <Radio.Group value={value}>
      <Space direction="vertical" size={12}>
        <Radio value={'optional'} onClick={() => handleRadioClick('optional')}>
          {intl.formatMessage({ defaultMessage: '可以为空' })}
        </Radio>
        <Radio value={'isArray'} onClick={() => handleRadioClick('isArray')}>
          {intl.formatMessage({ defaultMessage: '是否数组' })}
        </Radio>
      </Space>
    </Radio.Group>
  )
}

export default QuestionPopoverContent
