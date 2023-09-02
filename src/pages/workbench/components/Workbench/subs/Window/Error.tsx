import { Empty } from 'antd'
import { groupBy } from 'lodash'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import type { Question } from '@/hooks/global'
import { QuestionType, useGlobal } from '@/hooks/global'
import { mutateApi } from '@/hooks/store/api'
import { mutateAuth } from '@/hooks/store/auth'
import { mutateDataSource } from '@/hooks/store/dataSource'
import { mutateStorage } from '@/hooks/store/storage'
import { DataSourceKind } from '@/interfaces/datasource'
import events from '@/lib/event/events'
import requests from '@/lib/fetchers'
import { getDataSourceIcon } from '@/utils/datasource'

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
        if (key === QuestionType.DataSource) {
          x.icon = getDataSourceIcon(x.extra)
        } else if (key === QuestionType.Authentication) {
          x.icon = `${import.meta.env.BASE_URL}assets/icon/oidc.svg`
        } else if (key === QuestionType.Storage) {
          x.icon = `${import.meta.env.BASE_URL}assets/icon/file.svg`
        } else {
          x.icon = `${import.meta.env.BASE_URL}assets/icon/file.svg`
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
                {block.key == QuestionType.DataSource && (
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
                {block.key == QuestionType.Operation && (
                  <>
                    <span>
                      , <FormattedMessage defaultMessage="可" />
                      <span
                        className={styles.action}
                        onClick={() => navigate(`/workbench/apimanage/${item.name}`)}
                      >
                        <FormattedMessage defaultMessage="前往" />
                      </span>
                      <FormattedMessage defaultMessage="编辑" />
                      {item.enabled && (
                        <>
                          , <FormattedMessage defaultMessage="或" />
                          <span className={styles.action} onClick={() => closeAPI(item.name)}>
                            <FormattedMessage defaultMessage="关闭" />
                          </span>
                          <FormattedMessage defaultMessage="该API" />
                        </>
                      )}
                    </span>
                  </>
                )}
                {block.key == QuestionType.Authentication && (
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
                {block.key == QuestionType.Storage && (
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
                {block.key === QuestionType.Storage && (
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
