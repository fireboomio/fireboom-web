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

  //pannel 点击搜索框下6个按钮对应回调
  function introSpector_one() {
    console.log('触发introSpector_one操作')
  }

  function downLoad_two() {
    console.log('触发downLoad操作')
  }

  function upload_three() {
    console.log('触发CloudUploadr操作')
  }

  function connectCloudLocal_four() {
    console.log('触发connectCloudLocal操作')
  }

  function checkThing_fif() {
    console.log('触发connectCloudLocal操作')
  }

  function entity_Relationship_six() {
    console.log('触发Entity_Relationship操作')
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

        <div className={styles.actions}>
          <AppleOutlined onClick={introSpector_one}></AppleOutlined>
          <AppleOutlined onClick={downLoad_two}></AppleOutlined>
          <AppleOutlined onClick={upload_three}></AppleOutlined>
          <AppleOutlined onClick={connectCloudLocal_four}></AppleOutlined>
          <AppleOutlined onClick={checkThing_fif}></AppleOutlined>
          <AppleOutlined onClick={entity_Relationship_six}></AppleOutlined>
        </div>
      </div>

      <ModelEntityList></ModelEntityList>
    </EntitiesContext.Provider>
  )
}
