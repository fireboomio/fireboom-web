import { Col, Row } from 'antd'
import axios, { AxiosResponse } from 'axios'
import Head from 'next/head'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { ModelPannel, ModelEditor } from '@/components/modeling'
import type { Result, DBSourceResp, Block } from '@/interfaces'
import { ModelingContext } from '@/lib/context'

import styles from './index.module.scss'

const fetcher = (url: string) =>
  axios.get(url).then((res: AxiosResponse<Result<DBSourceResp[]>, unknown>) => {
    return res.data.result
  })

export default function Modeling() {
  const [blocks, setBlocks] = useImmer([] as Block[])
  const { data: sources, error } = useSWR<DBSourceResp[], Error>('/api/tables', fetcher)

  if (error) return <div>failed to load</div>
  if (!sources) return <div>loading...</div>

  return (
    <>
      <Head>
        <title>FireBoom - 数据建模</title>
      </Head>

      <ModelingContext.Provider value={{ blocks, setBlocks }}>
        <Row className="h-screen">
          <Col span={5} className={styles['col-left']}>
            <ModelPannel sourceOptions={sources} />
          </Col>
          <Col span={19}>
            <ModelEditor />
          </Col>
        </Row>
      </ModelingContext.Provider>
    </>
  )
}
