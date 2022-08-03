import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { DatasourceResp } from '@/interfaces/datasource'

import IconFont from '../iconfont'
import DatasourceDBMain from './subs/DB'
import DatasourceDeselfMainEdit from './subs/DefineSelf'
import DatasourceGraphalMain from './subs/Graphal'
import DatasourceRestMain from './subs/Rest'

interface Props {
  content: DatasourceResp
  showType: string
}

export default function DatasourceContainer({ content, showType }: Props) {
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
        if (content.sourceType == 1) {
          setTitile('DB')
          setViewer(<DatasourceDBMain content={content} type={showType} />)
        } else if (content.sourceType == 2) {
          setTitile('REST')
          setViewer(<DatasourceRestMain content={content} type={showType} />)
        } else if (content.sourceType == 3) {
          setTitile('Graphal')
          setViewer(<DatasourceGraphalMain content={content} type={showType} />)
        } else if (content.sourceType == 4) {
          setTitile('自定义')
          setViewer(<DatasourceDeselfMainEdit content={content} />)
        }
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showType, content])

  return (
    <div className="pl-6 mt-6 mr-6">
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
