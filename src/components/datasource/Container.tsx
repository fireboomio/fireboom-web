import { Button, Image, notification, Switch } from 'antd'
import type { NotificationPlacement } from 'antd/lib/notification'
import React, { useContext, useMemo } from 'react'

import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import IconFont from '../iconfont'
import Custom from './subs/Custom'
import DB from './subs/DB'
import Designer from './subs/Designer'
import Graphql from './subs/Graphql'
import Rest from './subs/Rest'

interface Props {
  content?: DatasourceResp
  showType: ShowType
}

export default function DatasourceContainer({ content, showType }: Props) {
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const { onRefreshMenu } = useContext(WorkbenchContext)

  if (!content) {
    return (
      <div className="pl-6 mt-6 mr-6">
        <div className="flex justify-start items-center  mb-24px">
          <span className="text-base flex-grow font-bold text-[18px]">外部数据源 / 选择数据源</span>
        </div>
        <Designer />
      </div>
    )
  }

  const toggleOpen = async () => {
    if (!content) return

    content.switch ^= 1
    if (content) {
      void (await requests.put('/dataSource', content))
    }
    onRefreshMenu('dataSource')
  }
  let icon = 'other'
  switch (content?.sourceType) {
    case 1:
      icon = String(content.config.dbType) || icon
      break
    case 2:
      icon = 'rest'
      break
    case 3:
      icon = 'graphql'
      break
  }

  const testLink = (placement: NotificationPlacement) => {
    void requests
      .post('/checkDBConn', {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: { sourceType: content.sourceType, config: content.config }
      })
      .then(x => console.log(x))

    notification.open({
      message: <IconFont type="icon-xingzhuangjiehe" />,
      description: (
        <div>
          <h1>链接失败</h1>
          描述性语句描述性语句描述性语句
        </div>
      ),
      placement
    })
  }

  return (
    <div className="common-form h-full flex items-stretch justify-items-stretch flex-col">
      {' '}
      <div className="h-54px flex-0 bg-white flex items-center pl-11">
        {showType === 'setting' ? (
          <>
            <div className="mr-6 py-0.5 px-2 flex items-center justify-evenly cursor-pointer bg-[#F9F9F9FF]">
              <Image width={12} height={7} src="/assets/back.svg" alt="返回" preview={false} />
              <span className="ml-1" onClick={() => handleToggleDesigner('detail')}>
                返回
              </span>
            </div>
            <div className="font-medium">高级设置</div>
          </>
        ) : (
          <>
            <img
              className="w-14px h-14px mr-1.5"
              src={`/assets/workbench/panel-item-${icon}.png`}
              alt="数据源"
            />
            {/* <img src="/assets/ant-tree/file.png" className="w-14px h-14px mr-1.5" alt="文件" /> */}
            {content?.name}
          </>
        )}

        <div className="flex-1"></div>
        {showType === 'detail' ? (
          <>
            <Switch
              checked={content?.switch === 1}
              checkedChildren="开启"
              unCheckedChildren="关闭"
              onChange={toggleOpen}
            />
            <Button className={'btn-test ml-4 mr-4'}>设计</Button>
            <Button className={'btn-test mr-4'} onClick={() => testLink('bottomLeft')}>
              测试
            </Button>
            <Button className={'btn-save mr-11'} onClick={() => handleToggleDesigner('form')}>
              编辑
            </Button>
          </>
        ) : null}
      </div>
      <div className="rounded-4px flex-1 min-h-0 overflow-y-auto bg-white px-8 mx-3 mt-3">
        {content.sourceType === 1 ? (
          <DB content={content} type={showType} />
        ) : content.sourceType === 2 ? (
          <Rest content={content} type={showType} />
        ) : content.sourceType === 3 ? (
          <Graphql content={content} type={showType} />
        ) : content.sourceType === 4 ? (
          <Custom content={content} />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
