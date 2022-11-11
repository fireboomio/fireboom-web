import { printSchema } from '@mrleebo/prisma-ast'
import { Dropdown, Empty, Input, Menu, message, Radio } from 'antd'
import { useContext, useEffect, useRef, useState } from 'react'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import IconFont from '@/components/iconfont'
import type { DMFResp } from '@/interfaces/datasource'
import type { Enum, Model, ModelingShowTypeT } from '@/interfaces/modeling'
import { ENTITY_NAME_REGEX, UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import requests from '@/lib/fetchers'
import { PrismaSchemaBlockOperator } from '@/lib/helpers/PrismaSchemaBlockOperator'
import useBlocks from '@/lib/hooks/useBlocks'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useDBSource from '@/lib/hooks/useDBSource'
import useEntities from '@/lib/hooks/useEntities'
import useLocalStorage from '@/lib/hooks/useLocalStorage'

import iconAdd from '../../assets/add.svg'
import iconAt from '../../assets/at.svg'
import iconDesignMode from '../../assets/design-mode.svg'
import iconDesignModeActive from '../../assets/design-mode-active.svg'
import iconEditMode from '../../assets/edit-mode.svg'
import iconEditModeActive from '../../assets/edit-mode-active.svg'
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
  const ModelDesignerRef = useRef<typeof ModelDesigner>(null)
  const EnumDesignerRef = useRef<typeof EnumDesigner>(null)

  const [newEnums, setNewEnums] = useImmer<Enum[]>([])

  const [editTitle, setEditTitle] = useState<boolean>(false)
  const [titleValue, setTitleValue] = useState<string>('')
  useEffect(() => {
    setTitleValue(currentEntity?.name || '')
  }, [currentEntity])

  const { panel } = useContext(PrismaSchemaContext)
  // const ctx = useContext(PrismaSchemaContext)
  const { handleClickEntity } = panel || {}

  const initialModel: Model = {
    type: 'model',
    name: UNTITLED_NEW_ENTITY,
    properties: [
      {
        type: 'field',
        name: 'id',
        fieldType: 'Int',
        optional: false,
        array: false,
        attributes: [{ name: 'id', type: 'attribute', kind: 'field' }]
      },
      {
        type: 'field',
        name: 'createdAt',
        fieldType: 'DateTime',
        optional: false,
        array: false,
        attributes: [
          {
            name: 'default',
            type: 'attribute',
            kind: 'field',
            args: [{ type: 'attributeArgument', value: { name: 'now', type: 'function' } }]
          }
        ]
      },
      {
        type: 'field',
        name: 'updatedAt',
        fieldType: 'DateTime',
        optional: true,
        array: false,
        attributes: [
          {
            name: 'default',
            type: 'attribute',
            kind: 'field',
            args: [{ type: 'attributeArgument', value: { name: 'now', type: 'function' } }]
          }
        ]
      },
      {
        type: 'field',
        name: 'deletedAt',
        fieldType: 'DateTime',
        optional: true
      }
    ],
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
    if (!titleValue) {
      void message.error('实体名不可为空！')
      return
    }
    const nameIsValid = new RegExp(ENTITY_NAME_REGEX).test(titleValue)
    if (!nameIsValid) {
      void message.error('实体名不合法！')
      return
    }
    model = { ...model, name: titleValue }
    return updateAndSaveBlock(
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
    if (!titleValue) {
      void message.error('枚举名不可为空！')
      return
    }
    const nameIsValid = new RegExp(ENTITY_NAME_REGEX).test(titleValue)
    if (!nameIsValid) {
      void message.error('枚举名不合法！')
      return
    }
    enumm = { ...enumm, name: titleValue }
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

  function onCancel() {
    if (mode === 'editor') {
      // 编辑器
    } else if (type === 'model') {
      // @ts-ignore
      ModelDesignerRef?.current?.handleResetModel?.()
    } else {
      // @ts-ignore
      EnumDesignerRef?.current?.handleResetEnum?.()
    }
  }
  async function onSave() {
    const hide = message.loading('保存中...')
    try {
      if (mode === 'editor') {
        if (editorContent !== undefined) {
          await requests.post<unknown, DMFResp>(`/prisma/migrate/${dbSourceId ?? ''}`, {
            schema: editorContent
          })
        }
      } else if (type === 'model') {
        // @ts-ignore
        await ModelDesignerRef?.current?.handleSaveModel?.()
      } else {
        // @ts-ignore
        await EnumDesignerRef?.current?.handleSaveEnum?.()
      }
    } catch (e) {
      console.error(e)
    }
    hide()
  }
  const dropdownMenu = [
    {
      label: (
        <div
          onClick={() => {
            handleClickEntity?.(currentEntity)
          }}
        >
          查看
        </div>
      ),
      key: 'view'
    },
    {
      label: (
        <div
          onClick={() => {
            changeToEntityById(getFirstEntity()?.id ?? 0)
            setShowType(getFirstEntity()?.type === 'model' ? 'preview' : 'editEnum')
            const hide = message.loading('删除中...', 0)
            void updateAndSaveBlock(
              PrismaSchemaBlockOperator(blocks).deleteEntity(currentEntity.id)
            )
              .then(() => {
                message.success('删除成功')
              })
              .finally(() => {
                hide()
              })
          }}
        >
          删除
        </div>
      ),
      key: 'delete'
    }
  ].filter(item => !(item.key === 'view' && type === 'enum'))

  const transferToEditor = () => {
    // 在这里 将 新增的枚举 添加进去
    let newBlocks = PrismaSchemaBlockOperator(blocks).addEnums(newEnums)
    // @ts-ignore
    let model = ModelDesignerRef?.current?.currentModel as Model
    if (titleValue && new RegExp(ENTITY_NAME_REGEX).test(titleValue)) {
      model = { ...model, name: titleValue }
    } else {
      void message.error('实体名不合法')
    }

    newBlocks =
      editType === 'add'
        ? PrismaSchemaBlockOperator(newBlocks).addModel(model)
        : PrismaSchemaBlockOperator(newBlocks).updateModel(model)
    return printSchema({ type: 'schema', list: newBlocks })
  }

  const transferToDesigner = () => {
    //
  }

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex justify-start items-center h-10 bg-white pl-7 pr-4"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
        <span className="text-lg font-medium text-16px common-form">
          {/*{editType === 'edit' ? currentEntity.name : '新增'}*/}
          {editTitle ? (
            <Input
              className="!w-20"
              onPressEnter={e => {
                setTitleValue(e.currentTarget.value)
                setEditTitle(false)
              }}
              onBlur={() => setEditTitle(false)}
              defaultValue={titleValue}
            />
          ) : (
            titleValue
          )}
          <IconFont
            onClick={() => {
              setEditTitle(!editTitle)
              setTitleValue(currentEntity.name)
            }}
            className="ml-1 cursor-pointer"
            type="icon-zhongmingming"
          />
          {isEditing && '(未保存)'}
        </span>
        <span className="mr-auto ml-12px text-[#118AD1] text-lg font-400 text-14px">{type}</span>

        {mode === 'designer' && type === 'model' ? (
          <>
            <div
              onClick={() => {
                // @ts-ignore
                ModelDesignerRef?.current?.addEmptyField?.()
              }}
              className="cursor-pointer mt-2px"
            >
              <img src={iconAdd} alt="增加" />
            </div>
            <div className={styles.split} />
            <div
              className="cursor-pointer"
              onClick={() => {
                // @ts-ignore
                ModelDesignerRef?.current?.addEmptyModelAttribute?.()
              }}
            >
              <img src={iconAt} alt="at" />
            </div>
            <div className={styles.split} />
          </>
        ) : null}
        {mode === 'designer' && type === 'enum' ? (
          <>
            <div
              className="cursor-pointer mt-2px"
              onClick={() => {
                // @ts-ignore
                EnumDesignerRef?.current?.handleAddNewEnumButtonClick?.()
              }}
            >
              <img src={iconAdd} alt="增加" />
            </div>
            <div className={styles.split} />
          </>
        ) : null}
        <Dropdown
          overlay={<Menu items={dropdownMenu} />}
          trigger={['click']}
          placement="bottomRight"
        >
          <div className="w-5.5 h-4 bg-[rgba(95,98,105,0.05)] text-center !leading-4 cursor-pointer">
            ···
          </div>
        </Dropdown>

        <div className={styles.resetBtn} onClick={onCancel}>
          重置
        </div>
        <div className={styles.saveBtn} onClick={onSave}>
          保存
        </div>
        <Radio.Group
          className={styles.modeRadio}
          value={mode}
          onChange={e => {
            if (e.target.value === 'editor') {
              setEditorContent(transferToEditor())
            }
            setMode(e.target.value)
          }}
        >
          <Radio.Button value="designer">
            <img src={mode === 'designer' ? iconDesignModeActive : iconDesignMode} alt="" />
          </Radio.Button>
          <Radio.Button value="editor">
            <img src={mode === 'editor' ? iconEditModeActive : iconEditMode} alt="" />
          </Radio.Button>
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
            ref={ModelDesignerRef}
          />
        ) : (
          <div style={{ flex: '1 1 0' }}>
            <ModelEditor
              dbId={dbSourceId}
              current={currentEntity.name}
              onChange={value => {
                setEditorContent(value)
              }}
              defaultContent={editorContent ?? ''}
            />
          </div>
        ))}

      {type === 'enum' && (
        <EnumDesigner
          ref={EnumDesignerRef}
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
