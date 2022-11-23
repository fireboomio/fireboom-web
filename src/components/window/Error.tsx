import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  function closeDatasource(id: number) {
    void requests.patch(`/datasource`, { id, switch: 0 })
  }
  function openApi(id: number) {
    void requests.patch(`/datasource`, { id, switch: 0 })
  }
  function closeAuth(id: number) {
    void requests.patch(`/datasource`, { id, switch: 0 })
  }
  function closeStorage(id: number) {
    void requests.patch(`/datasource`, { id, switch: 0 })
  }

  return (
    <div>
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
                          <span className={styles.action} onClick={() => openApi(item.id)}>
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
