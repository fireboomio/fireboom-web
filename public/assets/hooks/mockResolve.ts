import { Context } from '@wundergraph/sdk'
import { User } from 'generated/wundergraph.server'
import { InternalClient } from 'generated/wundergraph.internal.client'
import { $HOOK_NAME$Response } from 'generated/models'

export default async function mockResolve(ctx: Context<User, InternalClient>)
  : Promise<$HOOK_NAME$Response> {
  return
}