import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { AuthPannel, AuthContainer } from '@/components/auth'
import type { AuthProvItem } from '@/interfaces/auth'
import { AuthContext, AuthDispatchContext, AuthCurrContext, AuthToggleContext } from '@/lib/context'
import { authFetcher } from '@/lib/fetchers'

import authReducer from './auth-reducer'
import styles from './index.module.scss'

export default function Authentication() {
  const [authProvList, dispatch] = useReducer(authReducer, [] as AuthProvItem[])
  const [showType, setShowType] = useImmer('data')
  useEffect(() => {
    setCurrAuthProvItemId(authProvList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProvList])

  const [currAuthProvItemId, setCurrAuthProvItemId] = useImmer(null as number | null | undefined)
  const { data, error } = useSWR<AuthProvItem[], Error>('/api/datasource', authFetcher)
  useEffect(() => {
    data &&
      dispatch({
        type: 'fetched',
        data,
      })
  }, [data])

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  // TODO: need refine

  const content = authProvList.find((b) => b.id === currAuthProvItemId) as AuthProvItem

  function handleClickItem(authProvItem: AuthProvItem) {
    setShowType('data')
    setCurrAuthProvItemId(authProvItem.id)
  }

  function handleToggleDesigner(pagetype: 'edit' | 'setting' | 'identity' | 'role', id: number) {
    setShowType(pagetype)
    setCurrAuthProvItemId(id)
  }

  return (
    <>
      <AuthContext.Provider value={authProvList}>
        <AuthDispatchContext.Provider value={dispatch}>
          <AuthCurrContext.Provider value={{ currAuthProvItemId, setCurrAuthProvItemId }}>
            <AuthToggleContext.Provider value={{ handleToggleDesigner }}>
              <Head>
                <title>FireBoom - 认证鉴权</title>
              </Head>
              <Row className="h-screen">
                <Col span={5} className={styles['col-left']}>
                  <AuthPannel
                    onClickItem={handleClickItem}
                  />
                </Col>
                <Col span={19}>
                  <AuthContainer showType={showType} content={content} />
                </Col>
              </Row>
            </AuthToggleContext.Provider>
          </AuthCurrContext.Provider>
        </AuthDispatchContext.Provider>
      </AuthContext.Provider>
    </>
  )
}
