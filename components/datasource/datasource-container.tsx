import { AppleOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'

import DatasourceDBMain from './subs/datasource-db-main'
import DatasourceDeselfMainEdit from './subs/datasource-deself-main-edit'
import DatasourceGraphalMain from './subs/datasource-graphal-main'
import DatasourceRestMain from './subs/datasource-rest-main'

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
    if (content)
      if (showType == 'Setting') {
        setTitile('设置')
        setViewer(<DatasourceDBMain content={content} type={showType} />)
      } else {
        if (content.source_type == 1) {
          setTitile('DB')
          console.log('123')
          setViewer(<DatasourceDBMain content={content} type={showType} />)
        } else if (content.source_type == 2) {
          setTitile('REST')
          setViewer(<DatasourceRestMain content={content} type={showType} />)
        } else if (content.source_type == 3) {
          setTitile('Graphal')
          setViewer(<DatasourceGraphalMain content={content} type={showType} />)
        } else if (content.source_type == 4) {
          setTitile('defineByself')
          setViewer(<DatasourceDeselfMainEdit content={content} />)
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
