import { MailOutlined, MobileOutlined } from '@ant-design/icons'
import { Badge, Button, Table, Image } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useContext, useState } from 'react'

import { AuthListType } from '@/interfaces/auth'
import { Connector as ConnectorType } from '@/interfaces/connector'
import { EMAIL, SMS } from '@/lib/constant'
import { ConnectorContext } from '@/lib/context/auth-context'

import ConnectorModal from './ConnectorModal'
import styles from './MessageAndEmailConnector.module.scss'

interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
  data: ConnectorType[] | undefined
}

interface DataType {
  key: string
  name: string
  types: string
  experience: boolean
}

const MessageAndEmailConnector: React.FC<Props> = ({ handleTopToggleDesigner, data = [] }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentSelectedId, setCurrentSelectedId] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const { connectorDispatch } = useContext(ConnectorContext)

  const SMSData = data.filter(item => item.types === SMS)
  const emailData = data.filter(item => item.types === EMAIL)
  const isSMSInUse = SMSData.some(item => !!item.enabled)
  const isEmailInUse = emailData.some(item => !!item.enabled)
  const inUseSMS = SMSData.find(item => !!item.enabled)
  const inUseEmail = emailData.find(item => !!item.enabled)

  const columns: ColumnsType<DataType> = [
    {
      title: '连接器名称',
      dataIndex: 'name',
      render: (text, record) => {
        const header = (
          <div className={styles.tableNotInUseWrapper}>
            <div className={styles.icon}>
              {record.types === EMAIL ? <MailOutlined /> : <MobileOutlined />}
            </div>
            <span className={styles.tableNameHeader}>{text}</span>
            <Button size="small" onClick={handleConfig(record.types)}>
              配置
            </Button>
          </div>
        )
        return (
          <div>
            {record.types === SMS ? (
              isSMSInUse ? (
                <div className={styles.tableNameInUseWrapper}>
                  <div className={styles.icon}>
                    <Image src={inUseSMS?.logo} alt="" />
                  </div>
                  <div>
                    <h2>{inUseSMS?.name}</h2>
                    <h3>{inUseSMS?.id}</h3>
                  </div>
                </div>
              ) : (
                header
              )
            ) : isEmailInUse ? (
              <div className={styles.tableNameEmailInUse}>
                <Image src={inUseEmail?.logo} alt="" />
                <div>
                  <h2>{inUseEmail?.name}</h2>
                  <h3>{inUseEmail?.id}</h3>
                </div>
              </div>
            ) : (
              header
            )}
          </div>
        )
      },
    },
    {
      title: '类型',
      dataIndex: 'name',
    },
    {
      title: '登录体验',
      dataIndex: 'experience',
      render: text => {
        return text ? (
          <Badge color="#1BDD8A" text="使用中" />
        ) : (
          <span className={styles.unused}>
            <Badge color="#AFB0B4" text="未使用" />
          </span>
        )
      },
    },
  ]

  const tableData: DataType[] = [
    {
      key: SMS,
      name: '短信连接器',
      types: SMS,
      experience: isSMSInUse,
    },
    {
      key: EMAIL,
      name: '邮件链接器',
      types: EMAIL,
      experience: isEmailInUse,
    },
  ]

  const handleConfig = (types: string) => () => {
    setSelectedType(types)
    setIsModalVisible(true)
  }

  const handleModelOk = () => {
    setIsModalVisible(false)
    handleTopToggleDesigner({ name: '连接器详情', type: 'connectDetails' })
    const currentSelected = data.find(item => item.id === currentSelectedId)
    connectorDispatch({
      type: 'setCurrentConnector',
      payload: currentSelected || undefined,
    })
  }

  const handleModelCancel = () => {
    setIsModalVisible(false)
  }

  const onItemClickHandle = (data: ConnectorType) => {
    if (!data.enabled) {
      if (currentSelectedId !== data.id) {
        setCurrentSelectedId(data.id)
      } else {
        setCurrentSelectedId('')
      }
    }
  }
  const handleRowClick = (v: ConnectorType) => () => {
    const value = v.types === SMS ? inUseSMS : inUseEmail
    if (!value) {
      return false
    }
    handleTopToggleDesigner({ name: '连接器详情', type: 'connectDetails' })
    const currentSelected = data.find(item => item.id === value.id)
    connectorDispatch({
      type: 'setCurrentConnector',
      payload: currentSelected,
    })
  }

  // @ts-ignore
  return (
    <>
      <div className={styles.tableWrapper}>
        <Table
          onHeaderRow={() => ({
            className: styles.headerWidth,
          })}
          onRow={record => ({
            className: styles.tableItemWidth,
            onClick: handleRowClick(record as unknown as ConnectorType),
          })}
          pagination={false}
          columns={columns as DataType[]}
          dataSource={tableData}
          rowClassName="cursor-pointer"
        />
      </div>

      <ConnectorModal
        title={selectedType === SMS ? '设置短信连接器' : '设置邮件连接器'}
        handleModelOk={handleModelOk}
        isModalVisible={isModalVisible}
        handleModelCancel={handleModelCancel}
        data={selectedType === SMS ? SMSData : emailData}
        onItemClickHandle={onItemClickHandle}
        currentSelectedId={currentSelectedId}
      />
    </>
  )
}

export default MessageAndEmailConnector
