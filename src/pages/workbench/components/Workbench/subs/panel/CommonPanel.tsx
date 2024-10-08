import { Dropdown, Image, Input, Menu, message, Popconfirm, Tooltip } from 'antd'
import type React from 'react'
import { useContext, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'

import { mutateAuth, useAuthList } from '@/hooks/store/auth'
import { mutateDataSource, useDataSourceList } from '@/hooks/store/dataSource'
import { mutateHookModel } from '@/hooks/store/hook/model'
import { useStorageList } from '@/hooks/store/storage'
import { useValidate } from '@/hooks/validate'
import type { CommonPanelResp } from '@/interfaces/commonPanel'
import { DataSourceKind } from '@/interfaces/datasource'
import { GlobalContext } from '@/lib/context/globalContext'
import type { MenuName } from '@/lib/context/workbenchContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'
import { useConfigurationVariable } from '@/providers/variable'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { getDataSourceIcon, isDatabaseKind } from '@/utils/datasource'
import { parseDBUrl } from '@/utils/db'

import roleIcon from '../../assets/panel-role.png'
import styles from './CommonPanel.module.less'
import SidePanel from './SidePanel'

interface PanelConfig {
  title: string
  openItem: (name: string) => string
  newItem: string
  request: {
    getList: () => void
    editItem: (row: ApiDocuments.fileloader_DataMutation) => Promise<unknown>
    delItem: (name: string) => Promise<unknown>
  }
  navMenu?: (record: any) => Array<{
    key: string
    label: React.ReactNode
  }>
  navAction?: Array<{ icon: string; path: string; tooltip: string }>
  bottom?: React.ReactNode
}

export default function CommonPanel(props: { type: MenuName; defaultOpen: boolean }) {
  const intl = useIntl()
  const { validateName } = useValidate()
  const { vscode } = useContext(GlobalContext)
  const navigate = useNavigate()
  const storageList = useStorageList()
  const dataSourceList = useDataSourceList()
  const authList = useAuthList()
  const { getConfigurationValue } = useConfigurationVariable()
  const datasource = useMemo(() => {
    if (props.type === 'dataSource') {
      if (!dataSourceList) return []
      return dataSourceList.map(row => {
        let icon = 'other'
        let svg = getDataSourceIcon(row)
        let tip = ''
        let readOnly = row.kind === DataSourceKind.Graphql && row.customGraphql.customized

        if (isDatabaseKind(row)) {
          if (row.customDatabase?.kind === 1) {
            tip = row.customDatabase.databaseAlone.database
          } else {
            const url = getConfigurationValue(row.customDatabase.databaseUrl)
            if (url) {
              tip = parseDBUrl(url)?.dbName ?? ''
            }
          }
        }
        return {
          readonly: readOnly || row.readonly,
          name: row.name,
          icon,
          sourceType: row.sourceType,
          tip,
          enabled: row.enabled,
          _row: row,
          svg
        }
      })
    } else if (props.type === 'auth') {
      if (!authList) return []
      return authList.map((row: ApiDocuments.Authentication) => {
        const icon = 'other'
        const tip = 'OIDC'
        return {
          // id: row.id,
          name: row.name,
          icon,
          tip,
          enabled: row.oidcConfigEnabled || row.jwksProviderEnabled,
          _row: row,
          svg: `${import.meta.env.BASE_URL}assets/icon/oidc.svg`
        }
      })
    } else if (props.type === 'storage') {
      if (!storageList) return []
      return storageList.map(row => {
        const icon = 'other'
        const tip = ''
        return {
          // id: row.id,
          name: row.name,
          icon,
          tip,
          enabled: row.enabled,
          _row: row,
          svg: `${import.meta.env.BASE_URL}assets/icon/file.svg`
        }
      })
    }
  }, [dataSourceList, authList, storageList, props.type])
  const panelMap = useMemo<Record<string, PanelConfig>>(
    () => ({
      dataSource: {
        title: intl.formatMessage({ defaultMessage: '数据源' }),
        openItem: name => `/workbench/data-source/${name}`,
        newItem: '/workbench/data-source/new',
        request: {
          getList: () => {
            mutateDataSource()
          },
          editItem: async row => await requests.post('/datasource/rename', row),
          delItem: async name => await requests.delete(`/datasource/${name}`)
        },
        navMenu: (record: any) => {
          if (record.sourceType === 4) {
            if (record.enabled) {
              return [
                {
                  key: 'disable',
                  label: (
                    <div
                      onClick={async () => {
                        await requests.put('/datasource', {
                          name: record.name,
                          enabled: false
                        })
                        mutateDataSource()
                      }}
                    >
                      <span className="ml-1.5">
                        <FormattedMessage defaultMessage="停用" />
                      </span>
                    </div>
                  )
                }
              ]
            } else {
              return [
                {
                  key: 'enable',
                  label: (
                    <div
                      onClick={async () => {
                        await requests.put('/datasource', {
                          name: record.name,
                          enabled: true
                        })
                        mutateDataSource()
                      }}
                    >
                      <span className="ml-1.5">
                        <FormattedMessage defaultMessage="启用" />
                      </span>
                    </div>
                  )
                }
              ]
            }
          }
          return []
        }
      },
      auth: {
        title: intl.formatMessage({ defaultMessage: '身份验证' }),
        openItem: name => `/workbench/auth/${name}`,
        newItem: '/workbench/auth/new',
        navAction: [
          {
            icon: roleIcon,
            path: '/workbench/auth/role/role',
            tooltip: intl.formatMessage({ defaultMessage: '权限管理' })
          }
        ],
        bottom: (
          <div className={styles.bottomRowWrapper}>
            <div className={styles.bottomRow}>
              <span className={styles.btn} onClick={() => navigate('/workbench/setting/security')}>
                <FormattedMessage defaultMessage="配置登录回调" />
              </span>
            </div>
          </div>
        ),
        request: {
          getList: () => {
            mutateAuth()
          },
          editItem: async row => await requests.post('/authentication/rename', row),
          delItem: async name => await requests.delete(`/authentication/${name}`)
        }
      }
    }),
    [intl, navigate, vscode.toggleOperationHook]
  )
  const panelConfig = useMemo<PanelConfig>(() => panelMap[props.type], [panelMap, props.type])
  const location = useLocation()
  const [editTarget, setEditTarget] = useState<CommonPanelResp>() // 当前正在重命名的对象
  const [dropDownName, setDropDownName] = useState<string>() // 当前下拉列表的对象id
  const { refreshMap, navCheck } = useContext(WorkbenchContext)
  const [panelOpened, setPanelOpened] = useState(false)
  if (!datasource) return null

  const dropDownMenu = (row: any) => {
    const menuItems: Array<{ key: string; label: React.ReactNode; disabled?: boolean }> = [
      {
        key: 'rename',
        disabled: row.readonly,
        label: (
          <div onClick={() => !row.readonly && setEditTarget(row)}>
            <span className="ml-1.5">
              <FormattedMessage defaultMessage="重命名" />
            </span>
          </div>
        )
      },
      {
        key: 'delete',
        disabled: row.readonly,
        label: (
          <Popconfirm
            zIndex={9999}
            placement="right"
            title={intl.formatMessage({ defaultMessage: '确认删除吗？' })}
            onConfirm={() => void handleItemDelete(dropDownName)}
            okText={intl.formatMessage({ defaultMessage: '删除' })}
            cancelText={intl.formatMessage({ defaultMessage: '取消' })}
            overlayClassName={styles['delete-label']}
            okType="danger"
            trigger={row.readonly ? '' : 'click'}
          >
            <div>
              <span className="ml-1.5">
                <FormattedMessage defaultMessage="删除" />
              </span>
            </div>
          </Popconfirm>
        )
      }
    ]
    if (panelConfig.navMenu) {
      menuItems.unshift(...(panelConfig.navMenu?.(row) ?? []))
    }
    return (
      <Menu
        onClick={e => {
          if (e.key !== 'delete') {
            setDropDownName(undefined)
          }
        }}
        items={menuItems}
      />
    )
  }

  const handleItemDelete = async (path?: string) => {
    if (!path) {
      return
    }
    await panelConfig.request.delItem(path)
    panelConfig.request.getList()
    setDropDownName(undefined)
    // 当被删除对象是当前打开的页面时，需要跳转离开
    if (panelConfig.openItem(path) === location.pathname) {
      // 找到首个不是在新窗口中打开页面的项目
      const index = datasource.findIndex(item => item.name !== path)
      if (index >= 0) {
        handleItemNav(datasource[index])
      } else {
        navigate(panelConfig.newItem)
      }
    }
  }
  const handleItemEdit = async (value: string) => {
    const row = editTarget?._row
    if (row === undefined) {
      return
    }
    const err = validateName(value)
    if (err) {
      message.error(err)
      return
    }
    await panelConfig.request.editItem({
      src: row.name,
      dst: value,
      overload: false
    })
    panelConfig.request.getList()
    setEditTarget(undefined)
    mutateHookModel()
  }

  const handleItemNav = (item: any) => {
    if (item.openInNewPage) {
      window.open(item.openInNewPage)
      return
    }
    const itemPath = panelConfig.openItem(item.name)
    void navCheck().then(flag => {
      if (flag) {
        navigate(itemPath)
      }
    })
  }

  return (
    <SidePanel
      title={panelConfig.title}
      onAdd={() => navigate(panelConfig.newItem)}
      onOpen={(flag: boolean) => setPanelOpened(flag)}
      defaultOpen={props.defaultOpen}
      action={
        <>
          {panelConfig.navAction?.map(item => (
            <Tooltip key={item.path} title={item.tooltip}>
              <div className="flex mr-1.5" onClick={() => navigate(item.path)}>
                <img width={19} height={19} src={item.icon} alt="头像" />
              </div>{' '}
            </Tooltip>
          ))}
        </>
      }
    >
      <div className={styles.container}>
        {datasource.map(item => {
          const itemPath = panelConfig.openItem(item.name)
          return (
            <div
              className={`${styles.row} ${!item.enabled ? styles.rowDisable : ''} ${
                itemPath === location.pathname ? styles.active : ''
              }`}
              key={item.name}
              onClick={() => handleItemNav(item)}
            >
              {editTarget?.name === item.name && editTarget ? (
                <Input
                  // @ts-ignore
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  onPressEnter={e => void handleItemEdit(e.target.value)}
                  onBlur={e => void handleItemEdit(e.target.value)}
                  onKeyUp={(e: React.KeyboardEvent) => {
                    e.key == 'Escape' && setEditTarget(undefined)
                  }}
                  className="font-normal h-5 text-sm leading-4 w-5/7"
                  defaultValue={editTarget.name}
                  autoFocus
                  placeholder={intl.formatMessage({ defaultMessage: '请输入外部数据源名' })}
                />
              ) : (
                <>
                  <div className={styles.icon}>
                    <Image
                      width={12}
                      height={12}
                      preview={false}
                      alt={item.name}
                      src={item.svg ?? `${import.meta.env.BASE_URL}assets/icon/github-fill.svg`}
                    />
                  </div>
                  <div className={styles.title}>{item.name}</div>
                  <div className={styles.tip} title={item.tip}>
                    {item.tip}
                  </div>
                </>
              )}
              <div onClick={e => e.stopPropagation()}>
                <Dropdown
                  dropdownRender={() => dropDownMenu(item)}
                  trigger={['click']}
                  open={dropDownName === item.name}
                  onOpenChange={flag => {
                    setDropDownName(flag ? item.name : undefined)
                  }}
                  placement="bottomRight"
                >
                  <div className={styles.more} onClick={e => e.preventDefault()} />
                </Dropdown>
              </div>
            </div>
          )
        })}
        {panelConfig.bottom}
      </div>
    </SidePanel>
  )
}
