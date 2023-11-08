import clsx from 'clsx'
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

type VariableSelectIconProps = {
  checked?: false | 'variable' | 'static'
  className?: string
  onChange?: (checked: false | 'variable' | 'static') => void
}

export const VariableSelectIcon = ({ checked, className, onChange }: VariableSelectIconProps) => {
  return (
    <span className="relative group">
      {!checked ? (
        <>
          <div className="hidden group-hover:flex flex items-center -ml-3">
            <IconButton className={className}>
              <div className="border border-solid border-dark-700 w-4 h-4 rounded-lg flex items-center justify-center">
                $
              </div>
            </IconButton>
            <IconButton className={clsx('ml-1', className)}>
              <div className="border border-solid border-dark-700 w-4 h-4 rounded-lg flex items-center justify-center">
                C
              </div>
            </IconButton>
          </div>
          <IconButton className={clsx('group-hover:hidden', className)}>
            <AddOutlined className="w-4 h-4" />
          </IconButton>
        </>
      ) : (
        <IconButton className={className} onClick={() => onChange?.(false)}>
          <div className="bg-primary w-4 h-4 rounded-lg flex items-center justify-center">
            {checked === 'variable' ? '$' : 'S'}
          </div>
        </IconButton>
      )}
    </span>
  )
}
