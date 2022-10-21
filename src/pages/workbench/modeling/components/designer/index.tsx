import { AppleOutlined } from '@ant-design/icons'
import { Empty, message } from 'antd'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import type { Enum, Model, ModelingShowTypeT } from '@/interfaces/modeling'
import { UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import { PrismaSchemaBlockOperator } from '@/lib/helpers/PrismaSchemaBlockOperator'
import useBlocks from '@/lib/hooks/useBlocks'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useDBSource from '@/lib/hooks/useDBSource'
import useEntities from '@/lib/hooks/useEntities'
import useLocalStorage from '@/lib/hooks/useLocalStorage'

import EnumDesigner from './enum'
import ModelDesigner from './model'

type EditType = 'add' | 'edit'
type EntityType = 'enum' | 'model'

interface Props {
  editType: EditType
  type: EntityType
  showType: ModelingShowTypeT
  setShowType: Updater<ModelingShowTypeT>
}

const DesignerContainer = ({ editType, type, setShowType, showType }: Props) => {
  const { currentEntity, changeToEntityById } = useCurrentEntity()
  const { getFirstEntity } = useEntities()
  const { getNextId } = useEntities()
  const { blocks, updateAndSaveBlock } = useBlocks()
  const { id: dbSourceId } = useDBSource()
  const newEntityLocalStorageKey = `${showType}__for_db_source_${dbSourceId}`
  const newEntityId = getNextId()

  const [isEditing, setIsEditing] = useImmer(editType === 'add')

  const [newEnums, setNewEnums] = useImmer<Enum[]>([])

  const initialModel: Model = {
    type: 'model',
    name: UNTITLED_NEW_ENTITY,
    properties: [],
    id: newEntityId
  }

  const initialEnum: Enum = {
    type: 'enum',
    name: UNTITLED_NEW_ENTITY,
    enumerators: [],
    id: newEntityId
  }

  const initialEntity = showType === 'newModel' ? initialModel : initialEnum

  const [newEntity, updateNewEntityInLocalStorage] = useLocalStorage(
    newEntityLocalStorageKey,
    initialEntity
  )

  const handleSaveModel = (model: Model) => {
    // 在这里 将 新增的枚举 添加进去
    const newBlocks = PrismaSchemaBlockOperator(blocks).addEnums(newEnums)

    void updateAndSaveBlock(
      editType === 'add'
        ? PrismaSchemaBlockOperator(newBlocks).addModel(model)
        : PrismaSchemaBlockOperator(newBlocks).updateModel(model)
    )
      .then(() => {
        if (editType === 'add') {
          // 保存成功之后 清空 localstorage
          updateNewEntityInLocalStorage(null)
          changeToEntityById(getFirstEntity()?.id ?? 0)
          setShowType(getFirstEntity()?.type === 'enum' ? 'editEnum' : 'editModel')
        }
        setNewEnums([])
      })
      .then(() => message.success('保存成功！'))
  }

  const handleSaveEnum = (enumm: Enum) => {
    void updateAndSaveBlock(
      editType === 'add'
        ? PrismaSchemaBlockOperator(blocks).addEnum(enumm)
        : PrismaSchemaBlockOperator(blocks).updateEnum(enumm)
    )
      .then(() => {
        if (editType === 'add') {
          // 保存成功之后 清空 localstorage
          updateNewEntityInLocalStorage(null)
          changeToEntityById(getFirstEntity()?.id ?? 0)
          setShowType(getFirstEntity()?.type === 'model' ? 'editModel' : 'editEnum')
        }
      })
      .then(() => message.success('保存成功！'))
  }

  const handleAddNewEnum = (newEnum: Enum) => {
    setNewEnums([...newEnums.filter(e => e.name !== newEnum.name), newEnum])
  }

  if (editType === 'edit' && !currentEntity) {
    return <Empty className="pt-20" description="无可用实体！" />
  }

  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6">
        <span className="flex-grow text-lg font-medium">
          {editType === 'edit' ? '编辑' : '新增'}
          {isEditing && '(未保存)'}
        </span>
        <AppleOutlined className="text-base mr-3" />
        <AppleOutlined className="text-base mr-3" />
        <AppleOutlined className="text-base" />
      </div>

      {type === 'model' && (
        <ModelDesigner
          updateLocalstorage={editType === 'add' ? updateNewEntityInLocalStorage : undefined}
          setIsEditing={editType === 'edit' ? setIsEditing : undefined}
          isEditing={isEditing}
          model={editType === 'edit' ? (currentEntity as Model) : (newEntity as Model)}
          resetNewEnums={() => setNewEnums([])}
          saveModel={handleSaveModel}
          addNewEnum={handleAddNewEnum}
          newEnums={newEnums}
        />
      )}

      {type === 'enum' && (
        <EnumDesigner
          updateLocalstorage={editType === 'add' ? updateNewEntityInLocalStorage : undefined}
          setIsEditing={editType === 'edit' ? setIsEditing : undefined}
          isEditing={isEditing}
          savedEnum={editType === 'edit' ? (currentEntity as Enum) : (newEntity as Enum)}
          saveEnum={handleSaveEnum}
        />
      )}
    </div>
  )
}

export default DesignerContainer
