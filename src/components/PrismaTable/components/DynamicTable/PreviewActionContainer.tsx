import type { SchemaModel } from '@paljs/types'
import { Button, message, Modal } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
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
  const [updateModalVisible, setUpdateModalVisible] = useImmer<boolean>(false)
  const [deleteModalVisible, setDeleteModalVisible] = useImmer<boolean>(false)

  const currentModelFields = currentModel?.fields
  const currentModelIdField = currentModelFields?.find(f => f.isId)

  const handleDeleteOne = () => {
    if (!currentModelIdField) {
      void message.error('找不到对应实体主键')
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
      .catch((err: Error) => message.error(`删除数据失败，error: ${err.message}`))
  }

  const handleEditOne = () => {
    setUpdateModalVisible(true)
  }

  const onclickDelete = () => {
    setDeleteModalVisible(true)
  }

  return (
    <div className="flex w-full flex h-7 items-center">
      <Button type="link" className="!p-0 mr-4" onClick={handleEditOne}>
        编辑
      </Button>
      <Button type="link" className="!p-0 mr-4" onClick={onclickDelete}>
        删除
      </Button>
      <Modal
        title="删除确认"
        closable
        open={deleteModalVisible}
        destroyOnClose
        onCancel={() => setDeleteModalVisible(false)}
        footer={
          <ButtonGroup className="gap-2">
            <Button onClick={() => setDeleteModalVisible(false)}>取消</Button>
            <Button className={`${styles['add-btn']} cursor-default p-0`} onClick={handleDeleteOne}>
              确认
            </Button>
          </ButtonGroup>
        }
      >
        <div>删除操作将会同时删除关联数据！</div>
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
