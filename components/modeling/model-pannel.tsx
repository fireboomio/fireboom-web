import { Select, Tooltip, Col, Row } from 'antd'
import { AppleOutlined } from '@ant-design/icons'
import styles from './model-pannel.module.css'
import ModelEntity from './model-entity'
import { Entity } from '@/interfaces/model'
import { QrcodeOutlined, InfoCircleOutlined } from '@ant-design/icons'
const { Option } = Select
export default function ModelPannel() {
  const entities: Entity[] = [{ name: 'users' }, { name: 'posts' }, { name: 'comments' }]

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
    <div className={styles.pannel}>
      <div className={styles.title}>数据建模</div>
      <div className={styles.selectContain}>
        <Select className={styles.select} defaultValue="lucy" onChange={handleChange}>
          <Option value="jack" className={styles.Option}>
            <AppleOutlined className={styles.OptionIcon}></AppleOutlined>Jack
          </Option>
          <Option value="lucy">
            <AppleOutlined className={styles.OptionIcon}></AppleOutlined>Lucy
          </Option>
          <Option value="Yiminghe">
            <AppleOutlined className={styles.OptionIcon}></AppleOutlined>yiminghe
          </Option>
          <Option value="manage" className={styles.manage}>
            <QrcodeOutlined className={styles.OptionIcon} />
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

      <ModelEntity entities={entities}></ModelEntity>
    </div>
  )
}
