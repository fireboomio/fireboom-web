import { CloseCircleFilled } from '@ant-design/icons'
import type { ReactNode } from 'react'
import { useState } from 'react'

interface Props {
  children: ReactNode
  handleRemoveClick: () => void
}

const RemoveButton = ({ children, handleRemoveClick }: Props) => {
  const [isShow, setShow] = useState(false)
  const handleMouseEnter = () => {
    setShow(true)
  }

  const handleMouseLeave = () => {
    setShow(false)
  }
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="hover:bg-[#F8F8F9] relative h-7"
    >
      {isShow && (
        <CloseCircleFilled
          onClick={handleRemoveClick}
          style={{ color: '#5F6269', zIndex: 999 }}
          className="cursor-pointer absolute text-xs top-0 right-0"
        />
      )}
      {children}
    </div>
  )
}
export default RemoveButton
