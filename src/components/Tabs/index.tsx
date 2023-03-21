import clsx from 'clsx'

import iconClose from './assets/tabClose.svg'
import styles from './index.module.less'

interface Props {
  activeKey: string
  items: { key: string; label: string }[]
  onClick: (item: any) => void
  onClose: (item: any) => void
}

export default function Tabs({ activeKey, items, onClick, onClose }: Props) {
  return (
    <div className={styles.listWrapper}>
      <div className={styles.list}>
        {items.map((item, index) => {
          return (
            <div
              className={clsx(styles.item, {
                [styles.active]: item.label === activeKey
              })}
              key={index}
              onClick={() => onClick(item)}
            >
              {item.label}
              {items.length > 1 && (
                <div
                  className={styles.close}
                  onClick={e => {
                    e.stopPropagation()
                    onClose(item)
                  }}
                >
                  <img src={iconClose} alt="" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
