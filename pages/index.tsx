import { InfoCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { Col, Row, Input, Tooltip, Image, Divider, Progress, Badge } from 'antd'
import Head from 'next/head'
import { useImmer } from 'use-immer'

import { Guide } from '@/components/home/Guide'
import { Notice } from '@/components/home/Notice'
import IconFont from '@/components/iconfont'

import styles from './index.module.scss'
const handleIconClick = () => {
  console.log('aaa')
}

export default function Home() {
  const [showType, setShowType] = useImmer('notice')
  const handleToggleDesigner = (rightType: string) => {
    setShowType(rightType)
  }

  return (
    <>
      <Head>
        <title>FireBoom</title>
        <meta name="description" content="FireBoom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="flex justify-between">
          <Input
            disabled
            value="系统当前为“开发模式”，前往“设置-》系统设置”切换为“生产模式”"
            style={{ width: '38%' }}
            prefix={
              <Tooltip title="Extra information">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
            suffix={<CloseOutlined />}
            className=" mt-5.5 ml-6"
          />

          <div className="mt-5.5 flex items-center">
            <div className="border px-2 mr-6 flex items-center">
              <IconFont type="icon-rizhi1" />
              <span className="ml-2">日志</span>
            </div>
            <div>
              <IconFont type="icon-lianxi" className="text-[22px]" onClick={handleIconClick} />
              <IconFont
                type="icon-wendang"
                className="text-[22px] ml-4"
                onClick={handleIconClick}
              />
              <IconFont
                type="icon-bangzhu"
                className="text-[22px] ml-4"
                onClick={handleIconClick}
              />
            </div>
          </div>
        </div>
        <Divider className={styles['main-divider']} />
      </div>
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
                        <Image
                          src="/assets/DB API.svg"
                          alt="数据库"
                          width={50}
                          height={50}
                          preview={false}
                        />
                        <div className="ml-8">
                          <span>3</span>
                          <p>数据库</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="flex">
                        <Image
                          src="/assets/REST API.svg"
                          alt="REST API"
                          width={50}
                          height={50}
                          preview={false}
                        />
                        <div className="ml-8">
                          <span>3</span>
                          <p>REST API</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="flex">
                        <Image
                          src="/assets/GRAPHQL API.svg"
                          alt="GRAPHQL API"
                          width={50}
                          height={50}
                          preview={false}
                        />
                        <div className="ml-8">
                          <span>3</span>
                          <p>GRAPHQL API</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="flex">
                        <Image
                          src="/assets/DefineSelf.svg"
                          alt="DefineSelf"
                          width={50}
                          height={50}
                          preview={false}
                        />
                        <div className="ml-8">
                          <span>3</span>
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
                        <Image
                          src="/assets/check.svg"
                          alt="查询"
                          width={50}
                          height={50}
                          preview={false}
                        />
                        <div className="ml-8">
                          <span>3</span>
                          <p>查询</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="flex">
                        <Image
                          src="/assets/checkNow.svg"
                          alt="实时查询"
                          width={50}
                          height={50}
                          preview={false}
                        />
                        <div className="ml-8">
                          <span>3</span>
                          <p>实时查询</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="flex">
                        <Image
                          src="/assets/change.svg"
                          alt="变更"
                          width={50}
                          height={50}
                          preview={false}
                        />
                        <div className="ml-8">
                          <span>3</span>
                          <p>变更</p>
                        </div>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="flex">
                        <Image
                          src="/assets/subscribe.svg"
                          alt="订阅"
                          width={50}
                          height={50}
                          preview={false}
                        />
                        <div className="ml-8">
                          <span>3</span>
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
                        <span className="text-xl font-medium">1个</span>
                      </div>
                      <div className="flex mt-6">
                        <Progress percent={70} strokeColor="red" size="small" showInfo={false} />
                        <span className="pl-4.2 w-40">已使用 1g/34g</span>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="border pl-8 pt-6 pb-8">
                      <div>
                        <span className="mr-4">身份验证商</span>
                        <span className="text-xl font-medium">1个</span>
                      </div>
                      <div className="mt-6 mr-20">
                        <Row>
                          <Col span={12}>
                            <Badge text="累计用户289个" color="cyan" />
                          </Col>
                          <Col span={12}>
                            <Badge text="新增用户50个" color="purple" />
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
    </>
  )
}
