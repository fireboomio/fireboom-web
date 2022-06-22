import { AppleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Select, Tooltip } from 'antd'
import type { SelectProps } from 'antd'
import { useImmer } from 'use-immer'

import { Entity } from '@/interfaces/modeling'

import { EntitiesContext } from './model-context'
import styles from './model-pannel.module.scss'
import ModelEntityList from './subs/model-entity-list'

export default function ModelPannel() {
  const [entities, setEntities] = useImmer([
    { id: 1, name: 'users' },
    { id: 2, name: 'posts' },
    { id: 3, name: 'comments' },
  ] as Entity[])

  const menu = ['jack', 'jack1', 'jack2', '管理']
  const options: SelectProps['options'] = []
  for (let i = 0; i < menu.length; i++) {
    const value = menu[i]
    options.push({
      label: value,
      value,
      disabled: i === 10,
    })
  }

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
          <Select
            className={styles.select}
            defaultValue="lucy"
            onChange={handleChange}
            options={options}
          >
            {}
          </Select>
          <Tooltip title="prompt text">
            <InfoCircleOutlined style={{ marginLeft: '4px', fontSize: '15px', display: 'none' }} />
          </Tooltip>
        </div>

        <div className={styles.actions}>
          <AppleOutlined onClick={introSpector_one} />
          <AppleOutlined onClick={downLoad_two} />
          <AppleOutlined onClick={upload_three} />
          <AppleOutlined onClick={connectCloudLocal_four} />
          <AppleOutlined onClick={checkThing_fif} />
          <AppleOutlined onClick={entity_Relationship_six} />
        </div>
      </div>

      <ModelEntityList />
    </EntitiesContext.Provider>
  )
}
