import { ArgumentT } from '@/interfaces/apimanage'

import { isEmpty } from '../utils'
import { parseParameters } from './parameter'
import parseReq from './request'

const makePayload = (name: string, args: ArgumentT[]): string => {
  return isEmpty(args) ? `@${name}` : `@${name}(${args.map((x) => x.rendered).join('\n')})`
}

export { parseReq, parseParameters, makePayload }
