import { LocationOutlined } from '../../../icons'

interface CustomLabelProps {
  label: string
  onInject?: () => void
}

const CustomLabel = ({ label, onInject }: CustomLabelProps) => {
  return (
    <div className="w-full py-1 pr-8 pl-4 relative">
      {label}
      <LocationOutlined
        onClick={onInject}
        className="cursor-pointer text-xs top-2.25 right-3 hidden absolute location-icon"
      />
    </div>
  )
}

export default CustomLabel
