/* eslint-disable react/prop-types */
import { Image } from 'antd'

import { ErrorInfo } from '@/interfaces/common'

import styles from './index.module.scss'

interface Props {
  className?: string
  version?: string
  errorInfo?: ErrorInfo
  engineStatus?: string
  hookStatus?: string
}

// eslint-disable-next-line react/prop-types
const StatusBar: React.FC<Props> = ({
  className,
  version,
  errorInfo,
  engineStatus,
  hookStatus,
}) => {
  return (
    <div className={className}>
      <div className={styles['status-bar']}>
        <span className={styles['info']}>
          <span className={styles['info-version']}>
            <span>FB: </span>
            <span className="ml-2">{version}</span>
          </span>
          <span className={styles['info-problem']}>
            <span>错误信息：</span>
            <span className="ml-1">
              <Image height={13} width={13} src="/assets/error.png" alt="错误" preview={false} />
              {errorInfo?.errTotal ?? 0}
            </span>
            <span className="ml-1">
              <Image height={13} width={13} src="/assets/warning.png" alt="警告" preview={false} />
              {errorInfo?.warnTotal ?? 0}
            </span>
          </span>
          <span className={styles['info-engine']}>
            <span>引擎状态：</span>
            <span className="ml-1">{engineStatus}</span>
          </span>
          <span className={styles['info-hooks']}>
            <span>钩子状态：</span>
            <span className="ml-1">{hookStatus}</span>
          </span>
        </span>
      </div>
    </div>
  )
}

export default StatusBar
