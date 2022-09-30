import { message, Image } from 'antd'
import Draggable from 'react-draggable'

import { EngineStatus } from '@/interfaces/common'
import requests from '@/lib/fetchers'

import styles from './index.module.scss'

interface Props {
  className?: string
  status: EngineStatus
}

// eslint-disable-next-line react/prop-types
const Player: React.FC<Props> = ({ className, status }) => {
  function play() {
    if (status === '已启动') {
      void message.warn('不能重复运行！')
      return
    }
    void requests.get('/wdg/start').then(() => void message.success('正在启动!'))
  }

  function reload() {
    if (status === '已关闭') {
      void message.warn('程序已经停止！')
      return
    }
    void requests.get('/wdg/reStart').then(() => void message.success('正在重启!'))
  }

  function stop() {
    if (status === '已关闭') {
      void message.warn('程序已经停止！')
      return
    }
    void requests.get('/wdg/close').then(() => void message.success('停止命令已发送!'))
  }

  return (
    <Draggable defaultPosition={{ x: 0, y: 0 }} bounds="parent" handle=".drag-handler">
      <div className={className}>
        <div className={styles.player}>
          <div className={`drag-handler ${styles['player-palm']}`}>
            <Image
              onDragStart={e => e.preventDefault()}
              src="/assets/drag.png"
              alt="拖动"
              height={20}
              width={10}
              preview={false}
            />
          </div>

          <div className={styles['player-pannel']}>
            <Image
              className={`${styles['icon']} ${styles['player-pannel-play']}`}
              onClick={() => play()}
              src={status === '已关闭' ? '/assets/play.png' : '/assets/noplay.png'}
              alt="启动"
              preview={false}
            />
            <Image
              className={`${styles['icon']} ${styles['player-pannel-reload']}`}
              onClick={() => reload()}
              src={status === '已启动' ? '/assets/reload.png' : '/assets/noreload.png'}
              alt="重启"
              preview={false}
            />
            <Image
              className={`${styles['icon']} ${styles['player-pannel-stop']}`}
              onClick={() => stop()}
              src={status === '已启动' ? '/assets/stop.png' : '/assets/nostop.png'}
              alt="关闭"
              preview={false}
            />
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default Player
