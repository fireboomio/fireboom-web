import { Dropdown, Input, Tree } from 'antd'
import type { ItemType } from 'antd/es/menu/hooks/useItems'
import { cloneDeep, get, set } from 'lodash'
import type React from 'react'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { useIntl } from 'react-intl'

export interface FileTreeNode {
  parent?: FileTreeNode
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
  // 节点渲染
  titleRender?: (nodeData: any) => React.ReactNode
  // 文件树数据
  treeData: FileTreeNode[]
  // 在显示中替换[文件]
  fileText?: string
  // 根节点样式
  rootClassName?: string
  // 树组件根节点点样式
  treeClassName?: string
  // 选中的节点
  selectedKey?: string
  // 选中文件时的回调 nodeData: 当前选中的节点
  onSelectFile?: (nodeData: any) => void
  // 创建新项目时的回调 parent: 父节点 isDir: 是否是文件夹 name: 新项目名称
  onCreateItem?: (parent: FileTreeNode | null, isDir: boolean, name: string) => Promise<boolean>
  // 重命名时的回调 nodeData: 当前节点 newName: 新名称
  onRename?: (nodeData: FileTreeNode, newName: string) => Promise<boolean>
  // 移动时的回调 dragNode: 拖拽的节点 dropNode: 放置的节点
  onMove?: (dragNode: FileTreeNode, dropNode: FileTreeNode | null) => Promise<void>
  // 构造右键菜单 selectList: 当前选中的节点 deepList: 当前选中节点及其递归后的子节点
  onContextMenu?: (selectList: FileTreeNode[], deepList: FileTreeNode[]) => ItemType[]

  // footer元素
  footer?: React.ReactNode
  draggable?: boolean
}

export interface FileTreeRef {
  addItem: (isDir: boolean, forceRoot?: boolean) => void
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
      const parent = findItemByKey(newTree, tempItem?.parentKey)
      const newItem = {
        name: '',
        key: 'temp' + Date.now(),
        isDir: tempItem.isDir,
        data: { name: '' },
        isInput: true,
        isNew: true,
        parent: parent
      }
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

    newTree?.map(markParent)
    setTreeData(newTree)
  }, [props.treeData])

  // 根据props种传入的selectedKey，自动选中并展开节点，仅当selectedKey或keyMap变化时执行
  const lastPropSelectedKey = useRef<string>()
  const lastKeyMap = useRef<any>()
  useEffect(() => {
    if (
      lastPropSelectedKey.current === props.selectedKey &&
      lastKeyMap.current === keyMap &&
      props.selectedKey
    ) {
      return
    }
    lastPropSelectedKey.current = props.selectedKey
    setSelectedKeys(props.selectedKey ? [props.selectedKey] : [])
    // 自动展开选中节点
    if (props.selectedKey) {
      console.log(keyMap)
      const node = keyMap[props.selectedKey]
      if (node) {
        const keys: string[] = []
        let parent = node.parent
        while (parent) {
          keys.push(parent.key)
          parent = parent.parent
        }
        setExpandedKeys(expandedKeys => [...expandedKeys, ...keys])
      }
    }
  }, [props.selectedKey, keyMap])

  /**
   * 增加新节点
   * @param isDir 是否是目录
   * @param forceRoot 是否强制添加到根目录
   */
  const addItem = useCallback(
    (isDir: boolean, forceRoot = false) => {
      const target = forceRoot ? null : keyMap[lastClickKey]
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
    [selectedKeys, props, expandedKeys]
  )

  // 保存输入框内容
  const saveInput = async (node: InnerNode, str: string, closeOnFail: boolean) => {
    if (node.isNew) {
      // 处理新增保存
      const success = await props.onCreateItem?.(
        findItemByKey(treeData, node.parent?.key ?? '') ?? null,
        node.isDir,
        str
      )
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

  const buildContextMenu = (node: InnerNode) => {
    // 如果当前节点不在选中列表中，就选中当前节点，否则使用所有选择项作为目标
    if (!selectedKeys.includes(node.key)) {
      setSelectedKeys([node.key])
      props.onSelectFile?.(node)
    }
    const targets = selectedKeys.includes(node.key) ? selectedKeys.map(x => keyMap[x]) : [node]
    setDropDownItems(props.onContextMenu?.(targets, flattenTree(targets)) ?? [])
  }

  const [dropDownItems, setDropDownItems] = useState<ItemType[]>([])
  return (
    <Dropdown
      className={props.rootClassName}
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
        onClick={() => {
          setSelectedKeys([])
          setLastClickKey('')
        }}
        className=""
        onContextMenu={e => {
          if (!get(e, 'isFromChild')) {
            setDropDownItems([
              {
                key: '1',
                label:
                  intl.formatMessage({ defaultMessage: '新建' }) +
                  (props.fileText || intl.formatMessage({ defaultMessage: '文件' })),
                onClick: () => addItem(false, true)
              },
              {
                key: '2',
                label: intl.formatMessage({ defaultMessage: '新建文件夹' }),
                onClick: () => addItem(true, true)
              }
            ])
          }
        }}
      >
        <Tree
          onClick={e => e.stopPropagation()}
          rootClassName={props.treeClassName}
          draggable={props.draggable ? { icon: false } : false}
          onDrop={({ node, dragNode, dropToGap }) => {
            const dropTarget = dropToGap ? node.parent ?? null : node
            if (dragNode.parent?.key === dropTarget?.key) {
              return
            }
            props.onMove?.(dragNode, dropToGap ? node.parent ?? null : node)
          }}
          allowDrop={({ dropNode, dropPosition }) => {
            return !(!dropNode.isDir && dropPosition === 0)
          }}
          onDragEnter={e => {
            setExpandedKeys([...expandedKeys, e.node.key])
          }}
          titleRender={node => {
            if (node.isInput) {
              return (
                <Input
                  size="small"
                  autoFocus
                  defaultValue={node.name}
                  onPressEnter={e => {
                    void saveInput(node, get(e, 'target.value'), false)
                  }}
                  onBlur={e => {
                    void saveInput(node, e.target.value!, true)
                  }}
                />
              )
            } else {
              return (
                <div
                  onContextMenu={e => {
                    set(e, 'isFromChild', true)
                    buildContextMenu(node)
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
        {props.footer}
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

// 展平树，将所有节点放到一个数组中
function flattenTree(tree: InnerNode[]) {
  const lists = [...tree]
  const result: InnerNode[] = []
  while (lists.length) {
    const item = lists.pop()!
    result.push(item)
    if (item.children) {
      lists.push(...item.children)
    }
  }
  result.reverse()
  return result
}
