import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context/auth-context'
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
  useEffect(() => {
    // 如果id为new，则视为新增
    if (id === 'new') {
      setEditFlag(true)
      setContent({
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

  return (
    <>
      <div className={'pl-6 pr-6 pt-6'}>
        <AuthToggleContext.Provider
          value={{ handleBottomToggleDesigner: () => setEditFlag(!editFlag) }}
        >
          {content ? (
            editFlag ? (
              <AuthEdit content={content} onChange={onEdit} />
            ) : (
              <AuthCheck content={content} />
            )
          ) : (
            ''
          )}
        </AuthToggleContext.Provider>
      </div>
    </>
  )
}
