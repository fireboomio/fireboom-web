import { Input, Tree } from 'antd'
import { cloneDeep } from 'lodash'
import type React from 'react'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'

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
  selectedKeys?: string[]
  onSelectFile?: (nodeData: any) => void
  onCreateItem?: (parent: FileTreeNode | null, isDir: boolean, name: string) => Promise<boolean>
  onRename?: (nodeData: FileTreeNode, newName: string) => Promise<boolean>
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
  const [treeData, setTreeData] = useState<InnerNode[]>([]) // 文件树
  const [tempItem, setTempItem] = useState<{ isDir: boolean; parentKey: string } | null>(null)
  const [expandedKeys, setExpandedKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [lastClickKey, setLastClickKey] = useState<string>('')
  const [editingKey, setEditingKey] = useState<string>('')
  const showTree = useMemo(() => {
    if (!treeData || !tempItem) return treeData
    const newTree = cloneDeep(treeData)

    // 修改编辑节点状态
    const editNode = findItemByKey(newTree, editingKey)
    if (editNode) {
      editNode.isInput = true
    }
    // 插入临时新增节点
    const newItem = {
      name: '',
      key: 'temp' + Date.now(),
      isDir: tempItem.isDir,
      data: { name: '' },
      isInput: true,
      isNew: true
    }
    const parent = findItemByKey(newTree, tempItem?.parentKey)

    console.log(tempItem, parent)
    if (parent) {
      parent.children?.unshift(newItem)
    } else {
      newTree.unshift(newItem)
    }
    return newTree
  }, [treeData, tempItem])

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
  }, [props.treeData])

  useEffect(() => {
    setSelectedKeys(props.selectedKeys ?? [])
  }, [props.selectedKeys])

  // 增加节点
  const addItem = useCallback(
    (isDir: boolean) => {
      const target = findItemByKey(treeData, lastClickKey)
      setTempItem({ isDir: false, parentKey: target?.key ?? '' })
      setExpandedKeys([...expandedKeys, lastClickKey])
    },
    [treeData, lastClickKey]
  )
  // 编辑节点
  const editItem = useCallback((key: string) => {
    setEditingKey(key)
  }, [])

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
      // 处理重命名
      // 处理新增保存
      const success = await props.onRename?.(node.parent ?? null, node.isDir, str)
      if (success || closeOnFail) {
        setTempItem(null)
      }
    }
  }

  return (
    <Tree
      rootClassName={props.rootClassName}
      titleRender={node => {
        if (node.isInput) {
          return (
            <Input
              size="small"
              autoFocus
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
          return props.titleRender?.(node)
        }
      }}
      defaultExpandParent
      treeData={showTree}
      multiple
      expandedKeys={expandedKeys}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
    />
  )
})
FileTree.displayName = 'FileTree'
export default FileTree

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
