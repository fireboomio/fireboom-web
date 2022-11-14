import { message } from 'antd'
import type { ReactNode } from 'react'
import { useEffect, useReducer, useRef } from 'react'
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
} from '@/lib/context/PrismaSchemaContext'
import { fetchAndSaveToPrismaSchemaContext } from '@/lib/helpers/ModelingHelpers'
import modelingReducer from '@/lib/reducers/ModelingReducers'

const ModelingWrapper = (props: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modelingReducer, emptyPrismaSchemaContextState.state)
  const { newMap, delMap, editMap } = state
  const [showType, setShowType] = useImmer<ModelingShowTypeT>('preview')
  // 是否处于编辑状态，如果在编辑状态，则点击实体后不会切换到预览面板
  const inEdit = useRef<boolean>(false)
  const [dataSources, setDataSources] = useImmer<DBSourceResp[]>([])

  const { data, error } = useSWR(DATABASE_SOURCE, fetchDBSources)
  const [currentEntity, setCurrentEntity] = useImmer<Entity | null>(null)
  useEffect(() => {
    setDataSources(data?.filter(ds => ds.sourceType === 1) ?? [])
  }, [data, setDataSources])

  useEffect(() => {
    if (dataSources.length > 0) {
      fetchAndSaveToPrismaSchemaContext(dataSources[0].id, dispatch, dataSources)
    }
  }, [dataSources])

  const handleChangeSource = (dbSourceId: number) => {
    const hide = message.loading('加载中...', 0)
    fetchAndSaveToPrismaSchemaContext(dbSourceId, dispatch, dataSources)?.finally(() => {
      hide()
    })
    setShowType('preview')
  }

  const handleClickEntity = (entity: Entity, auto = false) => {
    if (!auto) {
      setCurrentEntity(entity)
    }
    if (inEdit.current) {
      setShowType(entity.type === 'model' ? 'editModel' : 'editEnum')
      dispatch(updateCurrentEntityIdAction(entity.id))
    } else {
      setShowType(entity?.type === 'enum' ? 'editEnum' : 'preview')
      dispatch(updateCurrentEntityIdAction(entity.id))
      dispatch(updatePreviewFiltersAction([]))
    }
  }

  const handleToggleDesigner = (entity: Entity, auto = false) => {
    if (!auto) {
      setCurrentEntity(entity)
    }

    if (inEdit.current) {
      setShowType(entity.type === 'model' ? 'editModel' : 'editEnum')
      dispatch(updateCurrentEntityIdAction(entity.id))
    } else {
      setShowType(entity?.type === 'enum' ? 'editEnum' : 'preview')
      dispatch(updateCurrentEntityIdAction(entity.id))
      dispatch(updatePreviewFiltersAction([]))
    }
  }

  const handleSetInEdit = (flag: boolean) => {
    if (inEdit.current) {
      if (Object.keys({ ...newMap, ...delMap, ...editMap }).length > 0) {
        message.error('请先保存或取消编辑')
        return
      }
    }
    inEdit.current = flag
    if (!currentEntity) {
      return
    }
    handleClickEntity(currentEntity, true)
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
          inEdit: inEdit.current,
          handleSetInEdit,
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
