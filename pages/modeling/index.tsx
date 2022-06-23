import { Col, Row } from 'antd'
import axios, { AxiosResponse } from 'axios'
import Head from 'next/head'
import useSWR from 'swr'

import Layout from '@/components/layout'
import { ModelPannel, ModelEditor } from '@/components/modeling'
import type { Result, SchemaResp } from '@/interfaces'

import styles from './index.module.scss'

const fetcher = (url: string) =>
  axios.get(url).then((res: AxiosResponse<Result<SchemaResp[]>, unknown>) => {
    return res.data.result
  })

export default function Modeling() {
  const { data: schemas, error } = useSWR<SchemaResp[], Error>(
    'http://localhost:8080/tables.json',
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!schemas) return <div>loading...</div>

  return (
    <Layout>
      <Head>
        <title>FireBoom - 数据建模</title>
      </Head>

      <Row className="h-screen">
        <Col span={5} className={styles['col-left']}>
          <ModelPannel schemaOptions={schemas} />
        </Col>
        <Col span={19}>
          <ModelEditor />
        </Col>
      </Row>
    </Layout>
  )
}
