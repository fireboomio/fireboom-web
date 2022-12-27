import type { SchemaModel } from '@paljs/types'
import { Button, message, Modal } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import ModelFormContainer from '@/components/PrismaTable/components/ModelForm'
import styles from '@/pages/workbench/modeling/components/pannel/pannel.module.less'

interface Props {
  record: Record<string, any>
  currentModel: SchemaModel
  refetch: () => Promise<any>
  deleteOne: (options: any) => Promise<any>
  namespace: string
}

const PreviewActionContainer = ({ record, currentModel, refetch, deleteOne, namespace }: Props) => {
  const intl = useIntl()
  const [updateModalVisible, setUpdateModalVisible] = useImmer<boolean>(false)
  const [deleteModalVisible, setDeleteModalVisible] = useImmer<boolean>(false)

  const currentModelFields = currentModel?.fields
  const currentModelIdField = currentModelFields?.find(f => f.isId)

  const handleDeleteOne = () => {
    if (!currentModelIdField) {
      void message.error(intl.formatMessage({ defaultMessage: '找不到对应实体主键' }))
      return
    }
    void deleteOne({
      variables: {
        where: {
          [currentModelIdField.name]: record[currentModelIdField.name]
        }
      }
    })
      .then(() => {
        setDeleteModalVisible(false)
        void refetch()
      })
      .catch((err: Error) => message.error(`error: ${err.message}`))
  }

  const handleEditOne = () => {
    setUpdateModalVisible(true)
  }

  const onclickDelete = () => {
    setDeleteModalVisible(true)
  }

  return (
    <div className="flex h-7 w-full items-center ">
      <Button type="link" className="mr-4 !p-0" onClick={handleEditOne}>
        <FormattedMessage defaultMessage="编辑" />
      </Button>
      <Button type="link" className="mr-4 !p-0" onClick={onclickDelete}>
        <FormattedMessage defaultMessage="删除" />
      </Button>
      <Modal
        title={intl.formatMessage({ defaultMessage: '删除确认' })}
        closable
        open={deleteModalVisible}
        destroyOnClose
        onCancel={() => setDeleteModalVisible(false)}
        footer={
          <ButtonGroup className="gap-2">
            <Button onClick={() => setDeleteModalVisible(false)}>
              <FormattedMessage defaultMessage="取消" />
            </Button>
            <Button className={`${styles['add-btn']} cursor-default p-0`} onClick={handleDeleteOne}>
              <FormattedMessage defaultMessage="确认" />
            </Button>
          </ButtonGroup>
        }
      >
        <div>
          <FormattedMessage defaultMessage="删除操作将会同时删除关联数据！" />
        </div>
      </Modal>
      <ModelFormContainer
        model={currentModel}
        action="update"
        initialValues={record}
        modalVisible={updateModalVisible}
        refetch={refetch}
        namespace={namespace}
        setModalVisible={setUpdateModalVisible}
      />
    </div>
  )
}

export default PreviewActionContainer
