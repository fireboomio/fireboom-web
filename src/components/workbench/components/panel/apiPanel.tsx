import { Dropdown, Input, Menu, message, Modal, Popconfirm, Tooltip, Tree } from 'antd'
import type { Key } from 'antd/lib/table/interface'
import uniq from 'lodash/uniq'
import type React from 'react'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ApiConfig from '@/components/apiConfig'
import IconFont from '@/components/iconfont'
import type { SidePanelProps } from '@/components/workbench/components/panel/sidePanel'
import SidePanel from '@/components/workbench/components/panel/sidePanel'
import type { DirTreeNode, OperationResp } from '@/interfaces/apimanage'
import { useConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import events from '@/lib/event/events'
import requests, { getFetcher } from '@/lib/fetchers'
import { isEmpty, isUpperCase } from '@/lib/utils'

// import GraphiQLApp from '@/pages/graphiql'
import styles from './apiPanel.module.less'

type ActionT = '创建文件' | '创建目录' | '编辑' | '重命名' | null

export default function ApiPanel(props: Omit<SidePanelProps, 'title'>) {
  const { config } = useConfigContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [action, setAction] = useState<ActionT>(null)
  const [treeData, setTreeData] = useState<DirTreeNode[]>([])
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [currEditingKey, setCurrEditingKey] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [query, setQuery] = useState<string>()
  const [isBlur, setIsBlur] = useState(false)
  const [panelOpened, setPanelOpened] = useState(false) // 面板是否展开
  const [delayAction, setDelayAction] = useState<ActionT>() // 面板展开后执行新增操作
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const currEditingNode = useMemo(() => {
    if (!currEditingKey) return null
    return getNodeByKey(currEditingKey, treeData)
  }, [currEditingKey, treeData])

  const selectedNode = useMemo(() => getNodeByKey(selectedKey, treeData), [selectedKey, treeData])

  const { refreshMap, navCheck, triggerPageEvent } = useContext(WorkbenchContext)

  const isLocationPage = useRef<boolean>()

  // 监听location变化，及时清空选中状态
  useEffect(() => {
    if (!location.pathname.match(/^\/workbench\/apimanage(?:\/\d*)?$/)) {
      isLocationPage.current = false
      setSelectedKey('')
    } else {
      if (!isLocationPage.current) {
        // 如果是从其他页面跳转过来的，需要刷新一下尝试自动选中当前项
        if (treeData) {
          const pathId = Number((location.pathname.match(/\/apimanage\/(\d+)/) ?? [])[1] ?? 0)
          if (pathId) {
            const currentNode = getNodeById(pathId, treeData)
            currentNode?.key && setSelectedKey(currentNode?.key)
          }
        }
      }
      isLocationPage.current = true
    }
  }, [location])
  useEffect(() => {
    if (props.defaultOpen) {
      setPanelOpened(true)
    }
  }, [props.defaultOpen])

  // 数据加载完成后，如果有需要延迟执行的新增操作，则此刻执行并清空标记
  useEffect(() => {
    if (delayAction) {
      handleAddNode(delayAction)
      setDelayAction(undefined)
    }
  }, [treeData])

  useEffect(() => {
    if (!panelOpened) return

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
          openApi(tree, pathId)
          currentNode?.key && setSelectedKey(currentNode?.key)
        }
      })
      .catch((err: Error) => {
        throw err
      })
  }, [panelOpened, refreshFlag, refreshMap.api])

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

  // useEffect(() => {
  //   if (action === '编辑' && selectedKey) {
  //     handleEdit()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedKey, action])

  const handleSelectTreeNode = useCallback(
    (selectedKeys: Key[], { node }: { node: DirTreeNode }) => {
      ;(async () => {
        if (!(await navCheck())) {
          return
        }
        if (node.isDir) {
          navigate(`/workbench/apimanage`, { replace: true })
        } else {
          navigate(`/workbench/apimanage/${node.id}`, { replace: true })
        }
        if (selectedKeys[0] && selectedKeys[0] !== selectedKey) {
          setSelectedKey(selectedKeys[0] as string)
        } else {
          setSelectedKey('')
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
    if (!panelOpened) {
      setDelayAction(action)
      setPanelOpened(true)
      return
    }
    setAction(action)

    const { parent, curr } = getNodeFamily(selectedKey, treeData)

    const node: DirTreeNode = {
      title: '',
      baseDir: curr?.currDir ?? '',
      isDir: action === '创建目录' ? true : false,
      key: Date.now().toString()
    } as DirTreeNode

    if (curr?.children === null) curr.children = []

    const tree = treeData ?? []

    let addTarget
    if (curr?.isDir) {
      // 如果当前目标是目录则向当前目标插入
      addTarget = curr
    } else if (parent) {
      // 否则如果有父目录则向其插入
      addTarget = parent
    }
    if (addTarget) {
      // 有插入目标时，向目标插入并自动展开
      addTarget.children?.push(node)
      if (!expandedKeys.includes(addTarget.key)) {
        setExpandedKeys([...expandedKeys, addTarget.key])
      }
    } else {
      // 无插入目标时，插入根节点
      tree.push(node)
    }

    // 清空输入框内容
    setInputValue('')
    setCurrEditingKey(node.key)
    setTreeData([...tree])
  }

  const validateName = (name: string, isDir = false) => {
    if (!isUpperCase(name[0])) {
      message.error('接口名称必须大写开头')
      return false
    }
    if (!name.match(/^\w[a-zA-Z0-9_]*$/)) {
      message.error('请输入字母、数字或下划线')
      return false
    }
    return true
  }

  const handlePressEnter = () => {
    if (!currEditingNode) {
      setAction(null)
      return
    }
    if (!validateName(inputValue, currEditingNode.isDir)) {
      return
    }

    switch (action) {
      case '重命名':
        if (currEditingNode.isDir) {
          void renameNode(currEditingNode, inputValue).then(res => {
            setCurrEditingKey(null)
            setRefreshFlag(!refreshFlag)
          })
        } else {
          if (!isUpperCase(inputValue[0])) {
            message.error('接口名称必须大写开头')
            return
          }
          void renameApi(currEditingNode, inputValue).then(res => {
            setCurrEditingKey(null)
            if (res) {
              events.emit({
                event: 'titleChange',
                data: { title: inputValue, path: `${currEditingNode.baseDir}/${inputValue}` }
              })
            }
            setRefreshFlag(!refreshFlag)
          })
        }
        break
      case '创建目录':
        void createNode(currEditingNode, inputValue).then(() => {
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
          void message.warn('接口名称必须大写开头！')
        } else {
          handleSaveGql()
          currEditingNode.title = inputValue
          // setQuery('')
          // setIsModalVisible(true)
        }
        break
      default:
        break
    }
  }

  // function handleEdit() {
  //   if (!selectedNode?.path) return
  //
  //   void getFetcher<OperationResp>(`/operateApi/${selectedNode.id}`).then(res => {
  //     setQuery(res.content)
  //   })
  //   setIsModalVisible(true)
  // }

  const handleSaveGql = () => {
    if (action === '创建文件') {
      if (!currEditingNode) return

      void createApi(currEditingNode, inputValue)
        .then(result => {
          if (result?.id) {
            navigate(`/workbench/apimanage/${result?.id}`)
            setCurrEditingKey(null)
            setRefreshFlag(!refreshFlag)
          }
          // void message.success('保存成功')
        })
        .catch(_ => {
          setAction('创建文件')
          return
        })

      // setAction(null)
      // setRefreshFlag(!refreshFlag)
    }
    setAction(null)
    // setIsModalVisible(false)
  }

  const handleDelete = (node: DirTreeNode) => {
    void deleteNode(node).then(() => {
      setCurrEditingKey(null)
      setRefreshFlag(!refreshFlag)
      if (`/workbench/apimanage/${node.id}` === location.pathname) {
        const findList = [...treeData]
        for (;;) {
          const curr = findList.shift()
          if (!curr) {
            navigate('/workbench/apimanage')
            return
          }
          if (curr.children?.length) {
            findList.push(...curr.children)
            continue
          }
          if (!curr.isDir && curr.id !== node.id) {
            navigate(`/workbench/apimanage/${curr.id}`)
            return
          }
        }
      }
    })
  }

  const openApi = (treeData: DirTreeNode[], id?: number) => {
    const expandList: string[] = []
    let fond
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i]
      fond = findApi(node)
      if (fond) {
        break
      }
    }
    function findApi(node: DirTreeNode): DirTreeNode | undefined {
      if (!node.isDir) {
        if (!id || id === node.id) {
          return node
        }
      }
      if (node.children) {
        const matched = node.children.find(findApi)
        if (matched) {
          expandList.push(node.key)
          return matched
        }
      }
    }
    if (fond) {
      setExpandedKeys(uniq([...expandedKeys, ...expandList]))
      return fond
    } else {
      return false
    }
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
              // 记录当前名称
              setInputValue(nodeData.title)
              setAction('重命名')
            }}
          >
            <IconFont type="icon-zhongmingming" />
            <span className="ml-1.5">重命名</span>
          </div>
        )
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
        )
      }
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
        <div className={styles.icon}>
          {nodeData.liveQuery ? <div className={styles.lighting}></div> : null}
        </div>
        {currEditingKey && nodeData.key === currEditingKey ? (
          <Input
            size="small"
            defaultValue={nodeData.title}
            onPressEnter={handlePressEnter}
            onBlur={() => {
              if (inputValue && validateName(inputValue, currEditingNode?.isDir)) {
                handlePressEnter()
              } else {
                setCurrEditingKey(null)
                setRefreshFlag(!refreshFlag)
              }
            }}
            onChange={handleInputChange}
            autoFocus
            onClick={handleInputClick}
            // onBlur={() => setIsBlur(true)}
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
      {...props}
      title="API管理"
      hideAdd
      open={panelOpened}
      onOpen={flag => {
        setPanelOpened(flag)
        props.onOpen && props.onOpen(flag)
      }}
      action={
        <>
          {/*<Tooltip title="筛选" >*/}
          {/*  <div className={styles.headerFilter} />*/}
          {/*</Tooltip>*/}
          <Tooltip title="刷新列表">
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
          </Tooltip>
          <Tooltip title="全局设置">
            <div className={styles.headerConfig} onClick={() => setIsModalVisible(true)} />
          </Tooltip>
          <Tooltip title="新建目录">
            <div className={styles.headerNewFold} onClick={() => handleAddNode('创建目录')} />
          </Tooltip>
          <Tooltip title="新建API">
            <div className={styles.headerNewFile} onClick={() => handleAddNode('创建文件')} />
          </Tooltip>
        </>
      }
    >
      <div className="flex flex-col justify-between h-full">
        <div className={styles.treeContainer}>
          {treeData.length ? (
            <Tree
              rootClassName="overflow-auto"
              // @ts-ignore
              titleRender={titleRender}
              // draggable
              showIcon
              defaultExpandParent
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
              // @ts-ignore
              treeData={treeData}
              selectedKeys={[selectedKey]}
              // @ts-ignore
              onSelect={handleSelectTreeNode}
            />
          ) : null}
        </div>
        <div className={styles.createRowWrapper}>
          <div className={styles.createRow}>
            <span className={styles.btn} onClick={() => handleAddNode('创建文件')}>
              新建
            </span>
            <span> 或者 </span>
            <span className={styles.btn} onClick={() => navigate(`/workbench/apimanage/crud`)}>
              批量新建
            </span>
          </div>
          <div
            className={styles.graphqlEntry}
            onClick={() => {
              const current = new URL(window.location.href)
              if (config.apiHost) {
                window.open(
                  `${current.protocol}//localhost:${current.port}/app/main/graphql`,
                  '_blank'
                )
              } else {
                window.open(
                  `${current.protocol}//${current.hostname}:${config.apiPort}/app/main/graphql`,
                  '_blank'
                )
              }
            }}
          >
            <img alt="" src="/assets/icon/graphql2.svg" />
          </div>
        </div>
      </div>
      <Modal
        title="API全局设置"
        open={isModalVisible}
        onOk={() => {
          setIsModalVisible(false)
        }}
        onCancel={() => {
          setIsModalVisible(false)
        }}
        footer={null}
        centered
      >
        <ApiConfig type="global" onClose={() => setIsModalVisible(false)} />
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
    children: convertToTree(x.children, `${lv}-${idx}`)
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
  return requests.put('/operateApi/dir', {
    oldPath: `${node.path}`,
    newPath: `${node.baseDir}/${value}`
  })
}
function renameApi(node: DirTreeNode, value: string) {
  return requests.put<any, DirTreeNode>(`/operateApi/${node.id}`, {
    ...node,
    path: `${node.baseDir}/${value}`
  })
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

function createNode(node: DirTreeNode, value: string) {
  return requests.post('/operateApi/dir', {
    path: `${node.baseDir}/${value}`
  })
}

function createApi(node: DirTreeNode, value: string) {
  return requests.post<unknown, { id: number }>('/operateApi', {
    path: `${node.baseDir}/${value}`
  })
}
