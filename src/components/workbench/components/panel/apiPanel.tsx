import { Dropdown, Input, Menu, message, Modal, Popconfirm, Tree } from 'antd'
import { Key } from 'antd/lib/table/interface'
import { OperationDefinitionNode, parse } from 'graphql/index'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import IconFont from '@/components/iconfont'
import SidePanel from '@/components/workbench/components/panel/sidePanel'
import type { SidePanelProps } from '@/components/workbench/components/panel/sidePanel'
import { DirTreeNode, OperationResp } from '@/interfaces/apimanage'
import { WorkbenchContext } from '@/lib/context/workbench-context'
import requests, { getFetcher } from '@/lib/fetchers'
import { isEmpty, isUpperCase } from '@/lib/utils'
import GraphiQLApp from '@/pages/graphiql'

import styles from './apiPanel.module.scss'

type ActionT = '创建文件' | '创建目录' | '编辑' | '重命名' | null

export default function ApiPanel(props: Omit<SidePanelProps, 'title'>) {
  const navigate = useNavigate()
  const location = useLocation()
  const [action, setAction] = useState<ActionT>(null)
  const [treeData, setTreeData] = useState<DirTreeNode[]>([])
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [currEditingKey, setCurrEditingKey] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [query, setQuery] = useState<string>()
  const [isBlur, setIsBlur] = useState(false)
  const currEditingNode = useMemo(() => {
    if (!currEditingKey) return null
    return getNodeByKey(currEditingKey, treeData)
  }, [currEditingKey, treeData])

  const selectedNode = useMemo(() => getNodeByKey(selectedKey, treeData), [selectedKey, treeData])

  const { refreshMap, navCheck } = useContext(WorkbenchContext)

  // 监听location变化，及时清空选中状态
  useEffect(() => {
    if (location.pathname !== `/apimanage/${selectedNode?.id || ' '}`) {
      setSelectedKey('')
    }
  }, [location])

  useEffect(() => {
    getFetcher<OperationResp[]>('/operateApi')
      // .then(x => {
      //   console.log('tree', convertToTree(x))
      //   return x
      // })
      .then(res => {
        const tree = convertToTree(res, '0')
        setTreeData(tree)

        // 根据当前path识别需要选中高亮的项目
        const pathId = Number((location.pathname.match(/\/apimanage\/(\d+)/) ?? [])[1] ?? 0)
        if (pathId) {
          const currentNode = getNodeById(pathId, tree)
          currentNode?.key && setSelectedKey(currentNode?.key)
        }
      })
      .catch((err: Error) => {
        throw err
      })
  }, [refreshFlag, refreshMap.api])

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
      setRefreshFlag(!refreshFlag)
    }
    setIsBlur(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalVisible, isBlur])

  useEffect(() => {
    if (action === '编辑' && selectedKey) {
      handleEdit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, action])

  const handleSelectTreeNode = useCallback(
    (selectedKeys: Key[], { node }: { node: DirTreeNode }) => {
      ~(async () => {
        if (node.isDir) {
          return
        }
        if (!await navCheck()) {
          return
        }
        navigate(`apimanage/${node.id}`)
        if (selectedKeys[0] && selectedKeys[0] !== selectedKey) {
          setSelectedKey(selectedKeys[0] as string)
        }
      })()
    },
    [navCheck]
  )

  function calcMiniStatus(nodeData: DirTreeNode) {
    if (nodeData.legal) {
      return <div className={styles.errLabel}>非法</div>
    } else if (!nodeData.isPublic) {
      return '内部'
    } else {
      return nodeData.method
    }
  }

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
    []
  )

  const handleInputClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }, [])

  const handleAddNode = (action: ActionT) => {
    setAction(action)

    const { parent, curr } = getNodeFamily(selectedKey, treeData)

    const node: DirTreeNode = {
      title: '',
      baseDir: curr?.currDir ?? '',
      isDir: action === '创建目录' ? true : false,
      key: Date.now().toString(),
    } as DirTreeNode

    if (curr?.children === null) curr.children = []

    const tree = treeData ?? []

    if (curr?.isDir) {
      curr.children.push(node)
    } else if (parent) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parent.children!.push(node)
    } else {
      tree.push(node)
    }

    setCurrEditingKey(node.key)
    setTreeData([...tree])
  }

  const handlePressEnter = () => {
    if (!currEditingNode) {
      setAction(null)
      return
    }

    switch (action) {
      case '重命名':
        void renameNode(currEditingNode, inputValue).then(() => {
          setCurrEditingKey(null)
          setRefreshFlag(!refreshFlag)
        })
        break
      case '创建目录':
        void createNode(currEditingNode, inputValue, '').then(() => {
          setCurrEditingKey(null)
          setRefreshFlag(!refreshFlag)
        })
        break
      case '创建文件':
        if (isEmpty(inputValue)) {
          setCurrEditingKey(null)
          setRefreshFlag(!refreshFlag)
          // @ts-ignore
        } else if (!isUpperCase(inputValue.at(0))) {
          void message.warn('文件名必须以大写字母开头！')
        } else {
          currEditingNode.title = inputValue
          setQuery('')
          setIsModalVisible(true)
        }
        break
      default:
        break
    }
  }

  function handleEdit() {
    if (!selectedNode?.path) return

    void getFetcher<OperationResp>(`/operateApi/${selectedNode.id}`).then(res => {
      setQuery(res.content)
    })
    setIsModalVisible(true)
  }

  const handleSaveGql = (query: string) => {
    if (action === '创建文件') {
      if (!currEditingNode) return

      void createNode(currEditingNode, inputValue, query)
        .then(() => {
          setCurrEditingKey(null)
          setRefreshFlag(!refreshFlag)
          void message.success('保存成功')
        })
        .catch(_ => {
          return
        })

      // setAction(null)
      // setRefreshFlag(!refreshFlag)
    } else if (action === '编辑') {
      const op = parse(query, { noLocation: true }).definitions[0] as OperationDefinitionNode

      if (!selectedNode) return
      void requests
        .put(`/operateApi/content/${selectedNode.id}`, {
          content: query,
          operationType: op.operation,
        })
        .then(() => void message.success('保存成功'))
        .then(() => setRefreshFlag(!refreshFlag))
    }
    setAction(null)
    setIsModalVisible(false)
  }

  const handleDelete = (node: DirTreeNode) => {
    void deleteNode(node).then(() => {
      setCurrEditingKey(null)
      setRefreshFlag(!refreshFlag)
    })
  }
  const titleRender = (nodeData: DirTreeNode) => {
    const miniStatus = calcMiniStatus(nodeData)
    let itemTypeClass
    if (nodeData.isDir) {
      itemTypeClass = styles.treeItemDir
    } else if (nodeData.legal) {
      itemTypeClass = styles.treeItemErr
    } else if (!nodeData.enable) {
      itemTypeClass = styles.treeItemDisable
    } else {
      itemTypeClass = styles.treeItemFile
    }
    let menuItems = [
      {
        key: 'rename',
        label: (
          <div
            onClick={() => {
              setCurrEditingKey(nodeData.key)
              setAction('重命名')
            }}
          >
            <IconFont type="icon-zhongmingming" />
            <span className="ml-1.5">重命名</span>
          </div>
        ),
      },
      {
        key: 'edit',
        label: (
          <div
            onClick={() => {
              setAction('编辑')
              setSelectedKey(nodeData.key)
            }}
          >
            <IconFont type="icon-chakan" />
            <span className="ml-1.5">编辑</span>
          </div>
        ),
      },
      {
        key: 'delete',
        label: (
          <Popconfirm
            title="确定删除吗?"
            onConfirm={() => handleDelete(nodeData)}
            okText="删除"
            cancelText="取消"
            placement="right"
          >
            <a href="#" onClick={e => e.stopPropagation()}>
              <IconFont type="icon-shanchu" />
              <span className="ml-1.5">删除</span>
            </a>
          </Popconfirm>
        ),
      },
    ]
    if (nodeData.isDir) {
      menuItems = menuItems.filter(x => x.key !== 'edit')
    }
    const menu = (
      <Menu
        // onClick={menuInfo => handleMenuClick(menuInfo, nodeData)}
        items={menuItems}
      />
    )

    return (
      <div className={`${styles.treeItem} ${itemTypeClass}`}>
        <div className={styles.icon} />
        {currEditingKey && nodeData.key === currEditingKey ? (
          <Input
            size="small"
            defaultValue={nodeData.title}
            onPressEnter={handlePressEnter}
            onChange={handleInputChange}
            autoFocus
            onClick={handleInputClick}
            onBlur={() => setIsBlur(true)}
          />
        ) : (
          <>
            <div className={styles.title}>{nodeData.title}</div>
            <div className={styles.suffix}>{miniStatus}</div>
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <div className={styles.more} onClick={e => e.stopPropagation()} />
            </Dropdown>
          </>
        )}
      </div>
    )
  }

  return (
    <SidePanel
      title="API管理"
      {...props}
      action={
        <>
          <div className={styles.headerFilter} />
          <div
            className={styles.headerRefresh}
            onClick={() => {
              void getFetcher<OperationResp[]>('/operateApi')
                .then(res => setTreeData(convertToTree(res)))
                // .then(() => setSelectedKey(''))
                .then(() => message.success('刷新完成！'))
                .catch((err: Error) => {
                  void message.error('获取文件列表失败！')
                  throw err
                })
            }}
          />
          <div className={styles.headerConfig} />
          <div className={styles.headerNewFold} onClick={() => handleAddNode('创建目录')} />
          <div className={styles.headerNewFile} onClick={() => navigate('/apimanage/new')} />
        </>
      }
    >
      <div className={styles.treeContainer}>
        <Tree
          rootClassName="overflow-auto"
          // @ts-ignore
          titleRender={titleRender}
          // draggable
          showIcon
          defaultExpandAll={true}
          defaultExpandParent
          // @ts-ignore
          treeData={treeData}
          selectedKeys={[selectedKey]}
          // @ts-ignore
          onSelect={handleSelectTreeNode}
        />
      </div>
      <Modal
        title="GraphiQL"
        open={isModalVisible}
        onOk={() => {
          setCurrEditingKey(null)
          setAction(null)
          setIsModalVisible(false)
        }}
        onCancel={() => {
          setCurrEditingKey(null)
          setAction(null)
          setIsModalVisible(false)
        }}
        footer={null}
        centered
        bodyStyle={{ height: '90vh' }}
        width={'90vw'}
      >
        <GraphiQLApp data={query} onSave={handleSaveGql} />
      </Modal>
    </SidePanel>
  )
}

