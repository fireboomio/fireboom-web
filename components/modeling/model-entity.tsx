import { AppleOutlined, MoreOutlined, PlusCircleOutlined, UserOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Space, Popconfirm, Input } from 'antd'
import type { MenuProps } from 'antd'
import { useState } from 'react'

import type { Entity } from '@/interfaces/model'

import styles from './model-entity.module.css'

interface Props {
  entities: Entity[]
}

export default function ModelEntity({ entities }: Props) {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(true)

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag)
  }
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === '3') {
      setVisible(false)
    }
  }
  const handleModleClick = () => {
    console.log('处理模型')
  }
  const handleEumClick = () => {
    console.log('枚举模型')
  }
  const handleObserveClick = () => {
    console.log('查看数据')
  }
  // const modleNameRef=useRef(null)
  const handleNameClick = () => {
    setShow(false)
    const modlename = document.getElementById('modleName')?.innerHTML

    console.log(modlename)
  }
  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: '1',
          label: (
            <span
              onClick={(e) => {
                handleNameClick()
              }}
            >
              重命名
            </span>
          ),
          icon: <UserOutlined />,
        },
        {
          key: '2',
          label: <span onClick={handleObserveClick}>查看</span>,
          icon: <UserOutlined />,
        },
        {
          key: '3',
          label: (
            <Popconfirm
              title="您是否确定删除当前项？"
              placement="rightTop"
              okText="确定删除"
              cancelText="取消"
            >
              删除
            </Popconfirm>
          ),
          icon: <UserOutlined />,
        },
      ]}
    />
  )
  const list = (
    <Menu
      items={[
        {
          label: <span onClick={handleModleClick}>模型</span>,
          key: '1',
          icon: <UserOutlined />,
        },
        {
          label: <span onClick={handleEumClick}>枚举</span>,
          key: '2',
          icon: <UserOutlined />,
        },
      ]}
    />
  )

  return (
    <>
      <div className={styles['entity-list']}>
        <span className={styles['span']}>所有实体</span>
        <Dropdown overlay={list} placement="bottomRight">
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <PlusCircleOutlined></PlusCircleOutlined>
            </Space>
          </a>
        </Dropdown>
      </div>

      <div className={styles['item-wrapper']}>
        {entities.map((e) => (
          <div className={styles.item} key={e.name}>
            <div className={styles['main']}>
              <AppleOutlined className={styles['icon1']}></AppleOutlined>
              <AppleOutlined className={styles['icon2']}></AppleOutlined>
              {show ? (
                <div className={styles['content']} id="modleName">
                  {e.name}
                </div>
              ) : (
                <Input id="inputName" placeholder="Basic usage" size="small" />
              )}
            </div>
            <Dropdown overlay={menu} placement="bottomRight">
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <MoreOutlined></MoreOutlined>
                </Space>
              </a>
            </Dropdown>
          </div>
        ))}
      </div>
    </>
  )
}
