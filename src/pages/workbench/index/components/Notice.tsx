import { Image } from 'antd'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import useCalcTime from '@/lib/helpers/calcTime'

import styles from './home.module.less'

interface Props {
  handleToggleDesigner: (rightType: string) => void
}

interface NoticeConfig {
  url: string
  content: string
  date: string
  title: string
}

export function Notice({ handleToggleDesigner }: Props) {
  const [_noticeConfig, setNoticeConfig] = useImmer([] as NoticeConfig[])
  const calcTime = useCalcTime()
  useEffect(() => {
    void fetch('https://raw.githubusercontent.com/fireboomio/fb-news/main/news.json').then(
      async res => {
        const result = await res.json()
        const news = result.map((item: any) => ({
          content: item.content,
          title: item.title,
          date: calcTime(item.time),
          url: item.url
        }))
        setNoticeConfig(news)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = () => {
    handleToggleDesigner('guide')
  }
  return (
    <div className={styles.noticeContainer}>
      <div className="bg-white flex h-53px pt-2 pl-23px top-0 z-10 items-center sticky">
        <div className="font-bold flex-1 text-17px">通知</div>
        <div className="cursor-pointer flex h-full flex-0 p-18px text-0px">
          <div className="text-[#ADADAD] text-11px">更多</div>
          <Image alt="更多" width={12} height={12} preview={false} src="/assets/icon-more.png" />
        </div>
      </div>
      <div className={styles.rowList}>
        {_noticeConfig.map((row, index) => (
          <div
            className={styles.noticeRow}
            key={index}
            onClick={() => {
              window.open(row.url, '_blank')
            }}
          >
            <div className={[styles.icon, styles['icon1']].join(' ')} />
            <div className={styles.info}>
              <div className={styles.title}>{row.title}</div>
              <div className={styles.text}>{row.content}</div>
            </div>
            <div className={styles.time}>{row.date}</div>
          </div>
        ))}
      </div>
      <div className={styles.guideEntry} onClick={handleClick} />
    </div>
  )
}
