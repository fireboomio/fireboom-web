import { message } from 'antd'
import type { DocumentNode, GraphQLSchema, IntrospectionQuery, OperationTypeNode } from 'graphql'
import { buildClientSchema, getIntrospectionQuery, Kind } from 'graphql'
import { isEqual } from 'lodash'
import create from 'zustand'

import type { WorkbenchContextType } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import { parseSchemaAST } from './components/GraphiQL/utils'

const DEFAULT_QUERY = `# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that start
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#  Prettify Query:  Shift-Ctrl-P (or press the prettify button above)
#
#     Merge Query:  Shift-Ctrl-M (or press the merge button above)
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
`

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
  setID: (id: string) => void
  apiDesc?: APIDesc
  schema: GraphQLSchema | undefined
  query: string
  lastSavedQuery: string
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
  updateAPIName: (id: number, path: string) => Promise<void>
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
  lastSavedQuery: '',
  apiID: '',
  setID: async (id: string) => {
    set({ apiID: id })
    await get().refreshAPI()
    refreshFns.forEach(fn => fn())
    // 第一次加载
    if (!get().schema) {
      // 获取 graphql 集合
      fetch('/app/main/graphql', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: getIntrospectionQuery() })
      })
        .then(resp => resp.json())
        .then(res => {
          set({ schema: buildClientSchema(res.data as IntrospectionQuery) })
        })
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
      return !get().lastSavedQuery || get().lastSavedQuery === get().query
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
  updateAPIName: (id, path) => {
    return requests.put(`/operateApi/rename/${get().apiID}`, { path }).then(resp => {
      get().pureUpdateAPI({ path })
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
    fetch('/app/main/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: getIntrospectionQuery() })
    })
      .then(resp => resp.json())
      .then(res => {
        const newSchema = buildClientSchema(res.data as IntrospectionQuery)
        if (!isEqual(get().schema, newSchema)) {
          console.log('schema changed')
          set({ schema: newSchema })
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
