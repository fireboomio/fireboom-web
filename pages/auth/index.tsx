/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useLayoutEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { AuthPannel, AuthContainer } from '@/components/auth'
import type { AuthProvResp } from '@/interfaces/auth'
import { AuthContext, AuthDispatchContext, AuthCurrContext, AuthToggleContext } from '@/lib/context'
import { getFetcher } from '@/lib/fetchers'
import authReducer from '@/lib/reducers/auth-reducer'

import styles from './index.module.scss'

export default function Authentication() {
  const [authProvList, dispatch] = useReducer(authReducer, [])
  const [showType, setShowType] = useImmer('data')
  useLayoutEffect(() => {
    setCurrAuthProvItemId(authProvList.at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProvList])

  const [currAuthProvItemId, setCurrAuthProvItemId] = useImmer(null as number | null | undefined)
  const { data, error } = useSWR<AuthProvResp[], Error>('/auth', getFetcher)
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

  const content = authProvList.find((b) => b.id === currAuthProvItemId) as AuthProvResp

  function handleClickItem(authProvItem: AuthProvResp) {
    setShowType('data')
    setCurrAuthProvItemId(authProvItem.id)
  }

  function handleToggleDesigner(
    pagetype: 'data' | 'edit' | 'setting' | 'identity' | 'role' | 'user',
    id?: number | undefined
  ) {
    setShowType(pagetype)
    id && setCurrAuthProvItemId(id)
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
                    // handleToggleDesigner={handleToggleDesigner}
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
