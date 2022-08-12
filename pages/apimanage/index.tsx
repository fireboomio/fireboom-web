import {
  CaretRightOutlined,
  DownOutlined,
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
  { title: '调用', key: '4' },
]

function convertToTree(data: OperationResp[] | null, lv = '0'): DirTreeNode[] {
  if (!data) return []
  return data.map((x, idx) => ({
    ...x,
    key: `${lv}-${idx}`,
    id: x.id,
    title: x.title.split('/')[x.title.split('/').length - 1].replace(/\.graphql(\.off)?$/, ''),
    path: x.title.split('/').slice(0, x.title.split('/').length).join('/'),
    // .replace(/\.graphql(\.off)?$/, ''),
    children: convertToTree(x.children, `${lv}-${idx}`),
    originTitle: x.title,
    enable: x.enable,
  }))
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

function getNodeFamily(key: string, data: DirTreeNode[] | undefined) {
  let parent: DirTreeNode | undefined
  let curr: DirTreeNode | undefined

  const inner = (key: string, nodes: DirTreeNode[] | undefined) => {
    if (!nodes) return []
    nodes.find(x => {
      if (x.key === key) {
        curr = x
        return [parent, curr]
      } else {
        if (x.children) parent = x
        return inner(key, x.children ?? undefined)
      }
    })
  }

  inner(key, data)
  return { parent, curr }
}

const ApiManage: FC<ApiManageProps> = () => {
  const [addType, setAddType] = useState<'文件' | '目录' | '编辑' | null>(null)
  const [treeData, setTreeData] = useState<DirTreeNode[]>([])
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [curEditingNode, setCurEditingNode] = useState<DirTreeNode | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [activeKey, setActiveKey] = useState<string>('0')
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [query, setQuery] = useState<string>()

  const selectedNode = useMemo(() => findNode(selectedKey, treeData), [selectedKey, treeData])

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
      // .then((x) => {
      //   console.log(convertToTree(x))
      //   return x
      // })
      .then(res => setTreeData(convertToTree(res)))
      .catch((err: Error) => {
        throw err
      })
  }, [refreshFlag])

  const handlePressEnter = useCallback(() => {
    if (!curEditingNode) {
      setAddType(null)
      return
    }

    if (!addType) {
      const basePath = curEditingNode.path
        .split('/')
        .slice(0, curEditingNode.path.split('/').length - 1)
        .join('/')
      const newPath = `${basePath}/${inputValue}`

      void requests
        .put(`/operateApi/rename/${curEditingNode.id}`, {
          oldPath: curEditingNode.path,
          newPath: newPath,
          enable: curEditingNode.enable,
        })
        .then(res => {
          if (res) {
            curEditingNode.title = inputValue
            curEditingNode.path = newPath
            setCurEditingNode(null)
            setTreeData([...treeData])
          }
        })
    } else if (addType === '文件') {
      if (inputValue === '') {
        setAddType(null)
        setRefreshFlag(!refreshFlag)
        return
      }
      curEditingNode.title = inputValue
      const curPath = `${curEditingNode.path || '/'}${curEditingNode.title}`
      void requests
        .post('/operateApi/createFile', {
          path: curPath,
        })
        .then(res => {
          if (res) {
            setRefreshFlag(!refreshFlag)
          }
        })
        .finally(() => setAddType(null))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
    []
  )

  const handleInputClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }, [])

  const handleInputBlur = useCallback(() => {
    if (curEditingNode === null) {
      setCurEditingNode(null)
      setRefreshFlag(!refreshFlag)
    }
    setAddType(null)
    setCurEditingNode(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddNode = () => {
    setAddType('文件')
    setIsModalVisible(true)
  }

  function handleClickEdit() {
    if (!selectedNode?.path) return

    void getFetcher<OperationResp>(`/operateApi/${selectedNode.id}`).then(res => {
      setAddType('编辑')
      setQuery(res.content)
    })
    setIsModalVisible(true)
  }

  const handleSaveGql = (query: string) => {
    // 新增
    if (addType === '文件') {
      const { parent, curr } = getNodeFamily(selectedKey, treeData)
      const title = 'new'
      const temp = {
        title: title,
        key: Date.now().toString(),
      } as DirTreeNode

      const tree = treeData ?? []
      if (!curr || !parent) {
        tree.push(temp)
      } else if (curr.children) {
        curr.children.push(temp)
      } else {
        // FIXME:
        // @ts-ignore
        parent.children.push(temp)
      }

      setCurEditingNode(temp)
      setTreeData([...tree])

      // 新增
      void requests
        .post('/operateApi/createFile', { title: '/new', content: query })
        .then(_ => void message.success('保存成功'))

      setAddType(null)
      setRefreshFlag(!refreshFlag)
    } else if (addType === '编辑') {
      if (!selectedNode) return
      void requests
        .put(`/operateApi/${selectedNode.id}`, { ...selectedNode, content: query })
        .then(_ => void message.success('保存成功'))
      setRefreshFlag(!refreshFlag)
    }
    setIsModalVisible(false)
  }

  const handleDelete = () => {
    // @ts-ignore
    requests.delete(`/operateApi/${selectedNode.id}`).finally(() => {
      setRefreshFlag(!refreshFlag)
    })
  }

  const handleSelectTreeNode = useCallback((selectedKeys: Key[]) => {
    setShowDatasource(false) //不展示datasource页面
    if (selectedKeys[0] && selectedKeys[0] !== selectedKey) {
      setSelectedKey(selectedKeys[0] as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMenuClick = (arg: unknown) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    arg.domEvent.stopPropagation()
    // @ts-ignore
    if (arg.key === '0') {
      setCurEditingNode(selectedNode ?? null)
    }
  }

  const titleRender = (nodeData: DirTreeNode) => {
    const menu = (
      <Menu
        onClick={menuInfo => handleMenuClick(menuInfo)}
        items={[
          {
            key: '0',
            label: (
              <>
                <IconFont type="icon-zhongmingming" />
                <span className="ml-1.5">重命名</span>
              </>
            ),
          },
          {
            key: '1',
            label: (
              <div onClick={handleClickEdit}>
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
                onConfirm={handleDelete}
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
        {curEditingNode && nodeData.key === curEditingNode.key ? (
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
    const hasChildren = !!nodeProps.data.children
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

  function connectSwitchOnChange(checked: boolean) {
    if (!selectedNode) return
    void requests
      .put(`/operateApi/rename/${selectedNode.id}`, {
        oldPath: selectedNode.path,
        newPath: selectedNode.path,
        enable: checked,
      })
      .then(() => setRefreshFlag(!refreshFlag))
  }

  const extra = (
    <div className="flex items-center">
      <Switch
        checked={selectedNode?.enable}
        checkedChildren="开启"
        unCheckedChildren="关闭"
        onChange={connectSwitchOnChange}
        className="ml-6 w-15 bg-[#8ABE2A]"
      />
      <Button className={`${styles['my-button']} ml-12`} onClick={handleClickEdit}>
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
                      <Tooltip placement="top" title="设置">
                        <IconFont type="icon-shezhi1" style={{ fontSize: '20px' }} />
                      </Tooltip>
                      <Tooltip placement="top" title="导出">
                        <IconFont type="icon-neisheng" style={{ fontSize: '18px' }} />
                      </Tooltip>
                      <Tooltip placement="top" title="表单设计器">
                        <IconFont type="icon-biaodanshejiqi" style={{ fontSize: '20px' }} />
                      </Tooltip>
                      <Tooltip placement="top" title="下载SDK">
                        <IconFont type="icon-xiazaiSDK" style={{ fontSize: '20px' }} />
                      </Tooltip>
                    </div>
                  </div>
                  <Divider className="my-4" />

                  <div className="flex justify-between px-4">
                    <span className="leading-20px font-bold">概览</span>
                    <div className="space-x-4">
                      <IconFont
                        type="icon-wenjianjia1"
                        style={{ fontSize: '18px' }}
                        onClick={handleAddNode}
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
                  <Divider className="my-4" />

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
                        ) : (
                          <Setting />
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
