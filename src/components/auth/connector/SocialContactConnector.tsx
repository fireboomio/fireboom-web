import { MobileOutlined, OneToOneOutlined } from '@ant-design/icons'
import { Image, Badge, Button, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useContext, useState } from 'react'

import { AuthListType } from '@/interfaces/auth'
import { Connector as ConnectorType } from '@/interfaces/connector'
import { ConnectorContext } from '@/lib/context/auth-context'

import ConnectorModal from './ConnectorModal'
import styles from './SocialContactConnector.module.less'
interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
  data: ConnectorType[] | undefined
}
interface DataType {
  key: string
  name: string
  type: string
  experience: boolean
  logo: string
  platform: string
}

const SocialContactConnector: React.FC<Props> = ({ data = [], handleTopToggleDesigner }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentSelectedId, setCurrentSelectedId] = useState('')
  const { connectorDispatch } = useContext(ConnectorContext)

  const renderLogo = (platform: string) => {
    switch (platform) {
      case 'Native':
        return <MobileOutlined />
      case 'Web':
        return <OneToOneOutlined />
      default:
        return null
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '连接器名称',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <div className={styles['table-header-name']}>
            <div className={styles.icon}>
              <Image src={record?.logo} alt="" preview={false} />
            </div>
            <span className={styles.tableNameHeader}>{text}</span>
            <span>{renderLogo(record?.platform)}</span>
          </div>
        )
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: () => {
        return <span>社交连接器</span>
      },
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
  const tableData = data
    .filter(item => !!item.enabled)
    .map(item => {
      return {
        key: item.id,
        name: item.name,
        type: item.types,
        experience: item.enabled,
        logo: item.logo,
        platform: item.platform,
      }
    })

  const handleConfig = () => {
    setIsModalVisible(true)
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

  const handleModelOk = () => {
    setIsModalVisible(false)
    handleTopToggleDesigner({ name: '连接器详情', type: 'connectDetails' })
    const currentSelected = data.find(item => item.id === currentSelectedId)
    connectorDispatch({
      type: 'setCurrentConnector',
      payload: currentSelected,
    })
  }

  const handleRowClick = (value: DataType) => () => {
    handleTopToggleDesigner({ name: '连接器详情', type: 'connectDetails' })
    const currentSelected = data.find(item => item.id === value.key)
    connectorDispatch({
      type: 'setCurrentConnector',
      payload: currentSelected,
    })
  }

  return (
    <div className={styles.socialContactConnectorWrapper}>
      <Button className={styles.addSocialButton} onClick={handleConfig}>
        添加社交连接器
      </Button>
      <div className={styles.tableWrapper}>
        <Table
          onHeaderRow={() => {
            return {
              className: styles.headerWidth,
            }
          }}
          onRow={record => {
            return {
              className: styles.tableItemWidth,
              onClick: handleRowClick(record as DataType), // 点击行
            }
          }}
          pagination={false}
          columns={columns as DataType[]}
          dataSource={tableData}
          rowClassName="cursor-pointer"
        />
      </div>

      <ConnectorModal
        title="添加社交连接器"
        handleModelOk={handleModelOk}
        isModalVisible={isModalVisible}
        handleModelCancel={handleModelCancel}
        data={data}
        onItemClickHandle={onItemClickHandle}
        currentSelectedId={currentSelectedId}
      />
    </div>
  )
}

export default SocialContactConnector
