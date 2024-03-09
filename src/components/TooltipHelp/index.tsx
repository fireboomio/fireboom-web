import { QuestionCircleOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"

const TooltipHelp = ({ overlay }: { overlay: React.ReactNode }) => {

  return (
    <Tooltip className='cursor-help' overlay={overlay}>
      <QuestionCircleOutlined className='ml-1' />
    </Tooltip>
  )
}

export default TooltipHelp