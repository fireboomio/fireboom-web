import {
  CaretRightOutlined,
  DownOutlined,
  FileAddOutlined,
  FileOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import {
  Modal,
  Tooltip,
  Divider,
  Tree,
  Dropdown,
  Menu,
  message,
  Input,
  Popconfirm,
  Switch,
  Button,
} from 'antd'
import { Key } from 'antd/lib/table/interface'
import Head from 'next/head'
import { FC, useCallback, useEffect, useState, useReducer, useMemo } from 'react'
import { useImmer } from 'use-immer'

import Detail from '@/components/apimanage/Detail'
import Hook from '@/components/apimanage/Hook'
import Mock from '@/components/apimanage/Mock'
import Setting from '@/components/apimanage/Setting'
import { DatasourcePannel, DatasourceContainer } from '@/components/datasource'
import IconFont from '@/components/iconfont'
import RcTab from '@/components/rc-tab'
import type { DirTreeNode, OperationResp } from '@/interfaces/apimanage'
import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceContext,
  DatasourceDispatchContext,
  DatasourceCurrDBContext,
  DatasourceToggleContext,
} from '@/lib/context'
import requests, { getFetcher } from '@/lib/fetchers'
import datasourceReducer from '@/lib/reducers/datasource-reducer'
import { isEmpty } from '@/lib/utils'

import GraphiQLApp from '../graphiql'
import styles from './index.module.scss'

type ApiManageProps = {
  //
}

const tabs = [
  { title: '详情', key: '0' },
  { title: 'Mock', key: '1' },
  { title: '钩子', key: '2' },
  { title: '设置', key: '3' },
  // { title: '调用', key: '4' },
]

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

