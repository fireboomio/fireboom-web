import { Col, Row, Image, Progress, Badge, Card } from 'antd'
import Head from 'next/head'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import { Guide } from '@/components/home/Guide'
import { Notice } from '@/components/home/Notice'
import IconFont from '@/components/iconfont'
import requests from '@/lib/fetchers'

import styles from './index.module.scss'

interface HomeApi {
  liveQueryTotal: number
  mutationsTotal: number
  queryTotal: number
  subscriptionsTotal: number
}

interface HomeDataSource {
  CustomerTotal: number
  GraphqlTotal: number
  RestTotal: number
  dbTotal: number
}

interface HomeOss {
  ossTotal: number
  totalMemory: string
  useMemory: string
}

interface HomeAuth {
  authTotal: number
  todayInsertUser: number
  totalUser: number
}

interface HomeConfig {
  homeApi: HomeApi
  homeAuth: HomeAuth
  homeDataSource: HomeDataSource
  homeOss: HomeOss
}

const handleIconClick = () => {
  console.log('aaa')
}

const initialValues = {
  homeApi: {
    liveQueryTotal: 0,
    mutationsTotal: 0,
    queryTotal: 0,
    subscriptionsTotal: 0,
  },
  homeAuth: {
    authTotal: 0,
    todayInsertUser: 0,
    totalUser: 0,
  },
  homeDataSource: {
    CustomerTotal: 0,
    GraphqlTotal: 0,
    RestTotal: 0,
    dbTotal: 0,
    dbTotal2: 0,
  },
  homeOss: {
    ossTotal: 0,
    totalMemory: '',
    useMemory: '',
  },
}

