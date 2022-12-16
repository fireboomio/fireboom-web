import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { Space } from 'antd'

interface MorePopoverContentProps {
  onDeleteClick: () => void
  onCopyClick: () => void
}

const MorePopoverContent = ({ onCopyClick, onDeleteClick }: MorePopoverContentProps) => (
  <Space direction="vertical">
    <div className="w-full hover:bg-[#F8F8F9] cursor-pointer" onClick={onDeleteClick}>
      <DeleteOutlined /> 删除
    </div>
    <div className="w-full hover:bg-[#F8F8F9] cursor-pointer" onClick={onCopyClick}>
      <CopyOutlined /> 复制
    </div>
  </Space>
)

export default MorePopoverContent
