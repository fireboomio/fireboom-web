import { RightOutlined } from '@ant-design/icons'
import { Divider, Tag, Image } from 'antd'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'

import styles from './home.module.scss'

interface Props {
  handleToggleDesigner: (rightType: string) => void
}

interface NoticeConfig {
  bulletinType: number
  date: string
  title: string
}

export function Notice({ handleToggleDesigner }: Props) {
  const [_noticeConfig, setNoticeConfig] = useImmer([] as NoticeConfig[])
  useEffect(() => {
    void requests.get<unknown, NoticeConfig[]>('/home/bulletin').then(res => {
      setNoticeConfig(res)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    handleToggleDesigner('guide')
  }
  return (
    <div className={styles.noticeContainer}>
      <div className="flex items-center pl-23px h-53px pt-2 sticky top-0 bg-white z-10">
        <div className="flex-1 text-17px font-bold">通知</div>
        <div className="flex flex-0 h-full p-18px text-0px cursor-pointer">
          <div className="text-11px text-[#ADADAD]">更多</div>
          <Image alt="更多" width={12} height={12} preview={false} src="/assets/icon-more.png" />
        </div>
      </div>
      <div className={styles.rowList}>
        {_noticeConfig.map(row => (
          <div className={styles.noticeRow} key={row.title}>
            <div className={[styles.icon, styles['icon' + String(row.bulletinType)]].join(' ')} />
            <div className={styles.info}>
              <div className={styles.title}>
                {{ 1: '公告信息', 2: '消息通知' }[row.bulletinType]}
              </div>
              <div className={styles.text}>{row.title}</div>
            </div>
            <div className={styles.time}>{row.date}</div>
          </div>
        ))}
      </div>
      <div className={styles.guideEntry} onClick={handleClick}/>
    </div>
  )
}
