import { message } from 'antd'
import type { ReactNode } from 'react'
import { useEffect, useReducer, useRef } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'
import { useImmer } from 'use-immer'

import type { Entity, ModelingShowTypeT } from '@/interfaces/modeling'
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
import type { ApiDocuments } from '@/services/a2s.namespace'
import { isDatabaseKind } from '@/utils/datasource'

const ModelingWrapper = (props: { children: ReactNode }) => {
  const intl = useIntl()
  // 用来获取实时id参数，以避免数据源请求返回后，id参数已经变化
  const paramNameRef = useRef<string>()
  const { name: paramName } = useParams()
  const [state, dispatch] = useReducer(modelingReducer, emptyPrismaSchemaContextState.state)
  const { newMap, delMap, editMap } = state
  const [showType, setShowType] = useImmer<ModelingShowTypeT>('preview')
  // 是否处于编辑状态，如果在编辑状态，则点击实体后不会切换到预览面板
  const [inEdit, setInEdit] = useImmer<boolean>(false)
  const [dataSources, setDataSources] = useImmer<ApiDocuments.Datasource[]>([])
  const { data, error } = useSWRImmutable(DATABASE_SOURCE, fetchDBSources)
  const [currentEntity, setCurrentEntity] = useImmer<Entity | null>(null)
  const [syncEditorFlag, setSyncEditorFlag] = useImmer<boolean>(false)
  useEffect(() => {
    setDataSources(data?.filter(ds => isDatabaseKind(ds)) ?? [])
  }, [data, setDataSources])

  const hideRef = useRef<() => void>()
  useEffect(() => {
    paramNameRef.current = paramName
    if (dataSources.length > 0 && paramName) {
      hideRef.current?.()
      const hide = message.loading(intl.formatMessage({ defaultMessage: '加载中' }), 0)
      hideRef.current = hide
      fetchAndSaveToPrismaSchemaContext(paramName, dispatch, dataSources, paramNameRef)?.finally(
        () => {
          hide()
          // 更新数据源后强制刷新编辑器
          setSyncEditorFlag(!syncEditorFlag)
        }
      )
    }
    return () => {
      hideRef.current?.()
    }
  }, [dataSources, paramName])
  useEffect(() => {
    // 如果当前blocks有内容(表示数据源已经加载完成)，且blocks中没有model或enum，则自动切换到编辑模式
    if (state.blocks.length && !state.blocks.find(b => ['model', 'enum'].includes(b.type))) {
      setShowType('editModel')
      setInEdit(true)
    }
  }, [state.blocks])

  const handleChangeSource = (dbSourceName: string) => {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '加载中' }), 0)
    fetchAndSaveToPrismaSchemaContext(dbSourceName, dispatch, dataSources, paramNameRef)?.finally(
      () => {
        setSyncEditorFlag(!syncEditorFlag)
        hide()
      }
    )
    // setShowType('preview')
  }

  /**
   * 2022-12-12 移除了是否是自动触发的判断，以解决请求到数据后，未自动选中第一项的问题，后续如有优化需要注意保证自动选择逻辑不会失效
   * @param entity
   * @param auto
   */
  const handleClickEntity = (entity: Entity, auto = false) => {
    if (!entity) {
      return
    }
    setCurrentEntity(entity)
    if (inEdit) {
      setShowType(entity.type === 'model' ? 'editModel' : 'editEnum')
    } else {
      setShowType(entity?.type === 'enum' ? 'editEnum' : 'preview')
      dispatch(updatePreviewFiltersAction([]))
    }
    dispatch(updateCurrentEntityIdAction(entity.id))
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
    if (flag === inEdit) {
      return
    }
    if (inEdit) {
      if (Object.keys({ ...newMap, ...delMap, ...editMap }).length > 0) {
        message.error(intl.formatMessage({ defaultMessage: '请先保存或取消编辑' }))
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
