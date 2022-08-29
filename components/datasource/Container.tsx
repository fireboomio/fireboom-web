import { useMemo } from 'react'

import type { DatasourceResp, ShowType } from '@/interfaces/datasource'

import IconFont from '../iconfont'
import DatasourceDeselfMainEdit from './subs/Custom'
import DatasourceDBMain from './subs/DB'
import DatasourceGraphalMain from './subs/Graphql'
import DatasourceRestMain from './subs/Rest'

interface Props {
  content: DatasourceResp
  showType: ShowType
}

export default function DatasourceContainer({ content, showType }: Props) {
  const handleIconClick = () => {
    console.log('aaa')
  }

  const title = useMemo(() => {
    let rv = ''
    switch (content.sourceType) {
      case 1:
        rv = showType == 'setting' ? '设置' : 'DB'
        break
      case 2:
        rv = 'REST'
        break
      case 3:
        rv = 'GraphQL'
        break
      case 4:
        rv = '自定义'
        break
      default:
        break
    }
    return rv
  }, [content.sourceType, showType])

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

      {content.sourceType === 1 ? (
        <DatasourceDBMain content={content} type={showType} />
      ) : content.sourceType === 2 ? (
        <DatasourceRestMain content={content} type={showType} />
      ) : content.sourceType === 3 ? (
        <DatasourceGraphalMain content={content} type={showType} />
      ) : content.sourceType === 4 ? (
        showType === 'detail' ? (
          <DatasourceDeselfMainEdit content={content} />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  )
}
