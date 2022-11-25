import { Empty } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import styles from './error.module.less'

type Block = {
  key: string
  list: {
    id: number
    sourceType: string
    dbType: string
    name: string
    icon: string
    errMsg: string
    switch: boolean
  }[]
}
export default function Error() {
  const [blocks, setBlocks] = useState<Block[]>([])

  const { onRefreshMenu } = useContext(WorkbenchContext)
  useEffect(() => {
    requests.get<unknown, any>('wdg/question').then(res => {
      setBlocks(
        Object.keys(res).map(key => {
          res[key].forEach((item: any) => {
            if (key === 'datasource') {
              if (['mysql', 'pgsql', 'mongodb', 'sqlite', 'rest', 'graphql'].includes(item.type)) {
                item.icon = `/assets/icons/${item.type}.svg`
              } else {
                item.icon = `/assets/icons/db-other.svg`
              }
            } else if (['api', 'storage'].includes(key)) {
              item.icon = '/assets/icon/file.svg'
            } else {
              item.icon = '/assets/icon/github-fill.svg'
            }
          })
          return { key, list: res[key] }
        })
      )
    })
  }, [])

  const navigate = useNavigate()
  async function closeDatasource(id: number) {
    const res = await requests.get<unknown, any>(`/dataSource/${id}`)
    if (res?.id) {
      await requests.put(`/dataSource`, { ...res, switch: 0 })
      onRefreshMenu('dataSource')
    }
  }
  async function closeAPI(id: number) {
    const res = await requests.get<unknown, any>(`/operateApi/${id}`)
    if (res?.id) {
      await requests.put(`/operateApi`, { ...res, enable: false })
      onRefreshMenu('api')
    }
  }
  async function closeAuth(id: number) {
    const res = await requests.get<unknown, any>(`/auth/${id}`)
    if (res?.id) {
      await requests.put(`/auth`, { ...res, switch: 0 })
      onRefreshMenu('auth')
    }
  }
  async function closeStorage(id: number) {
    const res = await requests.get<unknown, any>(`/storageBucket/${id}`)
    if (res?.id) {
      await requests.put(`/storageBucket`, { ...res, switch: 0 })
      onRefreshMenu('storage')
    }
  }

  return (
    <div>
      {!blocks.length && <Empty className="pt-20" description="暂无问题" />}
      {blocks.map((block, index) => (
        <div className={styles.block} key={index}>
          {block.list.map(item => (
            <div className={styles.line} key={item.id}>
              <img src={item.icon} className={styles.icon} alt="" />
              <div className={styles.name}>{item.name}</div>
              <div className={styles.desc}>
                <span>{item.errMsg}</span>
                {block.key === 'datasource' && (
                  <>
                    <span>
                      ，可
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/datasource/${item.id}`)}
                      >
                        前往
                      </span>
                      排查，或
                      <span className={styles.action} onClick={() => closeDatasource(item.id)}>
                        关闭
                      </span>
                      该数据源
                    </span>
                  </>
                )}
                {block.key === 'api' && (
                  <>
                    <span>
                      ，可
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/apimanage/${item.id}`)}
                      >
                        前往
                      </span>
                      编辑
                      {item.switch && (
                        <>
                          ，或
                          <span className={styles.action} onClick={() => closeAPI(item.id)}>
                            关闭
                          </span>
                          该API
                        </>
                      )}
                    </span>
                  </>
                )}
                {block.key === 'auth' && (
                  <>
                    <span>
                      ，可
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/auth/${item.id}`)}
                      >
                        前往
                      </span>
                      编辑
                      {item.switch && (
                        <>
                          ，或
                          <span className={styles.action} onClick={() => closeAuth(item.id)}>
                            关闭
                          </span>
                          该验证器
                        </>
                      )}
                    </span>
                  </>
                )}
                {block.key === 'storage' && (
                  <>
                    <span>
                      ，可
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/storage/${item.id}`)}
                      >
                        前往
                      </span>
                      编辑
                      {item.switch && (
                        <>
                          ，或
                          <span className={styles.action} onClick={() => closeStorage(item.id)}>
                            关闭
                          </span>
                          该对象存储
                        </>
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