export default function Home() {
  const [showType, setShowType] = useImmer('notice')
  const [homeConfig, setHomeConfig] = useImmer<HomeConfig>(initialValues)
  const handleToggleDesigner = (rightType: string) => {
    setShowType(rightType)
  }
  useEffect(() => {
    void requests.get<unknown, HomeConfig>('/home').then(res => {
      setHomeConfig(res)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { homeApi, homeAuth, homeDataSource, homeOss } = homeConfig
  const { CustomerTotal, GraphqlTotal, RestTotal, dbTotal } = homeDataSource
  const { liveQueryTotal, mutationsTotal, queryTotal, subscriptionsTotal } = homeApi
  const { authTotal, todayInsertUser, totalUser } = homeAuth
  const { ossTotal, totalMemory, useMemory } = homeOss

  const renderFeItem = (image: string, name: string, _doc: string, _code: string) => {
    return (
      <div className={styles.item}>
        <div className={styles.nameLine}>
          <div className={[styles.image, image].join(' ')} />
          <div className={styles.name}>{name}</div>
        </div>
        <div className={styles.btnLine}>
          <div className={styles.btn}>
            <div className={[styles.image, styles.imageDoc].join(' ')} />
            <div className={styles.text}>文档</div>
          </div>
          <div className={styles.btn}>
            <div className={[styles.image, styles.imageCode].join(' ')} />
            <div className={styles.text}>代码</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>FireBoom</title>
        <meta name="description" content="FireBoom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-full">
        <div className="flex items-center justify-end mx-6 my-5.5">
          <div className="invisible border cursor-pointer px-3 py-1">
            <IconFont type="icon-rizhi1" />
            <span className="ml-2">日志</span>
          </div>

          <div className="ml-8">
            <IconFont type="icon-lianxi" className="text-[22px]" onClick={handleIconClick} />
            <IconFont type="icon-wendang" className="text-[22px] ml-4" onClick={handleIconClick} />
            <IconFont type="icon-bangzhu" className="text-[22px] ml-4" onClick={handleIconClick} />
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <div className={styles.bodyContainer}>
            <div className={styles.centerContainer}>
              <div className={styles.row}>
                <div className={[styles.card, styles.moduleData].join(' ')}>
                  <div className={styles.cardTitle}>数据源</div>
                  <div className="flex">
                    <div className={[styles.dataCard, styles.dataCard1].join(' ')}>
                      <div className={styles.dataCardBody}>
                        <div className={styles.info}>
                          <div className={styles.name}>数据库</div>
                          <div className={styles.number}>{dbTotal}</div>
                        </div>
                        <Image
                          width={54}
                          height={54}
                          src="/assets/api-db.png"
                          alt="数据库"
                          preview={false}
                        />
                      </div>
                    </div>
                    <div className={[styles.dataCard, styles.dataCard2].join(' ')}>
                      <div className={styles.dataCardBody}>
                        <div className={styles.info}>
                          <div className={styles.name}>REST API</div>
                          <div className={styles.number}>{RestTotal}</div>
                        </div>
                        <Image
                          width={54}
                          height={54}
                          src="/assets/api-rest.png"
                          alt="REST API"
                          preview={false}
                        />
                      </div>
                    </div>
                    <div className={[styles.dataCard, styles.dataCard3].join(' ')}>
                      <div className={styles.dataCardBody}>
                        <div className={styles.info}>
                          <div className={styles.name}>GRAPHQL API</div>
                          <div className={styles.number}>{GraphqlTotal}</div>
                        </div>
                        <Image
                          width={54}
                          height={54}
                          src="/assets/api-graphql.png"
                          alt="GRAPHQL API"
                          preview={false}
                        />
                      </div>
                    </div>
                    <div className={[styles.dataCard, styles.dataCard4].join(' ')}>
                      <div className={styles.dataCardBody}>
                        <div className={styles.info}>
                          <div className={styles.name}>自定义服务</div>
                          <div className={styles.number}>{CustomerTotal}</div>
                        </div>
                        <Image
                          width={54}
                          height={54}
                          src="/assets/api-custom.png"
                          alt="自定义服务"
                          preview={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={[styles.card, styles.moduleApi].join(' ')}>
                  <div className={styles.cardTitle}>对外API</div>
                  <div className="flex">
                    <div className={styles.apiCard}>
                      <div className={styles.info}>
                        <div className={styles.name}>查询</div>
                        <div className={styles.number}>{queryTotal}</div>
                      </div>
                      <Image
                        width={54}
                        height={54}
                        src="/assets/api-query.png"
                        alt="查询"
                        preview={false}
                      />
                    </div>
                    <div className={styles.apiCard}>
                      <div className={styles.info}>
                        <div className={styles.name}>实时查询</div>
                        <div className={styles.number}>{liveQueryTotal}</div>
                      </div>
                      <Image
                        width={54}
                        height={54}
                        src="/assets/api-live-query.png"
                        alt="实时查询"
                        preview={false}
                      />
                    </div>
                    <div className={styles.apiCard}>
                      <div className={styles.info}>
                        <div className={styles.name}>变更</div>
                        <div className={styles.number}>{mutationsTotal}</div>
                      </div>
                      <Image
                        width={54}
                        height={54}
                        src="/assets/api-mutation.png"
                        alt="变更"
                        preview={false}
                      />
                    </div>
                    <div className={styles.apiCard}>
                      <div className={styles.info}>
                        <div className={styles.name}>订阅</div>
                        <div className={styles.number}>{subscriptionsTotal}</div>
                      </div>
                      <Image
                        width={54}
                        height={54}
                        src="/assets/api-subscription.png"
                        alt="订阅"
                        preview={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={[styles.card, styles.moduleSingle].join(' ')}>
                  <div className={styles.title}>
                    <div className={styles.text}>OSS存储</div>
                    <div className={styles.number}>{ossTotal}</div>
                    <div className={styles.numberText}>个</div>
                  </div>
                  <div className={styles.memoryLine}>
                    已使用 {useMemory}G<span className={styles.memoryTotal}>{totalMemory}/G</span>
                  </div>
                  <div className={styles.memoryProgress}>
                    <div
                      className={styles.active}
                      style={{
                        width:
                          String(((Number(useMemory) || 0) / (Number(totalMemory) || 1)) * 100) +
                          '%',
                      }}
                    />
                  </div>
                </div>
                <div className={[styles.card, styles.moduleSingle].join(' ')}>
                  <div className={styles.title}>
                    <div className={styles.text}>身份验证商</div>
                    <div className={styles.number}>{authTotal}</div>
                    <div className={styles.numberText}>个</div>
                  </div>
                  <div className={styles.authLine}>
                    <div className={styles.item}>
                      <div className={[styles.icon, styles.icon1].join(' ')} />
                      <div className={styles.label}>累计用户</div>
                      <div className={styles.text}>{totalUser}个</div>
                    </div>
                    <div className={styles.item}>
                      <div className={[styles.icon, styles.icon2].join(' ')} />
                      <div className={styles.label}>新增用户</div>
                      <div className={styles.text}>{todayInsertUser}个</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={[styles.card, styles.moduleFe].join(' ')}>
                  <div className={styles.cardTitle}>前端集成</div>
                  <div className={styles.blocks}>
                    <div className={styles.block}>
                      <div className={styles.title}>SDK</div>
                      <div className={styles.items}>
                        {renderFeItem(styles.react, 'REACT', '', '')}
                        {renderFeItem(styles.vue, 'VUE', '', '')}
                      </div>
                    </div>
                    <div className={styles.block}>
                      <div className={styles.title}>ADMIN后台</div>
                      <div className={styles.items}>
                        {renderFeItem(styles.react, 'REACT', '', '')}
                        {renderFeItem(styles.vue, 'VUE', '', '')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-380px ml-18px relative">
              <Notice handleToggleDesigner={handleToggleDesigner} />
              {showType == 'guide' ? <Guide handleToggleDesigner={handleToggleDesigner} /> : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
