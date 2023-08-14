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
import { mutate } from 'swr'
import create from 'zustand'

import { mutateApi } from '@/hooks/store/api'
import type { WorkbenchContextType } from '@/lib/context/workbenchContext'
import requests, { getAuthKey } from '@/lib/fetchers'
import { intl } from '@/providers/IntlProvider'
import type { ApiDocuments } from '@/services/a2s.namespace'

import { parseSchemaAST } from './components/GraphiQL/utils'

const DEFAULT_QUERY = `# Generate operation by click graphql schema on the left panel`

export interface APIState {
  apiPath: string
  setAPIPath: (path: string) => Promise<void>
  apiDesc?: ApiDocuments.Operation
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
  subscriptionController: AbortController | undefined
  computed: {
    operationType: Readonly<OperationTypeNode | undefined>
    saved: boolean
  }
  pureUpdateAPI: (newAPI: Partial<ApiDocuments.Operation>) => void

  changeEnable: (enabled: boolean) => void
  autoSave: () => boolean | Promise<boolean>
  updateAPI: (newAPI: Partial<ApiDocuments.Operation>) => Promise<void>
  updateAPIName: (path: string) => Promise<void>
  updateContent: (content: string, showMessage?: boolean) => boolean | Promise<boolean>
  refreshAPI: (keepCurrentQuery?: boolean) => void
  refreshSchema: () => void
  appendToAPIRefresh: (fn: () => void) => void
  dispendToAPIRefresh: (fn: () => void) => void
  setWorkbenchContext: (ctx: WorkbenchContextType) => void
  engineStartCallback: () => void
  abortSubscription: () => void
  saveSubscriptionController: (controller: AbortController) => void
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
  apiPath: '',
  setAPIPath: async (path: string) => {
    set({ apiPath: path })
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
  subscriptionController: undefined,
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
  abortSubscription: () => {
    get().subscriptionController?.abort()
    set({ subscriptionController: undefined })
  },
  saveSubscriptionController: (controller: AbortController) => {
    set({ subscriptionController: controller })
  },
  pureUpdateAPI: (newAPI: Partial<ApiDocuments.Operation>) => {
    // @ts-ignore
    set(state => ({ apiDesc: { ...state.apiDesc, ...newAPI } }))
  },
  updateAPI: (newAPI: Partial<ApiDocuments.Operation>) => {
    return requests.put(`/operation/${get().apiPath}`, newAPI).then(resp => {
      get().pureUpdateAPI(newAPI)
      // 刷新api列表
      void mutateApi()
    })
  },
  changeEnable: (enabled: boolean) => {
    return requests.put(`/operation`, { path: get().apiPath, enabled }).then(resp => {
      get().pureUpdateAPI({ enabled })
      // 刷新api列表
      void mutateApi()
    })
  },
  updateAPIName: path => {
    return requests
      .post(`/operation/rename`, { src: get().apiPath, dst: path, overload: false })
      .then(() => {
        get().pureUpdateAPI({
          path,
          restUrl: get().apiDesc!.restUrl.replace(/(\/app\/main\/operations)\/.*$/, `$1${path}`)
        })
        // 刷新api列表
        void mutateApi()
        void mutate(`/operation/${get().apiPath}`)
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
    if (content.trim() === get().lastSavedQuery?.trim()) {
      return true
    }
    return requests
      .post(`/operation/graphql/${get().apiPath}`, content)
      .then(async () => {
        const query = content ?? ''
        // 2022-12-16 此时的query可能已经与当前编辑器内容不一致，进行set会覆盖编辑器内容并导致光标重置
        get().setQuery(query)
        set({ lastSavedQuery: query })
        // @ts-ignore
        set(state => ({ apiDesc: { ...state.apiDesc, content: query } }))
        // 内容变更可能需要刷新api列表
        void mutateApi()
        return true
      })
      .catch(() => false)
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
    const path = get().apiPath
    try {
      const apiDesc = await requests.get<any, ApiDocuments.Operation>(`/operation/${path}`)
      set({ apiDesc })

      // 如果不需要保留query，则更新编辑器内容
      if (!keepCurrentQuery) {
        const resp = await requests.get<any, string>(`/operation/graphql/${get().apiPath}`)
        get().setQuery(resp ?? '')
        set({ clearHistoryFlag: !get().clearHistoryFlag })
        set({ lastSavedQuery: resp })
      }
    } catch (e) {
      // 接口请求错误就刷新api列表
      void mutateApi()
    }
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
