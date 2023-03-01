import { message, Modal, Tooltip } from 'antd'
import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'

import ApiConfig from '@/components/ApiConfig'
import type { FileTreeNode, FileTreeRef } from '@/components/FileTree'
import FileTree from '@/components/FileTree'
import { mutateApi, useApiList } from '@/hooks/store/api'
import { useValidate } from '@/hooks/validate'
import type { OperationResp } from '@/interfaces/apimanage'
import events from '@/lib/event/events'
import { registerHotkeyHandler } from '@/services/hotkey'

// import GraphiQLApp from '@/pages/graphiql'
import styles from './ApiPanel.module.less'
import type { SidePanelProps } from './SidePanel'
import SidePanel from './SidePanel'

type ActionT = '创建文件' | '创建目录' | '编辑' | '重命名' | null

export default function ApiPanel(props: Omit<SidePanelProps, 'title'>) {
  const intl = useIntl()
  const navigate = useNavigate()
  const location = useLocation()
  const [action, setAction] = useState<ActionT>(null)
  const [treeData, setTreeData] = useState<FileTreeNode[]>([])
  // 多选状态，用于批量操作
  const [currEditingKey, setCurrEditingKey] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [query, setQuery] = useState<string>()
  const [isBlur, setIsBlur] = useState(false)
  const [panelOpened, setPanelOpened] = useState(false) // 面板是否展开
  const [scrollBottom, setScrollBottom] = useState<boolean>() // 滚动到底部
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const fileTree = useRef<FileTreeRef>({
    addItem: () => {}
  })
  const currEditingNode = useMemo(() => {
    if (!currEditingKey) return null
    return getNodeByKey(currEditingKey, treeData)
  }, [currEditingKey, treeData])

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
  }, [])

  // 监听location变化，及时清空选中状态
  useEffect(() => {
    // 尝试自动选中当前项
    if (treeData) {
      const pathId = Number((location.pathname.match(/\/apimanage\/(\d+)/) ?? [])[1] ?? 0)
      if (pathId) {
        const currentNode = getNodeById(pathId, treeData)
        if (currentNode) {
          setSelectedKeys([currentNode.key as string])
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

  useEffect(() => {
    if (currEditingNode) {
      const node = findEmptyTitleNode(treeData)
      if (!node) return
      setCurrEditingKey(node.key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData])

  useEffect(() => {
    if (!isModalVisible && isBlur) {
      setAction(null)
      setCurrEditingKey(null)
      void mutateApi()
    }
    setIsBlur(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible, isBlur])

  // useEffect(() => {
  //   if (action === '编辑' && selectedKey) {
  //     handleEdit()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedKey, action])

  // console.log(multiSelection)

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
          <div className={styles.title}>{nodeData.data.title}</div>
          <div className={styles.suffix}>{miniStatus}</div>
          <div onClick={e => e.stopPropagation()}></div>
        </>
      </div>
    )
  }

  const { validateName, validateAPI } = useValidate()
  const onValidateName = (name: string, isDir = false) => {
    if (isDir) {
      let err = validateName(name)
      if (err) {
        message.error(err)
        return false
      }
    } else {
      let err = validateAPI(name)
      if (err) {
        message.error(err)
        return false
      }
    }
    return true
  }
  return (
    <SidePanel
      {...props}
      title={intl.formatMessage({ defaultMessage: 'API管理' })}
      hideAdd
      scrollBottom={scrollBottom}
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
                // void getFetcher<OperationResp[]>('/operateApi')
                //   .then(res => setTreeData(convertToTree(res)))
                //   // .then(() => setSelectedKey(''))
                //   .then(() => message.success(intl.formatMessage({ defaultMessage: '刷新完成！' })))
                //   .catch((err: Error) => {
                //     message.error(intl.formatMessage({ defaultMessage: '获取文件列表失败！' }))
                //     throw err
                //   })
              }}
            />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ defaultMessage: '全局设置' })}>
            <div className={styles.headerConfig} onClick={() => setIsModalVisible(true)} />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ defaultMessage: '新建目录' })}>
            <div className={styles.headerNewFold} onClick={() => fileTree.current.addItem(false)} />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ defaultMessage: '新建API' })}>
            <div className={styles.headerNewFile} onClick={() => fileTree.current.addItem(false)} />
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
          if (name && onValidateName(name, currEditingNode?.isDir)) {
            // handlePressEnter()
          }
          return false
        }}
        selectedKeys={selectedKeys}
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
      ...x,
      title: x.path.split('/')[x.path.split('/').length - 1]
    },
    name: x.path.split('/')[x.path.split('/').length - 1],
    key: `${lv}-${idx}`,
    isDir: x.isDir,
    children: convertToTree(x.children, `${lv}-${idx}`)
  }))
}

function findEmptyTitleNode(data: FileTreeNode[] | undefined): FileTreeNode | undefined {
  let rv

  const inner = (nodes: FileTreeNode[] | undefined) => {
    if (!nodes) return undefined
    nodes.find(x => {
      if (x.title === '') {
        rv = x
        return x
      } else {
        return inner(x.children ?? undefined)
      }
    })
  }

  inner(data)
  return rv
}

function getNodeById(id: number, data: FileTreeNode[] | undefined): FileTreeNode | undefined {
  let rv
  const inner = (key: number, nodes: FileTreeNode[] | undefined) => {
    if (!nodes) return undefined
    nodes.find(x => {
      if (x.data.id === id) {
        rv = x
        return x
      } else {
        return inner(key, x.children ?? undefined)
      }
    })
  }

  inner(id, data)
  return rv
}

function getNodeByKey(key: string, data: FileTreeNode[] | undefined): FileTreeNode | undefined {
  let rv

  const inner = (key: string, nodes: FileTreeNode[] | undefined) => {
    if (!nodes) return undefined
    nodes.find(x => {
      if (x.key === key) {
        rv = x
        return x
      } else {
        return inner(key, x.children ?? undefined)
      }
    })
  }

  inner(key, data)
  return rv
}
