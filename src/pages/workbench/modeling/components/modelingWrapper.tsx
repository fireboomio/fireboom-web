import type { ReactNode } from 'react'
import { useEffect, useReducer } from 'react'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import type { DBSourceResp, Entity, ModelingShowTypeT } from '@/interfaces/modeling'
import {
  updateCurrentEntityIdAction,
  updatePreviewFiltersAction
} from '@/lib/actions/PrismaSchemaActions'
import { fetchDBSources } from '@/lib/clients/fireBoomAPIOperator'
import { DATABASE_SOURCE } from '@/lib/constants/fireBoomConstants'
import {
  emptyPrismaSchemaContextState,
  PrismaSchemaContext
} from '@/lib/context/prismaSchemaContext'
import { fetchAndSaveToPrismaSchemaContext } from '@/lib/helpers/ModelingHelpers'
import modelingReducer from '@/lib/reducers/modelingReducers'

const ModelingWrapper = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modelingReducer, emptyPrismaSchemaContextState.state)
  const [showType, setShowType] = useImmer<ModelingShowTypeT>('preview')
  const [dataSources, setDataSources] = useImmer<DBSourceResp[]>([])

  const { data, error } = useSWR(DATABASE_SOURCE, fetchDBSources)
  useEffect(() => {
    setDataSources(data?.filter(ds => ds.sourceType === 1) ?? [])
  }, [data, setDataSources])

  useEffect(() => {
    if (dataSources.length > 0) {
      fetchAndSaveToPrismaSchemaContext(dataSources[0].id, dispatch, dataSources)
    }
  }, [dataSources])

  const handleChangeSource = (dbSourceId: number) => {
    fetchAndSaveToPrismaSchemaContext(dbSourceId, dispatch, dataSources)
    setShowType('preview')
  }

  const handleClickEntity = (entity: Entity) => {
    setShowType(entity?.type === 'enum' ? 'editEnum' : 'preview')
    dispatch(updateCurrentEntityIdAction(entity.id))
    dispatch(updatePreviewFiltersAction([]))
  }

  const handleToggleDesigner = (entity: Entity) => {
    setShowType(entity.type === 'model' ? 'editModel' : 'editEnum')
    dispatch(updateCurrentEntityIdAction(entity.id))
  }

  // console.log('provider', {
  //   state,
  //   dispatch,
  //   panel: {
  //     handleToggleDesigner,
  //     handleClickEntity,
  //     handleChangeSource,
  //     setShowType,
  //     dataSources
  //   }
  // })
  return (
    <PrismaSchemaContext.Provider
      value={{
        state,
        dispatch,
        panel: {
          handleToggleDesigner,
          handleClickEntity,
          handleChangeSource,
          setShowType,
          dataSources,
          showType
        }
      }}
    >
      {props.children}
    </PrismaSchemaContext.Provider>
  )
}

export default ModelingWrapper
