import { App, Dropdown, message, Modal, Popconfirm, Tooltip } from 'antd'
import type { ItemType } from 'antd/es/menu/hooks/useItems'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'

import ApiConfig from '@/components/ApiConfig'
import type { FileTreeNode, FileTreeRef } from '@/components/FileTree'
import FileTree from '@/components/FileTree'
import { mutateApi, useApiList } from '@/hooks/store/api'
import { useValidate } from '@/hooks/validate'
import type { OperationResp } from '@/interfaces/apimanage'
import events from '@/lib/event/events'
import requests from '@/lib/fetchers'
import { registerHotkeyHandler } from '@/services/hotkey'

import styles from './ApiPanel.module.less'
import type { SidePanelProps } from './SidePanel'
import SidePanel from './SidePanel'

export default function ApiPanel(props: Omit<SidePanelProps, 'title'>) {
  const intl = useIntl()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [treeData, setTreeData] = useState<FileTreeNode[]>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [panelOpened, setPanelOpened] = useState(false) // 面板是否展开
  const [selectedKey, setSelectedKey] = useState<string>('')
  const fileTree = useRef<FileTreeRef>({
    addItem: () => {},
    editItem: () => {}
  })

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

  const pathId = useMemo(() => {
    return Number((location.pathname.match(/\/apimanage\/(\d+)/) ?? [])[1] ?? 0)
  }, [location.pathname])

  // 监听location变化，及时清空选中状态
  useEffect(() => {
    // 尝试自动选中当前项
    if (treeData && pathId) {
      const currentNode = getNodeById(pathId, treeData)
      if (currentNode) {
        // 自动选中当前节点
        setSelectedKey(currentNode.key)
      } else {
        // 未找到当前节点，跳转至空白页
        navigate(`/workbench/apimanage`)
      }
    }
  }, [location, navigate, pathId, treeData])
  useEffect(() => {
    if (props.defaultOpen) {
      setPanelOpened(true)
    }
  }, [props.defaultOpen])

  const apiList = useApiList()
  useEffect(() => {
    // apiList未加载时，不进行转换，以避免自动跳转到空白页
    if (!apiList) return
    const tree = convertToTree(apiList ?? [], '0')
    setTreeData(tree)
  }, [apiList])

  function calcMiniStatus(nodeData: FileTreeNode) {
    if (nodeData.isDir) {
      return ''
    }
    if (nodeData.data.illegal) {
      return (
        <div className={styles.errLabel}>
          <FormattedMessage defaultMessage="非法" />
        </div>
      )
    } else if (!nodeData.data.isPublic) {
      return <FormattedMessage defaultMessage="内部" />
    } else {
      // return nodeData.method
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
  const handleBatchSwitch = executeWrapper(async (nodes: FileTreeNode[], flag: boolean) => {
    const ids = nodes.filter(x => !x.isDir || !x.data.id).map(x => x.data.id)
    await requests.post('operateApi/batchOnline', {
      Ids: ids,
      enabled: flag
    })
    events.emit({
      event: 'apiEnableChange',
      data: { ids, enabled: flag }
    })
  })
  const handleBatchDelete = executeWrapper(async (nodes: FileTreeNode[]) => {
    modal.confirm({
      title: intl.formatMessage({ defaultMessage: '是否确认删除选中的API？' }),
      onOk: executeWrapper(async () => {
        const ids = nodes.filter(x => !x.isDir || !x.data.id).map(x => x.data.id)
        await requests.post('operateApi/batchDelete', { ids })
        ids.forEach(id => localStorage.removeItem(`_api_args_${id}`))
        message.success(intl.formatMessage({ defaultMessage: '删除成功' }))
        // 删除后处理
      }),
      okText: intl.formatMessage({ defaultMessage: '确认' }),
      cancelText: intl.formatMessage({ defaultMessage: '取消' })
    })
  })
  const handleDelete = executeWrapper(async (node: FileTreeNode) => {
    if (node.isDir) {
      await requests.delete('/operateApi/dir', { data: { path: node.data.path } })
    } else {
      await requests.delete(`/operateApi/${node.data.id}`)
    }
    localStorage.removeItem(`_api_args_${node.data.id}`)
  })
  const handleAddNode = executeWrapper(async (path: string, isDir: boolean) => {
    if (isDir) {
      await requests.post('/operateApi/dir', { path })
      await mutateApi()
    } else {
      const result = await requests.post<unknown, { id: number }>('/operateApi', { path })
      await mutateApi()
      navigate(`/workbench/apimanage/${result?.id}`)
    }
  }, true)
  const handleRenameNode = executeWrapper(async (node: FileTreeNode, newName: string) => {
    const oldPath = node.data.path
    const newPath = oldPath.replace(/[^/]+$/, newName)
    if (node.isDir) {
      await requests.put('/operateApi/dir', { oldPath, newPath })
    } else {
      await requests.put(`/operateApi/rename/${node.data.id}`, { path: newPath })
      if (node.data.id === pathId) {
        events.emit({
          event: 'titleChange',
          data: { title: newName, path: newPath }
        })
      }
    }
  })

  const handleMove = executeWrapper(
    async (dragNode: FileTreeNode, dropNode: FileTreeNode | null, confirm = false) => {
      const oldPath = dragNode.data.path
      const newPath = `${dropNode?.data?.path ?? ''}/${dragNode.name}`
      // 判断移动目标是否包含当前已打开的api， 如果有，则需要更新api信息
      const hasCurrent = !!getNodeById(pathId, [dragNode])
      if (dragNode.isDir) {
        await requests.put(
          '/operateApi/dir',
          { oldPath, newPath, coverRepeat: confirm },
          {
            onError: async ({ code, result }) => {
              if (code === '20000000') {
                await confirmExecute(result, () => handleMove(dragNode, dropNode, true))
              }
            }
          }
        )
      } else {
        await requests.put(
          `/operateApi/rename/${dragNode.data.id}`,
          { path: newPath, coverRepeat: confirm },
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
        const api = getApiById(pathId, apiList)
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

  const titleRender = (nodeData: FileTreeNode) => {
    const miniStatus = calcMiniStatus(nodeData)
    let itemTypeClass
    if (nodeData.isDir) {
      itemTypeClass = styles.treeItemDir
    } else if (nodeData.data.illegal) {
      itemTypeClass = styles.treeItemErr
    } else if (!nodeData.data.enabled) {
      itemTypeClass = styles.treeItemDisable
    } else {
      itemTypeClass = styles.treeItemFile
    }

    return (
      <div className={`${styles.treeItem} ${itemTypeClass}`}>
        <div className={styles.icon}>
          {nodeData.data.liveQuery ? <div className={styles.lighting}></div> : null}
        </div>
        <>
          {nodeData.data.method && (
            <div
              className={`${styles.method} ${
                styles[`method_${nodeData.data.method?.toLowerCase()}`]
              }`}
            >
              {nodeData.data.method?.toUpperCase()}
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
                      const destPath = `${nodeData.data.path}Copy${Math.random()
                        .toString(36)
                        .substring(2, 5)}`
                      await requests.post('/operateApi/copy', {
                        path: destPath,
                        id: nodeData.data.id
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
    (selectList: FileTreeNode[], deepList: FileTreeNode[]) => {
      const menu: ItemType[] = [
        {
          key: 'on',
          onClick: () => void handleBatchSwitch(deepList, true),
          disabled: !deepList.some(x => !x.isDir && !x.data.enabled && !x.data.illegal),
          label: <FormattedMessage defaultMessage="上线" />
        },
        {
          key: 'off',
          onClick: () => void handleBatchSwitch(deepList, false),
          disabled: !deepList.some(x => !x.isDir && x.data.enabled),
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
        onSelectFile={nodeData => {
          if (!nodeData.isDir) {
            navigate(`/workbench/apimanage/${nodeData.data.id}`)
          }
        }}
        onCreateItem={async (parent, isDir, name) => {
          if (name && onValidateName(name, isDir)) {
            try {
              await handleAddNode(`${parent?.data.path ?? ''}/${name}`, isDir)
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

function convertToTree(data: OperationResp[] | null, lv = '0'): FileTreeNode[] {
  if (!data) return []
  return data.map((x, idx) => ({
    data: {
      ...x
    },
    id: x.id,
    name: x.path.split('/')[x.path.split('/').length - 1],
    title: x.path.split('/')[x.path.split('/').length - 1],
    key: `${x.isDir ? 1 : 0}-${x.path}`,
    isDir: x.isDir,
    children: convertToTree(x.children, `${lv}-${idx}`)
  }))
}

function getNodeById(id: number, data: FileTreeNode[] = []): FileTreeNode | undefined {
  const lists = [...data!]
  while (lists.length) {
    const item = lists.pop()!
    if (item.data.id === id) {
      return item
    } else if (item.children) {
      lists.push(...item.children)
    }
  }
}

function getApiById(id: number, data: OperationResp[] = []): OperationResp | undefined {
  const lists = [...data!]
  while (lists.length) {
    const item = lists.pop()!
    if (item.id === id) {
      return item
    } else if (item.children) {
      lists.push(...item.children)
    }
  }
}
