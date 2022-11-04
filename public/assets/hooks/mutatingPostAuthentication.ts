import { User } from 'generated/wundergraph.server'

import { AuthenticationResponse } from 'generated/wundergraph.hooks'

export default async function postAuthentication(user:User): Promise<AuthenticationResponse> {
  return {
    status: 'ok',
    user
  }
}