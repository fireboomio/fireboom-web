import { ApolloProvider } from '@apollo/client'
import { Empty, message } from 'antd'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'

import PrismaTable from '@/components/PrismaTable'
import type { FilterState } from '@/components/PrismaTable/libs/types'
import type { Model } from '@/interfaces/modeling'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useEntities from '@/lib/hooks/useEntities'
import useGraphqlClient from '@/lib/hooks/useGraphqlClient'
import usePreviewFilters from '@/lib/hooks/usePreviewFilters'

const PreviewContainer = () => {
  const intl = useIntl()
  const { name } = useParams()
  const { entities } = useEntities()
  const { currentEntity, changeToEntityById } = useCurrentEntity()
  const { previewFilters: initialFilters, updatePreviewFilters } = usePreviewFilters()
  const { graphqlClient } = useGraphqlClient()

  if (!currentEntity || !graphqlClient) {
    return (
      <Empty
        className="pt-20"
        description={intl.formatMessage({ defaultMessage: '无可用实体！' })}
      />
    )
  }
  const currentModel = currentEntity as Model

  const redirectToEntityWithFilters = (entityName: string, filters: FilterState[]) => {
    const relationEntityId = entities.find(e => e.name === entityName)?.id
    if (!relationEntityId) {
      void message.error(
        intl.formatMessage({ defaultMessage: '无法找到对应实体[{entityName}]' }, { entityName })
      )
      return
    }
    updatePreviewFilters(filters)
    changeToEntityById(relationEntityId)
  }

  return (
    <div className="h-full flex flex-col">
      <ApolloProvider client={graphqlClient}>
        <PrismaTable
          model={currentModel.name}
          namespace={name!}
          redirectToEntityWithFilters={redirectToEntityWithFilters}
          updateInitialFilters={updatePreviewFilters}
          initialFilters={initialFilters}
        />
      </ApolloProvider>
    </div>
  )
}

export default PreviewContainer
