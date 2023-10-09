import { LeftOutlined } from '@ant-design/icons'
import { AddOutlined, CheckedFilled } from './Icons'

interface FieldTitleProps {
  title: string
  type?: string
  isArray?: boolean
  selected: boolean
}

const FieldTitle = ({ title, type, isArray, selected }: FieldTitleProps) => {
  return (
    <div className="h-7 flex items-center">
      <LeftOutlined className="h-6 mr-2" />
      <span className="font-bold">
        {title}
        {type && (
          <>
            :<span className="ml-1">{isArray ? `[${type}]` : type}</span>{' '}
          </>
        )}
      </span>
      <div
        className="w-7 h-7 flex-shrink-0 flex items-center justify-center cursor-pointer rounded hover:bg-white"
        // onClick={onSelect}
      >
        {selected ? (
          <CheckedFilled className="w-4 h-4 text-primary" />
        ) : (
          <AddOutlined className="w-4 h-4" />
        )}
      </div>
    </div>
  )
}

export default FieldTitle
