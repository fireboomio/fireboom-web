import { BorderOutlined, MoreOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import Draggable from 'react-draggable'

import requests from '@/lib/fetchers'

import styles from './index.module.scss'

interface Props {
  className?: string
}

type Status = '运行中' | '已停止'

// eslint-disable-next-line react/prop-types
const Player: React.FC<Props> = ({ className }) => {
  const [status, setStatus] = useState<Status>()
  const [refreshFlag, setRefreshFlag] = useState(false)

  useEffect(() => {
    void requests.get<unknown, Status>('api/v1/wdg/state').then(res => {
      console.log(res)
      setStatus(res)
    })
  }, [refreshFlag])

  function play() {
    if (status === '运行中') {
      void message.warn('不能重复运行！')
    }
    void requests
      .post('/api/v1/wdg/start')
      .then(() => setRefreshFlag(!refreshFlag))
      .then(() => void message.success('正在启动!'))
  }

  function reload() {
    void requests
      .post('/api/v1/wdg/reStart')
      .then(() => setRefreshFlag(!refreshFlag))
      .then(() => void message.success('正在重启!'))
  }

  function stop() {
    if (status === '已停止') {
      void message.warn('程序已经停止！')
    }
    void requests.post('/api/v1/wdg/close').then(() => void message.success('停止命令已发送!'))
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
