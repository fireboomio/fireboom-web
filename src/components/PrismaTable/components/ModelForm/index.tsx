import type { ApolloQueryResult } from '@apollo/client/core/types'
import type { SchemaField, SchemaModel } from '@paljs/types'
import { Button, Form, message, Modal } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import type { Updater } from 'use-immer'

import useActions from '@/components/PrismaTable/hooks/useActions'
import type { RelationMap } from '@/lib/helpers/prismaRelation'
import { findRelations } from '@/lib/helpers/prismaRelation'
import useCurrentEntity from '@/lib/hooks/useCurrentEntity'

import styles from './index.module.less'
import { Inputs } from './Inputs'
import { DownOutlined, MinusCircleOutlined, UpOutlined } from '@ant-design/icons'
import clsx from 'clsx'

const canBeUpdatedOrCreated = (action: 'update' | 'view' | 'create', field: SchemaField) => {
  return action !== 'view' && field[action]
}
const canBeUpdatedOrViewed = (action: 'update' | 'view' | 'create', field: SchemaField) => {
  return ['update', 'view'].includes(action) && (field.read || field.update)
}

interface Props {
  model: SchemaModel
  // namespace: string
  action: 'update' | 'view' | 'create'
  modalVisible: boolean
  setModalVisible: Updater<boolean>
  refetch: () => Promise<ApolloQueryResult<any>>
  initialValues?: Record<string, any>
}

const ModelFormContainer = ({
  model,
  // namespace,
  action,
  modalVisible,
  setModalVisible,
  refetch,
  initialValues
}: Props) => {
  const intl = useIntl()
  const { currentEntity, changeToEntityById } = useCurrentEntity()
  const [relationMap, setRelationMap] = useState<RelationMap>()

  useEffect(() => {
    setRelationMap(findRelations(currentEntity))
  }, [currentEntity])
  const onSave = async () => {
    await refetch()
      .then(() => setModalVisible(false))
      .then(() => message.success(intl.formatMessage({ defaultMessage: '操作成功！' })))
      .catch(() => message.error(intl.formatMessage({ defaultMessage: '操作失败！' })))
  }

  // const { onSubmit, loading } = useActions(model, initialValues, action, onSave, namespace)
  const { onSubmit, loading } = useActions(model, initialValues, action, onSave)

  const handleFormSubmit = (values: Record<string, any>) =>
    void onSubmit(values).catch((error: Error) => message.error(`${error.message}`))

  if (!relationMap) return null

  // const
  const showFields = model.fields.filter(
    field =>
      (canBeUpdatedOrCreated(action, field) || canBeUpdatedOrViewed(action, field)) &&
      !(field.list && field.kind === 'object') &&
      // !field.relationField &&
      !relationMap.key2obj[field.name] && // 不显示关联字段
      (field.name !== model.idField || !field.hasDefault) // 如果是主键且有默认值，则隐藏
  )
  // console.log(relationMap)

  function buildScalarField(field: any, options: any) {
    switch (field.type) {
      case 'String':
        return <Inputs.String key={field.name} {...options} />
      case 'Boolean':
        return <Inputs.Boolean key={field.name} {...options} />
      case 'Int':
      case 'BigInt':
        return <Inputs.Int key={field.name} {...options} />
      case 'Float':
      case 'Decimal':
        return <Inputs.Float key={field.name} {...options} />
      case 'DateTime':
        return <Inputs.Datetime key={field.name} {...options} />
      case 'Json':
        return <Inputs.Json key={field.name} {...options} />
      case 'Bytes':
        return <Inputs.Bytes key={field.name} {...options} />
      default:
        return <Inputs.Unsupported key={field.name} {...options} />
    }
  }

  return (
    <Modal
      className="common-form"
      width={800}
      open={modalVisible}
      destroyOnClose
      title={
        {
          create: intl.formatMessage({ defaultMessage: '添加' }),
          update: intl.formatMessage({ defaultMessage: '编辑' }),
          view: intl.formatMessage({ defaultMessage: '查看' })
        }[action]
      }
      onCancel={() => setModalVisible(false)}
      footer={
        <ButtonGroup className="gap-2">
          <Button className="btn-cancel" onClick={() => setModalVisible(false)}>
            <FormattedMessage defaultMessage="取消" />
          </Button>
          <Button
            key="submit"
            htmlType="submit"
            form={model.id}
            disabled={loading}
            className={`btn-save cursor-default`}
          >
            <FormattedMessage defaultMessage="保存" />
          </Button>
        </ButtonGroup>
      }
    >
      <div className="flex pt-5 pr-5 justify-center">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          preserve={false}
          className={`${styles['prisma-table-form-item']} flex flex-col items-end w-full`}
          name={model.id}
          // initialValues={initialValues}
          initialValues={showFields.reduce<Record<string, any>>((obj, field: any) => {
            if (field.isList) {
              obj[field.name] = initialValues?.[field.name]
            }
            return obj
          }, {})}
          onFinish={handleFormSubmit}
        >
          {showFields
            .slice()
            // @ts-ignore
            .sort((a, b) => (a.isId ? -1 : b.isId ? 1 : a.order - b.order))
            .map((field: any) => {
              function buildNonListField(field: any) {
                const options = {
                  // namespace,
                  initialValues: initialValues ?? {},
                  field: field,
                  disabled: (action === 'update' && !field.update) || action === 'view'
                }
                switch (field.kind) {
                  case 'object':
                    return <Inputs.Object key={field.name} {...options} />
                  case 'enum':
                    return <Inputs.Enum key={field.name} {...options} />
                  case 'scalar':
                    return buildScalarField(field, options)
                  default:
                    return <Inputs.Unsupported key={field.name} {...options} />
                }
              }
              if (field.isList) {
                return (
                  <Form.Item className="w-full" label={field.title}>
                    <Form.List name={field.name}>
                      {(fields, { add, remove, move }) => {
                        return (
                          <div className="w-full">
                            {fields.map((_field, index) => {
                              const upEnabled = index !== 0
                              const downEnabled = index !== fields.length - 1
                              return (
                                <div key={_field.name} className="w-full flex items-start">
                                  <div className="flex-1 min-w-0">
                                    {buildNonListField({
                                      ...field,
                                      title: undefined,
                                      name: _field.name
                                    })}
                                  </div>
                                  <div className="ml-2 h-8 flex items-center">
                                    <UpOutlined
                                      className={clsx(
                                        upEnabled ? 'cursor-pointer' : 'text-gray-200'
                                      )}
                                      onClick={upEnabled ? () => move(index, index - 1) : undefined}
                                    />
                                    <DownOutlined
                                      className={clsx(
                                        'ml-2',
                                        downEnabled
                                          ? 'cursor-pointer'
                                          : 'text-gray-200'
                                      )}
                                      onClick={downEnabled ? () => move(index, index + 1) : undefined}
                                    />
                                    <MinusCircleOutlined
                                      className="ml-2 cursor-pointer"
                                      onClick={() => remove(_field.name)}
                                    />
                                  </div>
                                </div>
                              )
                            })}
                            <Button type="dashed" className="w-full mt-4" onClick={() => add()}>
                              <FormattedMessage defaultMessage="+ 添加" />
                            </Button>
                          </div>
                        )
                      }}
                    </Form.List>
                  </Form.Item>
                )
              } else {
                return buildNonListField(field)
              }
            })}
        </Form>
      </div>
    </Modal>
  )
}

export default ModelFormContainer
