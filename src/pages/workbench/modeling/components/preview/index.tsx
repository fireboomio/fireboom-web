import { AppleOutlined } from '@ant-design/icons'
import { ApolloProvider } from '@apollo/client'
import { Breadcrumb, Empty, message } from 'antd'

import PrismaTable from '@/components/PrismaTable'
import type { FilterState } from '@/components/PrismaTable/libs/types'
import type { Model } from '@/interfaces/modeling'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useEntities from '@/lib/hooks/useEntities'
import useGraphqlClient from '@/lib/hooks/useGraphqlClient'
import usePreviewFilters from '@/lib/hooks/usePreviewFilters'

const PreviewContainer = () => {
  const { entities } = useEntities()
  const { currentEntity, changeToEntityById } = useCurrentEntity()
  const { previewFilters: initialFilters, updatePreviewFilters } = usePreviewFilters()
  const { graphqlClient } = useGraphqlClient()

  if (!currentEntity || !graphqlClient) {
    return <Empty className="pt-20" description="无可用实体！" />
  }
  const currentModel = currentEntity as Model

  const redirectToEntityWithFilters = (entityName: string, filters: FilterState[]) => {
    const relationEntityId = entities.find(e => e.name === entityName)?.id
    if (!relationEntityId) {
      void message.error(`无法找到对应实体[${entityName}]`)
      return
    }
    updatePreviewFilters(filters)
    changeToEntityById(relationEntityId)
  }

  return (
    <div className="p-6 h-screen">
      <div className="flex justify-start items-center mb-6">
        <span className="flex-grow text-lg font-medium">
          {'查看'} / {currentModel.name}
        </span>
        <AppleOutlined className="text-base mr-3" />
        <AppleOutlined className="text-base mr-3" />
        <AppleOutlined className="text-base" />
      </div>

      <div className="flex justify-start items-center my-6">
        <Breadcrumb className="text-base flex-grow" separator=" ">
          <Breadcrumb.Item>{currentModel.name}</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[#118AD1]">{currentModel.type}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <ApolloProvider client={graphqlClient}>
        <PrismaTable
          model={currentModel.name}
          namespace={''}
          redirectToEntityWithFilters={redirectToEntityWithFilters}
          updateInitialFilters={updatePreviewFilters}
          initialFilters={initialFilters}
        />
      </ApolloProvider>
    </div>
  )
}

export default PreviewContainer
