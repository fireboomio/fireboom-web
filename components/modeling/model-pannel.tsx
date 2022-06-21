import { AppleOutlined, QrcodeOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Select, Tooltip } from 'antd'
import { useImmer } from 'use-immer'

import { Entity } from '@/interfaces/modeling'

import { EntitiesContext } from './model-context'
import styles from './model-pannel.module.scss'
import ModelEntityList from './subs/model-entity-list'

const { Option } = Select

export default function ModelPannel() {
  const [entities, setEntities] = useImmer([
    { id: 1, name: 'users' },
    { id: 2, name: 'posts' },
    { id: 3, name: 'comments' },
  ] as Entity[])

  function handleChange(value: string) {
    console.log(`selected ${value}`)
  }

  function goRoute(target: object): void {
    const currentTarget = target as HTMLElement
    if (currentTarget.nodeName == 'svg')
      //事件委托，点击图标才触发事件
      console.log('跳转到页面', currentTarget)
  }

  return (
    <EntitiesContext.Provider value={{ entities, setEntities }}>
      <div className={styles.pannel}>
        <div className={styles.title}>数据建模</div>

        <div className={styles['select-contain']}>
          <Select className={styles.select} defaultValue="lucy" onChange={handleChange}>
            <Option value="jack" className={styles.Option}>
              <AppleOutlined className={styles['option-icon']}></AppleOutlined>Jack
            </Option>
            <Option value="lucy">
              <AppleOutlined className={styles['option-icon']}></AppleOutlined>Lucy
            </Option>
            <Option value="Yiminghe">
              <AppleOutlined className={styles['option-icon']}></AppleOutlined>yiminghe
            </Option>
            <Option value="manage" className={styles.manage}>
              <QrcodeOutlined className={styles['option-icon']} />
              管理
            </Option>
          </Select>
          <Tooltip title="prompt text">
            <InfoCircleOutlined style={{ marginLeft: '4px', fontSize: '15px', display: 'none' }} />
          </Tooltip>
        </div>

        <div
          className={styles.actions}
          onClick={(e) => {
            goRoute(e.target)
          }}
        >
          <AppleOutlined></AppleOutlined>
          <AppleOutlined></AppleOutlined>
          <AppleOutlined></AppleOutlined>
          <AppleOutlined></AppleOutlined>
          <AppleOutlined></AppleOutlined>
          <AppleOutlined></AppleOutlined>
        </div>
      </div>

      <ModelEntityList></ModelEntityList>
    </EntitiesContext.Provider>
  )
}
