import { Col, Row } from 'antd'
import Head from 'next/head'
import { useImmer } from 'use-immer'

import { SettingPannel, SettingContainer } from '@/components/setting'
import type { SettingType } from '@/interfaces/setting'

import styles from './index.module.scss'

export default function Setting() {
  const [showType, setShowType] = useImmer('data')

  // TODO: need refine

  function handleToggleDesigner(settingType: SettingType) {
    setShowType(settingType.type)
  }

  return (
    <>
      <Head>
        <title>FireBoom - 设置</title>
      </Head>

      <Row className="h-screen">
        <Col span={5} className={styles['col-left']}>
          <SettingPannel handleToggleDesigner={handleToggleDesigner} />
        </Col>
        <Col span={19}>
          <SettingContainer showType={showType} />
        </Col>
      </Row>
    </>
  )
}
