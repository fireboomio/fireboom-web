import { Input } from 'antd'
import { useImmer } from 'use-immer'

interface Props {
  data: string
  className?: string
}

export default function ModelDesignerColumnName({ data, className }: Props) {
  const [isEditing, setIsEditing] = useImmer(false)

  function commit() {
    setIsEditing(!isEditing)
  }

  function cancel(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  return isEditing ? (
    <Input
      className={`h-7 max-w-150px mr-3 pl-2px ${className ?? ''}`}
      autoFocus
      size="small"
      defaultValue={data}
      onBlur={commit}
      onPressEnter={commit}
      onKeyUp={cancel}
    />
  ) : (
    <div
      className={`w-full max-w-150px ml-0 mr-3 hover:bg-[#F8F8F9] ${className ?? ''}`}
      onClick={() => setIsEditing(!isEditing)}
    >
      {data}
    </div>
  )
}