/* eslint-disable react/prop-types */
import { Image } from 'antd'

import { ErrorInfo } from '@/interfaces/common'

import styles from './index.module.scss'

interface Props {
  className?: string
  env?: string
  version?: string
  errorInfo?: ErrorInfo
  engineStatus?: string
  hookStatus?: string
  toggleWindow: () => void
}

// eslint-disable-next-line react/prop-types
const StatusBar: React.FC<Props> = ({
  className,
  env,
  version,
  errorInfo,
  engineStatus,
  hookStatus,
  toggleWindow,
}) => {
  return (
    <div className={className}>
      <div className={styles['status-bar']}>
        <span className={styles['info']}>
          <span className={styles.gitIcon} />
          <span className="mr-12">CONNECT GIT (BETA)</span>
          <span className={styles['info-env']}>
            <span>{env}</span>
          </span>
          <span className={styles['info-version']}>
            <span>FB: </span>
            <span className="ml-2">{version}</span>
          </span>
          <span onClick={toggleWindow} className="cursor-pointer flex items-center">
            <span className={styles.errLabel}>
              <Image height={13} width={13} src="/assets/workbench/footer-error.png" alt="错误" preview={false} />
              <span className="ml-2">{errorInfo?.errTotal ?? 0}</span>
            </span>
            <span className={styles.errLabel} style={{ marginLeft: 8 }}>
              <Image height={13} width={13} src="/assets/workbench/footer-warning.png" alt="警告" preview={false} />
              <span className="ml-2">{errorInfo?.warnTotal ?? 0}</span>
            </span>
          </span>
          <span className="ml-18">引擎状态：</span>
          <span className={styles.errLabel}>
            <div className="h-3px w-3px rounded-3px bg-[#50C772]" />
            <span className="ml-1 text-[#50C772]">{engineStatus}</span>
          </span>
          <span className="ml-4.5">钩子状态：</span>
          <span className={styles.errLabel}>
            <div className="h-3px w-3px rounded-3px bg-[#50C772]" />
            <span className="ml-1 text-[#50C772]">{hookStatus}</span>
          </span>
        </span>
      </div>
    </div>
  )
}

export default StatusBar
