import { BorderOutlined, MoreOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { message } from 'antd'
import Draggable from 'react-draggable'

import { Status } from '@/interfaces/common'
import requests from '@/lib/fetchers'

import styles from './index.module.scss'

interface Props {
  className?: string
  status: Status
}

// eslint-disable-next-line react/prop-types
const Player: React.FC<Props> = ({ className, status }) => {
  function play() {
    if (status === '已启动') {
      void message.warn('不能重复运行！')
    }
    void requests.get('/wdg/start').then(() => void message.success('正在启动!'))
  }

  function reload() {
    void requests.get('/wdg/reStart').then(() => void message.success('正在重启!'))
  }

  function stop() {
    if (status === '已关闭') {
      void message.warn('程序已经停止！')
    }
    void requests.get('/wdg/close').then(() => void message.success('停止命令已发送!'))
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
