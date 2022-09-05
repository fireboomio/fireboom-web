import { Tabs } from 'antd'
import React, { useContext, useEffect } from 'react'
import type { SWRResponse } from 'swr'

import { AuthListType } from '@/interfaces/auth'
import { Connector as ConnectorType } from '@/interfaces/connector'
import { EMAIL, SMS, SOCIAL } from '@/lib/constant'
import { ConnectorContext } from '@/lib/context/auth-context'
import { useFetchConnector } from '@/lib/service/connector'

import MessageAndEmailConnector from './MessageAndEmailConnector'
import SocialContactConnector from './SocialContactConnector'
import styles from './index.module.scss'

const { TabPane } = Tabs

interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
}

const Connector: React.FC<Props> = ({ handleTopToggleDesigner }) => {
  const res: SWRResponse<ConnectorType[], Error> = useFetchConnector()
  const { data } = res
  const { connectorDispatch } = useContext(ConnectorContext)
  const SMSAndEmailData = data && data.filter(item => item.types === SMS || item.types === EMAIL)
  const SocialData = data && data.filter(item => item.types === SOCIAL)

  useEffect(() => {
    connectorDispatch({ type: 'fetchConnector', payload: data || [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <div>
      <span className={styles.title}>连接器</span>
      <span className={styles.titlePlaceholder}>设置连接器，开启无密码和社交登录</span>
      <div className={styles.tabStyle}>
        <Tabs defaultActiveKey="messageAndEmail">
          <TabPane tab="短信和邮件连接器" key={SMS}>
            <MessageAndEmailConnector
              data={SMSAndEmailData}
              handleTopToggleDesigner={handleTopToggleDesigner}
            />
          </TabPane>
          <TabPane tab="社交连接器" key={SOCIAL}>
            <SocialContactConnector
              data={SocialData}
              handleTopToggleDesigner={handleTopToggleDesigner}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}
export default Connector
