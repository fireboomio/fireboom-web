import type { ArgumentT } from '@/interfaces/apimanage'

import { isEmpty } from '../utils'
import { parseParameters, parseRbac } from './parameter'
import parseGql from './request'

const makePayload = (name: string, args: ArgumentT[]): string => {
  return isEmpty(args) ? `@${name}` : `@${name}(${args.map(x => x.rendered).join('\n')})`
}

export { makePayload, parseGql, parseParameters, parseRbac }
