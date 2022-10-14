import { Image } from 'antd'
import clsx from 'clsx'
import React from 'react'

import { Connector } from '@/interfaces/connector'

import styles from './ConnectorItem.module.scss'
export interface Props {
  onItemClickHandle: (data: Connector) => void
  data: Connector
  currentSelectedId: string
}

const ConnectorItem: React.FC<Props> = ({ data, onItemClickHandle, currentSelectedId }) => {
  return (
    <div
      className={clsx({
        [styles['connector-item-wrapper']]: true,
        [styles['connector-item-wrapper-selected']]: currentSelectedId === data.id,
        [styles['connector-item-wrapper-unselected']]: currentSelectedId !== data.id,
        [styles['connector-item-wrapper-enabled']]: data.enabled,
        [styles['connector-item-wrapper-unenabled']]: !data.enabled,
      })}
      onClick={() => onItemClickHandle(data)}
    >
      {data.enabled && <div className={styles.enabled}>已添加</div>}
      <div className={styles.icon}>
        <Image height={18} src={data.logo} alt="" preview={false} />
      </div>
      <h1 className={styles.title}>
        {data.name}
        <span className={styles.platform}>{data.platform}</span>
      </h1>
      <p className={styles.description}>{data.description}</p>
    </div>
  )
}

export default ConnectorItem
