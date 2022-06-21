import { Col, Row } from 'antd'

import Layout from '@/components/layout'
import { ModelPannel, ModelEditor } from '@/components/modeling'

export default function Modeling() {
  return (
    <Layout>
      <Row>
        <Col span={5}>
          <ModelPannel />
        </Col>
        <Col span={19}>
          <ModelEditor />
        </Col>
      </Row>
    </Layout>
  )
}
