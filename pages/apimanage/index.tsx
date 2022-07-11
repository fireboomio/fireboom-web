/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react/prop-types */

import {
  AppleOutlined,
  DownOutlined,
  FileOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  MoreOutlined,
} from '@ant-design/icons'
import { Tooltip, Divider, Tree, Dropdown, Menu, message, Input, Popconfirm } from 'antd'
import { Key } from 'antd/lib/table/interface'
import type { DataNode } from 'antd/lib/tree'
import axios from 'axios'
import Head from 'next/head'
import { FC, useCallback, useEffect, useState } from 'react'

import type { DirTree, operationResp } from '@/interfaces/apimanage'
import { getFetcher } from '@/lib/fetchers'
import RcTab from 'pages/components/rc-tab'

import Detail from './blocks/Detail'
import Hook from './blocks/Hook'
import Mock from './blocks/Mock'
import Setting from './blocks/Setting'
import styles from './index.module.scss'

type ApiManageProps = {
  //
}

const tabs = [
  {
    title: '详情',
    key: '0',
  },
  {
    title: 'Mock',
    key: '1',
  },
  {
    title: '钩子',
    key: '2',
  },
  {
    title: '设置',
    key: '3',
  },
  {
    title: '调用',
    key: '4',
  },
]

function convertToTree(data: operationResp[] | null, lv = '0'): DirTree[] | null {
  if (!data) return null
  return data.map((x, idx) => ({
    key: `${lv}-${idx}`,
    title: x.title.split('/')[x.title.split('/').length - 1].replace(/(_off)?\.graphql$/, ''),
    path: x.title.split('/').slice(0, x.title.split('/').length).join('/'),
    children: convertToTree(x.children, `${lv}-${idx}`),
    originTitle: x.title,
  }))
}

function findNode(key: string, data: DataNode[] | undefined): DataNode | undefined {
  let rv

  const inner = (key: string, nodes: DataNode[] | undefined) => {
    if (!nodes) return undefined
    nodes.find((x) => {
      if (x.key === key) {
        rv = x
      } else {
        inner(key, x.children)
      }
    })
  }

  inner(key, data)
  return rv
}

const ApiManage: FC<ApiManageProps> = () => {
  const [isAdding, _setIsAdding] = useState(false)
  const [treeData, setTreeData] = useState<DataNode[]>(null!)
  const [selectedKey, setSelectedKey] = useState<string | number>('')
  const [curEditingNode, setCurEditingNode] = useState<DataNode | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [activeKey, setActiveKey] = useState<string>('0')

  useEffect(() => {
    getFetcher<operationResp[]>('/api/v1/operateApi')
      .then((res) => setTreeData(convertToTree(res) as DataNode[]))
      .catch((err: Error) => {
        throw err
      })
  }, [])

  const handlePressEnter = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    curEditingNode!.title = inputValue
    setCurEditingNode(null)
    setTreeData([...treeData])
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
    setCurEditingNode(null)
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
    if (isAdding) {
      void message.warn('正在添加中')
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
        title: '我是测试的',
        key: Date.now(),
      }
      if (!child) {
        treeData.push(temp)
      } else if (child!.children) {
        child!.children.push(temp)
      } else {
        parent.children.push(temp)
      }
      setCurEditingNode(temp)
      setTreeData([...treeData])
    }
    // setIsAdding(true)
  }, [isAdding, selectedKey, treeData])

  const handleDelete = (treeNodeKey: any) => {
    const node = findNode(treeNodeKey, treeData)
    // @ts-ignore
    void axios.delete(`/api/v1/operateApi/${node.path as string}`)
  }

  const handleSelectTreeNode = useCallback((selectedKeys: Key[]) => {
    if (selectedKeys[0] && selectedKeys[0] !== selectedKey) {
      setSelectedKey(selectedKeys[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTabContent = useCallback(() => {
    switch (activeKey) {
      case '0':
        return <Detail />
      case '1':
        return <Mock />
      case '2':
        return <Hook />
      case '3':
        return <Setting />
    }
  }, [activeKey])

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
          {
            label: '重命名',
            key: '0',
          },
          {
            label: '编辑',
            key: '1',
          },
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
            <span>{nodeData.title}</span>
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
              <AppleOutlined />
            </div>
            <div className="flex justify-between mt-7">
              <Tooltip placement="top" title="设置">
                <AppleOutlined />
              </Tooltip>
              <Tooltip placement="top" title="导出">
                <AppleOutlined />
              </Tooltip>
              <Tooltip placement="top" title="表单设计器">
                <AppleOutlined />
              </Tooltip>
              <Tooltip placement="top" title="下载SDK">
                <AppleOutlined />
              </Tooltip>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="flex justify-between px-4">
            <span className="leading-20px font-bold">概览</span>
            <div className="space-x-4">
              <AppleOutlined onClick={handleAddNode} />
              <AppleOutlined />
              <AppleOutlined />
            </div>
          </div>
          <Divider className="my-4" />
          <Tree
            style={{ overflow: 'auto', height: 'calc(100vh - 174px)' }}
            titleRender={titleRender}
            icon={iconRender}
            draggable
            showIcon
            defaultExpandAll
            defaultSelectedKeys={['0-0-0']}
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
              <AppleOutlined />
              <span className="text-16px font-bold">userinfo</span>
            </div>
            <div className="space-x-4">
              <AppleOutlined />
              <AppleOutlined />
              <AppleOutlined />
            </div>
          </div>
          <div className="mt-7">
            <RcTab tabs={tabs} onTabClick={setActiveKey} activeKey={activeKey} />
            <div className="overflow-auto h-[calc(100vh_-_98px)]">{getTabContent()}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ApiManage
