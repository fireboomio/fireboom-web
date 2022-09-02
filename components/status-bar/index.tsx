import { Status } from '@/interfaces/common'

import styles from './index.module.scss'

interface Props {
  className?: string
  status: Status
}

// eslint-disable-next-line react/prop-types
const StatusBar: React.FC<Props> = ({ className, status }) => {
  return (
    <div className={className}>
      <div className={styles['status-bar']}> bb </div>
    </div>
  )
}

export default StatusBar
