import { CopyOutlined } from '@ant-design/icons'
import { App, Dropdown, message, Modal, Popconfirm, Tooltip } from 'antd'
import type { ItemType } from 'antd/es/menu/hooks/useItems'
import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [treeData, setTreeData] = useState<FileTreeNode[]>([])
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

  // 监听location变化，及时清空选中状态
  useEffect(() => {
    // 尝试自动选中当前项
    if (treeData) {
      const pathId = Number((location.pathname.match(/\/apimanage\/(\d+)/) ?? [])[1] ?? 0)
      if (pathId) {
        const currentNode = getNodeById(pathId, treeData)
        if (currentNode) {
          // 自动选中当前节点
          setSelectedKey(currentNode.key)
        } else {
          // 未找到当前节点，跳转至空白页
          navigate(`/workbench/apimanage`)
        }
      }
    }
  }, [location, treeData])
  useEffect(() => {
    if (props.defaultOpen) {
      setPanelOpened(true)
    }
  }, [props.defaultOpen])

  const apiList = useApiList()
  useEffect(() => {
    const tree = convertToTree(apiList ?? [], '0')
    setTreeData(tree)
  }, [apiList])

  function calcMiniStatus(nodeData: FileTreeNode) {
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

  // 对所有修改操作进行一次封装，提供loading和刷新效果
  const executeWrapper = useCallback(
    function <T extends Function>(fn: T): T {
      return (async (...args: any) => {
        const hide = message.loading(intl.formatMessage({ defaultMessage: '执行中' }))
        try {
          await fn(...args)
          await mutateApi()
        } catch (_) {
          // ignore
        }
        hide()
      }) as any
    },
    [intl]
  )
  // 对所有修改操作进行一次封装，提供loading和刷新效果
  // const executeWrapper = useCallback(
  //   (fn: Function) => {
  //     return (async (...args: any) => {
  //       const hide = message.loading(intl.formatMessage({ defaultMessage: '执行中' }))
  //       try {
  //         await fn(...args)
  //         await mutateApi()
  //       } catch (_) {
  //         // ignore
  //       }
  //       hide()
  //     }) as typeof fn
  //   },
  //   [intl]
  // )
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
    void mutateApi()
    localStorage.removeItem(`_api_args_${node.data.id}`)
    // TODO 删除后的自动跳转逻辑
  })
  const handleAddNode = executeWrapper(async (path: string, isDir: boolean) => {
    if (isDir) {
      await requests.post('/operateApi/dir', { path })
    } else {
      const result = await requests.post<unknown, { id: number }>('/operateApi', { path })
      navigate(`/workbench/apimanage/${result?.id}`)
    }
  })
  const handleRenameNode = executeWrapper(async (node: FileTreeNode, newName: string) => {
    const oldPath = node.data.path
    const newPath = oldPath.replace(/[^/]+$/, newName)
    if (node.isDir) {
      await requests.put('/operateApi/dir', { oldPath, newPath })
    } else {
      await requests.put(`/operateApi/rename/${node.data.id}`, { path: newPath })
    }
  })
  const handleMove = executeWrapper(
    async (dragNode: FileTreeNode, dropNode: FileTreeNode | null) => {
      const oldPath = dragNode.data.path
      const newPath = `${dropNode?.data?.path ?? ''}/${dragNode.name}`
      if (dragNode.isDir) {
        await requests.put('/operateApi/dir', { oldPath, newPath })
      } else {
        await requests.put(`/operateApi/rename/${dragNode.data.id}`, { path: newPath })
      }
    }
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
          <div
            className={`${styles.method} ${
              styles[`method_${nodeData.data.method?.toLowerCase()}`]
            }`}
          >
            {nodeData.data.method?.toUpperCase()}
          </div>
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
                        <CopyOutlined />
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
                        <img
                          alt="zhongmingming"
                          src="assets/iconfont/zhongmingming.svg"
                          style={{ height: '1em', width: '1em' }}
                        />
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
                            <img
                              alt="shanchu"
                              src="assets/iconfont/shanchu.svg"
                              style={{ height: '1em', width: '1em' }}
                            />
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

  const { validateName, validateAPI } = useValidate()
  const onValidateName = (name: string, isDir = false) => {
    if (isDir) {
      let err = validateName(name)
      if (err) {
        void message.error(err)
        return false
      }
    } else {
      let err = validateAPI(name)
      if (err) {
        void message.error(err)
        return false
      }
    }
    return true
  }

  const buildContextMenu = useCallback(
    (nodeList: FileTreeNode[]) => {
      const menu: ItemType[] = []
      const hasApi = nodeList.some(x => !x.isDir)
      if (hasApi) {
        menu.push(
          ...[
            {
              key: 'on',
              onClick: () => void handleBatchSwitch(nodeList, true),
              disabled: !nodeList.some(x => !x.isDir && !x.data.enabled),
              label: <FormattedMessage defaultMessage="上线" />
            },
            {
              key: 'off',
              onClick: () => void handleBatchSwitch(nodeList, false),
              disabled: !nodeList.some(x => !x.isDir && x.data.enabled),
              label: <FormattedMessage defaultMessage="下线" />
            },
            {
              key: 'delete',
              onClick: () => void handleBatchDelete(nodeList),
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
        rootClassName={styles.treeContainer}
        treeData={treeData}
        titleRender={titleRender}
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
