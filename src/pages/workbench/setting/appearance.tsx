import { Image } from 'antd'

import styles from './components/subs/subs.module.less'

export default function SettingMainAppearance() {
  return (
    <>
      <div className="pt-8">
        <div className={`${styles['picture-box']} flex`}>
          <div className="ml-8">
            <Image src="/assets/system.svg" alt="图片不见了" />
            <div className="text-14px text-center leading-5 mt-2">系统</div>
          </div>
          <div className="ml-9">
            <Image src="/assets/light.svg" alt="图片不见了" />
            <div className="text-14px text-center leading-5 mt-2">亮色</div>
          </div>
          <div className="ml-9">
            <Image src="/assets/dark.svg" alt="图片不见了" />
            <div className="text-14px text-center leading-5 mt-2">暗色</div>
          </div>
          <div className="ml-9">
            <Image src="/assets/black.svg" alt="图片不见了" />
            <div className="text-14px text-center leading-5 mt-2">黑色</div>
          </div>
        </div>
      </div>
    </>
  )
}
