import { AppleOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceItem } from '@/interfaces/datasource'

import DatasourceEditorMainCheck from './subs/datasource-db-main-check'
import DatasourceEditorMainEdit from './subs/datasource-db-main-edit'
import DatasourceDBMainSetting from './subs/datasource-db-main-setting'
import DatasourceDeselfMainEdit from './subs/datasource-deself-main-edit'
import DatasourceGraphalMainCheck from './subs/datasource-graphal-main-check'
import DatasourceGraphalMainEdit from './subs/datasource-graphal-main-edit'
import DatasourceRestMainCheck from './subs/datasource-rest-main-check'
import DatasourceRestMainEdit from './subs/datasource-rest-main-edit'

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
          else if (content.type == 'REST') setViewer(<DatasourceRestMainCheck content={content} />)
          else if (content.type == 'Graphal')
            setViewer(<DatasourceGraphalMainCheck content={content} />)
          else if (content.type == 'defineByself')
            setViewer(<DatasourceDeselfMainEdit content={content} />)
          break
        case 'DB':
          setViewer(<DatasourceEditorMainEdit content={content} />)
          break
        case 'REST':
          setViewer(<DatasourceRestMainEdit content={content} />)
          break
        case 'Graphal':
          setViewer(<DatasourceGraphalMainEdit />)
          break
        case 'defineByself':
          setViewer(<DatasourceDeselfMainEdit content={content} />)
          break
        case 'Setting':
          setViewer(<DatasourceDBMainSetting />)
          break
        default:
          setViewer(JSON.stringify(content))
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showType, content])

  return (
    <div className="pl-6 pr-10 mt-6">
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
