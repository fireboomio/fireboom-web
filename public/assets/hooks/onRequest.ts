import { WunderGraphRequest, WunderGraphRequestContext } from '@wundergraph/sdk'
import { User } from 'generated/wundergraph.server'
import { CANCEL, SKIP } from 'generated/wundergraph.hooks'

export default async function onRequest(
  ctx: WunderGraphRequestContext<User>,
  request: WunderGraphRequest)
  : Promise<WunderGraphRequest | SKIP | CANCEL | void> {
  return
}
