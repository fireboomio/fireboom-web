import { Col, Empty, Row } from 'antd'
import { useContext, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import type { DBSourceResp } from '@/interfaces/modeling'
import { fetchDBSources } from '@/lib/clients/fireBoomAPIOperator'
import { DATABASE_SOURCE } from '@/lib/constants/fireBoomConstants'
import {
  emptyPrismaSchemaContextState,
  PrismaSchemaContext
} from '@/lib/context/PrismaSchemaContext'
import modelingReducer from '@/lib/reducers/ModelingReducers'

import DesignerContainer from './components/designer'
import ErDiagram from './components/erdiagram'
import PreviewContainer from './components/preview'

const Modeling = () => {
  const [state, dispatch] = useReducer(modelingReducer, emptyPrismaSchemaContextState.state)
  const [dataSources, setDataSources] = useImmer<DBSourceResp[]>([])
  const {
    panel: { showType, setShowType }
  } = useContext(PrismaSchemaContext)

  const { data: _, error } = useSWRImmutable(DATABASE_SOURCE, fetchDBSources)

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

  console.log('====showTYpe', showType)

  if (error) return <Empty className="pt-20" description="数据加载失败！" />
  if (!dataSources) return <Empty className="pt-20" description="无可用数据源列表！" />

  return (
    <>
      <Helmet>
        <title>FireBoom - 数据建模</title>
      </Helmet>

      <Row className="h-full">
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
        <Col span={24} className="h-full">
          {showType === 'preview' && <PreviewContainer />}
          {showType === 'editModel' && (
            <DesignerContainer
              key="a"
              editType={'edit'}
              type={'model'}
              setShowType={setShowType}
              showType={showType}
            />
          )}
          {showType === 'editEnum' && (
            <DesignerContainer
              key="a"
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
    </>
  )
}

export default Modeling
