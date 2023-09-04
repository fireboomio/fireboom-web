import { loader } from '@monaco-editor/react'
import { Descriptions } from 'antd'
import { useContext } from 'react'
import { useIntl } from 'react-intl'
import useSWRImmutable from 'swr/immutable'

import Error50x from '@/components/ErrorPage/50x'
import { ConfigContext } from '@/lib/context/ConfigContext'
import requests from '@/lib/fetchers'
import { useConfigurationVariable } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'

loader.config({ paths: { vs: import.meta.env.BASE_URL + 'modules/monaco-editor/min/vs' } })

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
  const { globalSetting } = useContext(ConfigContext)

  const { getConfigurationValue } = useConfigurationVariable()
  const enabledServer = useSWRImmutable<ApiDocuments.Sdk>('/sdk/enabledServer', requests)

  if (!content) {
    return <Error50x />
  }

  const endpoint = `${getConfigurationValue(globalSetting.serverOptions.serverUrl)}/gqls/${
    content.name
  }/graphql`

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
              <span>{intl.formatMessage({ defaultMessage: 'GraphQL 端点' })}</span>
            </div>
          }
          className="justify-start"
        >
          <a href={endpoint} target="_blank" rel="noreferrer">
            {endpoint}
          </a>
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <div>
              <span>{intl.formatMessage({ defaultMessage: 'Schema 文件' })}</span>
            </div>
          }
          className="justify-start"
        >
          <a
            href={`/api/vscode/readFile?uri=${enabledServer.data?.outputPath}/customize/${content.name}.json`}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="mr-1"
              alt="wenjian1"
              src={`${import.meta.env.BASE_URL}assets/iconfont/wenjian1.svg`}
              style={{ height: '1em', width: '1em' }}
            />
            customize/{content.name}.json
          </a>
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}
