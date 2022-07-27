/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
import type { DataNode } from 'antd/lib/tree'
import Head from 'next/head'
import Link from 'next/link'
import { FC, useCallback, useEffect, useState } from 'react'

import Detail from '@/components/apimanage/Detail'
import Hook from '@/components/apimanage/Hook'
import Mock from '@/components/apimanage/Mock'
import Setting from '@/components/apimanage/Setting'
import IconFont from '@/components/iconfont'
import RcTab from '@/components/rc-tab'
import type { DirTree, operationResp } from '@/interfaces/apimanage'
import requests, { getFetcher } from '@/lib/fetchers'

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

function convertToTree(data: operationResp[] | null, lv = '0'): DirTree[] | null {
  if (!data) return null
  return data.map((x, idx) => ({
    key: `${lv}-${idx}`,
    title: x.title.split('/')[x.title.split('/').length - 1].replace(/\.graphql(\.off)?$/, ''),
    path: x.title.split('/').slice(0, x.title.split('/').length).join('/'),
    children: convertToTree(x.children, `${lv}-${idx}`),
    originTitle: x.title,
    disable: x.disable,
  }))
}

function findNode(key: string, data: DataNode[] | undefined): DataNode | undefined {
  let rv

  const inner = (key: string, nodes: DataNode[] | undefined) => {
    if (!nodes) return undefined
    nodes.find((x) => {
      if (x.key === key) {
        rv = x
        return x
      } else {
        return inner(key, x.children)
      }
    })
  }

  inner(key, data)
  return rv
}

