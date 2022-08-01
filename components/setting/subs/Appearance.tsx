import { Image, Divider } from 'antd'

import styles from './subs.module.scss'

export default function SettingMainAppearance() {
  return (
    <>
      <div>
        <div>
          <Divider orientation="left" orientationMargin="0">
            <span className="text-gray-500">背景</span>
          </Divider>
        </div>
        <div className={`${styles['picture-box']} flex`}>
          <div>
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
              alt="图片不见了"
            />
            <div className="h-5 w-7 mt-4 ml-9">系统</div>
          </div>
          <div>
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
              alt="图片不见了"
            />
            <div className="h-5 w-7 mt-4 ml-9">亮色</div>
          </div>
          <div>
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
              alt="图片不见了"
            />
            <div className="h-5 w-7 mt-4 ml-9">暗色</div>
          </div>
          <div>
            <Image
              src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
              alt="图片不见了"
            />
            <div className="h-5 w-7 mt-4 ml-9">黑色</div>
          </div>
        </div>
      </div>
    </>
  )
}
