import { Image } from 'antd'

import styles from './setting-main.module.scss'

export default function SettingMainAppearance() {
  return (
    <>
      <div>
        <div className={styles.backgroundWord}>背景</div>
        <div className={`${styles['picture-box']} flex`}>
          <div className="">
            <Image src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
            <div className="h-5 w-7 mt-3 ml-8">系统</div>
          </div>
          <div>
            <Image src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
            <div className="h-5 w-7 mt-2 mt-3 ml-8 ">亮色</div>
          </div>
          <div>
            <Image src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
            <div className="h-5 w-7 mt-2 mt-3 ml-8">暗色</div>
          </div>
          <div>
            <Image src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg" />
            <div className="h-5 w-7 mt-2 mt-3 ml-8">黑色</div>
          </div>
        </div>
      </div>
    </>
  )
}
