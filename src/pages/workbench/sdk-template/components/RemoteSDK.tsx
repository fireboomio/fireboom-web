
import Error50x from '@/components/ErrorPage/50x'
import requests from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import { intl } from '@/providers/IntlProvider'
import { useFireboomFileContent, useFireboomRepositoryUrl } from '@/providers/ServiceDiscovery'
import { useDict } from '@/providers/dict'
import { ApiDocuments } from '@/services/a2s.namespace'
import { Button, Card, Col, Descriptions, Modal, Row, Spin, message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { mutate } from 'swr'
import base64 from 'base64-js'

import styles from './index.module.less'

export interface RemoteSDKActions {
  show: () => void
}

interface RemoteSDKProps {
  sdks: ApiDocuments.Sdk[]
  onUpdate: () => void
  actionRef: React.MutableRefObject<RemoteSDKActions | undefined>
}

const RemoteSDK = ({ sdks, onUpdate, actionRef }: RemoteSDKProps) => {
  const { getRepositoryUrl } = useFireboomRepositoryUrl()
  const { initialize } = useDict()
  const [showRemote, setShowRemote] = useState(false)

  const {
    data: remoteSDKs,
    isValidating,
    error,
    mutate: mutateRemote
  } = useFireboomFileContent<{
    official: ApiDocuments.Sdk[]
    community: ApiDocuments.Sdk[]
  }>('sdks.json')
  const { remoteServer, remoteClient } = useMemo(() => {
    const server: ApiDocuments.Sdk[] = []
    const client: ApiDocuments.Sdk[] = []
    if (remoteSDKs?.official) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      remoteSDKs.official.forEach(x => {
        if (x.type === 'server') {
          server.push(x)
        } else {
          client.push(x)
        }
      })
    }
    return { remoteServer: server, remoteClient: client }
  }, [remoteSDKs])

  const existSdkMap = useMemo(() => {
    return new Set(sdks?.map(x => x.dirName) ?? [])
  }, [sdks])
  const { loading, fun: downloadSdk } = useLock(
    async sdk => {
      const gitUrl = getRepositoryUrl(sdk.gitUrl)
      const hide = message.loading(intl.formatMessage({ defaultMessage: '下载' }), -1)
      try {
        await requests.post('/sdk', { ...sdk, gitUrl })
        onUpdate()
        initialize()
        mutate('/sdk/enabledServer')
        message.success(intl.formatMessage({ defaultMessage: '下载成功' }))
      } catch (e) {
        message.error(intl.formatMessage({ defaultMessage: '下载失败' }))
      }
      hide()
    },
    [mutate]
  )

  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        show: () => {
          setShowRemote(true)
          mutateRemote()
        }
      }
    }
  }, [actionRef, mutateRemote])

  return (
    <Modal
      width="80vw"
      footer={null}
      open={showRemote}
      onCancel={() => setShowRemote(false)}
      title={
        <div className="text-center">{intl.formatMessage({ defaultMessage: '模版市场' })}</div>
      }
      styles={{ body: { minHeight: '60vh' } }}
    >
      {isValidating ? (
        <div className="flex h-40vh w-full items-center justify-center">
          <Spin tip="Loading" size="large" />
        </div>
      ) : null}
      {!isValidating && error ? (
        <div className="flex flex-col h-40vh w-full items-center justify-center">
          <Error50x />
          <Button
            onClick={() => {
              void mutateRemote()
            }}
          >
            {intl.formatMessage({ defaultMessage: '重试' })}
          </Button>
        </div>
      ) : null}

      {!isValidating && !error && (
        <div>
          <div className="text-xs  mb-4 text-[#666]">
            <FormattedMessage defaultMessage="钩子模版" />
          </div>
          <Row className="" gutter={[32, 32]}>
            {remoteServer?.map((sdk, index) => (
              <Col key={index} xl={8} xxl={6} md={12}>
                <RemoteSDKCard
                  exist={existSdkMap.has(sdk.name)}
                  sdk={sdk}
                  onSelect={() => {
                    downloadSdk(sdk)
                  }}
                />
              </Col>
            ))}
          </Row>

          <div className="text-xs  mb-4 mt-8 text-[#666]">
            <FormattedMessage defaultMessage="客户端模版" />
          </div>
          <Row className="" gutter={[32, 32]}>
            {remoteClient?.map((sdk, index) => (
              <Col key={index} xl={8} xxl={6} md={12}>
                <RemoteSDKCard
                  exist={existSdkMap.has(sdk.name)}
                  sdk={sdk}
                  onSelect={() => {
                    downloadSdk(sdk)
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Modal>
  )
}

export default RemoteSDK


const RemoteSDKCard = ({
  onSelect,
  sdk,
  exist
}: {
  sdk: ApiDocuments.Sdk
  onSelect: () => void
  exist: boolean
}) => {
  const intl = useIntl()
  return (
    <Card
      title={
        <div className="flex items-center">
          <img
            alt=""
            className={styles.icon}
            src={
              sdk.icon.startsWith('http')
                ? sdk.icon
                : `data:image/svg+xml;base64,${base64.fromByteArray(
                  new TextEncoder().encode(`${sdk.icon}`)
                )}`
            }
          />
          {sdk.title}
        </div>
      }
      className={styles.remoteCard}
      extra={exist ? <div className="text-[#787D8B]">已下载</div> : null}
    >
      <Descriptions
        size="small"
        column={1}
        labelStyle={{ width: 100 }}
        contentStyle={{ color: '#787D8B' }}
      >
        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '模板ID' })}>
          {sdk.name}
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '功能描述' })}>
          <div className={styles.descLine}>{sdk.description}</div>
        </Descriptions.Item>
        <Descriptions.Item label={intl.formatMessage({ defaultMessage: '生成路径' })}>
          {sdk.outputPath}
        </Descriptions.Item>
      </Descriptions>
      {exist ? null : (
        <div className={styles.download}>
          <div className={styles.btn} onClick={onSelect}>
            点击下载
          </div>
        </div>
      )}
    </Card>
  )
}
