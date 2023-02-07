import { message } from 'antd'
import type {
  DocumentNode,
  GraphQLSchema,
  IntrospectionQuery,
  IntrospectionType,
  OperationTypeNode
} from 'graphql'
import { buildClientSchema, getIntrospectionQuery, Kind } from 'graphql'
import { isEqual, keyBy } from 'lodash'
import create from 'zustand'

import type { WorkbenchContextType } from '@/lib/context/workbenchContext'
import requests, { getAuthKey } from '@/lib/fetchers'
import { intl } from '@/providers/IntlProvider'

import { parseSchemaAST } from './components/GraphiQL/utils'

const DEFAULT_QUERY = `# Generate operation by click graphql schema on the left panel`

export interface APIDesc {
  // content: string
  enable: boolean
  id: number
  isDir: boolean
  isPublic: boolean
  inlegal: boolean
  method: string
  operationType: string
  path: string
  remark: string
  createTime: string
  updateTime: string
  restUrl: string
  liveQuery: boolean
  setting: {
    enable: boolean
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
  schemaTypeMap: Record<string, IntrospectionType>
  query: string
  editorQuery: string
  lastSavedQuery: string | undefined
  setQuery: (v: string, fromEditor?: boolean) => void
  clearHistoryFlag: boolean // 通知编辑器需要清空历史记录，用于切换api时清除旧api的内容
  schemaAST: DocumentNode | undefined
  _workbenchContext: WorkbenchContextType | undefined
  computed: {
    operationType: Readonly<OperationTypeNode | undefined>
    saved: boolean
  }
  pureUpdateAPI: (newAPI: Partial<APIDesc>) => void

  changeEnable: (enable: boolean) => void
  autoSave: () => boolean | Promise<boolean>
  updateAPI: (newAPI: Partial<APIDesc>) => Promise<void>
  updateAPIName: (path: string) => Promise<void>
  updateContent: (content: string, showMessage?: boolean) => boolean | Promise<boolean>
  refreshAPI: (keepCurrentQuery?: boolean) => void
  refreshAPISetting: () => void
  refreshSchema: () => void
  appendToAPIRefresh: (fn: () => void) => void
  dispendToAPIRefresh: (fn: () => void) => void
  setWorkbenchContext: (ctx: WorkbenchContextType) => void
  engineStartCallback: () => void
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

let engineStartPromiseResolve: Function
const engineStartPromise = new Promise(resolve => {
  engineStartPromiseResolve = resolve
})

export const useAPIManager = create<APIState>((set, get) => ({
  engineStartCallback: () => {
    engineStartPromiseResolve?.()
  },
  apiDesc: undefined,
  query: DEFAULT_QUERY,
  editorQuery: DEFAULT_QUERY,
  lastSavedQuery: undefined,
  apiID: '',
  setID: async (id: string) => {
    set({ apiID: id })
    await get().refreshAPI(false)
    refreshFns.forEach(fn => fn())
  },
  setQuery(query, fromEditor = false) {
    if (!fromEditor || !query) {
      if (query) {
        // 为了防止和上次设置编辑器的内容一致导致不触发，所以在末尾加一个空格或移除末尾空格
        if (get().editorQuery === query) {
          if (query.endsWith(' ')) {
            set({ editorQuery: get().editorQuery.slice(0, -1) })
          } else {
            set({ editorQuery: get().editorQuery + ' ' })
          }
        } else {
          set({ editorQuery: query })
        }
      } else {
        if (get().editorQuery === DEFAULT_QUERY) {
          console.error(3)
          set({ editorQuery: DEFAULT_QUERY + ' ' })
        } else {
          console.error(4)
          set({ editorQuery: DEFAULT_QUERY })
        }
      }
    }
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
  clearHistoryFlag: false,
  originSchema: undefined,
  schema: undefined,
  schemaAST: undefined,
  schemaTypeMap: {},
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
  changeEnable: (enable: boolean) => {
    return requests.put(`/operateApi/switch/${get().apiID}`, { enable }).then(resp => {
      get().pureUpdateAPI({ enable })
      // 刷新api列表
      get()._workbenchContext?.onRefreshMenu('api')
    })
  },
  updateAPIName: path => {
    return requests.put(`/operateApi/rename/${get().apiID}`, { path }).then(resp => {
      get().pureUpdateAPI({
        path,
        restUrl: get().apiDesc!.restUrl.replace(/(\/app\/main\/operations)\/.*$/, `$1${path}`)
      })
      // 刷新api列表
      get()._workbenchContext?.onRefreshMenu('api')
    })
  },
  updateContent: (content: string, showMessage = true) => {
    const schemaAST = get().schemaAST
    // content 校验
    if (!content || !schemaAST) {
      if (showMessage) {
        message.error(intl.formatMessage({ defaultMessage: '请输入合法的 GraphQL 查询语句' }))
      }
      return false
    }
    if (schemaAST.definitions.length > 1) {
      if (showMessage) {
        message.error(intl.formatMessage({ defaultMessage: '不支持多条查询语句' }))
      }
      return false
    }
    return requests.put(`/operateApi/content/${get().apiID}`, { content }).then(async resp => {
      if (resp) {
        const query = content ?? ''
        // 2022-12-16 此时的query可能已经与当前编辑器内容不一致，进行set会覆盖编辑器内容并导致光标重置
        // get().setQuery(query)
        set({ lastSavedQuery: query })
        // @ts-ignore
        // set(state => ({ apiDesc: { ...state.apiDesc, content: query } }))
        // 内容变更可能需要刷新api列表
        get()._workbenchContext?.onRefreshMenu('api')
        // await new Promise(resolve => setTimeout(resolve, 5000))
        requests.get(`/operateApi/${get().apiID}`).then(api => {
          // @ts-ignore
          set({ apiDesc: { ...api, setting: get().apiDesc?.setting } })
        })
        return true
      }
      return false
    })
  },
  autoSave() {
    /**
     * 2023-02-07 将editorQuery改为query，以解决保存的query不是最新内容的bug
     *            需要注意区分editorQuery和query的区别，后者是最新的query内容，前者只有强制刷新编辑器时才会变更
     */
    return get().updateContent(get().query, false)
  },
  /**
   * 刷新api
   * @param keepCurrentQuery 是否保持编辑器内容不变，默认为true
   */
  refreshAPI: async (keepCurrentQuery = true) => {
    const id = get().apiID
    try {
      const [api, setting] = await Promise.all([
        requests.get(`/operateApi/${id}`),
        requests.get(`/operateApi/setting/${id}`, { params: { settingType: 1 } })
      ])
      // @ts-ignore
      set({ apiDesc: { ...api, setting } })

      // 如果不需要保留query，则更新编辑器内容
      if (!keepCurrentQuery) {
        // @ts-ignore
        const content = api.content
        get().setQuery(content)
        set({ clearHistoryFlag: !get().clearHistoryFlag })
        set({ lastSavedQuery: content })
      }
    } catch (e) {
      // 接口请求错误就刷新api列表
      get()._workbenchContext?.onRefreshMenu('api')
    }
  },
  refreshAPISetting: async () => {
    const id = get().apiID
    const setting = await requests.get(`/operateApi/setting/${id}`, { params: { settingType: 1 } })
    // @ts-ignore
    set({ apiDesc: { ...get().apiDesc, setting } })
  },
  refreshSchema: async () => {
    await engineStartPromise
    return fetch('/app/main/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-FB-Authentication': getAuthKey() || ''
      },
      body: JSON.stringify({ query: getIntrospectionQuery() })
    })
      .then(resp => resp.json())
      .then(res => {
        const newOriginSchema = res.data as IntrospectionQuery
        if (!isEqual(get().originSchema, newOriginSchema)) {
          console.log('schema changed')
          const newSchema = buildClientSchema(newOriginSchema)
          set({
            originSchema: newOriginSchema,
            schema: newSchema,
            schemaTypeMap: keyBy(newOriginSchema.__schema.types, 'name')
          })
        }
      })
      .catch(() => {
        // set({
        //   originSchema: undefined,
        //   schema: undefined,
        //   schemaAST: undefined
        // })
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
