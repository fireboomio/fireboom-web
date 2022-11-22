import { useNavigate } from 'react-router-dom'

import requests from '@/lib/fetchers'

import styles from './error.module.less'

export default function Error() {
  const blocks = [
    {
      key: 'datasource',
      list: [
        {
          id: '4',
          type: 'error',
          name: 'mysql_demo',
          reasonMsg: '数据库无法连接',
          switch: true
        }
      ]
    }
  ]

  const navigate = useNavigate()
  function closeDatasource(id: string) {
    void requests.patch(`/datasource`, { id, switch: 0 })
  }
  function openApi(id: string) {
    void requests.patch(`/datasource`, { id, switch: 0 })
  }
  function closeAuth(id: string) {
    void requests.patch(`/datasource`, { id, switch: 0 })
  }

  return (
    <div>
      {blocks.map((block, index) => (
        <div className={styles.block} key={index}>
          {block.list.map(item => (
            <div className={styles.line} key={item.id}>
              <div className={styles.icon}></div>
              <div className={styles.name}>{item.name}</div>
              <div className={styles.desc}>
                <span>{item.reasonMsg}</span>
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
                      {!item.switch && (
                        <>
                          ，或
                          <span className={styles.action} onClick={() => openApi(item.id)}>
                            开启
                          </span>
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
                      {!item.switch && (
                        <>
                          ，或
                          <span className={styles.action} onClick={() => closeAuth(item.id)}>
                            关闭
                          </span>
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
