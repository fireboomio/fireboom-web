import { Drawer } from 'antd'
import { useRef } from 'react'

import IdeContainer from '@/components/Ide'

import { useAPIManager } from '../../store'
import backArrow from './assets/back-arrow.svg'
import styles from './editPanel.module.less'

const defaults: Record<string, string | undefined> = {
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

interface Props {
  onClose: () => void
  hook: { name: string; path: string }
}
export default function EditPanel({ onClose, hook }: Props) {
  const apiContainerRef = useRef<HTMLDivElement>(document.querySelector('#api-editor-container'))
  const { refreshAPI } = useAPIManager()
  return apiContainerRef.current ? (
    <Drawer
      className={styles.drawer}
      width="100%"
      placement="right"
      onClose={onClose}
      open
      getContainer={() => apiContainerRef.current!}
      style={{ position: 'absolute' }}
      extra={
        <div className="flex items-center">
          <div className={styles.back} onClick={onClose}>
            <img src={backArrow} alt="返回" className="mr-1" />
            返回文件
          </div>
          <div className={styles.split} />
          <div className={styles.title}>{hook.path.split('/').pop()}</div>
        </div>
      }
    >
      <IdeContainer
        onChange={refreshAPI}
        hookPath={hook.path}
        defaultCode={defaults[hook.name] || ''}
        defaultLanguage="typescript"
      />
    </Drawer>
  ) : null
}
