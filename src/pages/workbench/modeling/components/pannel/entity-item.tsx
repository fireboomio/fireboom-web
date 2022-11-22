import type { MenuProps } from 'antd'
import { Dropdown, Input, Menu, message, Popconfirm } from 'antd'
import { useContext } from 'react'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import type { Entity, ModelingShowTypeT } from '@/interfaces/modeling'
import { ENTITY_NAME_REGEX, MAGIC_DELETE_ENTITY_NAME } from '@/lib/constants/fireBoomConstants'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import { PrismaSchemaBlockOperator } from '@/lib/helpers/PrismaSchemaBlockOperator'
import useBlocks from '@/lib/hooks/useBlocks'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useEntities from '@/lib/hooks/useEntities'

import iconDel from '../../assets/del.svg'
import iconEntity from '../../assets/entity.svg'
import iconEntityActive from '../../assets/entity-active.svg'
import iconEnum from '../../assets/enum.svg'
import iconEnumActive from '../../assets/enum-active.svg'
import iconMore from '../../assets/more.svg'
import iconRename from '../../assets/rename.svg'
import styles from './pannel.module.less'

interface Props {
  entity: Entity
  editFlag: boolean
  newFlag: boolean
  onClick: () => void
  onToggleDesigner: (entity: Entity) => void
  setShowType: Updater<ModelingShowTypeT>
}

const ModelEntityItem = ({
  entity,
  onClick,
  onToggleDesigner,
  setShowType,
  editFlag,
  newFlag
}: Props) => {
  const { currentEntityId, changeToEntityById } = useCurrentEntity()
  const { blocks, updateAndSaveBlock, applyLocalBlocks } = useBlocks()
  const [isHovering, setIsHovering] = useImmer(false)
  const [isEditing, setIsEditing] = useImmer(entity.name === '')
  const [visible, setVisible] = useImmer(false)
  const { getFirstEntity } = useEntities()
  const { panel, triggerSyncEditor } = useContext(PrismaSchemaContext)
  // const ctx = useContext(PrismaSchemaContext)
  const { inEdit } = panel || {}

  const isCurrent = currentEntityId === entity.id

  const handleMenuClick: MenuProps['onClick'] = e => {
    e.domEvent.stopPropagation()
    if (e.key === '1' || e.key === '2') {
      setVisible(false)
    }
  }

  const handlePressKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  const handleItemDelete = () => {
    setVisible(false)
    if (isCurrent) {
      changeToEntityById(getFirstEntity()?.id ?? 0)
      setShowType(getFirstEntity()?.type === 'model' ? 'preview' : 'editEnum')
    }
    const hide = message.loading('删除中...', 0)
    void updateAndSaveBlock(PrismaSchemaBlockOperator(blocks).deleteEntity(entity.id))
      .then(() => {
        message.success('删除成功')
      })
      .finally(() => {
        hide()
      })
  }

  const renameEntity = (newName: string) => {
    setIsEditing(false)
    if (!newName) {
      void message.error('实体名不可为空！')
      return
    }
    const nameIsValid = new RegExp(ENTITY_NAME_REGEX).test(newName)
    if (newName === MAGIC_DELETE_ENTITY_NAME || !nameIsValid) {
      void message.error('实体名不合法！')
      return
    }
    if (!inEdit) {
      const hide = message.loading('保存中...', 0)
      updateAndSaveBlock(PrismaSchemaBlockOperator(blocks).updateEntityName(entity.id, newName))
        .then(() => {
          message.success('实体名更新成功')
        })
        .catch((error: Error) => message.error(`实体名更新失败, error: ${error.message}`))
        .finally(() => {
          hide()
        })
    } else {
      setIsEditing(false)
      const localBlocks = PrismaSchemaBlockOperator(blocks).updateEntityName(entity.id, newName)
      applyLocalBlocks(localBlocks)
      triggerSyncEditor()
    }
  }

  //实现鼠标移出item判断，当菜单显示的时候，仍处于hovering状态
  const leaveItem = (visible: boolean) => {
    if (!visible) {
      setIsHovering(false)
      setVisible(false)
    }
  }

  const MenuContainer = () => (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: 1,
          label: <span>重命名</span>,
          icon: <img src={iconRename} alt="重命名" />,
          onClick: () => setIsEditing(!isEditing)
        },
        {
          key: 4,
          label: (
            <Popconfirm
              className="w-full h-full"
              placement="right"
              title="确认删除该实体吗？将会同时删除引用字段！"
              onConfirm={handleItemDelete}
              okText="删除"
              cancelText="取消"
              onCancel={() => setVisible(false)}
              overlayClassName={styles['delete-label']}
              okType={'danger'}
            >
              <span>删除</span>
            </Popconfirm>
          ),
          icon: <img src={iconDel} alt="删除" />
        }
      ]}
    />
  )

  const itemContent = isEditing ? (
    <Input
      onBlur={e => renameEntity(e.target.value)}
      onKeyUp={handlePressKey}
      onPressEnter={e => renameEntity(e.currentTarget.value)}
      className="text-sm font-normal leading-4 h-5 w-5/7 pl-1"
      defaultValue={entity.name}
      autoFocus
      placeholder="请输入实体名"
    />
  ) : (
    <div className="text-sm font-normal leading-4">{entity.name}</div>
  )

  return (
    <div
      className={`${styles.item} ${isCurrent ? styles.itemActive : ''}`}
      key={entity.id}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => leaveItem(visible)}
      onClick={onClick}
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className={styles.icon}>
        {entity.type === 'model' ? (
          // FIXME(更新模型和枚举的icon)
          <img src={isCurrent ? iconEntityActive : iconEntity} alt="模型" />
        ) : (
          <img src={isCurrent ? iconEnumActive : iconEnum} alt="枚举" />
        )}
      </div>
      {itemContent}
      {editFlag ? <div className={styles.editMark}></div> : null}
      {newFlag ? <div className={styles.addMark}></div> : null}
      <Dropdown
        overlay={MenuContainer}
        trigger={['click']}
        placement="bottomRight"
        open={visible}
        onOpenChange={v => {
          setVisible(v)
          leaveItem(v)
        }}
      >
        <div
          className={styles.dropdownIcon}
          onClick={e => e.stopPropagation()}
          style={{ visibility: isHovering ? 'visible' : 'hidden' }}
        >
          <img src={iconMore} alt="菜单" />
        </div>
      </Dropdown>
    </div>
  )
}

export default ModelEntityItem
