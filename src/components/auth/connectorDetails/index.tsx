import { CopyOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { Badge, Button, Image, Popover } from 'antd'
import copy from 'copy-to-clipboard'
import type React from 'react'
import { useEffect, useState } from 'react'
import JSONInput from 'react-json-editor-ajrm'
// @ts-ignore
import locale from 'react-json-editor-ajrm/locale/zh-cn'
import { useNavigate, useParams } from 'react-router-dom'

import type { Connector, Connector as ConnectorType } from '@/interfaces/connector'
import { ConnectorTitleEnum, ConnectorTypeEnum, SMS, SOCIAL } from '@/lib/constant'
import requests from '@/lib/fetchers'

import ConnectorModal from '../connector/ConnectorModal'
import styles from './index.module.less'

interface JSONInputType {
  jsObject: object
}

const ConnectorDetails: React.FC = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { id } = useParams()
  const [currentConnector, setCurrentConnector] = useState<Connector>()
  const [connectors, setConnectors] = useState<Connector[]>()
  const [json, setJson] = useState<Object>()
  const [currentSelectedId, setCurrentSelectedId] = useState('')
  useEffect(() => {
    void requests.get<unknown, Connector[]>('/auth/linker').then(res => {
      const connect = res.find(x => x.id === id)
      if (connect) {
        setCurrentSelectedId(id || '')
        setCurrentConnector(connect)
        setConnectors(res)
        if (connect.enabled) {
          // 已启用状态则优先使用现有config
          setJson(connect.config || JSON.parse(connect.configTemplate))
        } else {
          // 未启用状态直接使用模板数据，以避免脏数据导致无法展示模板
          setJson(JSON.parse(connect.configTemplate))
        }
      }
    })
  }, [id])
  if (!currentConnector || !connectors) {
    return <div />
  }
  const modalData = (connectors || []).filter(item => item.types === currentConnector.types)
  // const {
  //   connector: { currentConnector, connectors },
  //   connectorDispatch
  // } = useContext(ConnectorContext)

  // useEffect(() => {
  //   // setJson(currentConnector.config)
  // }, [currentConnector])

  const onIdCopyHandle = (data: string) => () => {
    copy(data)
    alert('拷贝成功')
  }

  const onJSONChangeHandle = (e: JSONInputType) => {
    setJson(e.jsObject)
  }

  const handleClick = async () => {
    const res = await requests.post('/auth/linker', {
      id: currentConnector.id,
      enabled: true,
      config: json
    })
    if (res) {
      navigate('/auth/connect')
    }
  }

  const handleModelOk = () => {
    navigate(`/auth/connectDetails/${currentSelectedId}`)
    setIsModalVisible(false)
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
    const res = await requests.post('/auth/linker', {
      id: currentConnector.id,
      enabled: false
    })
    if (res) {
      navigate('/auth/connect')
    }
  }

  const switchConnector = () => {
    setIsModalVisible(true)
  }

  const handleReturnConnector = () => {
    // handleTopToggleDesigner({ name: '连接器', type: 'connect' })
  }

  const moreContent = (
    <div className={styles.moreContent}>
      <Button type="text" onClick={switchConnector}>
        <ReloadOutlined />
        更换{ConnectorTypeEnum[currentConnector.types]}
      </Button>
      <Button type="text" onClick={handleDelete}>
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
            <a target="_blank" rel="noreferrer">
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
              default: '#000'
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
        <Button className={styles.saveButton} onClick={() => handleClick()}>
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
