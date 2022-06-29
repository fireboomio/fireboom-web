import { AppleOutlined } from '@ant-design/icons'
import type { Model } from '@mrleebo/prisma-ast'
import { Breadcrumb } from 'antd'
import React, { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import { ModelingContext } from '@/lib/context'
import { Entity } from 'interfaces/modeling'

import ModelDesigner from './subs/model-designer'
import ModelEnumDesigner from './subs/model-enum-designer'

interface Props {
  showType: string
  currEntityId: number | null | undefined
}

export default function ModelContainer({ showType, currEntityId }: Props) {
  const [action, setAction] = useImmer('浏览')
  const [viewer, setViewer] = useImmer<React.ReactNode>('')
  const blocks = useContext(ModelingContext)

  const content = blocks.find((b) => b.id === currEntityId) as Entity

  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    switch (showType) {
      case 'data':
        setAction('浏览')
        setViewer(<h1>{content?.name}</h1>)
        break
      case 'model':
        setAction('编辑')
        setViewer(<ModelDesigner properties={(content as Model).properties} />)
        break
      case 'enum':
        setAction('编辑')
        setViewer(<ModelEnumDesigner content={content} />)
        break
      default:
        setAction('浏览')
        setViewer(JSON.stringify(content))
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showType, currEntityId])

  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6">
        <span className="flex-grow text-lg font-medium">
          {action} / {content?.name}
        </span>
        <AppleOutlined className="text-base mr-3" onClick={handleIconClick} />
        <AppleOutlined className="text-base mr-3" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
      </div>

      <div className="flex justify-start items-center my-6">
        <Breadcrumb className="text-base flex-grow" separator=" ">
          <Breadcrumb.Item>{content?.name}</Breadcrumb.Item>
          <Breadcrumb.Item>{showType}</Breadcrumb.Item>
        </Breadcrumb>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
      </div>

      {viewer}
    </div>
  )
}