function findNode(key: string, data: DirTreeNode[] | undefined): DirTreeNode | undefined {
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

function getNodeFamily(key: string, data?: DirTreeNode[]) {
  let parent: DirTreeNode | undefined
  let curr: DirTreeNode | undefined

  const inner = (key: string, nodes?: DirTreeNode[]) => {
    if (!nodes) return []
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

function renameNode(node: DirTreeNode, value: string) {
  if (node.isDir) {
    return requests.put('/operateApi/dir', {
      oldPath: `${node.path}`,
      newPath: `${node.baseDir}/${value}`,
    })
  } else {
    return requests.put(`/operateApi/${node.id}`, {
      path: `${node.baseDir}/${value}`,
    })
  }
}

function deleteNode(node: DirTreeNode) {
  if (node.isDir) {
    return requests.delete('/operateApi/dir', { data: { path: node.path } })
  } else {
    return requests.delete(`/operateApi/${node.id}`)
  }
}

function createNode(node: DirTreeNode, value: string) {
  if (node.isDir) {
    return requests.post('/operateApi/dir', {
      path: `${node.baseDir}/${value}`,
    })
  } else {
    return requests.put(`/operateApi/${node.id}`, {
      path: `${node.baseDir}/${value}`,
    })
  }
}

const ApiManage: FC<ApiManageProps> = () => {
  const [action, setAction] = useState<'创建文件' | '创建目录' | '编辑' | '重命名' | null>(null)
  const [treeData, setTreeData] = useState<DirTreeNode[]>([])
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [currEditingKey, setCurrEditingKey] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [activeKey, setActiveKey] = useState<string>('0')
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isSettingVisible, setIsSettingVisible] = useState(false)
  const [isHookVisible, setIsHookVisible] = useState(false)
  const [query, setQuery] = useState<string>()

  const selectedNode = useMemo(() => findNode(selectedKey, treeData), [selectedKey, treeData])
  const currEditingNode = useMemo(() => {
    if (!currEditingKey) return null
    return findNode(currEditingKey, treeData)
  }, [currEditingKey, treeData])

  //datasource逻辑-----
  const [showDatasource, setShowDatasource] = useImmer(false)
  const [datasource, dispatch] = useReducer(datasourceReducer, [])
  const [showType, setShowType] = useImmer('data')
  const [currDBId, setCurrDBId] = useImmer<number | null | undefined>(null)

  useEffect(() => {
    requests
      .get<unknown, DatasourceResp[]>('/dataSource')
      .then(res => {
        dispatch({
          type: 'fetched',
          data: res,
        })
        setCurrDBId(res.filter(item => item.sourceType == 1).at(0)?.id)
      })
      .catch((err: Error) => {
        throw err
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickItem = (datasourceItem: DatasourceResp) => {
    setShowDatasource(true)
    if (datasourceItem.name == '') {
      setShowType('edit')
    } else {
      setShowType('data')
    }
    setCurrDBId(datasourceItem.id)
  }

  const handleToggleDesigner = (type: string, id?: number, sourceType?: number) => {
    setShowDatasource(true)
    setShowType(type)
    //新增的item点击取消逻辑 // 0 会显示一个空页面
    if (id && id < 0) {
      setCurrDBId(datasource.filter(item => item.sourceType == sourceType).at(0)?.id || 0)
    } else setCurrDBId(id)
  }

  const content = datasource.find(b => b.id === currDBId) as DatasourceResp
  //-----datasource逻辑

  useEffect(() => {
    getFetcher<OperationResp[]>('/operateApi')
      .then(x => {
        console.log('tree', convertToTree(x))
        return x
      })
      .then(res => setTreeData(convertToTree(res)))
      .catch((err: Error) => {
        throw err
      })
  }, [refreshFlag])

  useEffect(() => {
    if (currEditingNode) {
      const node = findEmptyTitleNode(treeData)
      if (!node) return
      setCurrEditingKey(node.key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData])

  const handlePressEnter = () => {
    if (!currEditingNode) {
      setAction(null)
      return
    }

    if (action === '重命名') {
      void renameNode(currEditingNode, inputValue).then(() => {
        setCurrEditingKey(null)
        setRefreshFlag(!refreshFlag)
      })
    } else if (action === '创建目录') {
      void createNode(currEditingNode, inputValue).then(() => {
        setCurrEditingKey(null)
        setRefreshFlag(!refreshFlag)
      })
    } else if (action === '创建文件') {
      //   if (inputValue === '') {
      //     setAction(null)
      //     setRefreshFlag(!refreshFlag)
      //     return
      //   }
      //   currEditingNode.title = inputValue
      //   // const curPath = `${currEditingNode.path || '/'}${currEditingNode.title}`
      //   void requests
      //     .post('/operateApi/createFile', {
      //       title: `${currEditingNode.path}/${currEditingNode.title}`,
      //       content: query,
      //     })
      //     .then(res => {
      //       if (res) {
      //         setRefreshFlag(!refreshFlag)
      //       }
      //     })
      //     .then(_ => void message.success('保存成功'))
      //     .finally(() => setAction(null))
      // } else if (action === '目录') {
      //   if (inputValue === '') {
      //     setAction(null)
      //     setRefreshFlag(!refreshFlag)
      //     return
      //   }
      //   currEditingNode.title = inputValue
      //   currEditingNode.path = `${currEditingNode.path}/${currEditingNode.title}`
      //   // 新增
      //   void requests
      //     .post('/operateApi/createDic', { path: currEditingNode.path })
      //     .then(_ => void message.success('保存成功'))
      //     .then(() => setRefreshFlag(!refreshFlag))
      //   setAction(null)
    }
  }

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
    []
  )

  const handleInputClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }, [])

  const handleInputBlur = useCallback(() => {
    console.log('action', action)

    setAction(null)
    setCurrEditingKey(null)
    setRefreshFlag(!refreshFlag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, currEditingKey])

  const handleAddDir = () => {
    setAction('创建目录')

    const { parent, curr } = getNodeFamily(selectedKey, treeData)

    const node = {
      title: '',
      baseDir: curr?.currDir ?? '',
      isDir: true,
      key: Date.now().toString(),
    } as DirTreeNode

    const tree = treeData ?? []
    if (!parent) {
      tree.push(node)
    } else if (curr?.isDir) {
      if (curr.children === null) curr.children = []
      curr.children.push(node)
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parent.children!.push(node)
    }

    setCurrEditingKey(node.key)
    setTreeData([...tree])
  }

  const handleAddNode = () => {
    setAction('创建文件')

    const { parent, curr } = getNodeFamily(selectedKey, treeData)
    const currPath = selectedNode?.path ?? ''

    const temp = {
      title: '',
      path: currPath,
      key: Date.now().toString(),
    } as DirTreeNode

    const tree = treeData ?? []
    if (!parent) {
      tree.push(temp)
    } else if (curr) {
      if (curr.id === 0) {
        if (curr.children === null) curr.children = []
        curr.children.push(temp)
      }
    } else {
      // FIXME:
      // @ts-ignore
      parent.children.push(temp)
    }

    setTreeData([...tree])
    const etNode = findEmptyTitleNode(treeData)
    if (!etNode) return
    setCurrEditingKey(etNode.key)
    setIsModalVisible(true)
  }

  function handleEdit() {
    if (!selectedNode?.path) return

    void getFetcher<OperationResp>(`/operateApi/${selectedNode.id}`).then(res => {
      setAction('编辑')
      setQuery(res.content)
    })
    setIsModalVisible(true)
  }

  const handleSaveGql = (query: string) => {
    // 新增
    if (action === '创建文件') {
      if (!currEditingNode) return
      // void requests
      //   .post('/operateApi/createFile', {
      //     title: `${currEditingNode.path}/${currEditingNode.title}`,
      //     content: query,
      //   })
      //   .then(_ => void message.success('保存成功'))

      // setAction(null)
      // setRefreshFlag(!refreshFlag)
    } else if (action === '编辑') {
      if (!selectedNode) return
      void requests
        .put(`/operateApi/${selectedNode.id}`, { ...selectedNode, content: query })
        .then(_ => void message.success('保存成功'))
      setRefreshFlag(!refreshFlag)
    }
    setIsModalVisible(false)
  }

  const handleDelete = (node: DirTreeNode) => {
    void deleteNode(node).then(() => {
      setCurrEditingKey(null)
      setRefreshFlag(!refreshFlag)
    })
  }

  const handleSelectTreeNode = useCallback((selectedKeys: Key[]) => {
    setShowDatasource(false) // 不展示datasource页面
    if (selectedKeys[0] && selectedKeys[0] !== selectedKey) {
      setSelectedKey(selectedKeys[0] as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMenuClick = (info: unknown, nodeData: DirTreeNode) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    info.domEvent.stopPropagation()
    setCurrEditingKey(nodeData.key)
  }

  const titleRender = (nodeData: DirTreeNode) => {
    const menu = (
      <Menu
        onClick={menuInfo => handleMenuClick(menuInfo, nodeData)}
        items={[
          {
            key: '0',
            label: (
              <div onClick={() => setAction('重命名')}>
                <IconFont type="icon-zhongmingming" />
                <span className="ml-1.5">重命名</span>
              </div>
            ),
          },
          {
            key: '1',
            label: (
              <div onClick={handleEdit}>
                <IconFont type="icon-chakan" />
                <span className="ml-1.5">编辑</span>
              </div>
            ),
          },
          {
            key: '2',
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
        ]}
      />
    )

    return (
      <div className="flex justify-between items-center">
        {currEditingKey && nodeData.key === currEditingKey ? (
          <Input
            defaultValue={nodeData.title}
            onPressEnter={handlePressEnter}
            onChange={handleInputChange}
            autoFocus
            onClick={handleInputClick}
            onBlur={handleInputBlur}
          />
        ) : (
          <>
            <span className="truncate max-w-9rem">{nodeData.title}</span>
            <div className="text-12px  space-x-4">
              <span className="text-[#AFB0B499]">{nodeData.method}</span>
              <span className="text-[#AFB0B4]">
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                  <MoreOutlined onClick={e => e.stopPropagation()} />
                </Dropdown>
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  const iconRender = (nodeProps: unknown) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const hasChildren = !isEmpty(nodeProps.data.children) || nodeProps.data.id === 0
    if (hasChildren) {
      // @ts-ignore
      if (nodeProps.expanded) {
        return <FolderOpenOutlined />
      } else {
        return <FolderOutlined />
      }
    } else {
      return <FileOutlined />
    }
  }

  function toggleOperation(checked: boolean) {
    if (!selectedNode) return
    void requests
      .put(`/operateApi/${selectedNode.id}`, { enable: checked })
      .then(() => setRefreshFlag(!refreshFlag))
  }

  const extra = (
    <div className="flex items-center">
      <Switch
        checked={selectedNode?.enable}
        checkedChildren="开启"
        unCheckedChildren="关闭"
        onChange={toggleOperation}
        className="ml-6 w-15 bg-[#8ABE2A]"
      />
      <Button className={`${styles['my-button']} ml-12`} onClick={handleEdit}>
        <span>编辑</span>
      </Button>
    </div>
  )

  return (
    <>
      <Head>
        <title>API 管理</title>
      </Head>

      <DatasourceContext.Provider value={datasource}>
        <DatasourceDispatchContext.Provider value={dispatch}>
          <DatasourceCurrDBContext.Provider value={{ currDBId, setCurrDBId }}>
            <DatasourceToggleContext.Provider value={{ handleToggleDesigner }}>
              <div className={`flex ${styles['api-manage']} h-full`}>
                <div className="w-280px flex-shrink-0  pt-6">
                  <div className="px-4">
                    <div className="flex justify-between text-18px leading-25px">
                      <span className="font-bold">API 管理</span>
                      <IconFont type="icon-wenjianshezhi" style={{ fontSize: '18px' }} />
                    </div>

                    <div className="flex justify-between mt-7">
                      <Tooltip className="cursor-pointer" placement="top" title="设置">
                        <IconFont
                          onClick={() => setIsSettingVisible(!isSettingVisible)}
                          type="icon-shezhi1"
                          style={{ fontSize: '20px' }}
                        />
                      </Tooltip>
                      <Tooltip className="cursor-pointer" placement="top" title="钩子">
                        <IconFont
                          onClick={() => setIsHookVisible(!isHookVisible)}
                          type="icon-shengchanqianyi"
                          style={{ fontSize: '20px' }}
                        />
                      </Tooltip>
                      <Tooltip className="cursor-pointer" placement="top" title="导出">
                        <IconFont type="icon-neisheng" style={{ fontSize: '18px' }} />
                      </Tooltip>
                      <Tooltip className="cursor-pointer" placement="top" title="表单设计器">
                        <IconFont type="icon-biaodanshejiqi" style={{ fontSize: '20px' }} />
                      </Tooltip>
                      <Tooltip className="cursor-pointer" placement="top" title="下载SDK">
                        <IconFont type="icon-xiazaiSDK" style={{ fontSize: '20px' }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Divider style={{ margin: '14px 0', opacity: 0 }} />

                  <div className="flex justify-between px-4">
                    <span className="leading-20px font-bold">概览</span>
                    <div className="space-x-4 flex items-center">
                      <FileAddOutlined onClick={handleAddNode} />
                      <IconFont
                        type="icon-wenjianjia1"
                        style={{ fontSize: '18px' }}
                        onClick={handleAddDir}
                      />
                      <IconFont
                        type="icon-shuaxin"
                        style={{ fontSize: '16px' }}
                        onClick={() => {
                          setRefreshFlag(!refreshFlag)
                          void message.success('刷新完成')
                        }}
                      />
                      <IconFont
                        type="icon-fuzhi"
                        style={{ fontSize: '16px' }}
                        onClick={handleAddNode}
                      />
                    </div>
                  </div>
                  <Divider style={{ margin: '14px 0', opacity: 0 }} />

                  <Tree
                    style={{
                      overflow: 'auto',
                      height: 'calc(100vh - 350px)',
                      marginBottom: '10px',
                    }}
                    // @ts-ignore
                    titleRender={titleRender}
                    icon={iconRender}
                    // draggable
                    showIcon
                    defaultExpandAll
                    defaultExpandParent
                    defaultSelectedKeys={['0']}
                    switcherIcon={<DownOutlined />}
                    // @ts-ignore
                    treeData={treeData}
                    selectedKeys={[selectedKey]}
                    onSelect={handleSelectTreeNode}
                  />
                  {/*--- datasource更改 */}
                  <div className="fixed w-70 bottom-0 bg-white" style={{ overflow: 'auto' }}>
                    <DatasourcePannel onClickItem={handleClickItem} />
                  </div>
                  {/* datasource更改 ---*/}
                </div>

                <div className={styles.divider} />
                {/*--- datasource更改 */}
                {showDatasource ? (
                  <div className={`w-6/7 ${styles['datasource-container']}`}>
                    <DatasourceContainer showType={showType} content={content} />
                    {/* datasource更改 ---*/}
                  </div>
                ) : (
                  <div className="px-6 pt-6 flex-1">
                    <div className="flex justify-between items-center">
                      <div className="flex leading-25px space-x-2">
                        <span className="font-bold text-18px">API 管理</span>
                        <CaretRightOutlined />
                        <span className="text-16px font-bold">{selectedNode?.title ?? ''}</span>
                      </div>
                      <div className="space-x-4">
                        <IconFont type="icon-lianxi" style={{ fontSize: '18px' }} />
                        <IconFont type="icon-wenjian1" style={{ fontSize: '18px' }} />
                        <IconFont type="icon-bangzhu" style={{ fontSize: '18px' }} />
                      </div>
                    </div>

                    <div className="mt-7">
                      <RcTab
                        tabs={tabs}
                        onTabClick={setActiveKey}
                        activeKey={activeKey}
                        extra={extra}
                      />

                      <div className="overflow-auto h-[calc(100vh_-_98px)]">
                        {activeKey === '0' ? (
                          <Detail node={selectedNode} />
                        ) : activeKey === '1' ? (
                          <Mock node={selectedNode} />
                        ) : activeKey === '2' ? (
                          <Hook node={selectedNode} />
                        ) : activeKey === '3' ? (
                          <Setting node={selectedNode} />
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DatasourceToggleContext.Provider>
          </DatasourceCurrDBContext.Provider>
        </DatasourceDispatchContext.Provider>
      </DatasourceContext.Provider>

      <Modal
        title="全局设置"
        visible={isSettingVisible}
        onOk={() => setIsSettingVisible(false)}
        onCancel={() => setIsSettingVisible(false)}
        footer={null}
        bodyStyle={{ top: '20px' }}
        width={'60vw'}
      >
        <Setting node={{ id: 0 } as DirTreeNode} />
      </Modal>

      <Modal
        title="全局钩子"
        visible={isHookVisible}
        onOk={() => setIsHookVisible(false)}
        onCancel={() => setIsHookVisible(false)}
        footer={null}
        bodyStyle={{ top: '20px' }}
        width={'60vw'}
      >
        <Hook node={{ id: 0 } as DirTreeNode} />
      </Modal>

      <Modal
        title="GraphiQL"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{ height: '90vh' }}
        width={'90vw'}
      >
        <GraphiQLApp data={query} onSave={handleSaveGql} />
      </Modal>
    </>
  )
}

export default ApiManage
