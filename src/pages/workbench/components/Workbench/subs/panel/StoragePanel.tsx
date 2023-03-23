import { App, Dropdown, message, Popconfirm, Tooltip } from 'antd'
import { cloneDeep, set } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import type { FileTreeNode, FileTreeRef } from '@/components/FileTree'
import FileTree from '@/components/FileTree'
import { mutateStorage, useStorageList } from '@/hooks/store/storage'
import { useValidate } from '@/hooks/validate'
import requests from '@/lib/fetchers'

import type { SidePanelProps } from './SidePanel'
import SidePanel from './SidePanel'
import styles from './StoragePanel.module.less'

export default function StoragePanel(props: Omit<SidePanelProps, 'title'>) {
  const intl = useIntl()
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const [treeData, setTreeData] = useState<FileTreeNode[]>()
  const [panelOpened, setPanelOpened] = useState(false) // 面板是否展开
  const [selectedKey, setSelectedKey] = useState<string>('')
  const { validateName } = useValidate()
  const fileTree = useRef<FileTreeRef>({
    addItem: () => {},
    editItem: () => {}
  })

  // // 监听location变化，及时清空选中状态
  useEffect(() => {
    // 如果当前url不是/storage/xxx的形式，清空选中状态
    if (
      !treeData ||
      !params.id ||
      params.id === 'new' ||
      !location.pathname.startsWith('/workbench/storage')
    ) {
      setSelectedKey('')
      return
    }
    // 如果当前url对应的项目不存在，跳转到/storage
    const node = treeData.find(x => String(x.data.id) === params.id)
    if (!node) {
      navigate('/workbench/storage', { replace: true })
      return
    }
    // 如果当前url对应的项目存在，但是profile不存在，跳转到/storage/xxx
    if (params.profile && !node.children?.find(x => x.key === `${params.id}_${params.profile}`)) {
      navigate(`/workbench/storage/${params.id}`, { replace: true })
      return
    }
    // 如果当前url对应的项目存在，且profile存在，选中对应的节点
    setSelectedKey((params.profile ? `${params.id}_${params.profile}` : params.id) ?? '')
  }, [location, navigate, params, treeData])
  useEffect(() => {
    if (props.defaultOpen) {
      setPanelOpened(true)
    }
  }, [props.defaultOpen])

  const storageList = useStorageList()
  useEffect(() => {
    const tree = (storageList ?? []).map(item => ({
      data: item,
      key: String(item.id),
      name: item.name,
      isDir: true,
      children: Object.entries(item.config.uploadProfiles ?? {}).map(([key, subItem]) => ({
        data: subItem,
        key: `${item.id}_${key}`,
        name: key,
        isDir: false
      }))
    }))
    setTreeData(tree)
  }, [storageList])

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
          !skipMutate && (await mutateStorage())
        } catch (_) {
          // ignore
        }
        hide()
      }) as any
    },
    [intl]
  )
  const handleDelete = executeWrapper(async (node: FileTreeNode) => {
    if (!node.isDir) {
      await requests.delete(`/storageBucket/${node.parent!.data.id}`, {
        data: { profileNames: [node.name] }
      })
    } else {
      await requests.delete(`/storageBucket/${node.data.id}`)
    }
  })
  const onValidateName = (name: string, isDir = false) => {
    let err = validateName(name)
    if (err) {
      void message.error(err)
      return false
    }
    return true
  }
  const handleRenameNode = executeWrapper(async (node: FileTreeNode, newName: string) => {
    if (!node.isDir) {
      await requests.put(`/storageBucket/rename/${node.parent!.data.id}`, {
        oldProfileName: node.name,
        newProfileName: newName
      })
      await mutateStorage()
      if (params.id === String(node.parent!.data.id) && params.profile === node.name) {
        navigate(`/workbench/storage/${node.parent!.data.id}/profile/${newName}`)
      }
    } else {
      await requests.put(`/storageBucket/rename/${node.data.id}`, { newStorageName: newName })
      await mutateStorage()
    }
  }, true)

  const titleRender = (nodeData: FileTreeNode) => {
    let itemTypeClass
    if (nodeData.isDir) {
      itemTypeClass = styles.treeItemDir
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
          <div onClick={e => e.stopPropagation()}>
            <Dropdown
              destroyPopupOnHide
              menu={{
                items: [
                  {
                    key: 'profile',
                    onClick: async () => {
                      const currentProfileSet = new Set(
                        Object.keys(nodeData.data.config.uploadProfiles ?? {})
                      )
                      let i = 1
                      while (currentProfileSet.has(`NewProfile${i}`)) {
                        i++
                      }
                      const data = cloneDeep(nodeData.data)
                      set(data, `config.uploadProfiles.NewProfile${i}`, {
                        hooks: {},
                        maxAllowedUploadSizeBytes: 10 * 2 ** 20,
                        maxAllowedFiles: 1
                      })
                      await requests.put('/storageBucket ', data)
                      await mutateStorage()
                      navigate(`/workbench/storage/${nodeData.data.id}/profile/NewProfile${i}`)
                    },
                    label: <FormattedMessage defaultMessage="新建 Profile" />
                  },
                  {
                    key: 'detail',
                    onClick: () => {
                      navigate(`/workbench/storage/${nodeData.data.id}`)
                    },
                    label: <FormattedMessage defaultMessage="查看" />
                  },
                  {
                    key: 'rename',
                    onClick: () => {
                      fileTree.current.editItem(nodeData.key)
                    },
                    label: <FormattedMessage defaultMessage="重命名" />
                  },
                  {
                    key: 'delete',
                    label: (
                      <div
                        onClick={e => {
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
                            <FormattedMessage defaultMessage="删除" />
                          </div>
                        </Popconfirm>
                      </div>
                    )
                  }
                ].filter(x => ['delete', 'rename'].includes(x.key) || nodeData.isDir)
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

  return (
    <SidePanel
      {...props}
      title={intl.formatMessage({ defaultMessage: '文件存储' })}
      hideAdd
      open={panelOpened}
      onOpen={flag => {
        setPanelOpened(flag)
        props.onOpen && props.onOpen(flag)
      }}
      action={
        <>
          <Tooltip title={intl.formatMessage({ defaultMessage: '新建' })}>
            <div
              className={styles.headerNewFile}
              onClick={() => {
                setPanelOpened(true)
                navigate(`/workbench/storage/new`)
              }}
            />
          </Tooltip>
        </>
      }
    >
      <FileTree
        draggable={false}
        fileText={intl.formatMessage({ defaultMessage: '文件存储' })}
        ref={fileTree}
        onSelectFile={nodeData => {
          if (nodeData.isDir) {
            navigate(`/workbench/storage/${nodeData.data.id}/manage`)
          } else {
            navigate(`/workbench/storage/${nodeData.parent.data.id}/profile/${nodeData.name}`)
          }
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
        selectedKey={selectedKey}
        rootClassName="h-full"
        treeClassName={styles.treeContainer}
        treeData={treeData ?? []}
        titleRender={titleRender}
      />
    </SidePanel>
  )
}
