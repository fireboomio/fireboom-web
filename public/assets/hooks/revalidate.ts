import { User } from 'generated/wundergraph.server'

import { AuthenticationResponse } from 'generated/wundergraph.hooks'

export default async function revalidate(user:User): Promise<AuthenticationResponse> {
  return
}