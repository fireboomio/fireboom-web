import { Context } from '@wundergraph/sdk'
import { User } from 'generated/wundergraph.server'
import { InternalClient } from 'generated/wundergraph.internal.client'
import { $HOOK_NAME$Response } from 'generated/models'

export default async function postResolve(ctx: Context<User, InternalClient>
  , response: $HOOK_NAME$Response)
  : Promise<void> {
  return
}