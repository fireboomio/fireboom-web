import { Empty, message, Radio } from 'antd'
import { useState } from 'react'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import type { DMFResp } from '@/interfaces/datasource'
import type { Enum, Model, ModelingShowTypeT } from '@/interfaces/modeling'
import { UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import requests from '@/lib/fetchers'
import { PrismaSchemaBlockOperator } from '@/lib/helpers/PrismaSchemaBlockOperator'
import useBlocks from '@/lib/hooks/useBlocks'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useDBSource from '@/lib/hooks/useDBSource'
import useEntities from '@/lib/hooks/useEntities'
import useLocalStorage from '@/lib/hooks/useLocalStorage'

import ModelEditor from './editor'
import EnumDesigner from './enum'
import styles from './index.module.less'
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

  const [mode, setMode] = useState<'editor' | 'designer'>('designer')
  // 编辑器当前内容
  const [editorContent, setEditorContent] = useState<string>()
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

  function onSave() {
    if (editorContent !== undefined) {
      console.log('触发保存', editorContent)
      if (type === 'model' && mode === 'editor') {
        void requests
          .post<unknown, DMFResp>(`/prisma/migrate/${dbSourceId ?? ''}`, { schema: editorContent })
          .then(x => {})
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex justify-start items-center h-10 bg-white pl-7 pr-4"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
        <span className="text-lg font-medium text-16px">
          {editType === 'edit' ? currentEntity.name : '新增'}
          {isEditing && '(未保存)'}
        </span>
        <span className="mr-auto ml-12px text-[#118AD1] text-lg font-400 text-14px">{type}</span>
        <div>1</div>
        <div className={styles.split} />
        <div>2</div>
        <div className={styles.split} />
        <div className="w-5.5 h-4 bg-[rgba(95,98,105,0.05)] text-center !leading-4 cursor-pointer">
          ···
        </div>

        <div className={styles.resetBtn}>重置</div>
        <div className={styles.saveBtn} onClick={onSave}>
          保存
        </div>
        <Radio.Group
          className={styles.modeRadio}
          value={mode}
          onChange={e => {
            setEditorContent(undefined)
            setMode(e.target.value)
          }}
        >
          <Radio.Button value="designer">普通</Radio.Button>
          <Radio.Button value="editor">编辑器</Radio.Button>
        </Radio.Group>
      </div>

      {type === 'model' &&
        (mode === 'designer' ? (
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
        ) : (
          <div style={{ flex: '1 1 0' }}>
            <ModelEditor
              dbId={dbSourceId}
              current={currentEntity.name}
              onChange={setEditorContent}
            />
          </div>
        ))}

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
