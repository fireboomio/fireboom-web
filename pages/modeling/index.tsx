import { Col, Row } from 'antd'
import Head from 'next/head'

import Layout from '@/components/layout'
import { ModelPannel, ModelEditor } from '@/components/modeling'

import styles from './index.module.scss'

export default function Modeling() {
  return (
    <Layout>
      <Head>
        <title>数据建模</title>
      </Head>

      <Row>
        <Col span={5} className={styles['col-left']}>
          <ModelPannel />
        </Col>
        <Col span={19}>
          <ModelEditor />
        </Col>
      </Row>
    </Layout>
  )
}
