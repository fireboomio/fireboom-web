import {  DocumentNode, parse, print } from 'graphql'

export function parseSchemaAST(query: string) {
  return parse(query, { noLocation: true })
}

export function printSchemaAST(node: DocumentNode) {
  return print(node)
}