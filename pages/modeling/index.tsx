import { getSchema } from '@mrleebo/prisma-ast'
import { Col, Row } from 'antd'
import Head from 'next/head'
import { useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { ModelPannel, ModelEditor } from '@/components/modeling'
import type { DBSourceResp, Block, Entity } from '@/interfaces'
import { ModelingContext, ModelingDispatchContext, ModelingFoucsContext } from '@/lib/context'
import { schemaFetcher, sourceFetcher } from '@/lib/fetchers'

import styles from './index.module.scss'
import modelingReducer from './modeling-reducer'

export default function Modeling() {
  const [blocks, dispatch] = useReducer(modelingReducer, [] as Block[])
  const [foucsId, setFoucsId] = useImmer(null as number | null | undefined)

  const { data: sources, error } = useSWR<DBSourceResp[], Error>('/api/sources', sourceFetcher)

  if (error) return <div>failed to load</div>
  if (!sources) return <div>loading...</div>

  const content = blocks.find((b) => b.id === foucsId) as Entity

  function handleChangeSource(value: string) {
    schemaFetcher(`/api/schemas/${value}`)
      .then((res) =>
        dispatch({
          type: 'fetched',
          data: getSchema(res.body).list.map((item, idx) => ({ ...item, id: idx })),
        })
      )
      // FIXME:
      .then(() => setFoucsId(blocks.filter((b) => ['model', 'enum'].includes(b.type)).at(0)?.id))
      .catch((err: Error) => {
        throw err
      })
  }

  function handleClickEntity(entity: Entity) {
    console.log(entity)
    setFoucsId(entity.id)
  }

  return (
    <>
      <Head>
        <title>FireBoom - 数据建模</title>
      </Head>

      <ModelingContext.Provider value={blocks}>
        <ModelingDispatchContext.Provider value={dispatch}>
          <ModelingFoucsContext.Provider value={{ foucsId, setFoucsId }}>
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
          </ModelingFoucsContext.Provider>
        </ModelingDispatchContext.Provider>
      </ModelingContext.Provider>
    </>
  )
}
