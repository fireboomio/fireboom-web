import { FormattedMessage } from "react-intl"
import IconButton from "./IconButton"
import { SortableOutlined } from "./Icons"

interface FieldsTitleProps {
  //
}

const FieldsTitle = ({  }: FieldsTitleProps) => {

  return (
    <div className="mt-3 mb-2 flex items-center">
      <span className="font-semibold text-md"><FormattedMessage defaultMessage="字段列表" /></span>
      <IconButton className="ml-2">
        <SortableOutlined />
      </IconButton>
    </div>
  )
}

export default FieldsTitle