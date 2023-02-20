import { getSchema, printSchema } from '@mrleebo/prisma-ast'
import { Button, Empty, Input, message, Popover, Radio } from 'antd'
import { cloneDeep, isEqual } from 'lodash'
import { useContext, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import type { DMFResp } from '@/interfaces/datasource'
import type { Enum, Model, ModelingShowTypeT } from '@/interfaces/modeling'
import { ENTITY_NAME_REGEX, UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import { useEventBus } from '@/lib/event/events'
import requests from '@/lib/fetchers'
import { PrismaSchemaBlockOperator } from '@/lib/helpers/PrismaSchemaBlockOperator'
import useBlocks from '@/lib/hooks/useBlocks'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'
import useDBSource from '@/lib/hooks/useDBSource'
import useEntities from '@/lib/hooks/useEntities'
import useLocalStorage from '@/lib/hooks/useLocalStorage'
import { registerHotkeyHandler } from '@/services/hotkey'

import iconAdd from '../../assets/add.svg'
import iconAt from '../../assets/at.svg'
import iconDesignModeActive from '../../assets/design-mode-active.svg'
import iconEditMode from '../../assets/edit-mode.svg'
import ModelEditor from './editor'
import EnumDesigner from './enum'
import styles from './index.module.less'
import ModelDesigner from './model'
import Tabs from './Tabs'

type EditType = 'add' | 'edit'
type EntityType = 'enum' | 'model'

interface Props {
  editType: EditType
  type: EntityType
  showType: ModelingShowTypeT
  setShowType: Updater<ModelingShowTypeT>
}

const ModeKey = 'modeling_edit_mode'

const DesignerContainer = ({ type, setShowType, showType }: Props) => {
  const intl = useIntl()
  const { newMap } = useEntities()
  const { currentEntity, changeToEntityById } = useCurrentEntity()
  const editType = newMap[currentEntity?.name] ? 'add' : 'edit'
  const { getFirstEntity } = useEntities()
  const { getNextId } = useEntities()
  const { blocks, updateAndSaveBlock, applyLocalSchema, applyLocalBlocks, refreshBlocks } =
    useBlocks()
  const { id: dbSourceId, name: dbSourceName } = useDBSource()
  const { syncEditorFlag, panel, triggerSyncEditor } = useContext(PrismaSchemaContext)
  const newEntityLocalStorageKey = `${showType}__for_db_source_${dbSourceId}`
  const newEntityId = getNextId()

  let initMode = localStorage.getItem(ModeKey)
  if (initMode !== 'editor' && initMode !== 'designer') {
    initMode = 'designer'
  }
  const [mode, _setMode] = useState<'editor' | 'designer'>(initMode as 'editor' | 'designer')
  // 编辑器当前内容, 仅用于向编辑器传值，并不代表编辑器实时内容
  const [editorContent, setEditorContent] = useState<string>()
  // 编辑器当前内容, 仅用于向编辑器传值，并不代表编辑器实时内容
  const [currentEditorValue, setCurrentEditorValue] = useState<string>()
  const [isEditing, setIsEditing] = useImmer(editType === 'add')
  const ModelDesignerRef = useRef<typeof ModelDesigner>(null)
  const EnumDesignerRef = useRef<typeof EnumDesigner>(null)

  const [newEnums, setNewEnums] = useImmer<Enum[]>([])

  const [editTitle, setEditTitle] = useState<boolean>(false)
  const [editorValidate, setEditorValidate] = useState<boolean>(true) // 当前编辑器内容是否合法
  const [titleValue, setTitleValue] = useState<string>('')
  const [activeTab, setActiveTab] = useState<any>()
  const setMode = (mode: 'editor' | 'designer') => {
    setEditorContent(transferToEditor())
    _setMode(mode)
  }
  useEventBus('openModelingTab', ({ data }: any) => {
    setActiveTab(data)
    setMode(data.isSource ? 'editor' : 'designer')
  })
  // 首次进入设计器页面时，自动打开当前tab
  useEffect(() => {
    if (mode === 'designer') {
      setActiveTab(currentEntity)
    } else {
      setActiveTab({ name: dbSourceName, isSource: true })
    }
  }, [])

  // 编辑模式 变更时存入本地存储中
  useEffect(() => {
    localStorage.setItem(ModeKey, mode)
  }, [mode])
  useEffect(() => {
    // 此处刷新会导致编辑器内容丢失
    // setEditorContent(printSchema({ type: 'schema', list: blocks }))
  }, [blocks])
  useEffect(() => {
    // 此处刷新会导致编辑器内容丢失
    setEditorContent(printSchema({ type: 'schema', list: blocks }))
  }, [dbSourceId])

  useEffect(() => {
    setTitleValue(currentEntity?.name || '')
  }, [currentEntity])
  useEffect(() => {
    if (showType === 'newModel') {
      setTitleValue(UNTITLED_NEW_ENTITY)
    }
  }, [showType])
  useEffect(() => {
    setEditorContent(printSchema({ type: 'schema', list: blocks }))
  }, [syncEditorFlag])

  // const ctx = useContext(PrismaSchemaContext)
  const { handleClickEntity, inEdit, handleSetInEdit } = panel || {}

  const initialModel: Model = getSchema(`model ${UNTITLED_NEW_ENTITY} {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}
`).list[0] as Model

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
      void message.error(intl.formatMessage({ defaultMessage: '实体名不可为空！' }))
      return
    }
    const nameIsValid = new RegExp(ENTITY_NAME_REGEX).test(titleValue)
    if (!nameIsValid) {
      void message.error(intl.formatMessage({ defaultMessage: '实体名不合法！' }))
      return
    }
    model = { ...model, name: titleValue }
    const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }))
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
      .then(() => {
        hide()
        message.success(intl.formatMessage({ defaultMessage: '保存成功！' }))
      })
  }

  const handleSaveEnum = (enumm: Enum) => {
    if (!titleValue) {
      void message.error(intl.formatMessage({ defaultMessage: '枚举名不可为空！' }))
      return
    }
    const nameIsValid = new RegExp(ENTITY_NAME_REGEX).test(titleValue)
    if (!nameIsValid) {
      void message.error(intl.formatMessage({ defaultMessage: '枚举名不合法！' }))
      return
    }
    enumm = { ...enumm, name: titleValue }

    const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }))
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
      .then(() => {
        hide()
        message.success(intl.formatMessage({ defaultMessage: '保存成功！' }))
      })
  }

  const handleAddNewEnum = (newEnum: Enum) => {
    const exist = blocks.find(block => {
      return block.type === 'enum' && block.name === newEnum.name
    })
    if (exist) {
      return message.error(intl.formatMessage({ defaultMessage: '枚举名已存在！' }))
    }

    applyLocalBlocks(PrismaSchemaBlockOperator(blocks).addEnum(newEnum))
    // setNewEnums([...newEnums.filter(e => e.name !== newEnum.name), newEnum])
  }

  // 快捷键
  useEffect(() => {
    return registerHotkeyHandler('alt+shift+t,^+shift+t', () => {
      setMode(mode === 'designer' ? 'editor' : 'designer')
    })
  }, [mode])

  if (mode !== 'editor' && !currentEntity) {
    return (
      <div className="flex flex-col h-full">
        <div
          className="bg-white flex h-10 pr-4 pl-7 justify-end items-center"
          style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
        >
          <div className={styles.resetBtn} onClick={onCancel}>
            {intl.formatMessage({ defaultMessage: '重置' })}
          </div>
          <Button disabled={!editorValidate} className={styles.saveBtn} onClick={onSave}>
            {intl.formatMessage({ defaultMessage: '迁移' })}
          </Button>
          <Radio.Group
            disabled={!editorValidate}
            className={styles.modeRadio}
            value={mode}
            onChange={e => {
              setMode(e.target.value)
            }}
          >
            <Popover content={intl.formatMessage({ defaultMessage: '普通视图' })} trigger="hover">
              <Radio.Button value="designer">
                <img src={iconDesignModeActive} alt="" />
              </Radio.Button>
            </Popover>
            <Popover content={intl.formatMessage({ defaultMessage: '源码视图' })} trigger="hover">
              <Radio.Button value="editor">
                <img src={iconEditMode} alt="" />
              </Radio.Button>
            </Popover>
          </Radio.Group>
        </div>
        <Empty
          className="pt-20"
          description={intl.formatMessage({ defaultMessage: '无可用实体！' })}
        />
      </div>
    )
  }

  function onCancel() {
    const hide = message.loading(intl.formatMessage({ defaultMessage: '刷新中' }))
    refreshBlocks().then(() => {
      hide()
      triggerSyncEditor()
      message.success(intl.formatMessage({ defaultMessage: '重置成功！' }))
    })
  }
  async function onSave() {
    try {
      if (mode === 'editor') {
        const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }))
        await requests.post<unknown, DMFResp>(
          `/prisma/migrate/${dbSourceId ?? ''}`,
          {
            schema: currentEditorValue
          },
          { timeout: 30e3 }
        )
        await refreshBlocks()
        hide()
      } else {
        const hide = message.loading(intl.formatMessage({ defaultMessage: '保存中' }))
        await requests.post<unknown, DMFResp>(
          `/prisma/migrate/${dbSourceId ?? ''}`,
          {
            schema: transferToEditor()
          },
          { timeout: 30e3 }
        )
        await refreshBlocks()
        hide()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onDelete = () => {
    if (!inEdit) {
      // 查看模式下使用老逻辑直接删除
      changeToEntityById(getFirstEntity()?.id ?? 0)
      setShowType(getFirstEntity()?.type === 'model' ? 'preview' : 'editEnum')
      const hide = message.loading(intl.formatMessage({ defaultMessage: '删除中' }), 0)
      void updateAndSaveBlock(PrismaSchemaBlockOperator(blocks).deleteEntity(currentEntity.id))
        .then(() => {
          message.success(intl.formatMessage({ defaultMessage: '删除成功' }))
        })
        .finally(() => {
          hide()
        })
    } else {
      // 编辑模式下改为修改本地数据并选中第一项
      const localBlocks = PrismaSchemaBlockOperator(blocks).deleteEntity(currentEntity.id)
      applyLocalBlocks(localBlocks)
      setEditorContent(printSchema({ type: 'schema', list: localBlocks }))
      handleClickEntity(
        localBlocks.filter(block => block.type === 'model' || block.type === 'enum')[0]
      )
    }
  }

  const transferToEditor = () => {
    // 在这里 将 新增的枚举 添加进去
    // let newBlocks = PrismaSchemaBlockOperator(blocks).addEnums(newEnums)
    // // @ts-ignore
    // let model = ModelDesignerRef?.current?.currentModel as Model
    // if (titleValue && new RegExp(ENTITY_NAME_REGEX).test(titleValue)) {
    //   model = { ...model, name: titleValue }
    // } else {
    //   void message.error('实体名不合法')
    // }
    // PrismaSchemaBlockOperator(newBlocks).updateModel(model)
    // // 兼容代码，避免printSchema报错
    // newBlocks.forEach(block => {
    //   if (block.type === 'model' && !block.properties) {
    //     block.properties = []
    //   }
    // })
    return printSchema({ type: 'schema', list: blocks })
  }

  const handelEditTitle = (title: string) => {
    const edited = { ...currentEntity, name: title }
    const localBlocks = PrismaSchemaBlockOperator(blocks).updateModel(edited as Model)
    applyLocalBlocks(localBlocks)
    setEditorContent(printSchema({ type: 'schema', list: localBlocks }))
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs
        active={activeTab}
        onClick={(item: any) => {
          setActiveTab(item)
          if (item.isSource) {
            setMode('editor')
          } else {
            setMode('designer')
            handleClickEntity(item)
          }
        }}
      />
      <div
        className="bg-white flex flex-shrink-0 h-10 pr-4 pl-7 justify-start items-center"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
        {currentEntity ? (
          <>
            <span className="font-medium text-lg text-16px common-form">
              {/*{editType === 'edit' ? currentEntity.name : '新增'}*/}
              {editTitle ? (
                <Input
                  className="!w-20"
                  onPressEnter={e => {
                    handelEditTitle(e.currentTarget.value)
                    setEditTitle(false)
                  }}
                  onBlur={e => {
                    handelEditTitle(e.currentTarget.value)
                    setEditTitle(false)
                  }}
                  defaultValue={titleValue}
                />
              ) : (
                titleValue
              )}
              <span
                className="cursor-pointers ml-1"
                onClick={() => {
                  setEditTitle(!editTitle)
                  setTitleValue(currentEntity.name)
                }}
              >
                <img
                  alt="zhongmingming"
                  src="assets/iconfont/zhongmingming.svg"
                  style={{ height: '1em', width: '1em' }}
                />
              </span>
              {/*{isEditing && '(未保存)'}*/}
            </span>
            <span className="mr-auto font-400 text-lg ml-12px text-[#118AD1] text-14px">
              {type}
            </span>
            <div className="flex flex-0 items-center">
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
            </div>
            <div className={styles.resetBtn} onClick={onDelete}>
              {intl.formatMessage({ defaultMessage: '删除' })}
            </div>
          </>
        ) : (
          <div className="flex-1" />
        )}
        <div className={styles.resetBtn} onClick={onCancel}>
          {intl.formatMessage({ defaultMessage: '重置' })}
        </div>
        <Button disabled={!editorValidate} className={styles.saveBtn} onClick={onSave}>
          {intl.formatMessage({ defaultMessage: '迁移' })}
        </Button>
      </div>
      {type === 'model' &&
        (mode === 'designer' ? (
          <ModelDesigner
            updateLocalstorage={undefined}
            saveModify={model => {
              if (model) {
                const old = blocks.find(block => block.type === 'model' && block.id === model.id)
                if (isEqual(old, model)) {
                  return
                }
                const newBlocks = PrismaSchemaBlockOperator(blocks).updateModel(cloneDeep(model))
                applyLocalBlocks(newBlocks)
              }
            }}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            model={currentEntity as Model}
            resetNewEnums={() => setNewEnums([])}
            saveModel={handleSaveModel}
            addNewEnum={handleAddNewEnum}
            newEnums={newEnums}
            ref={ModelDesignerRef}
          />
        ) : (
          <div style={{ flex: '1 1 0' }}>
            <ModelEditor
              onUpdateValidate={setEditorValidate}
              onChange={value => {
                setCurrentEditorValue(value)
                applyLocalSchema(value)
              }}
              defaultContent={editorContent ?? ''}
            />
          </div>
        ))}
      {type === 'enum' &&
        (mode === 'designer' ? (
          <EnumDesigner
            ref={EnumDesignerRef}
            updateLocalstorage={editType === 'add' ? updateNewEntityInLocalStorage : undefined}
            setIsEditing={editType === 'edit' ? setIsEditing : undefined}
            isEditing={isEditing}
            savedEnum={currentEntity as Enum}
            saveEnum={handleSaveEnum}
            saveModify={(entity: any) => {
              if (entity) {
                const old = blocks.find(block => block.type === 'enum' && block.id === entity.id)
                if (isEqual(old, entity)) {
                  return
                }
                const newBlocks = PrismaSchemaBlockOperator(blocks).updateEnum(cloneDeep(entity))
                applyLocalBlocks(newBlocks)
              }
            }}
          />
        ) : (
          <div style={{ flex: '1 1 0' }}>
            <ModelEditor
              onChange={value => {
                setCurrentEditorValue(value)
                applyLocalSchema(value)
              }}
              defaultContent={editorContent ?? ''}
            />
          </div>
        ))}
    </div>
  )
}

export default DesignerContainer
