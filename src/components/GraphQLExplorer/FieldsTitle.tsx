import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { GraphQLFieldMap, GraphQLObjectType } from 'graphql'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import IconButton, { IconButtonMore } from './IconButton'
import { AddOutlined, CheckedFilled, SortableOutlined } from './Icons'
import { useGraphQLExplorer } from './provider'
import SelectableIcon, { SelectableIconProps } from './SelectableIcon'
import { getSelectionNodesString } from './utils'
interface FieldsTitleProps {
  //
}

const FieldsTitle = () => {
  const { currentFields, graphqlObjectStack, operationDefs, fieldSort, toggleFieldSort, updateGraphQLQuery } =
    useGraphQLExplorer()

  const selectionKeys = getSelectionNodesString(graphqlObjectStack, operationDefs)
  let checked: SelectableIconProps['checked'] = false
  if (selectionKeys?.length) {
    if (selectionKeys.length === Object.keys(currentFields || {}).length) {
      checked = true
    } else {
      checked = 'indeterminate'
    }
  }
  console.log('checked', checked)

  // TODO
  const onSelect = (index: number) => {
    // 选择所有标量
    if (index === 0) {
      if (currentFields) {
        const a = (currentFields as GraphQLObjectType | GraphQLFieldMap<any, any>).getFields()
        
      }
    } else {
      // 递归选择所有字段
    }
  }

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
        <SelectableIcon checked={checked} />
        <IconButtonMore items={['选择所有标量字段', '递归选择所有字段']} onClick={onSelect} />
      </div>
    </div>
  )
}

export default FieldsTitle
