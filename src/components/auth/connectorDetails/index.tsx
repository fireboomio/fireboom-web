import { CopyOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { Image, Badge, Button, Popover } from 'antd'
import copy from 'copy-to-clipboard'
import React, { useContext, useEffect, useState } from 'react'
import JSONInput from 'react-json-editor-ajrm'
// @ts-ignore
import locale from 'react-json-editor-ajrm/locale/zh-cn'

import { AuthListType } from '@/interfaces/auth'
import { Connector as ConnectorType } from '@/interfaces/connector'
import { ConnectorTitleEnum, ConnectorTypeEnum, SMS, SOCIAL } from '@/lib/constant'
import { ConnectorContext } from '@/lib/context/auth-context'
import { deleteConnector, upsertConnector } from '@/lib/service/connector'

import ConnectorModal from '../connector/ConnectorModal'
import styles from './index.module.scss'

interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
}

interface JSONInputType {
  plainText: string
  jsObject: object
}

const ConnectorDetails: React.FC<Props> = ({ handleTopToggleDesigner }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const {
    connector: { currentConnector, connectors },
    connectorDispatch,
  } = useContext(ConnectorContext)
  const [json, setJson] = useState(currentConnector.config || {})
  const [_plainText, setPlainText] = useState(currentConnector.configTemplate || {})
  const [currentSelectedId, setCurrentSelectedId] = useState('')
  const modalData = connectors.filter(item => item.types === currentConnector.types)

  useEffect(() => {
    setJson(currentConnector.config)
  }, [currentConnector])

  const onIdCopyHandle = (data: string) => () => {
    copy(data)
    alert('拷贝成功')
  }

  const onJSONChangeHandle = (e: JSONInputType) => {
    setJson(e.jsObject)
    setPlainText(e.plainText)
  }

  const handleClick = async () => {
    const res = await upsertConnector({
      id: currentConnector.id,
      enable: true,
      config: json,
    })
    if (res) {
      handleTopToggleDesigner({ name: '连接器', type: 'connect' })
    }
  }

  const handleModelOk = () => {
    setIsModalVisible(false)
    handleTopToggleDesigner({ name: '连接器详情', type: 'connectDetails' })
    const currentSelected = connectors.find(item => item.id === currentSelectedId)
    connectorDispatch({
      type: 'setCurrentConnector',
      payload: currentSelected,
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
  const handleDelete = async () => {
    // FIXME:
    const res: unknown = await deleteConnector(currentConnector.id, false)
    if (res) {
      handleTopToggleDesigner({ name: '连接器', type: 'connect' })
    }
  }

  const switchConnector = () => {
    setIsModalVisible(true)
  }

  const handleReturnConnector = () => {
    handleTopToggleDesigner({ name: '连接器', type: 'connect' })
  }

  const moreContent = (
    <div className={styles.moreContent}>
      <Button type="text" onClick={switchConnector}>
        <ReloadOutlined />
        更换{ConnectorTypeEnum[currentConnector.types]}
      </Button>
      <Button type="text" onClick={void handleDelete}>
        <DeleteOutlined />
        删除
      </Button>
    </div>
  )
  {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  }
  return (
    <div>
      <div onClick={handleReturnConnector} className={styles.return}>
        {'<<'}返回连接器
      </div>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <div className={styles.icon}>
              <Image height={22} src={currentConnector.logo} alt="" />
            </div>
          </div>
          <div className={styles.titleWrapper}>
            <div className={styles.h1}>{currentConnector.name}</div>
            <div className={styles.subHeading}>
              <span className={styles.titleType}>{ConnectorTypeEnum[currentConnector.types]}</span>
              <div className={styles.status}>
                {currentConnector.enabled ? (
                  <Badge color="#1BDD8A" text="使用中" />
                ) : (
                  <Badge color="rgba(175, 176, 180, 0.6000)" text="未使用" />
                )}
              </div>
              <div className={styles.id}>
                <span>ID：{currentConnector.id}</span>
                <span>
                  <CopyOutlined onClick={onIdCopyHandle(currentConnector.id)} />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <Button>
            <a target="_blank" href="http://www.baidu.com" rel="noreferrer">
              查看README
            </a>
          </Button>
          <Popover placement="topRight" content={moreContent} trigger="click">
            <Button>更多</Button>
          </Popover>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <span>{'//'}</span>
          <span>设置</span>
          <span>请再次输入你的JSON配置</span>
        </div>

        <div className={styles.contentJson}>
          {/* eslint-disable @typescript-eslint/no-unsafe-assignment */}
          <JSONInput
            colors={{
              background: '#FFF',
              default: '#000',
            }}
            width="100%"
            onChange={onJSONChangeHandle}
            id="a_unique_id"
            placeholder={json}
            locale={locale}
            height="100%"
          />
        </div>
        {currentConnector.types !== SOCIAL && (
          <div className={styles.mailTest}>
            <span>*</span>
            <span>测试你的{currentConnector.types === SMS ? '短信' : '邮件'}链接器：</span>
            <div className={styles.inputWrapper}>
              <input type="text" />
              <button>发送</button>
            </div>
          </div>
        )}
        <Button className={styles.saveButton} onClick={void handleClick}>
          保存更改
        </Button>
      </div>
      <ConnectorModal
        title={ConnectorTitleEnum[currentConnector.types]}
        handleModelOk={handleModelOk}
        isModalVisible={isModalVisible}
        handleModelCancel={handleModelCancel}
        data={modalData}
        onItemClickHandle={onItemClickHandle}
        currentSelectedId={currentSelectedId}
      />
    </div>
  )
}
export default ConnectorDetails
