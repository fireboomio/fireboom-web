import { RightOutlined } from '@ant-design/icons'
import { Divider, Tag } from 'antd'

import styles from './home.module.scss'

interface Props {
  handleToggleDesigner: (rightType: string) => void
}

export function Notice({ handleToggleDesigner }: Props) {
  const handleClick = () => {
    handleToggleDesigner('guide')
  }
  return (
    <>
      <div>
        <p className="text-right text-[#E92E5E] mr-6 mt-5" onClick={handleClick}>
          新手引导
        </p>
        <Divider className={styles['first-divider']} />
        <div className={`${styles['notice-main']} flex`}>
          <Tag color="#8B6BE6">公告</Tag>
          <span className="flex-1">FireBoom版本升级，请及时更新，体验新功能</span>
          <span className="text-[#b8bbc3] text-xs block w-13 mt-0.5 mr-4">30分钟前</span>
        </div>
        <div className={`${styles['notice-main']} flex`}>
          <Tag color="#8B6BE6">公告</Tag>
          <span className="flex-1">FireBoom版本升级，请及时更新，体验新功能</span>
          <span className="text-[#b8bbc3] text-xs block w-13 mt-0.5 mr-4">30分钟前</span>
        </div>
        <div className={`${styles['notice-main']} flex`}>
          <Tag color="#8B6BE6">公告</Tag>
          <span className="flex-1">FireBoom版本升级，请及时更新，体验新功能</span>
          <span className="text-[#b8bbc3] text-xs block w-13 mt-0.5 mr-4">30分钟前</span>
        </div>
        <div className="text-center text-[#E92E5E] mt-4 absolute w-full bottom-33">
          <span className=" w-19 h-5">
            查看更多 <RightOutlined />
          </span>
        </div>
      </div>
    </>
  )
}
