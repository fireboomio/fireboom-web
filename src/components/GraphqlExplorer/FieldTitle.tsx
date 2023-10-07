import { BackwardOutlined } from '@ant-design/icons'
import { AddOutlined, CheckedFilled } from './Icons'

interface FieldTitleProps {
  title: string
  type: string
  isArray: boolean
  selected: boolean
}

const FieldTitle = ({ title, type, isArray, selected }: FieldTitleProps) => {
  return (
    <div className="h-7 flex items-center">
      <BackwardOutlined className="h-6 mr-2" />
      <span className="font-bold">
        {title}:<span className="ml-1">{isArray ? `[${type}]` : type}</span>{' '}
      </span>
      {selected ? <CheckedFilled className="w-4 h-4 text-primary" /> : <AddOutlined className="w-4 h-4" />}
    </div>
  )
}

export default FieldTitle
