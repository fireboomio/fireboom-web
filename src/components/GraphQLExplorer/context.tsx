import { DocumentNode, GraphQLSchema, OperationTypeNode } from "graphql"
import { createContext, useContext } from "react"

type GraphQLExplorerState = {
  queryAST: DocumentNode
  schema: GraphQLSchema
  fieldTypeMap: Record<string, OperationTypeNode>
  updateAST: () => void
}

// @ts-ignore
export const GraphQLExplorerContext = createContext<GraphQLExplorerState>(null)

export const useExplorer = () => {
  return useContext<GraphQLExplorerState>(GraphQLExplorerContext)
}