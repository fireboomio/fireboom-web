import { getSchema } from '@mrleebo/prisma-ast'
import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { ModelPannel, ModelDesigner } from '@/components/modeling'
import ModelDesignerContent from '@/components/modeling/subs/model-designer-content'
import type { DBSourceResp, Block, Entity } from '@/interfaces'
import { ModelingContext, ModelingDispatchContext, ModelingCurrEntityContext } from '@/lib/context'
import { schemaFetcher, sourceFetcher } from '@/lib/fetchers'

import styles from './index.module.scss'
import modelingReducer from './modeling-reducer'

export default function Modeling() {
  const [blocks, dispatch] = useReducer(modelingReducer, [] as Block[])
  const [currEntityId, setCurrEntityId] = useImmer(null as number | null | undefined)
  const [showType, setShowType] = useImmer('data') // data schema

  // TODO: need refine
  useEffect(() => {
    setCurrEntityId(blocks.filter((b) => ['model', 'enum'].includes(b.type)).at(0)?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks])

  const { data: sources, error } = useSWR<DBSourceResp[], Error>('/api/sources', sourceFetcher)

  if (error) return <div>failed to load</div>
  if (!sources) return <div>loading...</div>

  const content = blocks.find((b) => b.id === currEntityId) as Entity

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
    setShowType('data')
    setCurrEntityId(entity.id)
  }

  function handleToggleDesigner(entity: Entity) {
    setShowType('schema')
    setCurrEntityId(entity.id)
    console.log(entity)
  }

  return (
    <>
      <Head>
        <title>FireBoom - 数据建模</title>
      </Head>

      <ModelingContext.Provider value={blocks}>
        <ModelingDispatchContext.Provider value={dispatch}>
          <ModelingCurrEntityContext.Provider
            value={{ currEntityId: currEntityId, setCurrEntityId: setCurrEntityId }}
          >
            <Row className="h-screen">
              <Col span={5} className={styles['col-left']}>
                <ModelPannel
                  sourceOptions={sources}
                  onChangeSource={handleChangeSource}
                  onClickEntity={handleClickEntity}
                  onToggleDesigner={handleToggleDesigner}
                />
              </Col>
              <Col span={19}>
                <ModelDesigner>
                  <ModelDesignerContent content={content} />
                </ModelDesigner>
              </Col>
            </Row>
          </ModelingCurrEntityContext.Provider>
        </ModelingDispatchContext.Provider>
      </ModelingContext.Provider>
    </>
  )
}
