import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context/auth-context'
import requests from '@/lib/fetchers'

import AuthCheck from './subs/Check'
import AuthEdit from './subs/Edit'

export default function AuthConfigContainer() {
  const [content, setContent] = useState<AuthProvResp>()
  const [editFlag, setEditFlag] = useState(false)
  const { id } = useParams()
  useEffect(() => {
    void requests.get<unknown, AuthProvResp[]>('/auth').then(res => {
      res.forEach(row => {
        if (row.id === Number(id)) {
          setContent(row)
        }
      })
    })
  }, [id])

  return (
    <>
      <div className={'pl-6 pr-6 pt-6'}>
        <AuthToggleContext.Provider value={{ handleBottomToggleDesigner: () => setEditFlag(!editFlag) }}>
          {content ? (
            editFlag ? (
              <AuthEdit content={content} onChange={setContent}/>
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
