import { EditFilled } from '@ant-design/icons'
import { Breadcrumb, Input, message, Switch, Tooltip } from 'antd'
import copy from 'copy-to-clipboard'
import { Kind, OperationTypeNode } from 'graphql'
import { useContext, useEffect, useMemo, useState } from 'react'

import { WorkbenchContext } from '@/lib/context/workbenchContext'
import { useEventBus } from '@/lib/event/events'
import requests from '@/lib/fetchers'

import { useAPIManager } from '../../hooks'
import { CopyOutlined, FlashFilled, LinkOutlined, SaveFilled } from '../icons'
import styles from './index.module.less'

const APIHeader = () => {
  const { apiDesc, schemaAST, updateAPI, updateContent, saved, query } = useAPIManager()
  const workbenchCtx = useContext(WorkbenchContext)
  useEventBus('titleChange', e => console.log(e.data.title))
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
    if (e.code === 'Enter') {
      try {
        await updateAPI({
          path: `/${[...apiPathList.slice(0, apiPathList.length - 1), name].join('/')}`
        })
        setIsEditingName(false)
      } catch (error) {
        //
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
    if (apiDesc?.setting.liveQueryEnable) {
      return true
    }
    if (schemaAST && schemaAST.definitions[0].kind === Kind.OPERATION_DEFINITION) {
      if (schemaAST.definitions[0].operation === OperationTypeNode.SUBSCRIPTION) {
        return true
      }
    }
  }, [apiDesc?.setting.liveQueryEnable, schemaAST])

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
    if (apiDesc?.restUrl) {
      copy(apiDesc!.restUrl)
      message.success('URL 地址已复制')
    }
  }

  const save = async () => {
    try {
      if (await updateContent(query)) {
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
        储存
      </button>
      <Switch
        className={`${styles.enableBtn} ${apiDesc?.enable ? styles.enableBtnEnabled : ''}`}
        checkedChildren="开启"
        unCheckedChildren="关闭"
        checked={apiDesc?.enable}
        onChange={toggleEnable}
      />
    </div>
  )
}

export default APIHeader
