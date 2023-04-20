import { EditFilled } from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Dropdown, message, Modal, Row, Spin, Switch } from 'antd'
import base64 from 'base64-js'
import type { KeyboardEventHandler } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'

import Error50x from '@/components/ErrorPage/50x'
import requests, { proxy } from '@/lib/fetchers'
import { useLock } from '@/lib/helpers/lock'
import { intl } from '@/providers/IntlProvider'

import styles from './index.module.less'

type SDKItem = {
  author: string
  description?: string
  dirName: string
  name: string
  outputPath: string
  enabled: boolean
}
type RemoteSDKItem = {
  defaultOutputPath: string
  description: string
  name: string
  title: string
  url: string
  icon: string
}

const SDKTemplate = () => {
  const { data, mutate } = useSWR<SDKItem[]>('/sdk', requests.get)
  const [showRemote, setShowRemote] = useState(false)
  const {
    data: remoteSdk,
    isLoading,
    error,
    mutate: mutateRemote
  } = useSWR<{
    official: RemoteSDKItem[]
    community: RemoteSDKItem[]
  }>(
    showRemote
      ? 'https://raw.githubusercontent.com/fireboomio/files/main/sdk.templates.json'
      : null,
    proxy,
    {
      revalidateOnMount: true
    }
  )
  const existSdkMap = useMemo(() => {
    return new Set(data?.map(x => x.dirName) ?? [])
  }, [data])

  const onUpdate = (index: number, sdk: SDKItem) => {
    mutate([...data!.slice(0, index - 2), sdk, ...data!.slice(index - 1)])
  }
  const { loading, fun: downloadSdk } = useLock(
    async sdk => {
      const hide = message.loading(intl.formatMessage({ defaultMessage: '下载' }), -1)
      try {
        await requests.post('/sdk/remote/download', sdk)
        await mutate()
        message.success(intl.formatMessage({ defaultMessage: '下载成功' }))
      } catch (e) {
        message.error(intl.formatMessage({ defaultMessage: '下载失败' }))
      }
      hide()
    },
    [mutate]
  )

  return (
    <Card>
      <div className="flex mb-4 items-center">
        <div className="text-base t-medium">
          <FormattedMessage defaultMessage="SDK模板" />
        </div>
        <div className="flex-1" />
        <Button onClick={() => setShowRemote(true)}>
          {intl.formatMessage({ defaultMessage: '浏览SDK市场' })}
        </Button>
      </div>
      <div className="flex mb-4 items-center">
        <div className="text-xs text-[#666]">
          <FormattedMessage defaultMessage="服务端" />
        </div>
        <div className="text-xs ml-3 text-[#787D8B]">
          <FormattedMessage defaultMessage="（钩子同时只能开启一个，为toggle模式）" />
        </div>
      </div>
      <Row className="" gutter={[32, 32]}>
        {data?.map((sdk, index) => (
          <Col key={index} xl={8} xxl={6} md={12}>
            <SDKTemplateItem sdk={sdk} onChange={sdk => onUpdate(index, sdk)} />
          </Col>
        ))}
      </Row>
      <Modal
        width="80vw"
        bodyStyle={{ minHeight: '60vh' }}
        footer={null}
        open={showRemote}
        onCancel={() => setShowRemote(false)}
        title={
          <div className="text-center">{intl.formatMessage({ defaultMessage: 'SDK模板市场' })}</div>
        }
      >
        {isLoading ? (
          <div className="h-40vh w-full flex items-center justify-center">
            <Spin tip="Loading" size="large" />
          </div>
        ) : null}
        {!isLoading && error ? (
          <div className="h-40vh w-full flex flex-col items-center justify-center">
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

        {!isLoading && !error && (
          <Row className="" gutter={[32, 32]}>
            {remoteSdk?.official?.map((sdk, index) => (
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
        )}
      </Modal>
    </Card>
  )
}

export default SDKTemplate

const SDKTemplateItem = ({
  onChange,
  sdk
}: {
  sdk: SDKItem
  onChange: (newSDK: SDKItem) => void
}) => {
  const intl = useIntl()
  const [editing, setEditing] = useState(false)
  const [editingValue, setEditingValue] = useState(sdk.outputPath)

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    e => {
      const value = e.currentTarget.value
      if (e.key === 'Escape') {
        setEditingValue(sdk.outputPath)
        setEditing(false)
      } else if (e.key === 'Enter') {
        requests.put('/sdk/rePath', { outputPath: value, dirName: sdk.dirName }).then(res => {
          console.log('res', res)
          onChange({
            ...sdk,
            outputPath: value
          })
          message.success(intl.formatMessage({ defaultMessage: '保存成功' }))
        })
      }
    },
    [intl, onChange, sdk]
  )

  const onSwitch = useCallback(
    (checked: boolean) => {
      requests.put('/sdk/switch', { enabled: checked, dirName: sdk.dirName }).then(res => {
        console.log('res', res)
        onChange({
          ...sdk,
          enabled: checked
        })
      })
    },
    [onChange, sdk]
  )

  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-lg">
      <div className="flex items-center">
        <div className="flex-1">
          <div className="text-base t-medium">{sdk.name}</div>
          <div className="flex mt-1 items-center">
            <div className="rounded-md bg-[#D8D8D8] h-2.5 shadow w-2.5"></div>
            <div className="text-xs ml-1 text-[#5F6269]">{sdk.author}</div>
          </div>
        </div>
        <Switch className="flex-shrink-0" checked={sdk.enabled} onChange={onSwitch} />
        <Dropdown
          menu={{
            items: [
              {
                key: 'delete',
                icon: '',
                label: intl.formatMessage({ defaultMessage: '删除' }),
                onClick: () => {}
              },
              {
                key: 'update',
                label: intl.formatMessage({ defaultMessage: '升级' }),
                onClick: () => {}
              }
            ]
          }}
          trigger={['hover']}
        >
          <img
            alt=""
            className="w-3 h-3 ml-2 cursor-pointer"
            src="assets/workbench/icon-menu.png"
          />
        </Dropdown>
      </div>
      <div className="bg-[rgba(95,98,105,0.1)] h-0.5 mt-2 mb-3"></div>
      <div className="text-xs text-[#787D8B] line-clamp-2">
        {intl.formatMessage({ defaultMessage: '功能描述' })}：{sdk.description || '-'}
      </div>
      <div className="h-8 mt-3 relative flex items-center">
        <span className="text-xs text-[#787D8B] line-clamp-2 flex-shrink-0">
          {intl.formatMessage({ defaultMessage: '生成路径' })}：
        </span>
        <input
          value={editingValue}
          readOnly={!editing}
          className="border rounded h-full outline-none border-[rgba(95,98,105,0.1)] text-sm w-full px-3 text-[#5F6269] focus:border-[rgba(95,98,105,0.8)]"
          onClick={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          onKeyDown={onKeyDown}
          onInput={e => setEditingValue(e.currentTarget.value)}
        />
        <EditFilled className="cursor-pointer top-2 right-3 absolute" size={8} />
      </div>
    </div>
  )
}

const RemoteSDKCard = ({
  onSelect,
  sdk,
  exist
}: {
  sdk: RemoteSDKItem
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
            src={`data:image/svg+xml;base64,${base64.fromByteArray(
              new TextEncoder().encode(`${sdk.icon}`)
            )}`}
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
          {sdk.defaultOutputPath}
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
