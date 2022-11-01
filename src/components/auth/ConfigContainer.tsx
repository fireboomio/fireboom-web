import { Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context/auth-context'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import AuthCheck from './subs/Check'
import AuthEdit from './subs/Edit'

export default function AuthConfigContainer() {
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const [content, setContent] = useState<AuthProvResp>()
  const [editFlag, setEditFlag] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { config } = useContext(ConfigContext)
  useEffect(() => {
    // 如果id为new，则视为新增
    if (id === 'new') {
      setEditFlag(true)
      setContent({
        point: '',
        config: {},
        id: 0,
        name: '',
        authSupplier: 'openid',
        switchState: []
      })
      return
    }

    void requests.get<unknown, AuthProvResp[]>('/auth').then(res => {
      res.forEach(row => {
        if (row.id === Number(id)) {
          setEditFlag(false)
          setContent(row)
        }
      })
    })
  }, [id])

  const onEdit = (content: AuthProvResp) => {
    onRefreshMenu('auth')
    setContent(content)
    navigate(`/workbench/auth/${content.id}`)
  }

  const onTest = () => {
    // 生成回调地址，此处假设使用hash路由，如果更改路由方式需要调整
    const callbackURL = new URL(location.toString())
    callbackURL.hash = '#/workbench/userInfo'

    let target = new URL(content?.point + encodeURIComponent(callbackURL.toString()))
    if (!config.apiHost) {
      target.protocol = location.protocol
      target.hostname = location.hostname
      target.port = location.port
    }

    window.open(target.toString())
  }

  return (
    <div className="common-form h-full flex items-stretch justify-items-stretch flex-col">
      {' '}
      <div className="h-54px flex-0 bg-white flex items-center pl-11">
        <img src="/assets/ant-tree/file.png" className="w-14px h-14px mr-1.5" alt="文件" />
        {content?.name}
        <div className="flex-1"></div>
        {!editFlag ? (
          <>
            <Button className={'btn-test  mr-4'} onClick={onTest}>
              测试
            </Button>
            <Button className={'btn-save  mr-11'} onClick={() => setEditFlag(true)}>
              编辑
            </Button>
          </>
        ) : null}
      </div>
      <div className="rounded-4px flex-1 min-h-0 overflow-y-auto bg-white pl-8 mx-3 mt-3">
        <AuthToggleContext.Provider
          value={{ handleBottomToggleDesigner: () => setEditFlag(!editFlag) }}
        >
          {content ? (
            editFlag ? (
              <AuthEdit content={content} onChange={onEdit} onTest={onTest} />
            ) : (
              <AuthCheck content={content} />
            )
          ) : (
            ''
          )}
        </AuthToggleContext.Provider>
      </div>
    </div>
  )
}
