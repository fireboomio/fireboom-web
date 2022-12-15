import { message } from 'antd'
import type { DocumentNode, GraphQLSchema, IntrospectionQuery, OperationTypeNode } from 'graphql'
import { buildClientSchema, getIntrospectionQuery, Kind } from 'graphql'
import { isEqual } from 'lodash'
import create from 'zustand'

import type { WorkbenchContextType } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import { parseSchemaAST } from './components/GraphiQL/utils'

const DEFAULT_QUERY = `# Generate operation by click graphql schema on the left panel`

export interface APIDesc {
  // content: string
  enable: boolean
  id: number
  isDir: boolean
  isPublic: boolean
  legal: boolean
  method: string
  operationType: string
  path: string
  remark: string
  createTime: string
  updateTime: string
  restUrl: string
  liveQuery: boolean
  setting: {
    authenticationRequired: boolean
    cachingEnable: boolean
    cachingMaxAge: number
    cachingStaleWhileRevalidate: number
    liveQueryEnable: boolean
    liveQueryPollingIntervalSeconds: number
  }
}

export interface APIState {
  apiID: string
  setID: (id: string) => Promise<void>
  apiDesc?: APIDesc
  originSchema: IntrospectionQuery | undefined
  schema: GraphQLSchema | undefined
  query: string
  lastSavedQuery: string | undefined
  setQuery: (v: string) => void
  schemaAST: DocumentNode | undefined
  _workbenchContext: WorkbenchContextType | undefined
  computed: {
    operationType: Readonly<OperationTypeNode | undefined>
    saved: boolean
  }
  pureUpdateAPI: (newAPI: Partial<APIDesc>) => void
  autoSave: () => boolean | Promise<boolean>
  updateAPI: (newAPI: Partial<APIDesc>) => Promise<void>
  updateAPIName: (path: string) => Promise<void>
  updateContent: (content: string, showMessage?: boolean) => boolean | Promise<boolean>
  refreshAPI: () => void
  refreshSchema: () => void
  appendToAPIRefresh: (fn: () => void) => void
  dispendToAPIRefresh: (fn: () => void) => void
  setWorkbenchContext: (ctx: WorkbenchContextType) => void
}

const refreshFns: (() => void)[] = []

function isQueryHasContent(query: string) {
  return (
    !!query &&
    query.split('\n').some(line => {
      const str = line.trim()
      return !!str && !str.match(/^#/)
    })
  )
}

export const useAPIManager = create<APIState>((set, get) => ({
  apiDesc: undefined,
  query: DEFAULT_QUERY,
  lastSavedQuery: undefined,
  apiID: '',
  setID: async (id: string) => {
    set({ apiID: id })
    await get().refreshAPI()
    refreshFns.forEach(fn => fn())
    // 第一次加载
    if (!get().schema) {
      // 获取 graphql 集合
      try {
        const res = await fetch('/app/main/graphql', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: getIntrospectionQuery() })
        }).then(resp => resp.json())
        set({
          originSchema: res.data as IntrospectionQuery,
          schema: buildClientSchema(res.data as IntrospectionQuery)
        })
      } catch (e) {
        //
      }
    }
  },
  setQuery(query) {
    set({ query: query || DEFAULT_QUERY })
    try {
      if (!isQueryHasContent(query)) {
        set({ schemaAST: undefined })
      } else {
        const schemaAST = parseSchemaAST(query)
        set({ schemaAST })
      }
    } catch (error) {
      // debugger
    }
  },
  originSchema: undefined,
  schema: undefined,
  schemaAST: undefined,
  _workbenchContext: undefined,
  computed: {
    get operationType() {
      const defs = get().schemaAST?.definitions
      if (defs) {
        return defs[0]?.kind === Kind.OPERATION_DEFINITION ? defs[0].operation : undefined
      }
      return undefined
    },
    get saved() {
      const { query, lastSavedQuery } = get()
      if (lastSavedQuery === undefined) return true
      if (query === DEFAULT_QUERY && !lastSavedQuery) return true
      return lastSavedQuery === query
    }
  },
  pureUpdateAPI: (newAPI: Partial<APIDesc>) => {
    // @ts-ignore
    set(state => ({ apiDesc: { ...state.apiDesc, ...newAPI } }))
  },
  updateAPI: (newAPI: Partial<APIDesc>) => {
    return requests.put(`/operateApi/${get().apiID}`, newAPI).then(resp => {
      get().pureUpdateAPI(newAPI)
      // 刷新api列表
      get()._workbenchContext?.onRefreshMenu('api')
    })
  },
  updateAPIName: (path) => {
    return requests.put(`/operateApi/rename/${get().apiID}`, { path }).then(resp => {
      get().pureUpdateAPI({ path, restUrl: get().apiDesc!.restUrl.replace(/(\/app\/main\/operations)\/.*$/, `$1${path}`) })
      // 刷新api列表
      get()._workbenchContext?.onRefreshMenu('api')
    })
  },
  updateContent: (content: string, showMessage = true) => {
    const schemaAST = get().schemaAST
    // content 校验
    if (!content || !schemaAST) {
      if (showMessage) {
        message.error('请输入合法的 GraphQL 查询语句')
      }
      return false
    }
    if (schemaAST.definitions.length > 1) {
      if (showMessage) {
        message.error('不支持多条查询语句')
      }
      return false
    }
    return requests.put(`/operateApi/content/${get().apiID}`, { content }).then(resp => {
      if (resp) {
        const query = content ?? ''
        get().setQuery(query)
        set({ lastSavedQuery: query })
        // @ts-ignore
        // set(state => ({ apiDesc: { ...state.apiDesc, content: query } }))
        // 内容变更可能需要刷新api列表
        get()._workbenchContext?.onRefreshMenu('api')
        return true
      }
      return false
    })
  },
  autoSave() {
    return get().updateContent(get().query, false)
  },
  refreshAPI: async () => {
    const id = get().apiID
    try {
      const [api, setting] = await Promise.all([
        requests.get(`/operateApi/${id}`),
        requests.get(`/operateApi/setting/${id}`, { params: { settingType: 1 } })
      ])
      // @ts-ignore
      set({ apiDesc: { ...api, setting } })
      // @ts-ignore
      const content = api.content
      get().setQuery(content)
      set({ lastSavedQuery: content })
    } catch (e) {
      // 接口请求错误就刷新api列表
      get()._workbenchContext?.onRefreshMenu('api')
    }
  },
  refreshSchema: () => {
    return fetch('/app/main/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: getIntrospectionQuery() })
    })
      .then(resp => resp.json())
      .then(res => {
        const newOriginSchema = res.data as IntrospectionQuery
        if (!isEqual(get().originSchema, newOriginSchema)) {
          console.log('schema changed')
          const newSchema = buildClientSchema(newOriginSchema)
          set({ originSchema: newOriginSchema, schema: newSchema })
        }
      })
  },
  appendToAPIRefresh: (fn: () => void) => {
    refreshFns.push(fn)
  },
  dispendToAPIRefresh: (fn: () => void) => {
    const index = refreshFns.indexOf(fn)
    if (index > -1) {
      refreshFns.splice(index, 1)
    }
  },
  setWorkbenchContext: (ctx: WorkbenchContextType) => {
    set({ _workbenchContext: ctx })
  }
}))
