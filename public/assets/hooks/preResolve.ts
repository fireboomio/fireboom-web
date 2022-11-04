import { Context } from '@wundergraph/sdk'
import { User } from 'generated/wundergraph.server'
import { InternalClient } from 'generated/wundergraph.internal.client'

export default async function preResolve(ctx: Context<User, InternalClient>)
  : Promise<void> {
  return
}