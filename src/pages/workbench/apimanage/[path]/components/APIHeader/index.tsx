import { EditFilled } from '@ant-design/icons'
import { Breadcrumb, Input, message, Switch, Tooltip } from 'antd'
import copy from 'copy-to-clipboard'
import type { OperationDefinitionNode } from 'graphql'
import { Kind, OperationTypeNode } from 'graphql'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { CopyOutlined, FlashFilled, LinkOutlined, SaveFilled } from '@/components/icons'
import { mutateApi, useApiGlobalSetting } from '@/hooks/store/api'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import { registerHotkeyHandler } from '@/services/hotkey'

import { useAPIManager } from '../../store'
import styles from './index.module.less'

const APIHeader = ({ onGetQuery }: { onGetQuery: () => string }) => {
  const intl = useIntl()
  const { apiDesc, schemaAST, changeEnable, updateAPIName, updateContent, saved, query, apiID } =
    useAPIManager(state => ({
      apiDesc: state.apiDesc,
      schemaAST: state.schemaAST,
      changeEnable: state.changeEnable,
      updateAPIName: state.updateAPIName,
      updateContent: state.updateContent,
      saved: state.computed.saved,
      apiID: state.apiID,
      query: state.query
    }))
  // const workbenchCtx = useContext(WorkbenchContext)
  const { globalSetting } = useContext(ConfigContext)

  const [isEditingName, setIsEditingName] = useState(false)
  const apiPathList = apiDesc?.path?.split('/').slice(1) ?? []
  const [name, setName] = useState('')
  const { data: globalOperationSetting } = useApiGlobalSetting()

  const startEdit = () => {
    setIsEditingName(true)
  }

  useEffect(() => {
    setName(apiPathList.length ? apiPathList[apiPathList.length - 1] : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiDesc?.path])

  const onInputKey = async (e: React.KeyboardEvent<HTMLInputElement> | { key: string }) => {
    if (e.key === 'Enter') {
      const targetPath = `/${[...apiPathList.slice(0, apiPathList.length - 1), name].join('/')}`
      if (targetPath !== apiDesc?.path) {
        try {
          if (apiDesc?.id) {
            await updateAPIName(targetPath)
          }
          setIsEditingName(false)
        } catch (error) {
          //
        }
      } else {
        setIsEditingName(false)
      }
    }
  }

  const { loading, fun: toggleEnable } = useLock(async (checked: boolean) => {
    try {
      await changeEnable(checked)
      message.success(
        checked
          ? intl.formatMessage({ defaultMessage: '已开启' })
          : intl.formatMessage({ defaultMessage: '已关闭' })
      )
    } catch (error) {
      //
    }
  }, [])

  const isLive = useMemo(() => {
    return apiDesc?.enabled
      ? apiDesc.liveQueryConfig?.enabled
      : globalOperationSetting?.liveQueryEnabled
  }, [
    apiDesc?.enabled,
    apiDesc?.liveQueryConfig?.enabled,
    globalOperationSetting?.liveQueryEnabled
  ])

  const method = useMemo(() => {
    if (schemaAST && schemaAST.definitions[0].kind === Kind.OPERATION_DEFINITION) {
      switch (schemaAST.definitions[0].operation) {
        case OperationTypeNode.QUERY:
          return 'GET'
        case OperationTypeNode.MUTATION:
          return 'POST'
        case OperationTypeNode.SUBSCRIPTION:
          return 'GET'
      }
    }
  }, [schemaAST])

  const copyAPI = useCallback(async () => {
    if (apiDesc?.path) {
      const destPath = `${apiDesc!.path}Copy${Math.random().toString(36).substring(2, 5)}`
      try {
        await requests.post('/operation/copy', {
          path: destPath,
          id: apiDesc!.id
        })
        message.success(
          intl.formatMessage({ defaultMessage: '已复制接口 {path}' }, { path: destPath })
        )
        void mutateApi()
      } catch (error) {
        //
      }
    }
  }, [apiDesc, intl])

  const copyLink = useCallback(async () => {
    let link = `${globalSetting.nodeOptions.publicNodeUrl.staticVariableContent ?? ''}/operations${
      apiDesc?.path
    }`
    if (!link) {
      message.error(intl.formatMessage({ defaultMessage: '接口异常' }))
      return
    }
    // @ts-ignore
    if (schemaAST?.definitions[0].directives.find(x => x?.name?.value === 'internalOperation')) {
      message.warning(intl.formatMessage({ defaultMessage: '内部 API 无法通过链接访问' }))
      return
    }
    let query: string[] = []
    let argValueMap: Record<string, any> = {}
    try {
      argValueMap = JSON.parse(localStorage.getItem(`_api_args_${apiID}`) || '{}')
    } catch (e) {
      // ignore
    }
    const def = schemaAST?.definitions[0] as OperationDefinitionNode | undefined
    const argNames = (def?.variableDefinitions || []).map(item => item.variable.name.value)
    const operationType = def?.operation ?? 'query'
    if (operationType === 'query' || operationType === 'subscription') {
      argNames.forEach((name, index) => {
        let value = argValueMap[name] ?? ''
        if (typeof value !== 'string') {
          value = JSON.stringify(value)
        }
        query.push(`${name}=${value}`)
      })

      // 对于订阅接口，增加wg_sse
      if (operationType === 'subscription') {
        query.push('wg_sse=true')
      }
      // 对于实时接口需要添加wg_live
      if (apiDesc?.liveQuery && operationType === 'query') {
        query.push('wg_live=true')
      }
      if (query.length) {
        link += '?' + query.join('&')
      }
      copy(link)
    } else if (operationType === 'mutation') {
      const data: Record<string, any> = {}
      argNames.forEach((name, index) => {
        data[name] = argValueMap[name] || null
      })
      const curl = `curl '${link}' \\
  -X POST  \\
  -H 'Content-Type: application/json' \\
  --data-raw '${JSON.stringify(data)}' \\
  --compressed`
      copy(curl)
    }

    message.success(intl.formatMessage({ defaultMessage: 'URL 地址已复制' }))
  }, [
    apiDesc?.liveQuery,
    apiDesc?.path,
    apiID,
    globalSetting.nodeOptions,
    intl,
    schemaAST?.definitions
  ])

  const save = async () => {
    try {
      const q = onGetQuery() ?? query
      if (await updateContent(q)) {
        message.success(intl.formatMessage({ defaultMessage: '已保存' }))
      }
    } catch (error) {
      //
    }
  }

  // 快捷键
  useEffect(() => {
    const unbind1 = registerHotkeyHandler('alt+shift+d,^+shift+d', e => {
      e.preventDefault()
      copyAPI()
    })
    const unbind2 = registerHotkeyHandler('alt+shift+c,^+shift+c', e => {
      e.preventDefault()
      copyLink()
    })
    return () => {
      unbind1()
      unbind2()
    }
  }, [copyAPI, copyLink])

  return (
    <div
      className="bg-white flex flex-shrink-0 h-10 px-3 items-center"
      style={{
        borderBottom: '1px solid rgba(95,98,105,0.1)'
      }}
    >
      <Breadcrumb separator=">">
        {apiPathList.length ? (
          <>
            {apiPathList.slice(0, apiPathList.length - 1).map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
            <Breadcrumb.Item>
              {isEditingName ? (
                <Input
                  className={styles.nameInput}
                  value={name}
                  autoFocus
                  onChange={e => setName(e.target.value)}
                  onKeyDown={onInputKey}
                  onBlur={() => onInputKey({ key: 'Enter' })}
                />
              ) : (
                apiPathList[apiPathList.length - 1]
              )}
            </Breadcrumb.Item>
          </>
        ) : null}
      </Breadcrumb>
      {!isEditingName ? (
        <Tooltip title={intl.formatMessage({ defaultMessage: '编辑' })}>
          <EditFilled
            className="cursor-pointer text-xs ml-1 !text-gray-500 !hover:text-default"
            onClick={startEdit}
          />
        </Tooltip>
      ) : (
        <EditFilled className="cursor-pointer text-xs ml-1 !text-gray-500 !hover:text-default" />
      )}
      <div className="flex text-[rgba(175,176,180,0.6)] items-center">
        <span className="text-xs ml-1">
          {' '}
          -{' '}
          {saved
            ? intl.formatMessage({ defaultMessage: '已保存' })
            : intl.formatMessage({ defaultMessage: '未保存' })}
        </span>
        <div className="ml-11" />
        <div className="text-sm relative">
          {method}
          {isLive && (
            <FlashFilled className="h-1.5 top-0.5 -right-1 text-[#3AE375] w-1.5 absolute" />
          )}
        </div>
        <Tooltip title={intl.formatMessage({ defaultMessage: '复制接口' })}>
          <CopyOutlined className="cursor-pointer ml-3 text-[#6F6F6F]" onClick={copyAPI} />
        </Tooltip>
        <Tooltip title={intl.formatMessage({ defaultMessage: '复制接口URL地址，上线API方可测试' })}>
          <LinkOutlined className="cursor-pointer ml-2 text-[#6F6F6F]" onClick={copyLink} />
        </Tooltip>
      </div>
      <button className={styles.save} onClick={save}>
        <SaveFilled className={styles.saveIcon} />
        <FormattedMessage defaultMessage="保存" />
      </button>
      <Switch
        loading={loading}
        disabled={(apiDesc?.illegal || !schemaAST) && !apiDesc?.enabled}
        className={`${styles.enableBtn} ${apiDesc?.enabled ? styles.enableBtnEnabled : ''}`}
        checked={apiDesc?.enabled}
        onChange={toggleEnable}
      />
    </div>
  )
}

export default APIHeader
