import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'

import IconFont from '../iconfont'
import DatasourceDBMain from './subs/datasource-main-db'
import DatasourceDeselfMainEdit from './subs/datasource-main-deself'
import DatasourceGraphalMain from './subs/datasource-main-graphal'
import DatasourceRestMain from './subs/datasource-main-rest'

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
    console.log(content, 'content')
    if (content)
      if (showType == 'Setting') {
        setTitile('设置')
        setViewer(<DatasourceDBMain content={content} type={showType} />)
      } else {
        if (content.source_type == 1) {
          setTitile('DB')
          setViewer(<DatasourceDBMain content={content} type={showType} />)
        } else if (content.source_type == 2) {
          setTitile('REST')
          setViewer(<DatasourceRestMain content={content} type={showType} />)
        } else if (content.source_type == 3) {
          setTitile('Graphal')
          setViewer(<DatasourceGraphalMain content={content} type={showType} />)
        } else if (content.source_type == 4) {
          setTitile('自定义')
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
        <IconFont type="icon-lianxi" className="text-[22px]" onClick={handleIconClick} />
        <IconFont type="icon-wenjian1" className="text-[22px] ml-4" onClick={handleIconClick} />
        <IconFont type="icon-bangzhu" className="text-[22px] ml-4" onClick={handleIconClick} />
      </div>
      {viewer}
    </div>
  )
}
