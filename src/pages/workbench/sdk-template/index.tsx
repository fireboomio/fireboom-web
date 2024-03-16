import { CopyOutlined, EditFilled } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Popconfirm,
  Row,
  Switch,
  message
} from 'antd'
import type { ItemType } from 'antd/es/menu/hooks/useItems'
import base64 from 'base64-js'
import { KeyboardEventHandler, useRef } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR, { mutate as _mutate } from 'swr'

import requests, { getAuthKey, proxy } from '@/lib/fetchers'
import { intl } from '@/providers/IntlProvider'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'

import copy from 'copy-to-clipboard'
import moreIcon from '../components/Workbench/assets/icon-menu.png'
import RemoteSDK, { RemoteSDKActions } from './components/RemoteSDK'

const SDKTemplate = () => {
  const { data: sdks, mutate: mutateSDKs } = useSWR<ApiDocuments.Sdk[]>('/sdk', requests.get)
  const remoteRef = useRef<RemoteSDKActions>()
  const { server, client } = useMemo(() => {
    const server: ApiDocuments.Sdk[] = []
    const client: ApiDocuments.Sdk[] = []
    if (sdks) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      sdks.forEach(x => {
        if (x.type === 'server') {
          server.push(x)
        } else {
          client.push(x)
        }
      })
    }
    return { server, client }
  }, [sdks])

  const onUpdate = (index: number, sdk: ApiDocuments.Sdk) => {
    mutateSDKs([...sdks!.slice(0, index - 2), sdk, ...sdks!.slice(index - 1)])
  }

  return (
    <Card>
      <div className="flex mb-4 items-center">
        <div className="text-base t-medium">
          <FormattedMessage defaultMessage="模版仓库" />
        </div>
        <div className="flex-1" />
        <Button
          onClick={() => {
            remoteRef.current?.show()
          }}
        >
          {intl.formatMessage({ defaultMessage: '浏览模版市场' })}
        </Button>
      </div>
      <div className="flex mb-4 items-center">
        <div className="text-xs text-[#666]">
          <FormattedMessage defaultMessage="钩子模版" />
        </div>
        <div className="text-xs ml-3 text-[#787D8B]">
          <FormattedMessage defaultMessage="（钩子同时只能开启一个，为toggle模式）" />
        </div>
      </div>
      <Row className="" gutter={[32, 32]}>
        {server?.map((sdk, index) => (
          <Col key={sdk.name} xl={8} xxl={6} md={12}>
            <SDKTemplateItem sdk={sdk} onChange={sdk => onUpdate(index, sdk)} />
          </Col>
        ))}
        {!server?.length && (
          <Empty
            className="m-auto"
            description={intl.formatMessage({ defaultMessage: '暂无模板' })}
          />
        )}
      </Row>
      <div className="flex mb-4 items-center mt-8">
        <div className="text-xs text-[#666]">
          <FormattedMessage defaultMessage="客户端模版" />
          {client.length && (
            <span className="text-xs ml-3 text-[#787D8B]">
              （<code className="px-1 text-primary">generated-sdk</code>
              <FormattedMessage defaultMessage="目录下生成的文件可以使用" />
              <span
                className="mx-1 text-primary cursor-pointer"
                onClick={() => {
                  copy(`${window.location.origin}/generated-sdk`)
                  message.success(`已复制`)
                }}
              >
                {window.location.origin}/generated-sdk
                <CopyOutlined className="ml-0.5 mr-1" />
              </span>
              <FormattedMessage defaultMessage="加上文件路径访问" />）
            </span>
          )}
        </div>
      </div>
      <Row className="" gutter={[32, 32]}>
        {client?.map((sdk, index) => (
          <Col key={index} xl={8} xxl={6} md={12}>
            <SDKTemplateItem sdk={sdk} onChange={sdk => onUpdate(index, sdk)} />
          </Col>
        ))}
        {!client?.length && (
          <Empty
            className="m-auto"
            description={intl.formatMessage({ defaultMessage: '暂无 模版' })}
          />
        )}
      </Row>
      <RemoteSDK sdks={sdks ?? []} onUpdate={mutateSDKs} actionRef={remoteRef} />
    </Card>
  )
}

export default SDKTemplate

