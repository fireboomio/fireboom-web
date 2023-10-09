import { GraphQLObjectType } from "graphql"
import Fields from "./Fields"
import FieldsTitle from "./FieldsTitle"
import FieldTitle from "./FieldTitle"

interface GraphQLObjectPanelProps {
  obj: GraphQLObjectType<any, any>
}

const GraphQLObjectPanel = ({ obj }: GraphQLObjectPanelProps) => {
  obj.getFields()
  return <div className="flex flex-1 flex-col">
    <FieldTitle title={obj.name} selected />
    <FieldsTitle />
    <Fields fields={obj.getFields()} />
  </div>
}

export default GraphQLObjectPanel
