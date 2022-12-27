import { Image } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { StorageResp } from '@/interfaces/storage'
import requests from '@/lib/fetchers'

import styles from './home.module.less'

interface Props {
  handleToggleDesigner: (rightType: string) => void
}

export default function Guide({ handleToggleDesigner }: Props) {
  const navigate = useNavigate()
  const [storageId, setStorageId] = useState<number>()
  useEffect(() => {
    requests.get<unknown, StorageResp[]>('/storageBucket').then(res => {
      setStorageId(res[0].id)
    })
  }, [])
  const handleClose = () => {
    handleToggleDesigner('notice')
  }
  const tasks = [
    {
      blockName: '数据源',
      optional: false,
      state: 1,
      lineUp: '',
      lineDown: '',
      subTasks: [
        {
          title: '连接数据库',
          date: '08.12 14:00 完成',
          state: 1,
          lineUp: '',
          lineDown: '',
          link: '/workbench/datasource/new'
        },
        {
          title: '连接REST API',
          date: '08.12 14:00 完成',
          state: 1,
          lineUp: '',
          lineDown: '',
          link: '/workbench/datasource/new'
        },
        {
          title: '连接GraphQL API',
          date: '08.12 14:00 完成',
          state: 1,
          lineUp: '',
          lineDown: '',
          link: '/workbench/datasource/new'
        }
      ]
    },
    {
      blockName: 'OSS存储',
      optional: true,
      state: 2,
      lineUp: '',
      lineDown: '',
      subTasks: [
        {
          title: '设置存储提供商',
          date: '08.12 14:00 完成',
          state: 1,
          lineUp: '',
          lineDown: '',
          link: '/workbench/storage/new'
        },
        {
          title: '上传一个文件',
          date: '快去完成吧',
          state: 0,
          lineUp: '',
          lineDown: '',
          link: storageId ? `/workbench/storage/${storageId}/manage` : '/workbench/storage/new'
        }
      ]
    },
    {
      blockName: '身份验证',
      optional: true,
      state: 0,
      lineUp: '',
      lineDown: '',
      subTasks: [
        {
          title: '设置身份提供商',
          date: '快去完成吧',
          state: 0,
          lineUp: '',
          lineDown: '',
          link: '/workbench/datasource/new'
        },
        {
          title: '注册账户并登录',
          date: '快去完成吧',
          state: 0,
          lineUp: '',
          lineDown: '',
          link: '/workbench/datasource/new'
        }
      ]
    },
    {
      blockName: '对外API',
      optional: false,
      state: 0,
      lineUp: '',
      lineDown: '',
      subTasks: [
        {
          title: '可视化编写接口',
          date: '快去完成吧',
          state: 0,
          lineUp: '',
          lineDown: '',
          link: '/workbench/apimanage/crud'
        },
        {
          title: '下载接口SDK',
          date: '快去完成吧',
          state: 0,
          lineUp: '',
          lineDown: '',
          link: '/workbench/rapi'
        }
      ]
    }
  ]

  let nextColor = 'transparent'
  const GREEN = '#3ED98F'
  const GRAY = '#EBEBEB'
  tasks.forEach(task => {
    task.lineUp = nextColor
    task.lineDown = nextColor = task.state === 1 ? GREEN : GRAY
    task.subTasks.forEach(sub => {
      sub.lineUp = nextColor
      sub.lineDown = nextColor = sub.state === 1 ? GREEN : GRAY
    })
  })

  return (
    <div className={styles.guideContainer}>
      <div className="flex flex-0 h-62px pr-8px pl-23px justify-between items-center">
        <span className="font-bold text-17px text-[#222]">新手指引</span>
        <div className="cursor-pointer p-3 text-0px">
          <Image
            width={15}
            height={15}
            preview={false}
            alt="关闭"
            src="/assets/guide/icon-close.png"
            onClick={handleClose}
          />
        </div>
      </div>
      <div className={styles.guideList}>
        {tasks.map((task, i) => (
          <div className={styles.block} key={task.blockName}>
            <div className={styles.head}>
              <div className={[styles.icon, styles[`icon${task.state || 0}`]].join(' ')}>
                <div className={styles.lineUp} style={{ background: task.lineUp }} />
                <div className={styles.lineDown} style={{ background: task.lineDown }} />
              </div>
              <div className={styles.title}>{task.blockName}</div>
              {task.optional ? <div className={styles.tip}>(可选)</div> : null}
              <div className="flex-1" />
              <div className={styles.docIcon} />
              <div className={styles.doc}>文档</div>
            </div>
            {task.subTasks.map((sub, j) => (
              <div className={styles.item} key={sub.title}>
                <div className={[styles.icon, styles[`icon${sub.state || 0}`]].join(' ')}>
                  <div className={styles.lineUp} style={{ background: sub.lineUp }} />
                  <div className={styles.lineDown} style={{ background: sub.lineDown }} />
                </div>
                <div className={styles.info}>
                  <div className={styles.title}>{`${i + 1}.${j + 1} ${sub.title}`}</div>
                  <div className={styles.status}>{sub.state ? sub.date : '快去完成吧'}</div>
                </div>
                <div
                  className={styles.btn}
                  onClick={() => {
                    sub.link && navigate(sub.link)
                  }}
                >
                  {sub.state ? '修改' : '前往'}
                  <div className={styles.arrow} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