const ApiManage: FC<ApiManageProps> = () => {
  const [addType, setAddType] = useState<'文件' | '目录' | '编辑'>(null)
  const [treeData, setTreeData] = useState<DataNode[]>(null!)
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [curEditingNode, setCurEditingNode] = useState<DataNode | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [activeKey, setActiveKey] = useState<string>('0')
  const [refreshFlag, setRefreshFlag] = useState<boolean>()
  // const [content, setContent] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    getFetcher<operationResp[]>('/operateApi')
      // .then((x) => {
      //   console.log(convertToTree(x))
      //   return x
      // })
      .then((res) => setTreeData(convertToTree(res) as DataNode[]))
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
        .join('/') as string
      const newPath = `${basePath}/${inputValue}`

      void requests
        .put('/operateApi/rename', {
          oldPath: curEditingNode.path,
          newPath: newPath,
          disable: curEditingNode.disable,
        })
        .then((res) => {
          if (res) {
            curEditingNode.title = inputValue
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
      const curPath = `${(curEditingNode.path as string) || '/'}${curEditingNode.title as string}`
      void requests
        .post('/operateApi/createFile', {
          path: curPath,
        })
        .then((res) => {
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

  const getTreeNode = useCallback(
    (treeNodeKey: any) => {
      let parent: any
      let child: any
      const getNode = (key: string | number, nodes: DataNode[]) => {
        for (let index = 0; index < nodes.length; index++) {
          if (child) {
            break
          }
          if (nodes[index].key === key) {
            child = nodes[index]
            break
          } else {
            const children = nodes[index].children
            if (children) {
              parent = nodes[index]
              getNode(treeNodeKey, children)
            }
          }
        }
      }
      getNode(treeNodeKey, treeData)
      return {
        parent,
        child,
      }
    },
    [treeData]
  )

  const handleAddNode = useCallback(() => {
    if (!addType) {
      void message.warn('正在添加中')
      setRefreshFlag(!refreshFlag)
    } else {
      let parent: any
      let child: any
      const getParent = (key: string | number, nodes: DataNode[]) => {
        for (let index = 0; index < nodes.length; index++) {
          if (child) {
            break
          }
          if (nodes[index].key === key) {
            child = nodes[index]
            break
          } else {
            const children = nodes[index].children
            if (children) {
              parent = nodes[index]
              getParent(selectedKey, children)
            }
          }
        }
      }
      getParent(selectedKey, treeData)
      const temp = {
        title: '',
        key: Date.now(),
      }
      if (!child || !parent) {
        treeData.push(temp)
      } else if (child!.children) {
        child!.children.push(temp)
      } else {
        parent.children.push(temp)
      }
      setCurEditingNode(temp)
      setTreeData([...treeData])
    }
    setAddType('文件')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addType, selectedKey, treeData])

  const handleDelete = (treeNodeKey: any) => {
    const node = findNode(treeNodeKey, treeData)
    // @ts-ignore
    requests.delete(`/operateApi/${node.path as string}`).finally(() => {
      setRefreshFlag(!refreshFlag)
    })
  }

  const handleSelectTreeNode = useCallback((selectedKeys: Key[]) => {
    if (selectedKeys[0] && selectedKeys[0] !== selectedKey) {
      setSelectedKey(selectedKeys[0] as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMenuClick = (arg: any, treeNodeKey: any) => {
    arg.domEvent.stopPropagation()
    if (arg.key === '0') {
      const { child } = getTreeNode(treeNodeKey)
      setCurEditingNode(child)
    }
  }

  const titleRender = (nodeData: any) => {
    const menu = (
      <Menu
        onClick={(menuInfo) => handleMenuClick(menuInfo, nodeData.key)}
        items={[
          { label: '重命名', key: '0' },
          { label: '编辑', key: '1' },
          {
            label: (
              <Popconfirm
                title="确定删除吗?"
                onConfirm={() => handleDelete(nodeData.key)}
                okText="删除"
                cancelText="取消"
                placement="right"
              >
                <a href="#" onClick={(e) => e.stopPropagation()}>
                  删除
                </a>
              </Popconfirm>
            ),
            key: '2',
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
              <span className="text-[#AFB0B499]">GET</span>
              <span className="text-[#AFB0B4]">
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                  <MoreOutlined onClick={(e) => e.stopPropagation()} />
                </Dropdown>
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  const iconRender = (nodeProps: any) => {
    const hasChildren = !!nodeProps.data.children
    if (hasChildren) {
      if (nodeProps.expanded) {
        return <FolderOpenOutlined />
      } else {
        return <FolderOutlined />
      }
    } else {
      return <FileOutlined />
    }
  }

  function connectSwitchOnChange(e) {
    const node = findNode(selectedKey, treeData)
    if (!node) return
    void requests
      .put('/operateApi/rename', {
        oldPath: node.path,
        newPath: node.path,
        disable: !e,
      })
      .then((res) => {
        if (res) {
          setRefreshFlag(!refreshFlag)
        }
      })
  }

  // function handleClickEdit() {
  //   const node = findNode(selectedKey, treeData)
  //   if (!node?.path) return

  //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  //   void getFetcher(`/operateApi/${node.path}`).then((res) => setContent(res))
  //   setIsModalVisible(true)
  // }

  const extra = (
    <div className="flex items-center">
      <Switch
        checked={!findNode(selectedKey, treeData)?.disable}
        checkedChildren="开启"
        unCheckedChildren="关闭"
        onChange={connectSwitchOnChange}
        className="ml-6 w-15 bg-[#8ABE2A]"
      />
      <Button className="ml-12">
        <Link
          href={{
            pathname: '/graphiql',
            query: { ...findNode(selectedKey, treeData) },
          }}
        >
          编辑
        </Link>
      </Button>
    </div>
  )

  return (
    <>
      <Head>
        <title>API 管理</title>
      </Head>

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
              <IconFont type="icon-fuzhi" style={{ fontSize: '16px' }} onClick={handleAddNode} />
            </div>
          </div>
          <Divider className="my-4" />
          <Tree
            style={{ overflow: 'auto', height: 'calc(100vh - 174px)' }}
            titleRender={titleRender}
            icon={iconRender}
            // draggable
            showIcon
            defaultExpandAll
            defaultSelectedKeys={['0']}
            switcherIcon={<DownOutlined />}
            treeData={treeData}
            selectedKeys={[selectedKey]}
            onSelect={handleSelectTreeNode}
          />
        </div>
        <div className={styles.divider} />

        <div className="px-6 pt-6 flex-1">
          <div className="flex justify-between items-center">
            <div className="flex leading-25px space-x-2">
              <span className="font-bold text-18px">API 管理</span>
              <CaretRightOutlined />
              <span className="text-16px font-bold">userinfo</span>
            </div>
            <div className="space-x-4">
              <IconFont type="icon-lianxi" style={{ fontSize: '18px' }} />
              <IconFont type="icon-wenjian1" style={{ fontSize: '18px' }} />
              <IconFont type="icon-bangzhu" style={{ fontSize: '18px' }} />
            </div>
          </div>

          <div className="mt-7">
            <RcTab tabs={tabs} onTabClick={setActiveKey} activeKey={activeKey} extra={extra} />

            <div className="overflow-auto h-[calc(100vh_-_98px)]">
              {activeKey === '0' ? (
                <Detail path={(findNode(selectedKey, treeData) as DirTree)?.path ?? ''} />
              ) : activeKey === '1' ? (
                <Mock />
              ) : activeKey === '2' ? (
                <Hook />
              ) : (
                <Setting />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="GraphiQL"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
      >
        {/* <GraphiQLApp /> */}
      </Modal>
    </>
  )
}

export default ApiManage
