import { BorderOutlined, MoreOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { message } from 'antd'
import Draggable from 'react-draggable'

import requests from '@/lib/fetchers'

import styles from './index.module.scss'

interface Props {
  className?: string
}

// eslint-disable-next-line react/prop-types
const Player: React.FC<Props> = ({ className }) => {
  function play() {
    void requests.post('/api/v1/wdg/start').then(() => void message.success('启动成功!'))
  }

  function reload() {
    void requests.post('/api/v1/wdg/reStart').then(() => void message.success('重启成功!'))
  }

  function stop() {
    void requests.post('/api/v1/wdg/close').then(() => void message.success('停止成功!'))
  }

  return (
    <Draggable defaultPosition={{ x: 0, y: 0 }} bounds="parent" handle=".drag-handler">
      <div className={className}>
        <div className={styles.player}>
          <MoreOutlined className={`drag-handler ${styles['player-palm']}`} />

          <div className={styles['player-pannel']}>
            <PlayCircleOutlined
              onClick={() => play()}
              className={`${styles['icon']} ${styles['player-pannel-play']}`}
            />
            <ReloadOutlined
              onClick={() => reload()}
              className={`${styles['icon']} ${styles['player-pannel-reload']}`}
            />
            <BorderOutlined
              onClick={() => stop()}
              className={`${styles['icon']} ${styles['player-pannel-stop']}`}
            />
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default Player
