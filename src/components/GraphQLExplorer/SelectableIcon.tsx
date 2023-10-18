import IconButton from './IconButton'
import { AddOutlined, CheckedFilled } from './Icons'

export interface SelectableIconProps {
  checked?: boolean | 'indeterminate'
  className?: string
  onChange?: (checked: boolean) => void
}

const SelectableIcon = ({ checked, className, onChange }: SelectableIconProps) => {
  const onClick = () => {
    if (checked === 'indeterminate') {
      onChange?.(false)
    } else {
      onChange?.(!checked)
    }
  }
  return (
    <IconButton className={className} onClick={onClick}>
      {checked === true ? (
        <CheckedFilled className="w-4 h-4 text-primary" />
      ) : checked === 'indeterminate' ? (
        <div className="bg-primary w-4 h-4 rounded-lg flex items-center justify-center">
          <div className="w-2.5 h-0.5 bg-white"></div>
        </div>
      ) : (
        <AddOutlined className="w-4 h-4" />
      )}
    </IconButton>
  )
}

export default SelectableIcon
