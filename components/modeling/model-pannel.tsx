import { Select } from 'antd'
import { AppleOutlined } from '@ant-design/icons'
import styles from './model-pannel.module.css'
import ModelEntity from './model-entity'
import { Entity } from '@/interfaces/model'

const { Option } = Select

export default function ModelPannel() {
  const entities: Entity[] = [{ name: 'users' }, { name: 'posts' }, { name: 'comments' }]

  function handleChange(value: string) {
    console.log(`selected ${value}`)
  }

  return (
    <div className={styles.pannel}>
      <div className={styles.title}>数据建模</div>

      <Select className={styles.select} defaultValue="lucy" onChange={handleChange}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>

      <div className={styles.actions}>
        <AppleOutlined></AppleOutlined>
        <AppleOutlined></AppleOutlined>
        <AppleOutlined></AppleOutlined>
        <AppleOutlined></AppleOutlined>
        <AppleOutlined></AppleOutlined>
        <AppleOutlined></AppleOutlined>
      </div>

      <ModelEntity entities={entities}></ModelEntity>
    </div>
  )
}
