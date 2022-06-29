import { AppleOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces'

import DatasourceEditorMainCheck from './subs/datasource-editor-main-check'
import DatasourceEditorMainEdit from './subs/datasource-editor-main-edit'
interface Props {
  content: DatasourceItem
  showType: string
}
export default function DatasourceEditor({ content, showType }: Props) {
  const [viewer, setViewer] = useImmer<React.ReactNode>('')

  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    if (content) {
      switch (showType) {
        case 'data':
          if (content.type == 'DB') setViewer(<DatasourceEditorMainCheck content={content} />)
          else if (content.type == 'REST') setViewer(<div>REST查看</div>)
          else if (content.type == 'Graphal') setViewer(<div>Graphal查看</div>)
          break
        case 'DB':
          setViewer(<DatasourceEditorMainEdit />)
          break
        case 'REST':
          setViewer(<div>REST编辑</div>)
          break
        case 'Graphal':
          setViewer(<div>Graphal编辑</div>)
          break
        default:
          setViewer(JSON.stringify(content))
          break
      }
    }
  }, [showType, content, setViewer])

  return (
    <div className="pl-4 pr-10 mt-6">
      <div className="flex justify-start items-center mb-6 ">
        <span className="text-base flex-grow font-bold">
          外部数据源 / {content && content.type}
        </span>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-3" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-3" onClick={handleIconClick} />
      </div>
      {viewer}
    </div>
  )
}
