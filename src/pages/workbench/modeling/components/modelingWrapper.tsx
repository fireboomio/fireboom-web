import { message } from 'antd'
import type { ReactNode } from 'react'
import { useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
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
  const { id: paramId } = useParams()
  const [state, dispatch] = useReducer(modelingReducer, emptyPrismaSchemaContextState.state)
  const { newMap, delMap, editMap } = state
  const [showType, setShowType] = useImmer<ModelingShowTypeT>('preview')
  // 是否处于编辑状态，如果在编辑状态，则点击实体后不会切换到预览面板
  const [inEdit, setInEdit] = useImmer<boolean>(false)
  const [dataSources, setDataSources] = useImmer<DBSourceResp[]>([])
  const { data, error } = useSWR(DATABASE_SOURCE, fetchDBSources)
  const [currentEntity, setCurrentEntity] = useImmer<Entity | null>(null)
  const [syncEditorFlag, setSyncEditorFlag] = useImmer<boolean>(false)
  useEffect(() => {
    setDataSources(data?.filter(ds => ds.sourceType === 1) ?? [])
  }, [data, setDataSources])

  useEffect(() => {
    if (dataSources.length > 0 && paramId) {
      const hide = message.loading('加载中...', 0)
      fetchAndSaveToPrismaSchemaContext(Number(paramId), dispatch, dataSources)?.finally(() => {
        hide()
        // 更新数据源后强制刷新编辑器
        setSyncEditorFlag(!syncEditorFlag)
      })
    }
  }, [dataSources, paramId])
  useEffect(() => {
    // 如果当前blocks有内容(表示数据源已经加载完成)，且blocks中没有model或enum，则自动切换到编辑模式
    if (state.blocks.length && !state.blocks.find(b => ['model', 'enum'].includes(b.type))) {
      setShowType('editModel')
      setInEdit(true)
    }
  }, [state.blocks])

  const handleChangeSource = (dbSourceId: number) => {
    const hide = message.loading('加载中...', 0)
    fetchAndSaveToPrismaSchemaContext(dbSourceId, dispatch, dataSources)?.finally(() => {
      hide()
    })
    // setShowType('preview')
  }

  const handleClickEntity = (entity: Entity, auto = false) => {
    if (!entity) {
      return
    }
    if (!auto) {
      setCurrentEntity(entity)
    }
    if (inEdit) {
      setShowType(entity.type === 'model' ? 'editModel' : 'editEnum')
      dispatch(updateCurrentEntityIdAction(entity.id))
    } else {
      setShowType(entity?.type === 'enum' ? 'editEnum' : 'preview')
      dispatch(updateCurrentEntityIdAction(entity.id))
      dispatch(updatePreviewFiltersAction([]))
    }
  }

  const handleToggleDesigner = handleClickEntity
  useEffect(() => {
    if (currentEntity) {
      handleClickEntity(currentEntity, true)
    } else if (state.blocks?.length > 0) {
      handleClickEntity(
        state.blocks.find(b => b.type === 'model' || b.type === 'enum') as Entity,
        true
      )
    }
  }, [inEdit, state.blocks])

  const handleSetInEdit = (flag: boolean) => {
    if (inEdit) {
      if (Object.keys({ ...newMap, ...delMap, ...editMap }).length > 0) {
        message.error('请先保存或取消编辑')
        return
      }
    }
    setInEdit(flag)
  }

  return (
    <PrismaSchemaContext.Provider
      value={{
        state,
        syncEditorFlag,
        triggerSyncEditor: () => setSyncEditorFlag(!syncEditorFlag),
        dispatch,
        panel: {
          inEdit: inEdit,
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
