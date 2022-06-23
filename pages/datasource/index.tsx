import { Col, Row } from 'antd'
import Head from 'next/head'

import { DatasourcePannel, DatasourceEditor } from '@/components/datasource'
import Layout from '@/components/layout'

import styles from './index.module.scss'

export default function Modeling() {
  return (
    <Layout>
      <Head>
        <title>数据建模</title>
      </Head>

      <Row className="h-screen">
        <Col span={5} className={styles['col-left']}>
          <DatasourcePannel />
        </Col>
        <Col span={19}>
          <DatasourceEditor />
        </Col>
      </Row>
    </Layout>
  )
}
