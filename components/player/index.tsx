import { BorderOutlined, MoreOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import Draggable from 'react-draggable'

import styles from './index.module.scss'

interface Props {
  className?: string
}

// eslint-disable-next-line react/prop-types
const Player: React.FC<Props> = ({ className }) => {
  function play() {
    console.log('play')
  }

  function reload() {
    console.log('reload')
  }

  function stop() {
    console.log('stop')
  }

  return (
    <Draggable defaultPosition={{ x: 0, y: 0 }}>
      <div className={className}>
        <div className={styles.player}>
          <MoreOutlined className={styles['player-palm']} />

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
