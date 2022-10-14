import { Col, Row } from 'antd'
import { Helmet } from 'react-helmet'
import { useImmer } from 'use-immer'

import { SettingContainer, SettingPannel } from '@/components/setting'
import type { SettingType } from '@/interfaces/setting'

import styles from './index.module.less'

export default function Setting() {
  const [showType, setShowType] = useImmer('data')

  // TODO: need refine

  function handleToggleDesigner(settingType: SettingType) {
    setShowType(settingType.type)
  }

  return (
    <>
      <Helmet>
        <title>FireBoom - 设置</title>
      </Helmet>

      <Row className="h-[calc(100vh_-_36px)]">
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