function convertToTree(data: OperationResp[] | null, lv = '0'): DirTreeNode[] {
  if (!data) return []
  return data.map((x, idx) => ({
    ...x,
    key: `${lv}-${idx}`,
    title: x.path.split('/')[x.path.split('/').length - 1],
    baseDir: x.path.split('/').slice(0, -1).join('/'),
    currDir: x.isDir ? x.path : x.path.split('/').slice(0, -1).join('/'),
    children: convertToTree(x.children, `${lv}-${idx}`),
  }))
}

function findEmptyTitleNode(data: DirTreeNode[] | undefined): DirTreeNode | undefined {
  let rv

  const inner = (nodes: DirTreeNode[] | undefined) => {
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

function getNodeById(id: number, data: DirTreeNode[] | undefined): DirTreeNode | undefined {
  let rv
  const inner = (key: number, nodes: DirTreeNode[] | undefined) => {
    if (!nodes) return undefined
    nodes.find(x => {
      if (x.id === id) {
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

function getNodeByKey(key: string, data: DirTreeNode[] | undefined): DirTreeNode | undefined {
  let rv

  const inner = (key: string, nodes: DirTreeNode[] | undefined) => {
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

function renameNode(node: DirTreeNode, value: string) {
  if (node.isDir) {
    return requests.put('/operateApi/dir', {
      oldPath: `${node.path}`,
      newPath: `${node.baseDir}/${value}`,
    })
  } else {
    return requests.put(`/operateApi/${node.id}`, {
      ...node,
      path: `${node.baseDir}/${value}`,
    })
  }
}

function getNodeFamily(key: string, data?: DirTreeNode[]) {
  let parent: DirTreeNode | undefined
  let curr: DirTreeNode | undefined

  const inner = (key: string, nodes?: DirTreeNode[]) => {
    if (!nodes) return []
    parent = undefined
    nodes.find(x => {
      if (x.key === key) {
        curr = x
        return [parent, curr]
      } else {
        if (!isEmpty(x.children)) parent = x
        return inner(key, x.children ?? undefined)
      }
    })
  }
  inner(key, data)

  parent = curr ? parent : undefined
  return { parent, curr }
}

function deleteNode(node: DirTreeNode) {
  if (node.isDir) {
    return requests.delete('/operateApi/dir', { data: { path: node.path } })
  } else {
    return requests.delete(`/operateApi/${node.id}`)
  }
}

function createNode(node: DirTreeNode, value: string, content: string) {
  if (node.isDir) {
    return requests.post('/operateApi/dir', {
      path: `${node.baseDir}/${value}`,
    })
  } else {
    const op = parse(content, { noLocation: true }).definitions[0] as OperationDefinitionNode

    return requests.post('/operateApi', {
      path: `${node.baseDir}/${value}`,
      content: content,
      operationType: op.operation,
    })
  }
}
