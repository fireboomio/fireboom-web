import { getSchema } from '@mrleebo/prisma-ast'
import { Col, Row } from 'antd'
import { useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import { ModelPannel, ModelContainer } from '@/components/modeling'
import type { DBSourceResp, Entity, SchemaResp } from '@/interfaces/modeling'
import { ModelingContext, ModelingDispatchContext, ModelingCurrEntityContext } from '@/lib/context'
import requests, { getFetcher } from '@/lib/fetchers'
import modelingReducer from '@/lib/reducers/modeling-reducer'

import styles from './index.module.scss'

type ShowTypeT = 'data' | 'model' | 'enum'

export default function Modeling() {
  const [blocks, dispatch] = useReducer(modelingReducer, [])
  const [currEntityId, setCurrEntityId] = useImmer<number | null>(null)
  const [showType, setShowType] = useImmer<ShowTypeT>('data')

  useEffect(() => {
    const entities = blocks.filter(b => ['model', 'enum'].includes(b.type)) as Entity[]
    setCurrEntityId(entities.at(0)?.id ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: sources, error } = useSWR('/sources', getFetcher)

  if (error) return <div>failed to load</div>
  if (!sources) return <div>loading...</div>

  function handleChangeSource(value: string) {
    requests
      .get<unknown, SchemaResp>(`/schemas/${value}`)
      .then(res =>
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
    setShowType(entity.type)
    setCurrEntityId(entity.id)
  }

  return (
    <>
      <Helmet>
        <title>FireBoom - 数据建模</title>
      </Helmet>

      <ModelingContext.Provider value={blocks}>
        <ModelingDispatchContext.Provider value={dispatch}>
          <ModelingCurrEntityContext.Provider
            value={{ currEntityId: currEntityId, setCurrEntityId: setCurrEntityId }}
          >
            <Row className="h-screen">
              <Col span={5} className={styles['col-left']}>
                <ModelPannel
                  sourceOptions={sources as DBSourceResp[]}
                  onChangeSource={handleChangeSource}
                  onClickEntity={handleClickEntity}
                  onToggleDesigner={handleToggleDesigner}
                />
              </Col>
              <Col span={19}>
                <ModelContainer showType={showType} currEntityId={currEntityId} />
              </Col>
            </Row>
          </ModelingCurrEntityContext.Provider>
        </ModelingDispatchContext.Provider>
      </ModelingContext.Provider>
    </>
  )
}
