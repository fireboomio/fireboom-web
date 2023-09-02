import { Button, Image, Input, message, Switch, Tooltip } from 'antd'
import React, { useContext, useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'
import useSWRImmutable from 'swr/immutable'

import { mutateDataSource } from '@/hooks/store/dataSource'
import type { ShowType } from '@/interfaces/datasource'
import { DataSourceKind } from '@/interfaces/datasource'
import { DatasourceToggleContext } from '@/lib/context/datasource-context'
import { GlobalContext } from '@/lib/context/globalContext'
import requests from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { getDataSourceIcon, isDatabaseKind } from '@/utils/datasource'

import backImg from '../../components/Workbench/assets/panel-arrow.png'
import Custom from './subs/Custom'
import DB from './subs/DB'
// import Designer from './subs/Designer'
import Graphql from './subs/Graphql'
import type { PrismaDSAction } from './subs/Prisma'
import PrismaDS from './subs/Prisma'
import Rest from './subs/Rest'

interface Props {
  content?: ApiDocuments.Datasource
  showType: ShowType
}

export default function DatasourceContainer({ content, showType }: Props) {
  const { handleSave } = useContext(DatasourceToggleContext)
  const intl = useIntl()
  const dict = useDict()
  const { mutate } = useSWRConfig()
  const { vscode } = useContext(GlobalContext)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const enabledServer = useSWRImmutable<ApiDocuments.Sdk>('/sdk/enabledServer', requests)
  // const { onRefreshMenu } = useContext(WorkbenchContext)
  const [isEditing, setIsEditing] = React.useState(false)

  // prisma
  const prismaDSRef = useRef<PrismaDSAction>(null)

  const navigate = useNavigate()
  const { loading, fun: toggleOpen } = useLock(async () => {
    if (!content) return
    await requests.put('/datasource', { name: content.name, enabled: !content.enabled })
    handleSave({ enabled: !content.enabled })
    // 自定义数据源，需要在开关时同步修改钩子开关
    // if (content.kind === DataSourceKind.Graphql && content.customGraphql) {
    //   updateHookEnabled(`customize/${content.name}`, !!content.enabled)
    // }
  }, [content])

  if (!content) {
    return null
  }

  const icon = getDataSourceIcon(content)

  const testLink = () => {
    void requests.post('/datasource/checkConnection', content).then(() => {
      message.success(intl.formatMessage({ defaultMessage: '连接成功' }))
    })
  }

  const handleEdit = async (name: string) => {
    if (!name.match(/^\w[a-zA-Z0-9_]*$/)) {
      message.error(intl.formatMessage({ defaultMessage: '请输入字母、数字或下划线' }))
      return
    }
    await requests.post('/datasource/rename', {
      src: content.name,
      dst: name,
      overload: false
    })
    void mutateDataSource()
    setIsEditing(false)
    await mutate(['/datasource', content.name])
    navigate(`/workbench/data-source/${name}`)
  }

  const isDatabase = isDatabaseKind(content)
  const isCustomDataSource =
    content.kind === DataSourceKind.Graphql &&
    content.customGraphql &&
    content.customGraphql.customized

  const designBtn = (
    <Button
      disabled={!content.enabled}
      className={'btn-test !ml-4'}
      onClick={() => {
        navigate(`/workbench/modeling/${content?.name}`)
      }}
    >
      <FormattedMessage defaultMessage="设计" />
    </Button>
  )

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
              <Image
                width={12}
                height={7}
                src={`${import.meta.env.BASE_URL}assets/back.svg`}
                alt="返回"
                preview={false}
              />
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
            {!content.name ? (
              <div
                className="cursor-pointer flex h-5 mr-1 w-5 items-center justify-center"
                onClick={() => history.back()}
              >
                <Image
                  style={{ transform: 'rotate(90deg)' }}
                  width={12}
                  height={12}
                  src={backImg}
                  alt="返回"
                  preview={false}
                />
              </div>
            ) : (
              ''
            )}
            <img className="h-14px mr-1.5 w-14px" src={icon} alt="数据源" />
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
                  <span className="text-ellipsis max-w-200px overflow-hidden" title={content?.name}>
                    {content?.name}
                  </span>
                  {!content.readonly && !content.customGraphql?.customized && (
                    <span onClick={() => setIsEditing(true)} className="cursor-pointer ml-3">
                      <img
                        alt="bianji"
                        src="assets/iconfont/bianji.svg"
                        style={{ height: '1em', width: '1em' }}
                      />
                    </span>
                  )}
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
            {!content.customGraphql?.customized && (
              <Switch
                disabled={content.readonly}
                loading={loading}
                checked={content?.enabled}
                checkedChildren={intl.formatMessage({ defaultMessage: '开启' })}
                unCheckedChildren={intl.formatMessage({ defaultMessage: '关闭' })}
                onChange={toggleOpen}
                className="!mr-4"
              />
            )}
            {isDatabase &&
              (content.enabled ? (
                designBtn
              ) : (
                <Tooltip title={<FormattedMessage defaultMessage="请先开启数据源" />}>
                  <span>{designBtn}</span>
                </Tooltip>
              ))}
            {!isCustomDataSource ? (
              content.kind === DataSourceKind.Prisma ? (
                <>
                  <Button
                    className={'btn-save !ml-4'}
                    onClick={testLink}
                    disabled={content.readonly}
                  >
                    <FormattedMessage defaultMessage="测试" />
                  </Button>
                  <Button
                    className="ml-4"
                    ghost
                    danger
                    disabled={!content.enabled}
                    onClick={prismaDSRef.current?.introspection}
                  >
                    <FormattedMessage defaultMessage="内省" />
                  </Button>
                  <Button className={'btn-save !ml-4 mr-11'} onClick={prismaDSRef.current?.save}>
                    <FormattedMessage defaultMessage="保存" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={'btn-save !ml-4'}
                    onClick={testLink}
                    disabled={content.readonly}
                  >
                    <FormattedMessage defaultMessage="测试" />
                  </Button>
                  <Button
                    className={'btn-save !ml-4 mr-11'}
                    onClick={() => handleToggleDesigner('form')}
                    disabled={content.readonly}
                  >
                    <FormattedMessage defaultMessage="编辑" />
                  </Button>
                </>
              )
            ) : content.customGraphql.customized ? (
              <>
                <Button className={'btn-save !ml-4'} onClick={testLink}>
                  <FormattedMessage defaultMessage="测试" />
                </Button>
                <Button
                  className={'btn-save !ml-4 mr-11'}
                  onClick={() =>
                    vscode.show(`${dict.customize}/${content.name}${enabledServer.data?.extension}`)
                  }
                  disabled={content.readonly}
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
        {content.kind === DataSourceKind.Prisma ? (
          <PrismaDS content={content} type={showType} actionRef={prismaDSRef} />
        ) : isDatabase ? (
          <DB content={content} type={showType} />
        ) : content.kind === DataSourceKind.Restful ? (
          <Rest content={content} type={showType} />
        ) : content.kind === DataSourceKind.Graphql ? (
          content.customGraphql.customized ? (
            <Custom content={content} />
          ) : (
            <Graphql content={content} type={showType} />
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
