import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import IconButton, { IconButtonMore } from './IconButton'
import { AddOutlined, CheckedFilled, SortableOutlined } from './Icons'
import { useGraphQLExplorer } from './provider'
interface FieldsTitleProps {
  //
}

const FieldsTitle = () => {
  const [selected, setSelected] = useState(false)
  const { fieldSort, toggleFieldSort } = useGraphQLExplorer()

  return (
    <div className="mt-3 mb-2 flex items-center">
      <span className="font-semibold text-md">
        <FormattedMessage defaultMessage="字段列表" />
      </span>
      <IconButton className="ml-2" onClick={toggleFieldSort}>
        {fieldSort === 'asc' ? (
          <ArrowUpOutlined className="h-3" />
        ) : fieldSort === 'desc' ? (
          <ArrowDownOutlined className="h-3" />
        ) : (
          <SortableOutlined className="h-3" />
        )}
      </IconButton>
      <div className="ml-2 flex items-center">
        <IconButton>
          {selected ? (
            <CheckedFilled className="w-4 h-4 text-primary" />
          ) : (
            <AddOutlined className="w-4 h-4" />
          )}
        </IconButton>
        <IconButtonMore items={['选择所有标量字段', '递归选择所有字段']} />
      </div>
    </div>
  )
}

export default FieldsTitle
