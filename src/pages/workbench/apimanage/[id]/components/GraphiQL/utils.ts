import type { DocumentNode } from 'graphql'
import { parse, print } from 'graphql'

export function parseSchemaAST(query: string) {
  return parse(query)
}

export function printSchemaAST(node: DocumentNode) {
  return print(node)
}
