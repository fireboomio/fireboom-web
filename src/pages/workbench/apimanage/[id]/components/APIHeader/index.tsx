import { EditFilled } from '@ant-design/icons'
import { Breadcrumb, Input, message, Switch, Tooltip } from 'antd'
import copy from 'copy-to-clipboard'
import type { OperationDefinitionNode } from 'graphql'
import { Kind, OperationTypeNode } from 'graphql'
import { useContext, useEffect, useMemo, useState } from 'react'

import { ConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import { useAPIManager } from '../../store'
import { CopyOutlined, FlashFilled, LinkOutlined, SaveFilled } from '../icons'
import styles from './index.module.less'

const APIHeader = ({ onGetQuery }: { onGetQuery: () => string }) => {
  const { apiDesc, schemaAST, updateAPI, updateAPIName, updateContent, saved, query, apiID } =
    useAPIManager(state => ({
      apiDesc: state.apiDesc,
      schemaAST: state.schemaAST,
      updateAPI: state.updateAPI,
      updateAPIName: state.updateAPIName,
      updateContent: state.updateContent,
      saved: state.computed.saved,
      apiID: state.apiID,
      query: state.query
    }))
  const workbenchCtx = useContext(WorkbenchContext)
  const { config } = useContext(ConfigContext)

  const [isEditingName, setIsEditingName] = useState(false)
  const apiPathList = apiDesc?.path?.split('/').slice(1) ?? []
  const [name, setName] = useState('')

  const startEdit = () => {
    setIsEditingName(true)
  }

  useEffect(() => {
    setName(apiPathList.length ? apiPathList[apiPathList.length - 1] : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiDesc?.path])

  const onInputKey = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const targetPath = `/${[...apiPathList.slice(0, apiPathList.length - 1), name].join('/')}`
      if (targetPath !== apiDesc?.path) {
        try {
          if (apiDesc?.id) {
            await updateAPIName(apiDesc?.id, targetPath)
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

  const toggleEnable = async (checked: boolean) => {
    try {
      await updateAPI({
        enable: checked
        // path: apiDesc!.path
      })
      message.success(checked ? '已开启' : '已关闭')
    } catch (error) {
      //
    }
  }

  const isLive = useMemo(() => {
    // if (apiDesc?.setting.liveQueryEnable) {
    //   return true
    // }
    // if (schemaAST && schemaAST.definitions[0].kind === Kind.OPERATION_DEFINITION) {
    //   if (schemaAST.definitions[0].operation === OperationTypeNode.SUBSCRIPTION) {
    //     return true
    //   }
    // }
    return apiDesc?.liveQuery
    // }, [apiDesc?.setting.liveQueryEnable, schemaAST])
  }, [apiDesc?.liveQuery])

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

  const copyAPI = async () => {
    if (apiDesc?.path) {
      try {
        await requests.post('/operateApi/copy', {
          path: `${apiDesc!.path}_Copy`,
          id: apiDesc!.id
        })
        message.success(`已复制接口 ${apiDesc!.path}_Copy}`)
        workbenchCtx.onRefreshMenu('api')
      } catch (error) {
        //
      }
    }
  }

  const copyLink = async () => {
    let link = apiDesc?.restUrl
    if (!link) {
      message.error('接口异常')
      return
    }
    if (!config.apiHost) {
      const url = new URL(apiDesc?.restUrl!)
      url.hostname = location.hostname
      url.port = config.apiPort
      link = url.toString()
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
    const isQuery = apiDesc?.operationType === 'queries'
    if (isQuery) {
      argNames.forEach((name, index) => {
        let value = argValueMap[name] ?? ''
        if (typeof value !== 'string') {
          value = JSON.stringify(value)
        }
        query.push(`${name}=${value}`)
      })

      if (apiDesc?.liveQuery) {
        query.push('wg_live=true')
      }
      if (query.length) {
        link += '?' + query.join('&')
      }
      copy(link)
    } else {
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

    message.success('URL 地址已复制')
  }

  const save = async () => {
    try {
      const q = onGetQuery() ?? query
      if (await updateContent(q)) {
        message.success('已保存')
      }
    } catch (error) {
      //
    }
  }

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
      <Tooltip title="编辑">
        <EditFilled
          className="cursor-pointer text-xs ml-1 !text-gray-500 !hover:text-default"
          onClick={startEdit}
        />
      </Tooltip>
      <div className="flex text-[rgba(175,176,180,0.6)] items-center">
        <span className="text-xs ml-1"> - {saved ? '已保存' : '未保存'}</span>
        <div className="ml-11" />
        <div className="text-sm relative">
          {method}
          {isLive && (
            <FlashFilled className="h-1.5 top-0.5 -right-1 text-[#3AE375] w-1.5 absolute" />
          )}
        </div>
        <Tooltip title="复制接口">
          <CopyOutlined className="cursor-pointer ml-3 text-[#6F6F6F]" onClick={copyAPI} />
        </Tooltip>
        <Tooltip title="复制接口 URL 地址">
          <LinkOutlined className="cursor-pointer ml-2 text-[#6F6F6F]" onClick={copyLink} />
        </Tooltip>
      </div>
      <button className={styles.save} onClick={save}>
        <SaveFilled className={styles.saveIcon} />
        保存
      </button>
      <Switch
        className={`${styles.enableBtn} ${apiDesc?.enable ? styles.enableBtnEnabled : ''}`}
        checkedChildren="上线"
        unCheckedChildren="下线"
        checked={apiDesc?.enable}
        onChange={toggleEnable}
      />
    </div>
  )
}

export default APIHeader
