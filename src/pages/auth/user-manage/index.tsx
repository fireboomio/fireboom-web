/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Col, Row } from 'antd'
import { useEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { AuthContainer, AuthPannel } from '@/components/auth'
import type { AuthListType, AuthProvResp } from '@/interfaces/auth'
import { AuthContext, AuthCurrContext, AuthDispatchContext, AuthToggleContext, ConnectorContext } from '@/lib/context/auth-context'
import { getFetcher } from '@/lib/fetchers'
import authReducer from '@/lib/reducers/auth-reducer'
import connectorReducer from '@/lib/reducers/connector-reducer';

import styles from './index.module.scss'

export default function Authentication() {
  const [authProvList, dispatch] = useReducer(authReducer, [])
  const [connector, connectorDispatch] = useReducer(connectorReducer, {
    currentConnector: null,
    connectors: []
  });
  const [showBottomType, setShowBottomType] = useImmer('data')
  const [showTopType, setShowTopType] = useImmer('userManage')
  const [currAuthProvItemId, setCurrAuthProvItemId] = useImmer(null as number | null | undefined)

  const { data } = useSWR<AuthProvResp[], Error>('/auth', getFetcher)
  useEffect(() => {
    data &&
    dispatch({
      type: 'fetched',
      data,
    })
  }, [data])

  // TODO: add
  // if (error) return <div>failed to load</div>
  // if (!data) return <div>loading...</div>

  // TODO: need refine

  const onClickItem = (authItem: AuthProvResp) => {
    if (authItem.name == '') {
      setShowBottomType('edit')
    } else {
      setShowBottomType('data')
    }

    setCurrAuthProvItemId(authItem.id)
  }

  const handleBottomToggleDesigner = (pageType: 'data' | 'edit', id?: number | undefined) => {
    setShowBottomType(pageType)
    id && setCurrAuthProvItemId(id)
  }

  const handleTopToggleDesigner = (authType: AuthListType) => {
    setShowTopType(authType.type)
  }

  const content = authProvList.find((b) => b.id === currAuthProvItemId) as AuthProvResp

  return (
    <>
      <AuthContext.Provider value={authProvList}>
        <AuthDispatchContext.Provider value={dispatch}>
          <AuthCurrContext.Provider value={{ currAuthProvItemId, setCurrAuthProvItemId }}>
            <AuthToggleContext.Provider value={{ handleBottomToggleDesigner }}>
              <ConnectorContext.Provider value={{ connector, connectorDispatch }}>
                <Row className="h-screen">
                  <Col span={5} className={styles['col-left']}>
                    <AuthPannel
                      onClickItem={onClickItem}
                      handleTopToggleDesigner={handleTopToggleDesigner}
                    />
                  </Col>
                  <Col span={19}>
                    <AuthContainer
                      handleTopToggleDesigner={handleTopToggleDesigner}
                      showBottomType={showBottomType}
                      showTopType={showTopType}
                      content={content}
                    />
                  </Col>
                </Row>
              </ConnectorContext.Provider>
            </AuthToggleContext.Provider>
          </AuthCurrContext.Provider>
        </AuthDispatchContext.Provider>
      </AuthContext.Provider>
    </>
  )
}
