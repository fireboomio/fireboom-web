import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { useIntl } from 'react-intl'

interface MorePopoverContentProps {
  onDeleteClick: () => void
  onCopyClick: () => void
}

const MorePopoverContent = ({ onCopyClick, onDeleteClick }: MorePopoverContentProps) => {
  const intl = useIntl()
  return (
    <Space direction="vertical">
      <div className="w-full hover:bg-[#F8F8F9] cursor-pointer" onClick={onDeleteClick}>
        <DeleteOutlined /> {intl.formatMessage({ defaultMessage: '删除' })}
      </div>
      <div className="w-full hover:bg-[#F8F8F9] cursor-pointer" onClick={onCopyClick}>
        <CopyOutlined /> {intl.formatMessage({ defaultMessage: '复制' })}
      </div>
    </Space>
  )
}

export default MorePopoverContent
