import { ExclamationCircleOutlined } from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import { Switch } from 'antd'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'

import RcTab from '@/components/rc-tab'
import type { DirTreeNode, HookName, HookResp } from '@/interfaces/apimanage'
import requests, { getFetcher } from '@/lib/fetchers'
import { isEmpty } from '@/lib/utils'

import styles from './Hook.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

type HookProps = { node?: DirTreeNode }

interface TabT {
  key: HookName
  title: HookName
}

const defaults = {
  preResolve: `// import type { User } from "../../../wundergraph/.wundergraph/generated/wundergraph.server"
// import type { InternalClient } from "../../../wundergraph/.wundergraph/generated/wundergraph.internal.client"
// import type { Context } from "@wundergraph/sdk"

// export default preResolveHook(ctx: Context<User, InternalClient>) {
//     console.log('hello')
//     return
// }`,
  postResolve: `// import type { User } from "../../../wundergraph/.wundergraph/generated/wundergraph.server"
// import type { InternalClient } from "../../../wundergraph/.wundergraph/generated/wundergraph.internal.client"
// import type { Context } from "@wundergraph/sdk"

// export default postResolveHook(ctx: Context<User, InternalClient>) {
//     console.log('hello')
//     return
// }`,
  customResolve: `// import type { User } from "../../../wundergraph/.wundergraph/generated/wundergraph.server"
// import type { InternalClient } from "../../../wundergraph/.wundergraph/generated/wundergraph.internal.client"
// import type { Context } from "@wundergraph/sdk"

// export default customResolveHook(ctx: Context<User, InternalClient>) {
//     console.log('hello')
//     return
// }`,
  mutatingPreResolve: `// import type { User } from "../../../wundergraph/.wundergraph/generated/wundergraph.server"
// import type { InternalClient } from "../../../wundergraph/.wundergraph/generated/wundergraph.internal.client"
// import type { Context } from "@wundergraph/sdk"

// export default mutatingPreResolveHook(ctx: Context<User, InternalClient>) {
//     console.log('hello')
//     return
// }`,
  mutatingPostResolve: `// import type { User } from "../../../wundergraph/.wundergraph/generated/wundergraph.server"
// import type { InternalClient } from "../../../wundergraph/.wundergraph/generated/wundergraph.internal.client"
// import type { Context } from "@wundergraph/sdk"

// export default mutatingPostResolveHook(ctx: Context<User, InternalClient>) {
//     console.log('hello')
//     return
// }`,
  onRequest: `// import type {WunderGraphRequest,WunderGraphResponse, WunderGraphRequestContext} from "../../../wundergraph/node_modules/@wundergraph/sdk";
// import type {User} from "../../../wundergraph/.wundergraph/generated/wundergraph.server";

// export default async function (ctx: WunderGraphRequestContext<User>, request: WunderGraphRequest) {
//   console.log('onOriginRequest', request.headers)
//   return request
// }`,
  onResponse: `// import type {WunderGraphRequest,WunderGraphResponse, WunderGraphRequestContext} from "../../../wundergraph/node_modules/@wundergraph/sdk";
// import type {User} from "../../../wundergraph/.wundergraph/generated/wundergraph.server";

// export default async function (ctx: WunderGraphRequestContext<User>, request: WunderGraphResponse) {
//   console.log('onOriginRequest', request.headers)
//   return request
// }`
}

const Hook: FC<HookProps> = ({ node }) => {
  const [activeKey, setActiveKey] = useState<HookName>(node?.id === 0 ? 'onRequest' : 'preResolve')
  const [hooks, setHooks] = useImmer<HookResp[]>([])
  const [tabs, setTabs] = useState<TabT[]>([])
  const [refreshFlag, setRefreshFlag] = useState<boolean>()

  useEffect(() => {
    if (!node) return
    const url = node.id === 0 ? '/operateApi/hooks' : `/operateApi/hooks/${node.id}`
    getFetcher<HookResp[]>(url)
      .then(res => setHooks(res))
      .catch((err: Error) => {
        throw err
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, refreshFlag])

  useEffect(() => {
    if (!hooks) return
    setTabs(hooks.map(x => ({ key: x.hookName, title: x.hookName })))
  }, [hooks])

  useEffect(() => {
    if (isEmpty(tabs)) return
    if (activeKey) return
    setActiveKey(tabs[0].key)
  }, [activeKey, tabs])

  const currHook = useMemo(() => hooks?.find(x => x.hookName === activeKey), [activeKey, hooks])

  const save = () => {
    if (!node) return
    const url = node.id === 0 ? '/operateApi/hooks' : `/operateApi/hooks/${node.id}`
    void requests.put(url, {
      hookName: activeKey,
      content: currHook?.content,
      hookSwitch: currHook?.hookSwitch
    })
    setRefreshFlag(!refreshFlag)
  }

  function handleEditorChange(value: string | undefined) {
    if (!value) return

    setHooks(draft => {
      let hook = draft.find(x => x.hookName === activeKey)
      if (!hook) hook = { content: '', fileName: '', hookName: activeKey, hookSwitch: false }
      hook.content = value
    })
  }

  function toggleSwitch() {
    if (!node) return
    const url = node.id === 0 ? '/operateApi/hooks' : `/operateApi/hooks/${node.id}`
    void requests.put(url, {
      hookName: activeKey,
      hookSwitch: !currHook?.hookSwitch,
      content: currHook?.content
    })
    setRefreshFlag(!refreshFlag)
  }

  return (
    <div>
      {/* @ts-ignore */}
      <RcTab tabs={tabs} onTabClick={setActiveKey} activeKey={activeKey} />

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <div className="text-[#00000040] flex items-center">
            <ExclamationCircleOutlined />
            <span className="text-12px leading-17px ml-2">主要用于日志等副作用操作</span>
          </div>
          <div className="space-x-4 flex items-center">
            {/* <div className="text-[#E92E5E]">
              <CaretRightOutlined />
              <span className="leading-20px ml-1">测试</span>
            </div>
            <div className="text-[#E92E5E]">
              <PlusCircleOutlined />
              <span className="leading-20px ml-1">添加</span>
            </div>
            <div className="text-[#E92E5E]">
              <MenuOutlined />
              <span className="leading-20px ml-1">管理</span>
            </div> */}
            <div className="text-[#E92E5E] cursor-pointer" onClick={save}>
              <span className="leading-20px ml-1">保存</span>
            </div>
            <Switch onClick={toggleSwitch} checked={currHook?.hookSwitch} />
          </div>
        </div>

        <Editor
          height="90vh"
          defaultLanguage="typescript"
          defaultValue={defaults[activeKey]}
          value={currHook?.content || defaults[activeKey]}
          onChange={value => handleEditorChange(value)}
          className={`mt-4 ${styles.monaco}`}
        />
      </div>
    </div>
  )
}

export default Hook
