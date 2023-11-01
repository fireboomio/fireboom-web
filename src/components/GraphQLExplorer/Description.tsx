import { FormattedMessage } from 'react-intl'
import { parseDescription } from './utils'

interface DescriptionProps {
  description?: string
}

const Description = ({ description }: DescriptionProps) => {
  if (!description) return null
  const { datasource, description: desc, originName } = parseDescription(description)
  return (
    <div className="flex flex-col mt-2 text-sm text-dark-400">
      {datasource && (
        <span>
          <FormattedMessage key="ds" defaultMessage="数据源: {ds}" values={{ ds: datasource }} />
        </span>
      )}
      {originName && (
        <span>
          <FormattedMessage
            key="name"
            defaultMessage="原始字段: {originName}"
            values={{ originName }}
          />
        </span>
      )}
      <span>{desc}</span>
    </div>
  )
}

export default Description
