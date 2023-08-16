import { Empty } from 'antd'
import { groupBy } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import type { Question } from '@/hooks/global'
import { QuestionType, useGlobal } from '@/hooks/global'
import { mutateApi } from '@/hooks/store/api'
import { mutateAuth } from '@/hooks/store/auth'
import { mutateDataSource } from '@/hooks/store/dataSource'
import { mutateStorage } from '@/hooks/store/storage'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import events from '@/lib/event/events'
import requests from '@/lib/fetchers'

import styles from './error.module.less'

type Block = {
  key: QuestionType
  list: {
    id: number
    sourceType: string
    dbType: string
    name: string
    icon: string
    msg: string
    enabled: boolean
  }[]
}
export default function Error() {
  const [blocks, setBlocks] = useState<Block[]>([])

  const { questions } = useGlobal(state => ({
    questions: state.questions,
    setQuestions: state.setQuestions
  }))

  useEffect(() => {
    const groups: Record<QuestionType, Question[]> = groupBy(questions, 'model') as any
    // @ts-ignore
    const list: any = Object.keys(groups).map(key => ({
      key,
      list: groups[key].map((x: any) => {
        if (key === QuestionType.DatasourceQuestion) {
          // TODO
          // switch (x.sourceType) {
          //   case 1:
          //     x.icon =
          //       {
          //         mysql: '/assets/icon/mysql.svg',
          //         postgresql: '/assets/icon/pgsql.svg',
          //         graphql: '/assets/icon/graphql.svg',
          //         mongodb: '/assets/icon/mongodb.svg',
          //         rest: '/assets/icon/rest.svg',
          //         sqlite: '/assets/icon/sqlite.svg'
          //       }[String(x.dbType).toLowerCase()] || '/assets/icon/file.svg'
          //     break
          //   case 2:
          //     x.icon = '/assets/icon/rest.svg'
          //     break
          //   case 3:
          //     x.icon = '/assets/icon/graphql.svg'
          //     break
          // }
        } else if (key == QuestionType.AuthQuestion) {
          x.icon = '/assets/icon/oidc.svg'
        } else if (key == QuestionType.OssQuestion) {
          x.icon = '/assets/icon/file.svg'
        } else {
          x.icon = '/assets/icon/file.svg'
        }
        return x
      })
    }))
    setBlocks(list)
  }, [questions])

  const navigate = useNavigate()
  async function closeDatasource(name: string) {
    await requests.put(`/datasource`, { name, enabled: false })
    void mutateDataSource()
  }

  async function closeAPI(path: string) {
    await requests.put<unknown, any>(`/operation`, { path, enabled: false })
    events.emit({
      event: 'apiEnableChange',
      data: { pathList: [path], enabled: false }
    })
    void mutateApi()
  }
  async function closeAuth(name: string) {
    await requests.put(`/authentication`, { name, enabled: false })
    void mutateAuth()
  }
  async function closeStorage(name: string) {
    await requests.put(`/storage`, { name, enabled: false })
    void mutateStorage()
  }

  return (
    <div>
      {!blocks.length && (
        <Empty
          className="pt-2"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<FormattedMessage defaultMessage="暂无问题" />}
        />
      )}
      {blocks.map((block, index) => (
        <div className={styles.block} key={index}>
          {block.list.map(item => (
            <div className={styles.line} key={item.name}>
              <img src={item.icon} className={styles.icon} alt="" />
              <div className={styles.name}>{item.name}</div>
              <div className={styles.desc}>
                <span>{item.msg}</span>
                {block.key == QuestionType.DatasourceQuestion && (
                  <>
                    <span>
                      , <FormattedMessage defaultMessage="可" />
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/data-source/${item.name}`)}
                      >
                        <FormattedMessage defaultMessage="前往" />
                      </span>
                      <FormattedMessage defaultMessage="排查, 或" />
                      <span className={styles.action} onClick={() => closeDatasource(item.name)}>
                        <FormattedMessage defaultMessage="关闭" />
                      </span>
                      <FormattedMessage defaultMessage="该数据源" />
                    </span>
                  </>
                )}
                {block.key == QuestionType.OperationQuestion && (
                  <>
                    <span>
                      , <FormattedMessage defaultMessage="可" />
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/apimanage/${item.path}`)}
                      >
                        <FormattedMessage defaultMessage="前往" />
                      </span>
                      <FormattedMessage defaultMessage="编辑" />
                      {item.enabled && (
                        <>
                          , <FormattedMessage defaultMessage="或" />
                          <span className={styles.action} onClick={() => closeAPI(item.path)}>
                            <FormattedMessage defaultMessage="关闭" />
                          </span>
                          <FormattedMessage defaultMessage="该API" />
                        </>
                      )}
                    </span>
                  </>
                )}
                {block.key == QuestionType.AuthQuestion && (
                  <>
                    <span>
                      , <FormattedMessage defaultMessage="可" />
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/auth/${item.name}`)}
                      >
                        <FormattedMessage defaultMessage="前往" />
                      </span>
                      <FormattedMessage defaultMessage="编辑" />
                      {item.enabled && (
                        <>
                          , <FormattedMessage defaultMessage="或" />
                          <span className={styles.action} onClick={() => closeAuth(item.name)}>
                            <FormattedMessage defaultMessage="关闭" />
                          </span>
                          <FormattedMessage defaultMessage="该验证器" />
                        </>
                      )}
                    </span>
                  </>
                )}
                {block.key == QuestionType.OssQuestion && (
                  <>
                    <span>
                      , <FormattedMessage defaultMessage="可" />
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/storage/${item.name}`)}
                      >
                        <FormattedMessage defaultMessage="前往" />
                      </span>
                      <FormattedMessage defaultMessage="编辑" />
                      {item.enabled && (
                        <>
                          , <FormattedMessage defaultMessage="或" />
                          <span className={styles.action} onClick={() => closeStorage(item.name)}>
                            <FormattedMessage defaultMessage="关闭" />
                          </span>
                          <FormattedMessage defaultMessage="该对象存储" />
                        </>
                      )}
                    </span>
                  </>
                )}
                {[QuestionType.InternalQuestion, QuestionType.HooksQuestion].includes(
                  block.key
                ) && (
                  <>
                    <span>
                      , <FormattedMessage defaultMessage="可" />
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/storage/${item.name}`)}
                      >
                        <FormattedMessage defaultMessage="前往" />
                      </span>
                      <FormattedMessage defaultMessage="编辑" />
                      {item.enabled && (
                        <>
                          , <FormattedMessage defaultMessage="或" />
                          <span className={styles.action} onClick={() => closeStorage(item.name)}>
                            <FormattedMessage defaultMessage="关闭" />
                          </span>
                          <FormattedMessage defaultMessage="该对象存储" />
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
