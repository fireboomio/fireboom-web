import { AppleOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'

import DatasourceEditorMainCheck from './subs/datasource-db-main-check'
import DatasourceEditorMainEdit from './subs/datasource-db-main-edit'
import DatasourceDBMainSetting from './subs/datasource-db-main-setting'
import DatasourceDeselfMainEdit from './subs/datasource-deself-main-edit'
import DatasourceGraphalMainCheck from './subs/datasource-graphal-main-check'
import DatasourceGraphalMainEdit from './subs/datasource-graphal-main-edit'
import DatasourceRestMainCheck from './subs/datasource-rest-main-check'
import DatasourceRestMainEdit from './subs/datasource-rest-main-edit'

interface Props {
  content: DatasourceResp
  showType: string
}

export default function DatasourceEditor({ content, showType }: Props) {
  const [viewer, setViewer] = useImmer<React.ReactNode>('')
  const [title, setTitile] = useImmer('')
  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    if (content) {
      switch (showType) {
        case 'data':
          if (content.source_type == 1) {
            setTitile('DB')
            setViewer(<DatasourceEditorMainCheck content={content} />)
          } else if (content.source_type == 2) {
            setTitile('REST')
            setViewer(<DatasourceRestMainCheck content={content} />)
          } else if (content.source_type == 3) {
            setTitile('Graphal')
            setViewer(<DatasourceGraphalMainCheck content={content} />)
          } else if (content.source_type == 4) {
            setTitile('defineByself')
            setViewer(<DatasourceDeselfMainEdit content={content} />)
          }
          break
        case 'DB':
          setTitile('DB')
          setViewer(<DatasourceEditorMainEdit content={content} />)
          break
        case 'REST':
          setTitile('REST')
          setViewer(<DatasourceRestMainEdit content={content} />)
          break
        case 'Graphal':
          setTitile('Graphal')
          setViewer(<DatasourceGraphalMainEdit content={content} />)
          break
        case 'defineByself':
          setTitile('自定义')
          setViewer(<DatasourceDeselfMainEdit content={content} />)
          break
        case 'Setting':
          setTitile('设置')
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
    <div className="pl-6 pr-10 mt-24px">
      <div className="flex justify-start items-center  mb-24px">
        <span className="text-base flex-grow font-bold text-[18px]">
          外部数据源 / {content && title}
        </span>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-3" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-3" onClick={handleIconClick} />
      </div>
      {viewer}
    </div>
  )
}
