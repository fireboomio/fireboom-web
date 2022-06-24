import { Col, Row } from 'antd'
import axios, { AxiosResponse } from 'axios'
import Head from 'next/head'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { ModelPannel, ModelEditor } from '@/components/modeling'
import type { Result, DBSourceResp, Entity } from '@/interfaces'
import { ModelingContext } from '@/lib/modeling-context'
import { ModelEnum } from '@/components/modeling'

import styles from './index.module.scss'

const fetcher = (url: string) =>
  axios.get(url).then((res: AxiosResponse<Result<DBSourceResp[]>, unknown>) => {
    return res.data.result
  })

export default function Modeling() {
  const [entities, setEntities] = useImmer([] as Entity[])
  const { data: sources, error } = useSWR<DBSourceResp[], Error>('/api/tables', fetcher)

  if (error) return <div>failed to load</div>
  if (!sources) return <div>loading...</div>

  const [isShowChart, setIsShowChart] = useImmer(false)

  return (
    <>
      <Head>
        <title>FireBoom - 数据建模</title>
      </Head>

      <ModelingContext.Provider value={{ entities, setEntities }}>
        <Row className="h-screen">
          <Col span={5} className={styles['col-left']}>
            <ModelPannel sourceOptions={sources} />
          </Col>
          <Col span={19}>
            <Col span={19}>{isShowChart ? <ModelEditor /> : <ModelEnum />}</Col>
          </Col>
        </Row>
      </ModelingContext.Provider>
    </>
  )
}
