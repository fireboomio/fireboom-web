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
import { FC, useCallback, useState } from 'react'
import RcTab from 'pages/components/rc-tab'
import Detail from './blocks/Detail'
import Mock from './blocks/Mock'
import Hook from './blocks/Hook'
import Setting from './blocks/Setting'

import styles from './index.module.scss'

type ApiManageProps = {
  //
}

const inititalTreeData: DataNode[] = [
  {
    title: 'userinfo',
    key: '0-0',
    children: [
      {
        title: 'leaf',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-1-0',
          },
        ],
      },
      {
        title: 'leaf',
        key: '0-0-1',
      },
    ],
  },
  {
    title: 'userinfo',
    key: '0-1',
    children: [
      {
        title: 'leaf',
        key: '0-1-0',
      },
      {
        title: 'leaf',
        key: '0-1-1',
      },
    ],
  },
  {
    title: 'userinfo',
    key: '0-2',
    children: [
      {
        title: 'leaf',
        key: '0-2-0',
      },
      {
        title: 'leaf',
        key: '0-2-1',
      },
    ],
  },
  {
    title: 'userinfo',
    key: '0-3',
    children: [
      {
        title: 'leaf',
        key: '0-3-0',
      },
      {
        title: 'leaf',
        key: '0-3-1',
      },
    ],
  },
]

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
const ApiManage: FC<ApiManageProps> = () => {
  const [isAdding, setIsAdding] = useState(false)
  const [treeData, setTreeData] = useState<DataNode[]>(inititalTreeData)
  const [selectedKey, setSelectedKey] = useState<string | number>('')
  const [curEditingNode, setCurEditingNode] = useState<DataNode | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [activeKey, setActiveKey] = useState<string>('0')

  const handlePressEnter = useCallback(() => {
    curEditingNode!.title = inputValue
    setCurEditingNode(null)
    setTreeData([...treeData])
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

  const getTreeNode = useCallback((treeNodeKey: any) => {
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
  }, [])

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

  const handleDelete = useCallback((treeNodeKey: any) => {
    const { parent } = getTreeNode(treeNodeKey)
    if (!parent) {
      const index = treeData.findIndex((i) => i.key === treeNodeKey)
      treeData.splice(index, 1)
    } else {
      const index = parent.children.findIndex((i: any) => i.key === treeNodeKey)
      parent.children.splice(index, 1)
    }
    setTreeData([...treeData])
  }, [])

  const handleSelectTreeNode = useCallback((selectedKeys: Key[]) => {
    if (selectedKeys[0] && selectedKeys[0] !== selectedKey) {
      setSelectedKey(selectedKeys[0])
    }
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
          ></Input>
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

  const getTabContent = useCallback(() => {
    switch (activeKey) {
      case '0':
        return <Detail></Detail>
      case '1':
        return <Mock></Mock>
      case '2':
        return <Hook></Hook>
      case '3':
        return <Setting></Setting>
    }
  }, [activeKey])

  return (
    <div className={`flex ${styles['api-manage']} h-full`}>
      <div className="w-280px flex-shrink-0  pt-6">
        <div className="px-4">
          <div className="flex justify-between text-18px leading-25px">
            <span className="font-bold">API管理</span>
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
      <div className={styles.divider}></div>
      <div className="px-6 pt-6 flex-1">
        <div className="flex justify-between items-center">
          <div className="flex leading-25px space-x-2">
            <span className="font-bold text-18px">API管理</span>
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
          {getTabContent()}
        </div>
      </div>
    </div>
  )
}

export default ApiManage
