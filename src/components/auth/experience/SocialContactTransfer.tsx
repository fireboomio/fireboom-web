import {
  MinusCircleOutlined,
  MobileOutlined,
  OneToOneOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import { Transfer, Image } from 'antd'
import React, { useEffect, useState } from 'react'

import { GroupedSocialItemType } from './ExperienceSetting'
import styles from './SocialContactTransfer.module.less'
interface Props {
  data: GroupedSocialItemType[]
  selectedData: string[]
  onChange: (s: string[]) => void
}

const SocialContactTransfer: React.FC<Props> = ({ data, selectedData, onChange }) => {
  const [targetKeys, setTargetKeys] = useState(selectedData)

  const allData = data.map(item => ({
    key: item.type,
    title: item.name,
    platform: item.platform,
    list: item.list,
    logo: item.logo,
  }))

  useEffect(() => {
    setTargetKeys(selectedData)
  }, [selectedData])

  const [selectedKeys] = useState<string[]>([])
  const onSelectChange = (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => {
    if (sourceSelectedKeys.length !== 0) {
      const newTargetKeys = [...targetKeys, ...sourceSelectedKeys]
      setTargetKeys(newTargetKeys)
      onChange(newTargetKeys)
    } else {
      const item = targetSelectedKeys[0]
      const index = targetKeys.findIndex(i => i === item)
      const newTargetSelectedKeys = targetKeys
      newTargetSelectedKeys.splice(index, 1)
      setTargetKeys([...newTargetSelectedKeys])
      onChange([...newTargetSelectedKeys])
    }
  }

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

  const renderItem = (item: GroupedSocialItemType) => {
    const flag = targetKeys.find(i => i === item.key)
    const customLabel = (
      <div className={styles.transferItem}>
        <div>
          <Image className="mr-2" height={14} src={item.logo} alt="" />
          <span className="custom-item">{item.title}</span>
          {item.platform.map(i => (
            <span key={i}>{renderLogo(i)}</span>
          ))}
        </div>
        <span>{flag ? <MinusCircleOutlined /> : <PlusCircleOutlined />}</span>
      </div>
    )

    return {
      label: customLabel,
      value: item.title as string,
    }
  }
  return (
    <div className={styles.transferWrapper}>
      <Transfer
        selectAllLabels={[
          <div style={{ color: '#5F6269' }} key="1">
            社交连接器
          </div>,
          <div style={{ color: '#5F6269' }} key="2">
            已添加
          </div>,
        ]}
        operationStyle={{
          display: 'none',
        }}
        listStyle={{
          border: '1px solid rgba(0,0,0,0.1)',
        }}
        selectedKeys={selectedKeys}
        showSelectAll={false}
        dataSource={allData as GroupedSocialItemType[]}
        targetKeys={targetKeys}
        onSelectChange={onSelectChange}
        render={renderItem}
      />
    </div>
  )
}

export default SocialContactTransfer
