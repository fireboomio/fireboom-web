import { Col, Row } from 'antd'
import Head from 'next/head'

import { DatasourcePannel, DatasourceEditor } from '@/components/datasource'

import styles from './index.module.scss'

export default function Modeling() {
  return (
    <>
      <Head>
        <title>FireBoom - 数据来源</title>
      </Head>

      <Row className="h-screen">
        <Col span={5} className={styles['col-left']}>
          <DatasourcePannel />
        </Col>
        <Col span={19}>
          <DatasourceEditor />
        </Col>
      </Row>
    </>
  )
}
