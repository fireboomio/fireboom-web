import { Col, Row, Image, Progress, Badge } from 'antd'
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

  return (
    <>
      <Head>
        <title>FireBoom</title>
        <meta name="description" content="FireBoom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
      <div className={styles['main-divider']} />

      <div className="overflow-y-scroll h-180">
        <Row className="h-screen">
          <Col span={18} className={styles['col-left']}>
            <div className="pl-6 pr-10 mt-6">
              <div className=" mb-5 ">
                <span className="text-lg flex-grow font-bold">数据概览</span>
                <div className={`${styles['right-data']} border pl-6 pt-4 mb-3 mt-3`}>
                  <h3 className={styles['top-head']}>数据源</h3>
                  <div className=" pb-5 ">
                    <Row gutter={[16, 40]}>
                      <Col span={6}>
                        <div className="flex">
                          <Image src="/assets/api-db.svg" alt="数据库" preview={false} />
                          <div className="ml-8">
                            <span>{dbTotal}</span>
                            <p>数据库</p>
                          </div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="flex">
                          <Image src="/assets/api-rest.svg" alt="REST API" preview={false} />
                          <div className="ml-8">
                            <span>{RestTotal}</span>
                            <p>REST API</p>
                          </div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="flex">
                          <Image src="/assets/api-graphql.svg" alt="GRAPHQL API" preview={false} />
                          <div className="ml-8">
                            <span>{GraphqlTotal}</span>
                            <p>GRAPHQL API</p>
                          </div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="flex">
                          <Image src="/assets/api-custom.svg" alt="custom" preview={false} />
                          <div className="ml-8">
                            <span>{CustomerTotal}</span>
                            <p>自定义服务</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className={`${styles['right-data']} border pl-6 pt-4`}>
                  <h3 className={styles['top-head']}>对外API</h3>
                  <div className="pb-5">
                    <Row gutter={[16, 40]}>
                      <Col span={6}>
                        <div className="flex ">
                          <Image src="/assets/check.svg" alt="查询" preview={false} />
                          <div className="ml-8">
                            <span>{queryTotal}</span>
                            <p>查询</p>
                          </div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="flex">
                          <Image src="/assets/checkNow.svg" alt="实时查询" preview={false} />
                          <div className="ml-8">
                            <span>{liveQueryTotal}</span>
                            <p>实时查询</p>
                          </div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="flex">
                          <Image src="/assets/change.svg" alt="变更" preview={false} />
                          <div className="ml-8">
                            <span>{mutationsTotal}</span>
                            <p>变更</p>
                          </div>
                        </div>
                      </Col>
                      <Col span={6}>
                        <div className="flex">
                          <Image src="/assets/subscribe.svg" alt="订阅" preview={false} />
                          <div className="ml-8">
                            <span>{subscriptionsTotal}</span>
                            <p>订阅</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="mt-3">
                  <Row gutter={[5, 40]}>
                    <Col span={12}>
                      <div className="border pl-8 pt-6 pb-8 mr-6">
                        <div>
                          <span className="mr-4">OSS存储</span>
                          <span className="text-xl font-medium">{`${ossTotal}个`}</span>
                        </div>
                        <div className="flex mt-6">
                          <Progress percent={70} strokeColor="red" size="small" showInfo={false} />
                          <span className="pl-4.2 w-40">{`已使用 ${useMemory}g/${totalMemory}g`}</span>
                        </div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="border pl-8 pt-6 pb-8">
                        <div>
                          <span className="mr-4">身份验证商</span>
                          <span className="text-xl font-medium">{`${authTotal}个`}</span>
                        </div>
                        <div className="mt-6 mr-20">
                          <Row>
                            <Col span={12}>
                              <Badge text={`累计用户${totalUser}个`} color="cyan" />
                            </Col>
                            <Col span={12}>
                              <Badge text={`新增用户${todayInsertUser}个`} color="purple" />
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="mt-10.5">
                <span className="text-lg flex-grow font-bold">前端集成</span>
                <div className="mt-3 ">
                  <Row gutter={[5, 40]}>
                    <Col span={12}>
                      <div className="border pl-6 pt-4 pb-6 mr-6">
                        <h2 className={styles['skd-style']}>SDK</h2>
                        <Row>
                          <Col span={12}>
                            <div>
                              <div>
                                <IconFont type="icon-React" className="text-[20px]" />
                                <span className={styles['logo-style']}>REACT</span>
                              </div>
                              <div className={`${styles['bottom-data']} flex mt-3.5`}>
                                <div className="border mr-2 px-2">
                                  <IconFont type="icon-wendang" onClick={handleIconClick} />
                                  <span>文档</span>
                                </div>
                                <div className="border px-2">
                                  <IconFont type="icon-code" onClick={handleIconClick} />
                                  <span>代码</span>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div>
                              <div>
                                <IconFont type="icon-Vue" className="text-[20px]" />
                                <span className={styles['logo-style']}>VUE</span>
                              </div>
                              <div className={`${styles['bottom-data']} flex mt-3.5`}>
                                <div className="border mr-2 px-2">
                                  <IconFont type="icon-wendang" onClick={handleIconClick} />
                                  <span>文档</span>
                                </div>
                                <div className="border px-2">
                                  <IconFont type="icon-code" onClick={handleIconClick} />
                                  <span>代码</span>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="border pl-6 pt-4 pb-6">
                        <h2 className={styles['skd-style']}>ADMIN后台</h2>
                        <Row>
                          <Col span={12}>
                            <div>
                              <div>
                                <IconFont type="icon-React" className="text-[20px]" />
                                <span className={styles['logo-style']}>REACT</span>
                              </div>
                              <div className={`${styles['bottom-data']} flex mt-3.5`}>
                                <div className="border mr-2 px-2">
                                  <IconFont type="icon-wendang" onClick={handleIconClick} />
                                  <span>文档</span>
                                </div>
                                <div className="border px-2">
                                  <IconFont type="icon-code" onClick={handleIconClick} />
                                  <span>代码</span>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div>
                              <div>
                                <IconFont
                                  type="icon-Vue"
                                  className="text-[20px]"
                                  onClick={handleIconClick}
                                />
                                <span className={styles['logo-style']}>VUE</span>
                              </div>
                              <div className={`${styles['bottom-data']} flex mt-3.5`}>
                                <div className="border mr-2 px-2">
                                  <IconFont type="icon-wendang" onClick={handleIconClick} />
                                  <span>文档</span>
                                </div>
                                <div className="border px-2">
                                  <IconFont type="icon-code" onClick={handleIconClick} />
                                  <span>代码</span>
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>

          <Col span={6}>
            {showType == 'notice' ? (
              <Notice handleToggleDesigner={handleToggleDesigner} />
            ) : showType == 'guide' ? (
              <Guide handleToggleDesigner={handleToggleDesigner} />
            ) : (
              ''
            )}
          </Col>
        </Row>
      </div>
    </>
  )
}