async function checkUpdatable(
  sdk: ApiDocuments.Sdk
): Promise<false | { repo: string; localSha: string; remoteSha: string }> {
  const matched = sdk.gitUrl.match(/^https?:\/\/(.+)\/(.+\/.+)\.git/)
  if (matched) {
    try {
      // TODO 待优化
      const ret = await proxy(
        `https://api.github.com/repos/${matched[2]}/git/refs/heads/${sdk.gitBranch}`
      )
      if (ret) {
        if (ret.object.sha !== sdk.gitCommitHash) {
          return {
            repo: matched[2],
            localSha: sdk.gitCommitHash,
            remoteSha: ret.object.sha
          }
        }
      }
      return false
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

const SDKTemplateItem = ({
  onChange,
  sdk
}: {
  sdk: ApiDocuments.Sdk
  onChange: (newSDK: ApiDocuments.Sdk) => void
}) => {
  const intl = useIntl()
  const [updatable, setUpdatable] = useState<
    false | { repo: string; localSha: string; remoteSha: string }
  >(false)
  const [editing, setEditing] = useState(false)
  const [editingValue, setEditingValue] = useState(sdk.outputPath)
  const { initialize } = useDict()
  const { mutate } = useSWR<ApiDocuments.Sdk[]>('/sdk', requests.get)

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    e => {
      const value = e.currentTarget.value
      if (e.key === 'Escape') {
        setEditingValue(sdk.outputPath)
        setEditing(false)
      } else if (e.key === 'Enter') {
        requests.put("/sdk", { name: sdk.name, outputPath: value }).then(res => {
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
      requests.put("/sdk", { name: sdk.name, enabled: checked }).then(res => {
        mutate()
        initialize()
        _mutate('/sdk/enabledServer')
      })
    },
    [initialize, mutate, sdk.name]
  )

  const dropdownMenus = useMemo<ItemType[]>(() => {
    const menus = [
      {
        key: 'delete',
        icon: '',
        label: (
          <Popconfirm
            title={intl.formatMessage({ defaultMessage: '确定要删除?' })}
            okText={intl.formatMessage({ defaultMessage: '确定' })}
            cancelText={intl.formatMessage({ defaultMessage: '取消' })}
            onConfirm={async () => {
              await requests.delete(`/sdk/${sdk.name}`)
              message.success(intl.formatMessage({ defaultMessage: '删除成功' }))
              mutate()
            }}
          >
            {intl.formatMessage({ defaultMessage: '删除' })}
          </Popconfirm>
        )
      },
      {
        key: 'update',
        label: intl.formatMessage({ defaultMessage: '升级' }),
        onClick: async () => {
          const hide = message.loading(intl.formatMessage({ defaultMessage: '升级中' }))
          try {
            await requests.put("/sdk", {
              name: sdk.name,
              gitCommitHash: 'latest'
              // gitpull: true
            })
            message.success(intl.formatMessage({ defaultMessage: '升级成功' }))
            mutate()
          } finally {
            hide()
          }
        }
      }
    ]
    if (sdk.enabled === true) {
      menus.push({
        key: 'download',
        label: intl.formatMessage({ defaultMessage: '下载生成文件' }),
        onClick: async () => {
          const authKey = getAuthKey()
          window.open(
            `/api/sdk/downloadOutput/${sdk.name}?${authKey ? `&auth-key=${authKey}` : ''}`
          )
        }
      })
    }
    return menus
  }, [intl, mutate, sdk])

  useEffect(() => {
    checkUpdatable(sdk).then(setUpdatable)
  }, [sdk])

  return (
    <div className="bg-white rounded shadow p-4 hover:shadow-lg">
      <div className="flex items-center">
        <img
          alt=""
          className="w-10 h-10 mr-2.5"
          src={
            sdk.icon.startsWith('http')
              ? sdk.icon
              : `data:image/svg+xml;base64,${base64.fromByteArray(
                new TextEncoder().encode(`${sdk.icon}`)
              )}`
          }
        />
        <div className="flex-1">
          <div className="flex items-center">
            <div className="text-base t-medium">{sdk.name}</div>
            {updatable && (
              <a
                className="ml-4 text-primary italic border border-primary border-solid rounded px-1 py-0.5 leading-2 text-xs"
                href={`https://github.com/${updatable.repo}/compare/${updatable.localSha.substring(
                  0,
                  7
                )}..${updatable.remoteSha.substring(0, 7)}`}
                target="_blank"
                rel="noreferrer"
              >
                new
              </a>
            )}
          </div>
          <div className="flex mt-1 items-center">
            <div className="rounded-md bg-[#D8D8D8] h-2.5 shadow w-2.5" />
            <div className="text-xs ml-1 text-[#5F6269]">{sdk.author}</div>
          </div>
        </div>
        <Switch className="flex-shrink-0" checked={sdk.enabled} onChange={onSwitch} />
        <Dropdown
          menu={{
            items: dropdownMenus
          }}
          trigger={['hover']}
        >
          <img alt="" className="cursor-pointer h-3 ml-2 w-3" src={moreIcon} />
        </Dropdown>
      </div>
      <div className="bg-[rgba(95,98,105,0.1)] h-0.5 mt-2 mb-3" />
      <div className="text-xs text-[#787D8B] line-clamp-2">
        {intl.formatMessage({ defaultMessage: '功能描述' })}：{sdk.description || '-'}
      </div>
      <div className="flex h-8 mt-3 relative items-center">
        <span className="flex-shrink-0 text-xs text-[#787D8B] line-clamp-2">
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
