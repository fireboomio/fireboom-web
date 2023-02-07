import { Button, Image, Input, message, Switch } from 'antd'
import type { NotificationPlacement } from 'antd/lib/notification'
import React, { useContext } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import type { DatasourceResp, ShowType } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import { updateHookSwitch } from '@/lib/service/hook'

import Custom from './subs/Custom'
import DB from './subs/DB'
// import Designer from './subs/Designer'
import Graphql from './subs/Graphql'
import Rest from './subs/Rest'

interface Props {
  content?: DatasourceResp
  showType: ShowType
}

export default function DatasourceContainer({ content, showType }: Props) {
  const intl = useIntl()
  const { mutate } = useSWRConfig()
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const [isEditing, setIsEditing] = React.useState(false)

  const navigate = useNavigate()
  const { loading, fun: toggleOpen } = useLock(async () => {
    if (!content) return
    content.switch ^= 1
    if (content) {
      void (await requests.put('/dataSource', content))
    }
    // 目前逻辑为sourceType=4视为自定义钩子数据源，需要在开关时同步修改钩子开关
    if (content.sourceType === 4) {
      updateHookSwitch(`customize/${content.name}`, !!content.switch)
    }
    onRefreshMenu('dataSource')
  }, [content])

  if (!content) {
    return null
  }

  let icon = '/assets/icon/db-other.svg'
  switch (content?.sourceType) {
    case 1:
      icon =
        {
          mysql: '/assets/icon/mysql.svg',
          pgsql: '/assets/icon/pg.svg',
          graphql: '/assets/icon/graphql.svg',
          mongodb: '/assets/icon/mongodb.svg',
          rest: '/assets/icon/rest.svg',
          sqlite: '/assets/icon/sqlite.svg'
        }[String(content.config.dbType).toLowerCase()] || icon
      break
    case 2:
      icon = '/assets/icon/rest.svg'
      break
    case 3:
      icon = '/assets/icon/graphql.svg'
      break
  }

  const testLink = (placement: NotificationPlacement) => {
    void requests.post('/checkDBConn', { ...content }).then((x: any) => {
      if (x?.status) {
        message.success(intl.formatMessage({ defaultMessage: '连接成功' }))
      } else {
        message.error(x?.msg || intl.formatMessage({ defaultMessage: '连接失败' }))
      }
    })
  }

  const handleEdit = async (name: string) => {
    if (!name.match(/^\w[a-zA-Z0-9_]*$/)) {
      message.error(intl.formatMessage({ defaultMessage: '请输入字母、数字或下划线' }))
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
            <div
              className="cursor-pointer flex bg-[#F9F9F9FF] mr-6 py-0.5 px-2 items-center justify-evenly"
              onClick={() => handleToggleDesigner('detail')}
            >
              <Image width={12} height={7} src="/assets/back.svg" alt="返回" preview={false} />
              <span className="ml-1">
                <FormattedMessage defaultMessage="返回" />
              </span>
            </div>
            <div className="font-medium">
              <FormattedMessage defaultMessage="高级设置" />
            </div>
          </>
        ) : (
          <>
            <img className="h-14px mr-1.5 w-14px" src={icon} alt="数据源" />
            {/* <img src="/assets/ant-tree/file.png" className="h-14px mr-1.5 w-14px" alt="文件" /> */}

            {showType === 'detail' ? (
              isEditing ? (
                <Input
                  onBlur={e => handleEdit(e.target.value)}
                  // @ts-ignore
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  onPressEnter={e => handleEdit(e.target.value)}
                  style={{ width: '200px' }}
                  defaultValue={content?.name}
                  autoFocus
                  placeholder={intl.formatMessage({ defaultMessage: '请输入数据源名' })}
                />
              ) : (
                <>
                  {content?.name}
                  <span onClick={() => setIsEditing(true)} className="cursor-pointer ml-3">
                    <img
                      alt="bianji"
                      src="assets/iconfont/bianji.svg"
                      style={{ height: '1em', width: '1em' }}
                    />
                  </span>
                </>
              )
            ) : (
              content?.name || intl.formatMessage({ defaultMessage: '新建数据源' })
            )}
          </>
        )}

        <div className="flex-1"></div>
        {showType === 'detail' ? (
          <>
            {content.sourceType !== 4 ? (
              <Switch
                loading={loading}
                checked={content?.switch === 1}
                checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                onChange={toggleOpen}
                className="mr-4"
              />
            ) : null}
            {content.sourceType === 1 ? (
              <Button
                className={'btn-test !ml-4'}
                onClick={() => navigate(`/workbench/modeling/${content?.id}`)}
              >
                <FormattedMessage defaultMessage="设计" />
              </Button>
            ) : (
              <></>
            )}
            {content.sourceType !== 4 ? (
              <>
                <Button
                  className={'btn-save !ml-4 mr-11'}
                  onClick={() => handleToggleDesigner('form')}
                >
                  <FormattedMessage defaultMessage="编辑" />
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
