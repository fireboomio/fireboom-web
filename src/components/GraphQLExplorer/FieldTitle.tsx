import { LeftOutlined } from '@ant-design/icons'

import { AddOutlined, CheckedFilled } from './Icons'
import { useGraphQLExplorer } from './provider'
import SelectableIcon from './SelectableIcon'

interface FieldTitleProps {
  title: string
  type?: string
  isArray?: boolean
  selected: boolean
}

// TODO 递归选择所有未选择的 Field
const FieldTitle = ({ title, type, isArray, selected }: FieldTitleProps) => {
  const { graphqlObjectStack, setGraphQLObjectStack: setGraphqlObjectStack } = useGraphQLExplorer()
  function navigateBack() {
    const clone = graphqlObjectStack.slice()
    clone.pop()
    setGraphqlObjectStack(clone)
  }
  return (
    <div className="flex items-center">
      <LeftOutlined className="h-6 mr-2" onClick={navigateBack} />
      <span className="font-bold break-all">
        {title}
        {type && (
          <>
            :<span className="ml-1">{isArray ? `[${type}]` : type}</span>{' '}
          </>
        )}
      </span>
      <SelectableIcon className='ml-2'/>
    </div>
  )
}

export default FieldTitle
