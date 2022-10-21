import {
  MoreOutlined,
  PaperClipOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  TagOutlined
} from '@ant-design/icons'
import type { Attribute, Field, ModelAttribute, Property } from '@mrleebo/prisma-ast'
import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Row,
  Spin
} from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import { useEffect } from 'react'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import MorePopoverContent from '@/components/components/MorePopoverContent'
import NormalInputCell from '@/components/components/NormalInputCell'
import type { ArrayOrOptionalRadioValue } from '@/components/components/QuestionPopoverContent'
import QuestionPopoverContent from '@/components/components/QuestionPopoverContent'
import type { Enum, Model } from '@/interfaces/modeling'
import { MAGIC_DELETE_ENTITY_NAME, UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import { checkAndUpdateRelation, checkIdExist } from '@/lib/helpers/PropertiesHelper'

import styles from '../index.module.less'
import FieldTypeCell from './field-type-cell'
import FieldAttributesCell from './fieldattributes'
import ModelAttributes from './modelattributes'

interface Props {
  model: Model
  saveModel: (model: Model) => void
  updateLocalstorage?: (model: Model) => void
  isEditing: boolean
  setIsEditing?: Updater<boolean>
  newEnums: Enum[]
  addNewEnum: (newEnum: Enum) => void
  resetNewEnums: () => void
}

const ModelDesigner = ({
  model,
  saveModel,
  updateLocalstorage,
  setIsEditing,
  isEditing,
  addNewEnum,
  newEnums,
  resetNewEnums
}: Props) => {
  const [currentModel, setCurrentModel] = useImmer<Model>(model)

  const [modelNameModalVisible, setModelNameModalVisible] = useImmer(false)

  const [morePopoverEditingFieldName, setMorePopoverEditingFieldName] = useImmer<
    string | undefined
  >(undefined)
  const [questionPopoverEditingFieldName, setQuestionPopoverEditingFieldName] = useImmer<
    string | undefined
  >(undefined)

  const [invalidFieldIdx, setInvalidFieldIdx] = useImmer<number[]>([])

  useEffect(() => {
    setCurrentModel(model)
  }, [model])

  useEffect(() => {
    updateLocalstorage && updateLocalstorage(currentModel)
  }, [currentModel, updateLocalstorage])

  useEffect(() => {
    setIsEditing && setIsEditing(JSON.stringify(model) !== JSON.stringify(currentModel))
  }, [currentModel, model, setIsEditing])

  const addEmptyField = () => {
    setCurrentModel(m => {
      m.properties.push({
        type: 'field',
        fieldType: 'String',
        name: ''
      })
    })
  }
  const addEmptyModelAttribute = () => {
    setCurrentModel(m => {
      m.properties.push({
        type: 'attribute',
        kind: 'model',
        name: '',
        args: []
      })
    })
  }
  const addEmptyFieldAttribute = (field: Field) => {
    const newField = { ...field }

    const newAttributes = newField.attributes ?? []
    newField.attributes = [
      ...newAttributes,
      {
        type: 'attribute',
        kind: 'field',
        name: '',
        args: []
      }
    ]
    const newModel = {
      ...currentModel,
      properties: currentModel.properties.map(property => {
        if (property.type === field.type && property.name === field.name) {
          return newField
        }
        return property
      })
    }
    setCurrentModel(newModel)
  }

  const deleteEmptyAttributes = () => {
    setCurrentModel(m => {
      const { properties: currentProperties } = m
      m.properties = currentProperties
        .filter(p => (p.type === 'attribute' && p.name) || p.type !== 'attribute')
        .map(p => {
          if (p.type === 'field') {
            // 保留attribute name不为空的
            const newFieldAttributes = [...(p.attributes ?? [])].filter(attr => attr.name)
            return {
              ...p,
              attributes: newFieldAttributes.length > 0 ? newFieldAttributes : undefined
            }
          }
          return p
        })
    })
  }

  if (!currentModel) {
    return <Spin />
  }

  const { properties, name: currentModelName } = currentModel
  const fields = (properties?.filter(p => p.type === 'field') as Field[]) || []
  const attributes = (properties?.filter(p => p.type === 'attribute') as ModelAttribute[]) || []

  const handlePropertyUpdate = (originalProperty: Property, newProperty: Property) => {
    const newModel = {
      ...currentModel,
      properties: properties.map(property => {
        if (JSON.stringify(property) === JSON.stringify(originalProperty)) {
          return newProperty
        }
        return property
      })
    }
    setCurrentModel(
      originalProperty.type === 'field'
        ? checkAndUpdateRelation(newModel, originalProperty, newProperty.name)
        : newModel
    )
  }

  const handleDeleteProperty = (toBeDel: Property) => {
    const newModel = {
      ...currentModel,
      properties: properties.filter(p => !(JSON.stringify(p) === JSON.stringify(toBeDel)))
    }
    setCurrentModel(toBeDel.type === 'field' ? checkAndUpdateRelation(newModel, toBeDel) : newModel)
  }

  const handleDeleteFieldAttribute = (field: Field) => (idx: number) => {
    const newField = { ...field }

    const newAttributes = [...(newField?.attributes ?? [])]
    newAttributes.splice(idx, 1)
    newField.attributes = newAttributes

    handlePropertyUpdate(field, newField)
  }

  const handleUpdateFieldAttribute = (field: Field) => (idx: number, attr: Attribute) => {
    const newField = { ...field }
    const newAttributes = [...(newField.attributes ?? [])]
    newAttributes[idx] = attr
    newField.attributes = newAttributes
    handlePropertyUpdate(field, newField)
  }

  const handleFieldTypeChange = (field: Field) => (fieldType: string) => {
    const newField = {
      ...field,
      fieldType
    }
    handlePropertyUpdate(field, newField)
  }

  const handleFieldNameChange = (field: Field) => (name: string) => {
    if (!name) {
      const newModel = {
        ...currentModel,
        properties: properties.filter(
          p => !(p.type === 'field' && (p.name === field.name || p.name === ''))
        )
      }
      setCurrentModel(checkAndUpdateRelation(newModel, field))
      return
    }
    const newField = {
      ...field,
      name
    }
    handlePropertyUpdate(field, newField)
  }

  const handleFieldCommentChange = (field: Field) => (comment: string) => {
    let commentValue = comment
    if (commentValue && !commentValue.startsWith('//')) {
      commentValue = `// ${commentValue}`
    }
    const newField = {
      ...field,
      comment: commentValue
    }
    handlePropertyUpdate(field, newField)
  }

  const handleCopyField = (originalField: Field) => () => {
    let copiedName = `${originalField.name}_copy`
    while (properties.find(p => p.type === 'field' && p.name === copiedName)) {
      copiedName += '_copy'
    }
    const newModel: Model = {
      ...currentModel,
      properties: [...properties, { ...originalField, name: copiedName }]
    }
    setCurrentModel(newModel)
    setMorePopoverEditingFieldName(undefined)
  }

  const handleMoreClick = (name: string) => () => {
    setMorePopoverEditingFieldName(name === morePopoverEditingFieldName ? undefined : name)
  }

  const handleQuestionClick = (name: string) => () => {
    setQuestionPopoverEditingFieldName(name === questionPopoverEditingFieldName ? undefined : name)
  }

  const handleIsArrayOrRequiredCheck = (field: Field) => (value: ArrayOrOptionalRadioValue) => {
    const newField = {
      ...field,
      array: value === 'isArray',
      optional: value === 'optional'
    }
    handlePropertyUpdate(field, newField)
  }

  const handleValidateFieldName =
    (originalFieldName: string, idx: number) => (fieldName: string) => {
      const fieldNameIsValid = new RegExp('^([A-Za-z][A-Za-z0-9_]*)*$').test(fieldName)
      const fieldNameExist =
        originalFieldName !== fieldName && fields.map(f => f.name).find(n => n === fieldName)

      if (!fieldNameIsValid) {
        if (invalidFieldIdx.indexOf(idx) === -1) {
          setInvalidFieldIdx(idxs => {
            idxs.push(idx)
          })
        }
        return { result: false, errorMessage: '字段名不合法，以字母开头，可包含数字和下划线' }
      }
      if (fieldNameExist) {
        if (invalidFieldIdx.indexOf(idx) === -1) {
          setInvalidFieldIdx(idxs => {
            idxs.push(idx)
          })
        }
        return { result: false, errorMessage: '字段名已存在' }
      }
      if (invalidFieldIdx.indexOf(idx) !== -1) {
        setInvalidFieldIdx(idxs => {
          idxs.splice(idxs.indexOf(idx), 1)
        })
      }
      return { result: true }
    }

  const handleResetModel = () => {
    resetNewEnums()
    setCurrentModel(model)
  }

  const handleSaveModel = () => {
    if (!checkIdExist(currentModel)) {
      void message.error('实体未设置主键')
      return
    }
    if (currentModelName === UNTITLED_NEW_ENTITY) {
      setModelNameModalVisible(true)
      return
    }
    saveModel(currentModel)
  }

  const handleUpdateModelName = ({ modelName }: { modelName: string }) => {
    if (modelName === MAGIC_DELETE_ENTITY_NAME) {
      void message.error('实体名不合法！')
      return
    }
    saveModel({ ...currentModel, name: modelName })
    setModelNameModalVisible(false)
  }

  const FieldRow = (idx: number, field: Field) => {
    return (
      <Row
        justify="space-between"
        key={idx}
        className="my-1.5 text-sm font-normal leading-7"
        wrap={false}
      >
        <Col span={22}>
          <Row wrap={false}>
            <Col span={3}>
              <NormalInputCell
                placeholder="请编辑"
                data={field.name}
                onBlur={handleFieldNameChange(field)}
                initialIsEditing={field.name === ''}
                validation={handleValidateFieldName(field.name, idx)}
              />
            </Col>
            <Col span={4}>
              <FieldTypeCell
                index={idx}
                field={field}
                fields={fields}
                currentModel={currentModel}
                newEnums={newEnums}
                addNewEnum={addNewEnum}
                updateFieldType={handleFieldTypeChange(field)}
              />
            </Col>
            <Col span={17}>
              <div className="flex flex-row no-wrap">
                {field.attributes && (
                  <FieldAttributesCell
                    fields={fields}
                    deleteEmptyAttributes={deleteEmptyAttributes}
                    deleteFieldAttribute={handleDeleteFieldAttribute(field)}
                    updateFieldAttribute={handleUpdateFieldAttribute(field)}
                    field={field}
                    dbSourceType="MySQL"
                  />
                )}
                <NormalInputCell
                  placeholder="注释描述"
                  className="text-[#AFB0B4]"
                  data={field.comment?.replace(/^\/\/\s+/, '') ?? ''}
                  onBlur={handleFieldCommentChange(field)}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={2}>
          <div className="ml-auto flex flex-row justify-end items-center">
            <Popover
              open={morePopoverEditingFieldName === field.name}
              trigger="click"
              onOpenChange={visible =>
                setMorePopoverEditingFieldName(visible ? field.name : undefined)
              }
              content={
                <MorePopoverContent
                  onDeleteClick={() => handleDeleteProperty(field)}
                  onCopyClick={handleCopyField(field)}
                />
              }
              placement="left"
            >
              <MoreOutlined onClick={handleMoreClick(field.name)} />
            </Popover>

            <Divider type="vertical" />

            <PaperClipOutlined onClick={() => addEmptyFieldAttribute(field)} />

            <Divider type="vertical" />

            <Popover
              open={questionPopoverEditingFieldName === field.name}
              trigger="click"
              onOpenChange={visible =>
                setQuestionPopoverEditingFieldName(visible ? field.name : undefined)
              }
              content={
                <QuestionPopoverContent
                  radioValue={field.optional ? 'optional' : field.array ? 'isArray' : undefined}
                  handleRadioChange={handleIsArrayOrRequiredCheck(field)}
                />
              }
              placement="left"
            >
              <QuestionCircleOutlined onClick={handleQuestionClick(field.name)} />
            </Popover>
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <>
      <div className="flex justify-start items-center my-6">
        <Breadcrumb className="text-base flex-grow" separator=" ">
          <Breadcrumb.Item>{currentModelName}</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[#118AD1]">model</Breadcrumb.Item>
        </Breadcrumb>
        <Button className="mr-3" onClick={handleResetModel} disabled={!isEditing}>
          重置
        </Button>
        <Button
          className={`${styles['save-btn']} mr-3`}
          onClick={handleSaveModel}
          disabled={!isEditing || invalidFieldIdx.length > 0}
        >
          保存
        </Button>
        <PlusCircleOutlined className="text-base mr-3" onClick={addEmptyField} />
        <TagOutlined className="text-base" onClick={addEmptyModelAttribute} />
      </div>
      {fields?.map((field, idx) => FieldRow(idx, field))}

      <ModelAttributes
        modelAttributes={attributes}
        currentModel={currentModel}
        deleteEmptyAttributes={deleteEmptyAttributes}
        handleDeleteAttribute={handleDeleteProperty}
        handleUpdateAttribute={handlePropertyUpdate}
      />
      <Modal
        title="新增实体"
        visible={modelNameModalVisible}
        onCancel={() => setModelNameModalVisible(false)}
        destroyOnClose
        footer={
          <ButtonGroup className="gap-2">
            <Button onClick={() => setModelNameModalVisible(false)}>取消</Button>
            <Button
              key="submit"
              htmlType="submit"
              form="new_model_name_form"
              className={`${styles['save-btn']} cursor-default p-0`}
            >
              保存
            </Button>
          </ButtonGroup>
        }
      >
        <Form onFinish={handleUpdateModelName} name="new_model_name_form">
          <Form.Item
            label="实体名"
            name="modelName"
            initialValue={currentModelName}
            rules={[
              {
                pattern: new RegExp('^([A-Za-z][A-Za-z0-9_]*)*$'),
                required: true,
                message: '实体名称不合法，pattern: [A-Za-z][A-Za-z0-9_]*'
              }
            ]}
          >
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ModelDesigner
