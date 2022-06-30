import { AppleOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import React, { useContext, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'

import { Entity, Enum, Model } from '@/interfaces/modeling'
import { ModelingContext } from '@/lib/context'

import ModelDesigner from './subs/model-designer'
import ModelEnumDesigner from './subs/model-enum-designer'

interface Props {
  showType: string
  currEntityId: number | null
}

export default function ModelContainer({ showType, currEntityId }: Props) {
  const [action, setAction] = useImmer('浏览')
  const [content, setContent] = useImmer<React.ReactNode>('')
  const blocks = useContext(ModelingContext)

  const entity = useMemo(
    () => blocks.find((b) => b.id === currEntityId) as Entity,
    [blocks, currEntityId]
  )

  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    switch (showType) {
      case 'data':
        setAction('浏览')
        setContent(<h1>{entity?.name}</h1>)
        break
      case 'model':
        setAction('编辑')
        setContent(<ModelDesigner entity={entity as Model} />)
        break
      case 'enum':
        setAction('编辑')
        setContent(<ModelEnumDesigner entity={entity as Enum} />)
        break
      default:
        setAction('浏览')
        setContent(JSON.stringify(entity))
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showType, currEntityId])

  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6">
        <span className="flex-grow text-lg font-medium">
          {action} / {entity?.name}
        </span>
        <AppleOutlined className="text-base mr-3" onClick={handleIconClick} />
        <AppleOutlined className="text-base mr-3" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
      </div>

      <div className="flex justify-start items-center my-6">
        <Breadcrumb className="text-base flex-grow" separator=" ">
          <Breadcrumb.Item>{entity?.name}</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[#118AD1]">{showType}</Breadcrumb.Item>
        </Breadcrumb>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
      </div>

      {content}
    </div>
  )
}
