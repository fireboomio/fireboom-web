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

const canBeUpdatedOrCreated = (action: 'update' | 'view' | 'create', field: SchemaField) => {
  return action !== 'view' && field[action]
}
const canBeUpdatedOrViewed = (action: 'update' | 'view' | 'create', field: SchemaField) => {
  return ['update', 'view'].includes(action) && (field.read || field.update)
}

interface Props {
  model: SchemaModel
  namespace: string
  action: 'update' | 'view' | 'create'
  modalVisible: boolean
  setModalVisible: Updater<boolean>
  refetch: () => Promise<ApolloQueryResult<any>>
  initialValues?: Record<string, any>
}

const ModelFormContainer = ({
  model,
  namespace,
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

  const { onSubmit, loading } = useActions(model, initialValues, action, onSave, namespace)

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

  return (
    <Modal
      className="common-form"
      width={550}
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
          <Button onClick={() => setModalVisible(false)}>
            <FormattedMessage defaultMessage="取消" />
          </Button>
          <Button
            key="submit"
            htmlType="submit"
            form={model.id}
            disabled={loading}
            className={`${styles['add-btn']} cursor-default p-0`}
          >
            <FormattedMessage defaultMessage="保存" />
          </Button>
        </ButtonGroup>
      }
    >
      <div className="flex pt-5 pr-5 justify-center">
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          preserve={false}
          className={`${styles['prisma-table-form-item']} flex flex-col items-end w-full`}
          name={model.id}
          onFinish={handleFormSubmit}
        >
          {showFields
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(field => {
              const options = {
                namespace,
                initialValues: initialValues ?? {},
                field: field,
                disabled: (action === 'update' && !field.update) || action === 'view'
              }
              if (field.kind === 'object') {
                return <Inputs.Object key={field.name} {...options} />
              }
              if (field.kind === 'enum') {
                return <Inputs.Enum key={field.name} {...options} />
              }
              if (field.type === 'DateTime') {
                return <Inputs.Datetime key={field.name} {...options} />
              }
              if (field.type === 'Boolean') {
                return <Inputs.Boolean key={field.name} {...options} />
              }
              if (field.type === 'Json') {
                return <Inputs.Json key={field.name} {...options} />
              }
              if (['Int', 'BigInt', 'Float', 'Decimal'].includes(field.type)) {
                return <Inputs.Number key={field.name} {...options} />
              }
              return <Inputs.Json key={field.name} {...options} />
            })}
        </Form>
      </div>
    </Modal>
  )
}

export default ModelFormContainer
