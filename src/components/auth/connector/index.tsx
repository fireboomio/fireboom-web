import { Tabs } from 'antd'
import type React from 'react'
import { useEffect } from 'react'
import type { SWRResponse } from 'swr'

import type { Connector as ConnectorType } from '@/interfaces/connector'
import { EMAIL, SMS, SOCIAL } from '@/lib/constant'
import { useFetchConnector } from '@/lib/service/connector'

import styles from './index.module.less'
import MessageAndEmailConnector from './MessageAndEmailConnector'
import SocialContactConnector from './SocialContactConnector'

const { TabPane } = Tabs

const Connector: React.FC<Props> = () => {
  const res: SWRResponse<ConnectorType[], Error> = useFetchConnector()
  const { data } = res
  // const { connectorDispatch } = useContext(ConnectorContext)
  const SMSAndEmailData = data && data.filter(item => item.types === SMS || item.types === EMAIL)
  const SocialData = data && data.filter(item => item.types === SOCIAL)

  useEffect(() => {
    // connectorDispatch({ type: 'fetchConnector', payload: data || [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <>
      <span className={styles.title}>连接器</span>
      <span className={styles.titlePlaceholder}>设置连接器，开启无密码和社交登录</span>
      <div className={styles.tabStyle}>
        <Tabs defaultActiveKey="messageAndEmail">
          <TabPane tab="短信和邮件连接器" key={SMS}>
            <MessageAndEmailConnector data={SMSAndEmailData} />
          </TabPane>
          <TabPane tab="社交连接器" key={SOCIAL}>
            <SocialContactConnector data={SocialData} />
          </TabPane>
        </Tabs>
      </div>
    </>
  )
}
export default Connector
