import type { Entity } from '@/interfaces/model'
import { AppleOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import styles from './model-entity.module.css'

interface Props {
  entities: Entity[]
}

export default function ModelEntity({ entities }: Props) {
  return (
    <>
      <div className={styles['entity-list']}>
        <span>所有实体</span>
        <Button type="primary" shape="circle" size="small">
          +
        </Button>
      </div>

      <div className={styles['item-wrapper']}>
        {entities.map((e) => (
          <div className={styles.item} key={e.name}>
            <AppleOutlined></AppleOutlined>
            <AppleOutlined></AppleOutlined>
            <div>{e.name}</div>
            <AppleOutlined></AppleOutlined>
          </div>
        ))}
      </div>
    </>
  )
}
