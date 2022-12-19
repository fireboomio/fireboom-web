import { Button, Image, Input, message, Switch } from 'antd'
import type { NotificationPlacement } from 'antd/lib/notification'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import IconFont from '@/components/Iconfont'
import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { updateHookSwitch } from '@/lib/service/hook'

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
  const { mutate } = useSWRConfig()
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const [isEditing, setIsEditing] = React.useState(false)

  const navigate = useNavigate()
  if (!content) {
    return (
      <div className="h-full p-3 pb-0">
        <div className="bg-white h-full pt-5.5 pl-5.5 overflow-auto">
          {/* <div className="flex mb-24px justify-start  items-center">
            <span className="flex-grow font-bold text-base text-[18px]">外部数据源 / 选择数据源</span>
          </div> */}
          <Designer />
        </div>
      </div>
    )
  }

  const toggleOpen = async () => {
    if (!content) return

    content.switch ^= 1
    if (content) {
      void (await requests.put('/dataSource', content))
    }
    // 目前逻辑为sourceType=4视为自定义钩子数据源，需要在开关时同步修改钩子开关
    if (content.sourceType === 4) {
      console.log(content)
      updateHookSwitch(`customize/${content.name}`, !!content.switch)
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
    void requests.post('/checkDBConn', { ...content }).then((x: any) => {
      if (x?.status) {
        message.success('连接成功')
      } else {
        message.error(x?.msg || '连接失败')
      }
    })
  }

  const handleEdit = async (name: string) => {
    if (!name.match(/^\w[a-zA-Z0-9_]*$/)) {
      message.error('请输入字母、数字或下划线')
      return
    }
    const saveData = { ...content, name }
    await requests.put('/dataSource', saveData)
    onRefreshMenu('dataSource')
    setIsEditing(false)
    await mutate(['/dataSource', String(content.id)])
  }

  return (
    <div className="flex flex-col h-full common-form items-stretch justify-items-stretch">
      {' '}
      <div
        className="bg-white flex flex-0 h-54px pl-11 items-center"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
        {showType === 'setting' ? (
          <>
            <div className="cursor-pointer flex bg-[#F9F9F9FF] mr-6 py-0.5 px-2 items-center justify-evenly">
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
              className="h-14px mr-1.5 w-14px"
              src={`/assets/workbench/panel-item-${icon.toLowerCase()}.png`}
              alt="数据源"
            />
            {/* <img src="/assets/ant-tree/file.png" className="h-14px mr-1.5 w-14px" alt="文件" /> */}

            {isEditing ? (
              <Input
                onBlur={e => handleEdit(e.target.value)}
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onPressEnter={e => handleEdit(e.target.value)}
                style={{ width: '200px' }}
                defaultValue={content?.name}
                autoFocus
                placeholder="请输入数据源名"
              />
            ) : (
              <>
                {content?.name}
                <span onClick={() => setIsEditing(true)} className="ml-3 cursor-pointer">
                  <IconFont type="icon-bianji" />
                </span>
              </>
            )}
          </>
        )}

        <div className="flex-1"></div>
        {showType === 'detail' ? (
          <>
            {content.sourceType !== 4 ? (
              <Switch
                checked={content?.switch === 1}
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onChange={toggleOpen}
                className="mr-4"
              />
            ) : null}
            {content.sourceType === 1 ? (
              <Button
                className={'btn-test ml-4 '}
                onClick={() => navigate(`/workbench/modeling/${content?.id}`)}
              >
                设计
              </Button>
            ) : (
              <></>
            )}
            {content.sourceType !== 4 ? (
              <>
                <Button className={'btn-test ml-4 mr-4'} onClick={() => testLink('bottomLeft')}>
                  测试
                </Button>
                <Button className={'btn-save mr-11'} onClick={() => handleToggleDesigner('form')}>
                  编辑
                </Button>
              </>
            ) : (
              <></>
            )}
          </>
        ) : null}
      </div>
      <div
        className="bg-white  flex-1 mx-3 mt-3 min-h-0 px-8 pt-5 overflow-y-auto"
        style={{
          border: '1px solid rgba(95,98,105,0.1)',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0'
        }}
      >
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
