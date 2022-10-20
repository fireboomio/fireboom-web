import { Col, Empty, Row } from 'antd'
import { useReducer } from 'react'
import { Helmet } from 'react-helmet'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import type { DBSourceResp, ModelingShowTypeT } from '@/interfaces/modeling'
import { fetchDBSources } from '@/lib/clients/fireBoomAPIOperator'
import { DATABASE_SOURCE } from '@/lib/constants/fireBoomConstants'
import {
  emptyPrismaSchemaContextState,
  PrismaSchemaContext
} from '@/lib/context/prismaSchemaContext'
import modelingReducer from '@/lib/reducers/modelingReducers'

import DesignerContainer from './components/designer'
import ErDiagram from './components/erdiagram'
import PreviewContainer from './components/preview'

const Modeling = () => {
  const [state, dispatch] = useReducer(modelingReducer, emptyPrismaSchemaContextState.state)
  const [showType, setShowType] = useImmer<ModelingShowTypeT>('preview')
  const [dataSources, setDataSources] = useImmer<DBSourceResp[]>([])

  const { data: _, error } = useSWR(DATABASE_SOURCE, fetchDBSources)

  // useEffect(() => {
  //   setDataSources(data?.filter(ds => ds.sourceType === 1) ?? [])
  // }, [data, setDataSources])

  // useEffect(() => {
  //   if (dataSources.length > 0) {
  //     fetchAndSaveToPrismaSchemaContext(dataSources[0].id, dispatch, dataSources)
  //   }
  // }, [dataSources])

  // const handleChangeSource = (dbSourceId: number) => {
  //   fetchAndSaveToPrismaSchemaContext(dbSourceId, dispatch, dataSources)
  //   setShowType('preview')
  // }

  // const handleClickEntity = (entity: Entity) => {
  //   setShowType(entity?.type === 'enum' ? 'editEnum' : 'preview')
  //   dispatch(updateCurrentEntityIdAction(entity.id))
  //   dispatch(updatePreviewFiltersAction([]))
  // }

  // const handleToggleDesigner = (entity: Entity) => {
  //   setShowType(entity.type === 'model' ? 'editModel' : 'editEnum')
  //   dispatch(updateCurrentEntityIdAction(entity.id))
  // }

  if (error) return <Empty className="pt-20" description="数据加载失败！" />
  if (!dataSources) return <Empty className="pt-20" description="无可用数据源列表！" />

  return (
    <>
      <Helmet>
        <title>FireBoom - 数据建模</title>
      </Helmet>

      <PrismaSchemaContext.Provider value={{ state, dispatch }}>
        <Row className="h-screen">
          {/* <Col span={5} className={styles['col-left']}>
            <ModelPannel
              setShowType={setShowType}
              changeToER={() => setShowType('erDiagram')}
              addNewModel={() => setShowType('newModel')}
              addNewEnum={() => setShowType('newEnum')}
              sourceOptions={dataSources}
              onChangeSource={dbSourceId => handleChangeSource(dbSourceId)}
              onClickEntity={handleClickEntity}
              onToggleDesigner={handleToggleDesigner}
            />
          </Col> */}
          <Col span={24}>
            {showType === 'preview' && <PreviewContainer />}
            {showType === 'editModel' && (
              <DesignerContainer
                editType={'edit'}
                type={'model'}
                setShowType={setShowType}
                showType={showType}
              />
            )}
            {showType === 'editEnum' && (
              <DesignerContainer
                editType={'edit'}
                type={'enum'}
                setShowType={setShowType}
                showType={showType}
              />
            )}
            {showType === 'newModel' && (
              <DesignerContainer
                editType={'add'}
                type={'model'}
                setShowType={setShowType}
                showType={showType}
              />
            )}
            {showType === 'newEnum' && (
              <DesignerContainer
                editType={'add'}
                type={'enum'}
                setShowType={setShowType}
                showType={showType}
              />
            )}
            {showType === 'erDiagram' && <ErDiagram />}
          </Col>
        </Row>
      </PrismaSchemaContext.Provider>
    </>
  )
}

export default Modeling
