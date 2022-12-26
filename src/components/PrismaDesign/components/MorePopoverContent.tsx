import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { FormattedMessage } from 'react-intl'

interface MorePopoverContentProps {
  onDeleteClick: () => void
  onCopyClick: () => void
}

const MorePopoverContent = ({ onCopyClick, onDeleteClick }: MorePopoverContentProps) => (
  <Space direction="vertical">
    <div className="cursor-pointer w-full hover:bg-[#F8F8F9]" onClick={onDeleteClick}>
      <DeleteOutlined /> <FormattedMessage defaultMessage="删除" />
    </div>
    <div className="cursor-pointer w-full hover:bg-[#F8F8F9]" onClick={onCopyClick}>
      <CopyOutlined /> <FormattedMessage defaultMessage="复制" />
    </div>
  </Space>
)

export default MorePopoverContent
