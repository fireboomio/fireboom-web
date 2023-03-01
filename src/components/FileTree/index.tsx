import { Dropdown, Input, Tree } from 'antd'
import type { ItemType } from 'antd/es/menu/hooks/useItems'
import { cloneDeep, get, set } from 'lodash'
import type React from 'react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

export interface FileTreeNode {
  key: string
  name: string
  isDir: boolean
  children?: any[]
  data: any
}

interface InnerNode extends FileTreeNode {
  isInput?: boolean
  isNew?: boolean
  parent?: InnerNode
}

export interface FileTreeProps {
  titleRender?: (nodeData: any) => React.ReactNode
  treeData: FileTreeNode[]
  rootClassName?: string
  selectedKey?: string
  onSelectFile?: (nodeData: any) => void
  onCreateItem?: (parent: FileTreeNode | null, isDir: boolean, name: string) => Promise<boolean>
  onRename?: (nodeData: FileTreeNode, newName: string) => Promise<boolean>
  onContextMenu?: (nodeList: FileTreeNode[]) => ItemType[]
}

export interface FileTreeRef {
  addItem: (isDir: boolean) => void
  editItem: (key: string) => void
}

const FileTree = forwardRef<FileTreeRef, FileTreeProps>((props: FileTreeProps, ref) => {
  useImperativeHandle(ref, () => ({
    addItem,
    editItem
  }))
  const intl = useIntl()
  const [treeData, setTreeData] = useState<InnerNode[]>([]) // 文件树
  const [tempItem, setTempItem] = useState<{ isDir: boolean; parentKey: string } | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [lastClickKey, setLastClickKey] = useState<string>('')
  const [editingKey, setEditingKey] = useState<string>('')
  const keyMap = useMemo<Record<string, InnerNode>>(() => {
    function markKey(node: InnerNode) {
      map[node.key] = node
      node.children?.forEach(markKey)
    }

    const map: Record<string, InnerNode> = {}
    treeData?.forEach(markKey)
    return map
  }, [treeData])
  // 用于渲染的数据，加入了临时新增节点和编辑节点的状态
  const showTree = useMemo(() => {
    if (!treeData || (!tempItem && !editingKey)) return treeData
    const newTree = cloneDeep(treeData)

    // 修改编辑节点状态
    const editNode = findItemByKey(newTree, editingKey)
    if (editNode) {
      editNode.isInput = true
    }
    // 插入临时新增节点
    if (tempItem) {
      const newItem = {
        name: '',
        key: 'temp' + Date.now(),
        isDir: tempItem.isDir,
        data: { name: '' },
        isInput: true,
        isNew: true
      }
      const parent = findItemByKey(newTree, tempItem?.parentKey)
      if (parent) {
        parent.children?.unshift(newItem)
      } else {
        newTree.unshift(newItem)
      }
    }

    return newTree
  }, [treeData, tempItem, editingKey])

  // 初始化数据
  useEffect(() => {
    const newTree = cloneDeep(props.treeData)

    function markParent(node: InnerNode) {
      node.children?.forEach(x => {
        x.parent = node
        markParent(x)
      })
    }

    treeData?.map(markParent)
    setTreeData(newTree)
  }, [props.treeData, treeData])

  // 初始化选中状态
  useEffect(() => {
    setSelectedKeys(props.selectedKey ? [props.selectedKey] : [])
  }, [props.selectedKey])

  // 增加节点
  const addItem = useCallback(
    (isDir: boolean) => {
      const target = keyMap[lastClickKey]
      const parent = target?.isDir ? target : target?.parent
      setTempItem({ isDir: isDir, parentKey: parent?.key ?? '' })
      setExpandedKeys([...expandedKeys, lastClickKey])
    },
    [expandedKeys, keyMap, lastClickKey]
  )
  // 编辑节点
  const editItem = useCallback(
    (key: string) => {
      setEditingKey(key)
    },
    [setEditingKey]
  )

  // 处理点击树节点
  const onSelect = useCallback(
    (
      _: unknown,
      e: {
        node: InnerNode
        nativeEvent: { shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }
      }
    ) => {
      // 忽略输入框
      if (e.node.isInput) return
      // 记录最后点击项目
      setLastClickKey(e.node.key)
      if (e.nativeEvent.shiftKey) {
        // shift多选
        // TODO
      } else if (e.nativeEvent.ctrlKey || e.nativeEvent.metaKey) {
        // ctrl多选
        if (selectedKeys.includes(e.node.key)) {
          setSelectedKeys(selectedKeys.filter(x => x !== e.node.key))
        } else {
          setSelectedKeys([...selectedKeys, e.node.key])
        }
      } else {
        // 单选
        setSelectedKeys([e.node.key])
        props.onSelectFile?.(e.node)
      }
      // 展开或收起目录
      if (e.node.isDir) {
        if (expandedKeys.includes(e.node.key)) {
          setExpandedKeys(expandedKeys.filter(x => x !== e.node.key))
        } else {
          setExpandedKeys([...expandedKeys, e.node.key])
        }
      }
    },
    [treeData, expandedKeys, selectedKeys]
  )

  // 保存输入框内容
  const saveInput = async (node: InnerNode, str: string, closeOnFail: boolean) => {
    if (node.isNew) {
      // 处理新增保存
      const success = await props.onCreateItem?.(node.parent ?? null, node.isDir, str)
      if (success || closeOnFail) {
        setTempItem(null)
      }
    } else {
      if (node.name === str) {
        setEditingKey('')
        return
      }
      // 处理重命名
      const success = await props.onRename?.(node, str)
      if (success || closeOnFail) {
        setEditingKey('')
      }
    }
  }

  const [dropDownItems, setDropDownItems] = useState<ItemType[]>([])
  return (
    <Dropdown
      open={dropDownItems.length > 0}
      onOpenChange={open => !open && setDropDownItems([])}
      menu={{
        items: dropDownItems,
        // 目录点击后自动关闭
        onClick: () => setDropDownItems([])
      }}
      trigger={['contextMenu']}
    >
      <div
        className="h-full w-full"
        onContextMenu={e => {
          if (!get(e, 'isFromChild')) {
            setDropDownItems([
              {
                key: '1',
                label: intl.formatMessage({ defaultMessage: '新建文件' }),
                onClick: () => addItem(false)
              },
              {
                key: '2',
                label: intl.formatMessage({ defaultMessage: '新建文件夹' }),
                onClick: () => addItem(true)
              }
            ])
          }
        }}
      >
        <Tree
          rootClassName={props.rootClassName}
          titleRender={node => {
            if (node.isInput) {
              return (
                <Input
                  size="small"
                  autoFocus
                  defaultValue={node.name}
                  onPressEnter={e => {
                    // @ts-ignore
                    saveInput(node, e.target.value!, false)
                  }}
                  onBlur={e => {
                    // @ts-ignore
                    saveInput(node, e.target.value!, true)
                  }}
                />
              )
            } else {
              return (
                <div
                  onContextMenu={e => {
                    set(e, 'isFromChild', true)
                    if (!selectedKeys.includes(node.key)) {
                      setSelectedKeys([node.key])
                      props.onSelectFile?.(node)
                    }
                    const targets = selectedKeys.includes(node.key)
                      ? selectedKeys.map(x => keyMap[x])
                      : [node]
                    setDropDownItems(props.onContextMenu?.(targets) ?? [])
                  }}
                >
                  {props.titleRender?.(node)}
                </div>
              )
            }
          }}
          defaultExpandParent
          treeData={showTree}
          multiple
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onSelect={onSelect}
        />
      </div>
    </Dropdown>
  )
})

FileTree.displayName = 'FileTree'
export default FileTree

// 注意，此方法不能被keyMap替代，因为此处的treeData是经过cloneDeep的，keyMap中的node是原始数据
function findItemByKey(tree: InnerNode[], key: string) {
  const lists = [...tree]
  while (lists.length) {
    const item = lists.pop()!
    if (item.key === key) {
      return item
    } else if (item.children) {
      lists.push(...item.children)
    }
  }
}
