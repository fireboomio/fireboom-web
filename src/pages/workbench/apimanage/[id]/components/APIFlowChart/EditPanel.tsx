import { Drawer } from 'antd'

import IdeContainer from '@/components/Ide'
import { useAPIManager } from '@/pages/workbench/apimanage/[id]/hooks'

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

interface Props {
  onClose: () => void
  hookPath: string
}
export default function EditPanel({ onClose, hookPath }: Props) {
  const { apiContainerRef } = useAPIManager()
  console.log(hookPath)
  return apiContainerRef ? (
    <Drawer
      width="100%"
      placement="right"
      onClose={onClose}
      open
      getContainer={() => apiContainerRef}
      style={{ position: 'absolute' }}
    >
      <IdeContainer hookPath={hookPath} defaultLanguage="typescript" />
    </Drawer>
  ) : null
}
