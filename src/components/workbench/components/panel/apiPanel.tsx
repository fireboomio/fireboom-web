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
import { registerHotkeyHandler } from '@/services/hotkey'

// import GraphiQLApp from '@/pages/graphiql'
import styles from './apiPanel.module.less'

type ActionT = '创建文件' | '创建目录' | '编辑' | '重命名' | null

export default function ApiPanel(props: Omit<SidePanelProps, 'title'>) {
  const { config } = useConfigContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [action, setAction] = useState<ActionT>(null)
  const [treeData, setTreeData] = useState<DirTreeNode[]>([])
  // const [selectedKey, setSelectedKey] = useState<string>('')
  // 多选状态，用于批量操作
  const [multiSelection, setMultiSelection] = useState<Key[]>([])
  const [currEditingKey, setCurrEditingKey] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [query, setQuery] = useState<string>()
  const [isBlur, setIsBlur] = useState(false)
  const [panelOpened, setPanelOpened] = useState(false) // 面板是否展开
  const [delayAction, setDelayAction] = useState<ActionT>() // 面板展开后执行新增操作
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [dropDownId, setDropDownId] = useState<string>() // 当前下拉列表的对象id
  const currEditingNode = useMemo(() => {
    if (!currEditingKey) return null
    return getNodeByKey(currEditingKey, treeData)
  }, [currEditingKey, treeData])

  // key到树节点的map
  const keyMap: Record<string, DirTreeNode> = useMemo(() => {
    const map: Record<string, DirTreeNode> = {}
    const nodes = [...treeData]
    while (nodes.length) {
      const node: DirTreeNode | undefined = nodes.pop()
      if (!node) {
        continue
      }
      if (node.children?.length) {
        nodes.push(...node.children)
      }
      map[node.key as string] = node
    }
    return map
  }, [treeData])

  const selectedNode: DirTreeNode[] = useMemo(() => {
    return multiSelection.map(key => keyMap[key]).filter(x => x)
  }, [multiSelection, keyMap])

  const { refreshMap, navCheck, triggerPageEvent } = useContext(WorkbenchContext)

  const isLocationPage = useRef<boolean>()

  // 快捷键
  useEffect(() => {
    const unbind1 = registerHotkeyHandler('alt+n,^+n', () => {
      handleAddNode('创建文件')
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
    if (!location.pathname.match(/^\/workbench\/apimanage(?:\/\d*)?$/)) {
      isLocationPage.current = false
      setMultiSelection([])
    } else {
      if (!isLocationPage.current) {
        // 如果是从其他页面跳转过来的，需要刷新一下尝试自动选中当前项
        if (treeData) {
          const pathId = Number((location.pathname.match(/\/apimanage\/(\d+)/) ?? [])[1] ?? 0)
          if (pathId) {
            const currentNode = getNodeById(pathId, treeData)
            if (currentNode) {
              setMultiSelection([currentNode.key])
            }
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
      .then(res => {
        const tree = convertToTree(res, '0')

        setTreeData(tree)
        // 根据当前path识别需要选中高亮的项目
        const pathId = Number((location.pathname.match(/\/apimanage\/(\d+)/) ?? [])[1] ?? 0)
        if (pathId) {
          const currentNode = getNodeById(pathId, tree)
          openApi(tree, pathId)
          if (currentNode) {
            setMultiSelection([currentNode.key])
          }
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
    (selectedKeys: Key[], e: { node: DirTreeNode; nativeEvent: { shiftKey: boolean } }) => {
      ;(async () => {
        let { node } = e
        // 如果按下shift键，表示多选
        if (e.nativeEvent.shiftKey) {
          let selections
          if (!multiSelection.includes(node.key)) {
            selections = [...multiSelection, node.key]
            setMultiSelection(selections)
          } else {
            selections = multiSelection.filter(x => x !== node.key)
            setMultiSelection(selections)
          }
          if (selections.length !== 1) {
            return
          } else {
            const targetNode = getNodeByKey(selections[0] as string, treeData)
            if (!targetNode) {
              return
            }
            node = targetNode
          }
        }
        if (!(await navCheck())) {
          return
        }
        setMultiSelection([])
        if (node.isDir) {
          navigate(`/workbench/apimanage`, { replace: true })
        } else {
          navigate(`/workbench/apimanage/${node.id}`, { replace: true })
        }
        if (node.key !== multiSelection[0]) {
          setMultiSelection([node.key])
        } else {
          setMultiSelection([])
        }
      })()
    },
    [navCheck, multiSelection]
  )
  // console.log(multiSelection)

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
    if (multiSelection.length > 1) {
      message.error('只能选择一个节点')
      return
    }
    if (!panelOpened) {
      setDelayAction(action)
      setPanelOpened(true)
      return
    }
    setAction(action)

    const { parent, curr } = getNodeFamily(multiSelection[0] as string, treeData)

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

  // 移除临时插入的节点
  const removeNewNode = (tree?: DirTreeNode[]): DirTreeNode[] => {
    if (tree) {
      return tree.filter(x => {
        if (x.children) {
          x.children = removeNewNode(x.children)
        }
        return x.id !== undefined
      })
    } else {
      setTreeData(
        treeData.filter(x => {
          if (x.children) {
            x.children = removeNewNode(x.children)
          }
          return x.id !== undefined
        })
      )
      return treeData
    }
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
    setAction(null)
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

  async function batchSwitch(flag: boolean) {
    await requests.post('operateApi/batchOnline', {
      Ids: selectedNode.map(x => x.id),
      enable: flag
    })
    message.success('操作成功')
    setRefreshFlag(!refreshFlag)
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
          <div onClick={e => e.stopPropagation()}>
            <Popconfirm
              title="确定删除吗?"
              onConfirm={() => {
                handleDelete(nodeData)
                setDropDownId(undefined)
              }}
              onCancel={() => {
                setDropDownId(undefined)
              }}
              okText="删除"
              cancelText="取消"
              placement="right"
            >
              <IconFont type="icon-shanchu" />
              <span className="ml-1.5">删除</span>
            </Popconfirm>
          </div>
        )
      }
    ]
    if (nodeData.isDir) {
      menuItems = menuItems.filter(x => x.key !== 'edit')
    }
    const menu = (
      <Menu
        onClick={e => {
          if (e.key !== 'delete') {
            setDropDownId(undefined)
          }
        }}
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
                removeNewNode()
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
            <div onClick={e => e.stopPropagation()}>
              <Dropdown
                open={dropDownId === nodeData.key}
                onOpenChange={flag => {
                  setDropDownId(flag ? nodeData.key : undefined)
                }}
                destroyPopupOnHide
                overlay={menu}
                trigger={['click']}
                placement="bottomRight"
              >
                <div className={styles.more} onClick={e => e.preventDefault()} />
              </Dropdown>
            </div>
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
      <Dropdown
        overlay={
          <Menu
            items={[
              {
                disabled: !selectedNode.some(x => !x.enable),
                key: 'enable',
                label: (
                  <div
                    onClick={() => {
                      void batchSwitch(true)
                    }}
                  >
                    上线
                  </div>
                )
              },
              {
                disabled: !selectedNode.some(x => x.enable),
                key: 'disable',
                label: (
                  <div
                    onClick={() => {
                      void batchSwitch(true)
                    }}
                  >
                    下线
                  </div>
                )
              },
              {
                disabled: !selectedNode.length,
                key: 'delete',
                label: (
                  <div
                    onClick={() => {
                      setMultiSelection([])
                      Modal.confirm({
                        title: '是否确认删除选中的API？',
                        onOk: () => {
                          const ids = selectedNode.map(x => x.id).filter(x => x)
                          requests.post('operateApi/batchDelete', { ids }).then(() => {
                            message.success('删除成功')
                            setRefreshFlag(!refreshFlag)
                          })
                          // setEditFlag(false)
                          // resolve(true)
                        },
                        okText: '确认',
                        cancelText: '取消'
                      })
                    }}
                  >
                    删除
                  </div>
                )
              },
              {
                key: 'cancel',
                label: (
                  <div
                    onClick={() => {
                      setMultiSelection([])
                    }}
                  >
                    取消
                  </div>
                )
              }
            ]}
          />
        }
        trigger={['contextMenu']}
      >
        <div className="flex flex-col h-full justify-between">
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
                multiple
                selectedKeys={multiSelection}
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
            <Tooltip title="测试">
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
            </Tooltip>
          </div>
        </div>
      </Dropdown>
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
  return requests
    .put(`/operateApi/rename/${node.id}`, {
      path: `${node.baseDir}/${value}`
    })
    .catch(e => {
      console.error(e)
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
