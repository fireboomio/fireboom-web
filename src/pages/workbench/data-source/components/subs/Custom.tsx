import { loader } from '@monaco-editor/react'
import { Descriptions } from 'antd'
import { useIntl } from 'react-intl'

import Error50x from '@/components/ErrorPage/50x'
import type { ApiDocuments } from '@/services/a2s.namespace'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export interface Config {
  apiNamespace: string
  schema: string
  serverName: string
}

interface Props {
  content: ApiDocuments.Datasource
}

export default function Custom({ content }: Props) {
  const intl = useIntl()

  if (!content) {
    return <Error50x />
  }

  return (
    <div className="flex mb-8 justify-center">
      <Descriptions bordered column={1} size="small" labelStyle={{ width: 190 }}>
        <Descriptions.Item
          label={
            <div>
              <span>{intl.formatMessage({ defaultMessage: '名称' })}</span>
            </div>
          }
          className="justify-start"
        >
          {content.name}
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <div>
              <span>{intl.formatMessage({ defaultMessage: 'Graphql 端点' })}</span>
            </div>
          }
          className="justify-start"
        >
          {content.customGraphql.endpoint}
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}
