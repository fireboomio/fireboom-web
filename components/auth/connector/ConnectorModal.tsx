import { Button, Modal } from 'antd'
import React from 'react'

import { Connector as ConnectorType } from '@/interfaces/connector'

import ConnectorItem from './ConnectorItem'
import styles from './ConnectorModal.module.scss'
interface Props {
  title: string
  handleModelOk: () => void
  handleModelCancel: () => void
  isModalVisible: boolean
  data: ConnectorType[]
  onItemClickHandle: (data: ConnectorType) => void
  currentSelectedId: string
}

const ConnectorModal: React.FC<Props> = ({
  title,
  handleModelOk,
  isModalVisible,
  handleModelCancel,
  data,
  onItemClickHandle,
  currentSelectedId,
}) => {
  return (
    <Modal
      width="690px"
      title={title}
      footer={[
        <Button className={styles['next-button']} key="next" onClick={handleModelOk}>
          下一步
        </Button>,
      ]}
      visible={isModalVisible}
      onOk={handleModelOk}
      onCancel={handleModelCancel}
    >
      <div className={styles['modal-wrapper']}>
        {data.map((item, index) => (
          <ConnectorItem
            key={`${item.id} ${index}`}
            onItemClickHandle={onItemClickHandle}
            currentSelectedId={currentSelectedId}
            data={item}
          />
        ))}
      </div>
    </Modal>
  )
}

export default ConnectorModal
