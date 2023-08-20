import { App, Dropdown, message, Modal, Popconfirm, Tooltip } from 'antd'
import type { ItemType } from 'antd/es/menu/hooks/useItems'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import ApiConfig from '@/components/ApiConfig'
import type { FileTreeRef } from '@/components/FileTree'
import FileTree from '@/components/FileTree'
import { mutateApi, useApiList } from '@/hooks/store/api'
import { useValidate } from '@/hooks/validate'
import events from '@/lib/event/events'
import requests from '@/lib/fetchers'
import { useAPIManager } from '@/pages/workbench/apimanage/[...path]/store'
import { useDict } from '@/providers/dict'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { registerHotkeyHandler } from '@/services/hotkey'

import styles from './ApiPanel.module.less'
import type { SidePanelProps } from './SidePanel'
import SidePanel from './SidePanel'

export default function ApiPanel(props: Omit<SidePanelProps, 'title'>) {
  const intl = useIntl()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const currentUrlPath = params['*']!
  const [treeData, setTreeData] = useState<ApiDocuments.fileloader_DataTree[]>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [panelOpened, setPanelOpened] = useState(false) // 面板是否展开
  const [selectedKey, setSelectedKey] = useState<string>('')
  const fileTree = useRef<FileTreeRef>({
    addItem: () => {},
    editItem: () => {}
  })
  const {
    computed: { saved },
    autoSave
  } = useAPIManager()
  const { operation: operationStorePath } = useDict()

  // 快捷键
  useEffect(() => {
    const unbind1 = registerHotkeyHandler('alt+n,^+n', () => {
      // handleAddNode('创建文件')
    })
    const unbind2 = registerHotkeyHandler('alt+b,^+b', () => {
      navigate(`/workbench/apimanage/crud`)
    })
    return () => {
      unbind1()
      unbind2()
    }
  }, [navigate])

  // 监听location变化，及时清空选中状态
  useEffect(() => {
    // 尝试自动选中当前项
    if (treeData && currentUrlPath) {
      const currentNode = getNodeByPath(currentUrlPath, treeData)
      if (currentNode) {
        // 自动选中当前节点
        setSelectedKey(currentNode.key)
      } else {
        // 未找到当前节点，跳转至空白页
        navigate(`/workbench/apimanage`)
      }
    }
  }, [currentUrlPath, location, navigate, params, treeData])
  useEffect(() => {
    if (props.defaultOpen) {
      setPanelOpened(true)
    }
  }, [props.defaultOpen])

  const apiList = useApiList()
  useEffect(() => {
    // apiList未加载时，不进行转换，以避免自动跳转到空白页
    // if (!apiList) return
    const tree = convertToTree(apiList ?? [], '0')
    setTreeData(tree)
  }, [apiList])

  function calcMiniStatus(nodeData: ApiDocuments.fileloader_DataTree) {
    if (nodeData.isDir) {
      return ''
    }
    if (nodeData.extra.invalid) {
      // FIXME
      return (
        <div className={styles.errLabel}>
          <FormattedMessage defaultMessage="非法" />
        </div>
      )
    } else if (nodeData.extra.internal) {
      return <FormattedMessage defaultMessage="内部" />
    } else {
      // return nodeextra.method
    }
  }

  /**
   * 对所有修改操作进行一次封装，提供loading和刷新效果
   * 被封装对象的执行结果将延迟到mutate完成之后执行
   */
  const executeWrapper = useCallback(
    function <T extends Function>(fn: T, skipMutate = false): T {
      return (async (...args: any) => {
        const hide = message.loading(intl.formatMessage({ defaultMessage: '执行中' }))
        try {
          await fn(...args)
          !skipMutate && (await mutateApi())
        } catch (_) {
          // ignore
        }
        hide()
      }) as any
    },
    [intl]
  )
  const handleBatchSwitch = executeWrapper(
    async (nodes: ApiDocuments.fileloader_DataTree[], flag: boolean) => {
      const pathList = nodes.filter(x => !x.isDir).map(x => x.path!)
      await requests.put(
        'operation/batch',
        pathList.map(item => ({
          path: item,
          enabled: flag
        }))
      )
      events.emit({
        event: 'apiEnableChange',
        data: { pathList, enabled: flag }
      })
    }
  )
  const handleBatchDelete = executeWrapper(async (nodes: ApiDocuments.fileloader_DataTree[]) => {
    modal.confirm({
      title: intl.formatMessage({ defaultMessage: '是否确认删除选中的API？' }),
      onOk: executeWrapper(async () => {
        const pathList = nodes.filter(x => !x.isDir).map(x => x.path!)
        await requests.delete('operation/batch', {
          params: {
            dataNames: pathList.join(',')
          }
        })
        pathList.forEach(path => localStorage.removeItem(`_api_args_${path}`))
        message.success(intl.formatMessage({ defaultMessage: '删除成功' }))
        // 删除后处理
      }),
      okText: intl.formatMessage({ defaultMessage: '确认' }),
      cancelText: intl.formatMessage({ defaultMessage: '取消' })
    })
  })
  const handleDelete = executeWrapper(async (node: ApiDocuments.fileloader_DataTree) => {
    if (node.isDir) {
      await requests.delete(`/operation/deleteParent/${node.path}`)
    } else {
      await requests.delete(`/operation/${node.path}`)
    }
    localStorage.removeItem(`_api_args_${node.path}`)
  })
  const handleAddNode = executeWrapper(async (path: string, isDir: boolean) => {
    if (isDir) {
      await requests.post(`/vscode/createDirectory`, { uri: `${operationStorePath}/${path}` })
      await mutateApi()
    } else {
      await requests.post<unknown, { path: string }>('/operation', { path })
      await mutateApi()
      navigate(`/workbench/apimanage/${path}`)
    }
  }, true)
  const handleRenameNode = executeWrapper(
    async (node: ApiDocuments.fileloader_DataTree, newName: string) => {
      const oldPath = node.path!
      const newPath = oldPath.replace(/[^/]+$/, newName)
      if (node.isDir) {
        await requests.post('/operation/renameParent', {
          src: oldPath,
          dst: newPath,
          overload: false
        })
      } else {
        await requests.post(`/operation/rename`, { src: oldPath, dst: newPath, overload: false })
        if (node.path === currentUrlPath) {
          events.emit({
            event: 'titleChange',
            data: { title: newName, path: newPath }
          })
        }
      }
    }
  )

  const handleMove = executeWrapper(
    async (
      dragNode: ApiDocuments.fileloader_DataTree,
      dropNode: ApiDocuments.fileloader_DataTree | null,
      confirm = false
    ) => {
      const oldPath = dragNode.path
      const newPath = `${dropNode?.path ?? ''}/${dragNode.path?.split('/').pop()}`
      // 判断移动目标是否包含当前已打开的api， 如果有，则需要更新api信息
      const hasCurrent = !!getNodeByPath(currentUrlPath, [dragNode])
      if (dragNode.isDir) {
        await requests.post(
          '/operation/renameParent',
          { src: oldPath, dst: newPath, overload: confirm },
          {
            onError: async ({ code, result }) => {
              if (code === '20000000') {
                await confirmExecute(result, () => handleMove(dragNode, dropNode, true))
              }
            }
          }
        )
      } else {
        await requests.post(
          `/operation/rename`,
          { src: oldPath, dst: newPath, overload: confirm },
          {
            onError: async ({ code, result }) => {
              if (code === '20000000') {
                await confirmExecute([result], () => handleMove(dragNode, dropNode, true))
              }
            }
          }
        )
      }

      const apiList = await mutateApi()
      // 如果移动的是当前打开的api，则需要更新api信息
      if (hasCurrent) {
        const api = getApiByPath(currentUrlPath, apiList)
        if (api) {
          events.emit({
            event: 'titleChange',
            data: { title: api.path.split('/').pop() ?? '', path: api.path }
          })
        }
      }
    },
    true
  )

  const confirmExecute = useCallback(
    (data: any, callback: any) => {
      modal.confirm({
        title: intl.formatMessage({ defaultMessage: '以下API已存在，是否覆盖？' }),
        content: data.map((x: any) => <div key={x.path}>{x.path}</div>),
        onOk: callback,
        okText: intl.formatMessage({ defaultMessage: '覆盖' }),
        cancelText: intl.formatMessage({ defaultMessage: '取消' })
      })
    },
    [intl, modal]
  )

  const titleRender = (nodeData: ApiDocuments.fileloader_DataTree) => {
    const miniStatus = calcMiniStatus(nodeData)
    let itemTypeClass
    if (nodeData.isDir) {
      itemTypeClass = styles.treeItemDir
    } else if (nodeData.extra.invalid) {
      itemTypeClass = styles.treeItemErr
    } else if (!nodeData.extra.enabled) {
      itemTypeClass = styles.treeItemDisable
    } else {
      itemTypeClass = styles.treeItemFile
    }

    return (
      <div className={`${styles.treeItem} ${itemTypeClass}`}>
        <div className={styles.icon}>
          {nodeData.extra?.liveQueryEnabled ? <div className={styles.lighting}></div> : null}
        </div>
        <>
          {nodeData.extra?.method && (
            <div
              className={`${styles.method} ${
                styles[`method_${nodeData.extra.method?.toLowerCase()}`]
              }`}
            >
              {nodeData.extra.method?.toUpperCase()}
            </div>
          )}
          <div className={styles.title}>{nodeData.name}</div>
          <div className={styles.suffix}>{miniStatus}</div>

          <div onClick={e => e.stopPropagation()}>
            <Dropdown
              destroyPopupOnHide
              menu={{
                items: [
                  {
                    key: 'copy',
                    onClick: async () => {
                      const destPath = `${nodeData.path}Copy${Math.random()
                        .toString(36)
                        .substring(2, 5)}`
                      await requests.post('/operation/copy', {
                        dst: destPath,
                        src: nodeData.path!,
                        overload: false
                      })
                      message.success(
                        intl.formatMessage(
                          { defaultMessage: '已复制接口 {path}' },
                          { path: destPath }
                        )
                      )
                      void mutateApi()
                    },
                    label: (
                      <div>
                        <span className="ml-1.5">
                          <FormattedMessage defaultMessage="复制" />{' '}
                        </span>
                      </div>
                    )
                  },
                  {
                    key: 'rename',
                    onClick: () => {
                      fileTree.current.editItem(nodeData.key)
                    },
                    label: (
                      <div>
                        <span className="ml-1.5">
                          <FormattedMessage defaultMessage="重命名" />{' '}
                        </span>
                      </div>
                    )
                  },
                  {
                    key: 'delete',
                    label: (
                      <div
                        onClick={e => {
                          console.log(e)
                          // @ts-ignore
                          if (e.target?.dataset?.stoppropagation) {
                            e.stopPropagation()
                          }
                        }}
                      >
                        <Popconfirm
                          zIndex={9999}
                          title={intl.formatMessage({ defaultMessage: '确定删除吗?' })}
                          onConfirm={() => {
                            handleDelete(nodeData)
                          }}
                          okText={intl.formatMessage({ defaultMessage: '删除' })}
                          cancelText={intl.formatMessage({ defaultMessage: '取消' })}
                          placement="right"
                        >
                          <div className={styles.menuItem} data-stoppropagation="1">
                            <span className="ml-1.5">
                              <FormattedMessage defaultMessage="删除" />
                            </span>
                          </div>
                        </Popconfirm>
                      </div>
                    )
                  }
                ].filter(x => x.key !== 'copy' || !nodeData.isDir)
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <div className={styles.more} onClick={e => e.preventDefault()} />
            </Dropdown>
          </div>
        </>
      </div>
    )
  }

  const { validateAPI } = useValidate()
  const onValidateName = (name: string, isDir = false) => {
    let err = validateAPI(name)
    if (err) {
      void message.error(err)
      return false
    }
    return true
  }

  const buildContextMenu = useCallback(
    (
      selectList: ApiDocuments.fileloader_DataTree[],
      deepList: ApiDocuments.fileloader_DataTree[]
    ) => {
      const menu: ItemType[] = [
        {
          key: 'on',
          onClick: () => void handleBatchSwitch(deepList, true),
          disabled: !deepList.some(x => !x.isDir && !x.extra.enabled && !x.extra.invalid),
          label: <FormattedMessage defaultMessage="上线" />
        },
        {
          key: 'off',
          onClick: () => void handleBatchSwitch(deepList, false),
          disabled: !deepList.some(x => !x.isDir && x.extra.enabled),
          label: <FormattedMessage defaultMessage="下线" />
        }
      ]
      const hasApi = selectList.some(x => !x.isDir)
      if (hasApi) {
        menu.push(
          ...[
            {
              key: 'delete',
              onClick: () => void handleBatchDelete(selectList),
              label: <FormattedMessage defaultMessage="删除" />
            }
          ]
        )
      }
      return menu
    },
    [handleBatchDelete, handleBatchSwitch]
  )

  return (
    <SidePanel
      {...props}
      title={intl.formatMessage({ defaultMessage: 'API管理' })}
      hideAdd
      open={panelOpened}
      onOpen={flag => {
        setPanelOpened(flag)
        props.onOpen && props.onOpen(flag)
      }}
      action={
        <>
          <Tooltip title="筛选">
            <div
              className={styles.headerFilter}
              onClick={() => {
                events.emit({ event: 'openApiSearch' })
              }}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ defaultMessage: '刷新列表' })}>
            <div
              className={styles.headerRefresh}
              onClick={() => {
                void mutateApi()
              }}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ defaultMessage: '全局设置' })}>
            <div className={styles.headerConfig} onClick={() => setIsModalVisible(true)} />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ defaultMessage: '新建目录' })}>
            <div
              className={styles.headerNewFold}
              onClick={() => {
                setPanelOpened(true)
                fileTree.current.addItem(true)
              }}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ defaultMessage: '新建API' })}>
            <div
              className={styles.headerNewFile}
              onClick={() => {
                setPanelOpened(true)
                fileTree.current.addItem(false)
              }}
            />
          </Tooltip>
        </>
      }
    >
      <FileTree
        draggable
        fileText="API"
        ref={fileTree}
        onSelectFile={async nodeData => {
          if (!nodeData.isDir) {
            if (!saved) {
              message.info(intl.formatMessage({ defaultMessage: '自动保存中...' }))
              await autoSave()
              message.destroy()
            }
            navigate(`/workbench/apimanage/${nodeData.path}`)
          }
        }}
        onCreateItem={async (parent, isDir, name) => {
          if (name && onValidateName(name, isDir)) {
            try {
              await handleAddNode(parent?.path ? `${parent?.path}/${name}` : name, isDir)
              return true
            } catch (e) {
              console.error(e)
              return false
            }
          }
          return false
        }}
        onRename={async (nodeData, newName) => {
          if (newName && onValidateName(newName, nodeData.isDir)) {
            try {
              await handleRenameNode(nodeData, newName)
              return true
            } catch (e) {
              console.error(e)
              return false
            }
          }
          return false
        }}
        onMove={handleMove}
        onContextMenu={buildContextMenu}
        selectedKey={selectedKey}
        rootClassName="h-full"
        treeClassName={styles.treeContainer}
        treeData={treeData ?? []}
        titleRender={titleRender}
        footer={
          <div className={styles.createRowWrapper}>
            <div className={styles.createRow} onContextMenu={e => e.stopPropagation()}>
              <span className={styles.btn} onClick={() => fileTree.current.addItem(false)}>
                <FormattedMessage defaultMessage="新建" />
              </span>
              <span>
                {' '}
                <FormattedMessage defaultMessage="或者" />{' '}
              </span>
              <span className={styles.btn} onClick={() => navigate(`/workbench/apimanage/crud`)}>
                <FormattedMessage defaultMessage="批量新建" />
              </span>
            </div>
            <Tooltip title={intl.formatMessage({ defaultMessage: '测试' })}>
              <div
                onContextMenu={e => e.stopPropagation()}
                className={styles.graphqlEntry}
                onClick={() => {
                  const current = new URL(window.location.href)
                  window.open(
                    `${current.protocol}//localhost:${current.port}/app/main/graphql`,
                    '_blank'
                  )
                }}
              >
                <img alt="" src="/assets/icon/graphql2.svg" />
              </div>
            </Tooltip>
          </div>
        }
      />
      <Modal
        title={intl.formatMessage({ defaultMessage: 'API全局设置' })}
        open={isModalVisible}
        onOk={() => {
          setIsModalVisible(false)
        }}
        onCancel={() => {
          setIsModalVisible(false)
        }}
        footer={null}
        centered
        destroyOnClose={true}
      >
        <ApiConfig type="global" onClose={() => setIsModalVisible(false)} />
      </Modal>
    </SidePanel>
  )
}

function convertToTree(data: ApiDocuments.fileloader_DataTree[] | null, lv = '0') {
  if (!data) return []
  return data.map((x, idx) => ({
    ...x,
    key: `${x.isDir ? 0 : 1}-${x.path}`,
    children: convertToTree(x.items ?? [], `${lv}-${idx}`)
  }))
}

function getNodeByPath(
  path: string,
  data: ApiDocuments.fileloader_DataTree[] = []
): ApiDocuments.fileloader_DataTree | undefined {
  const lists = [...data!]
  while (lists.length) {
    const item = lists.pop()!
    if (item.path === path) {
      return item
    } else if (item.children) {
      lists.push(...item.children)
    }
  }
}

function getApiByPath(
  path: string,
  data: ApiDocuments.Operation[] = []
): ApiDocuments.Operation | undefined {
  const lists = [...data!]
  while (lists.length) {
    const item = lists.pop()!
    if (item.path === path) {
      return item
    } else if (item.children) {
      lists.push(...item.children)
    }
  }
}
