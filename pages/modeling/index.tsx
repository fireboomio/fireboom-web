import { getSchema } from '@mrleebo/prisma-ast'
import { Col, Row } from 'antd'
import Head from 'next/head'
import { useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { ModelPannel, ModelEditor } from '@/components/modeling'
import type { DBSourceResp, Block, Entity } from '@/interfaces'
import { ModelingContext, ModelingDispatchContext } from '@/lib/context'
import { schemaFetcher, sourceFetcher } from '@/lib/fetchers'

import styles from './index.module.scss'
import modelingReducer from './modeling-reducer'

export default function Modeling() {
  const [content, setContent] = useImmer({} as Entity)
  const [blocks, dispatch] = useReducer(modelingReducer, [] as Block[])
  const { data: sources, error } = useSWR<DBSourceResp[], Error>('/api/sources', sourceFetcher)

  if (error) return <div>failed to load</div>
  if (!sources) return <div>loading...</div>

  function handleChangeSource(value: string) {
    schemaFetcher(`/api/schemas/${value}`)
      .then((res) =>
        dispatch({
          type: 'fetched',
          data: getSchema(res.body).list.map((item, idx) => ({ ...item, id: idx })),
        })
      )
      .catch((err: Error) => {
        throw err
      })
  }

  function handleClickEntity(entity: Entity) {
    console.log(entity)
    setContent(entity)
  }

  return (
    <>
      <Head>
        <title>FireBoom - 数据建模</title>
      </Head>

      <ModelingContext.Provider value={blocks}>
        <ModelingDispatchContext.Provider value={dispatch}>
          <Row className="h-screen">
            <Col span={5} className={styles['col-left']}>
              <ModelPannel
                sourceOptions={sources}
                onChangeSource={handleChangeSource}
                onClickEntity={handleClickEntity}
              />
            </Col>
            <Col span={19}>
              <ModelEditor content={content} />
            </Col>
          </Row>
        </ModelingDispatchContext.Provider>
      </ModelingContext.Provider>
    </>
  )
}
