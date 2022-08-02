/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { AuthPannel, AuthContainer } from '@/components/auth'
import type { AuthListType, AuthProvResp } from '@/interfaces/auth'
import { AuthContext, AuthDispatchContext, AuthCurrContext, AuthToggleContext } from '@/lib/context'
import { getFetcher } from '@/lib/fetchers'
import authReducer from '@/lib/reducers/auth-reducer'

import styles from './index.module.scss'

export default function Authentication() {
  const [authProvList, dispatch] = useReducer(authReducer, [])
  const [showBottomType, setShowBottomType] = useImmer('data')
  const [showTopType, setShowTopType] = useImmer('userManage')

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

  const onClickItem = (authItem: AuthProvResp) => {
    if (authItem.name == '') {
      setShowBottomType('edit')
    } else {
      setShowBottomType('data')
    }

    console.log(currAuthProvItemId, '123111111')
    setCurrAuthProvItemId(authItem.id)
  }

  const handleBottomToggleDesigner = (pageType: 'data' | 'edit', id?: number | undefined) => {
    setShowBottomType(pageType)
    id && setCurrAuthProvItemId(id)
  }

  const handleTopToggleDesigner = (authType: AuthListType) => {
    setShowTopType(authType.type)
  }

  console.log(currAuthProvItemId, '123')
  const content = authProvList.find((b) => b.id === currAuthProvItemId) as AuthProvResp

  return (
    <>
      <AuthContext.Provider value={authProvList}>
        <AuthDispatchContext.Provider value={dispatch}>
          <AuthCurrContext.Provider value={{ currAuthProvItemId, setCurrAuthProvItemId }}>
            <AuthToggleContext.Provider value={{ handleBottomToggleDesigner }}>
              <Head>
                <title>FireBoom - 认证鉴权</title>
              </Head>
              <Row className="h-screen">
                <Col span={5} className={styles['col-left']}>
                  <AuthPannel
                    onClickItem={onClickItem}
                    handleTopToggleDesigner={handleTopToggleDesigner}
                  />
                </Col>
                <Col span={19}>
                  <AuthContainer
                    showBottomType={showBottomType}
                    showTopType={showTopType}
                    content={content}
                  />
                </Col>
              </Row>
            </AuthToggleContext.Provider>
          </AuthCurrContext.Provider>
        </AuthDispatchContext.Provider>
      </AuthContext.Provider>
    </>
  )
}
