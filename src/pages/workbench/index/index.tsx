import { Image } from 'antd'
import { lazy, Suspense, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useImmer } from 'use-immer'

import requests from '@/lib/fetchers'
import { Notice } from '@/pages/workbench/index/components/Notice'
import type { ApiDocuments } from '@/services/a2s.namespace'

import styles from './index.module.less'

const Guide = lazy(() => import('@/pages/workbench/index/components/Guide'))

export default function Home() {
  const intl = useIntl()
  const [showType, setShowType] = useImmer('notice')
  const [homeConfig, setHomeConfig] = useState<ApiDocuments.handler_homeStatistics | undefined>()
  const handleToggleDesigner = (rightType: string) => {
    setShowType(rightType)
  }
  useEffect(() => {
    void requests.get<unknown, ApiDocuments.handler_homeStatistics>('/home').then(res => {
      setHomeConfig(res)
    })
  }, [])

  // const renderFeItem = (image: string, name: string, _doc: string, _code: string) => {
  //   return (
  //     <div className={styles.item}>
  //       <div className={styles.nameLine}>
  //         <div className={[styles.image, image].join(' ')} />
  //         <div className={styles.name}>{name}</div>
  //       </div>
  //       <div className={styles.btnLine}>
  //         <div className={styles.btn}>
  //           <div className={[styles.image, styles.imageDoc].join(' ')} />
  //           <div className={styles.text}>{intl.formatMessage({ defaultMessage: '文档' })}</div>
  //         </div>
  //         <div className={styles.btn}>
  //           <div className={[styles.image, styles.imageCode].join(' ')} />
  //           <div className={styles.text}>{intl.formatMessage({ defaultMessage: '代码' })}</div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0">
          <div className={styles.bodyContainer}>
            <div className={styles.centerContainer}>
              <div className={styles.row}>
                <div className={[styles.card, styles.moduleData].join(' ')}>
                  <div className={styles.cardTitle}>
                    {intl.formatMessage({ defaultMessage: '数据源' })}
                  </div>
                  <div className="flex">
                    <div className={[styles.dataCard, styles.dataCard1].join(' ')}>
                      <div className={styles.dataCardBody}>
                        <div className={styles.info}>
                          <div className={styles.name}>
                            {intl.formatMessage({ defaultMessage: '数据库' })}
                          </div>
                          <div className={styles.number}>
                            {homeConfig?.dataSource?.databaseTotal ?? 0}
                          </div>
                        </div>
                        <Image
                          width={54}
                          height={54}
                          src={`${import.meta.env.BASE_URL}assets/api-db.png`}
                          alt="数据库"
                          preview={false}
                        />
                      </div>
                    </div>
                    <div className={[styles.dataCard, styles.dataCard2].join(' ')}>
                      <div className={styles.dataCardBody}>
                        <div className={styles.info}>
                          <div className={styles.name}>REST API</div>
                          <div className={styles.number}>
                            {homeConfig?.dataSource?.restTotal ?? 0}
                          </div>
                        </div>
                        <Image
                          width={54}
                          height={54}
                          src={`${import.meta.env.BASE_URL}assets/api-rest.png`}
                          alt="REST API"
                          preview={false}
                        />
                      </div>
                    </div>
                    <div className={[styles.dataCard, styles.dataCard3].join(' ')}>
                      <div className={styles.dataCardBody}>
                        <div className={styles.info}>
                          <div className={styles.name}>GRAPHQL API</div>
                          <div className={styles.number}>
                            {homeConfig?.dataSource?.graphqlTotal ?? 0}
                          </div>
                        </div>
                        <Image
                          width={54}
                          height={54}
                          src={`${import.meta.env.BASE_URL}assets/api-graphql.png`}
                          alt="GRAPHQL API"
                          preview={false}
                        />
                      </div>
                    </div>
                    <div className={[styles.dataCard, styles.dataCard4].join(' ')}>
                      <div className={styles.dataCardBody}>
                        <div className={styles.info}>
                          <div className={styles.name}>
                            {intl.formatMessage({ defaultMessage: '自定义服务' })}
                          </div>
                          <div className={styles.number}>
                            {homeConfig?.dataSource?.customizeTotal ?? 0}
                          </div>
                        </div>
                        <Image
                          width={54}
                          height={54}
                          src={`${import.meta.env.BASE_URL}assets/api-custom.png`}
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
                  <div className={styles.cardTitle}>
                    {intl.formatMessage({ defaultMessage: '对外API' })}
                  </div>
                  <div className="flex">
                    <div className={styles.apiCard}>
                      <div className={styles.info}>
                        <div className={styles.name}>
                          {intl.formatMessage({ defaultMessage: '查询' })}
                        </div>
                        <div className={styles.number}>
                          {homeConfig?.operation?.queryTotal ?? 0}
                        </div>
                      </div>
                      <Image
                        width={54}
                        height={54}
                        src={`${import.meta.env.BASE_URL}assets/api-query.png`}
                        alt="查询"
                        preview={false}
                      />
                    </div>
                    <div className={styles.apiCard}>
                      <div className={styles.info}>
                        <div className={styles.name}>
                          {intl.formatMessage({ defaultMessage: '实时查询' })}
                        </div>
                        <div className={styles.number}>
                          {homeConfig?.operation?.liveQueryTotal ?? 0}
                        </div>
                      </div>
                      <Image
                        width={54}
                        height={54}
                        src={`${import.meta.env.BASE_URL}assets/api-live-query.png`}
                        alt="实时查询"
                        preview={false}
                      />
                    </div>
                    <div className={styles.apiCard}>
                      <div className={styles.info}>
                        <div className={styles.name}>
                          {intl.formatMessage({ defaultMessage: '变更' })}
                        </div>
                        <div className={styles.number}>
                          {homeConfig?.operation?.mutationTotal ?? 0}
                        </div>
                      </div>
                      <Image
                        width={54}
                        height={54}
                        src={`${import.meta.env.BASE_URL}assets/api-mutation.png`}
                        alt="变更"
                        preview={false}
                      />
                    </div>
                    <div className={styles.apiCard}>
                      <div className={styles.info}>
                        <div className={styles.name}>
                          {intl.formatMessage({ defaultMessage: '订阅' })}
                        </div>
                        <div className={styles.number}>
                          {homeConfig?.operation?.subscriptionTotal ?? 0}
                        </div>
                      </div>
                      <Image
                        width={54}
                        height={54}
                        src={`${import.meta.env.BASE_URL}assets/api-subscription.png`}
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
                    <div className={styles.text}>
                      {intl.formatMessage({ defaultMessage: 'OSS存储' })}
                    </div>
                    <div className={styles.number}>{homeConfig?.storage?.storageTotal ?? 0}</div>
                    <div className={styles.numberText}>
                      {intl.formatMessage({ defaultMessage: '个' })}
                    </div>
                  </div>
                  {/*<div className={styles.memoryLine}>*/}
                  {/*  已使用 {useMemory}G<span className={styles.memoryTotal}>{totalMemory}/G</span>*/}
                  {/*</div>*/}
                  {/*<div className={styles.memoryProgress}>*/}
                  {/*  <div*/}
                  {/*    className={styles.active}*/}
                  {/*    style={{*/}
                  {/*      width:*/}
                  {/*        String(((Number(useMemory) || 0) / (Number(totalMemory) || 1)) * 100) +*/}
                  {/*        '%'*/}
                  {/*    }}*/}
                  {/*  />*/}
                  {/*</div>*/}
                </div>
                <div className={[styles.card, styles.moduleSingle].join(' ')}>
                  <div className={styles.title}>
                    <div className={styles.text}>
                      {intl.formatMessage({ defaultMessage: '身份验证商' })}
                    </div>
                    <div className={styles.number}>
                      {homeConfig?.authentication?.authenticationTotal ?? 0}
                    </div>
                    <div className={styles.numberText}>个</div>
                  </div>
                  {/*<div className={styles.authLine}>*/}
                  {/*  <div className={styles.item}>*/}
                  {/*    <div className={[styles.icon, styles.icon1].join(' ')} />*/}
                  {/*    <div className={styles.label}>累计用户</div>*/}
                  {/*    <div className={styles.text}>{totalUser}个</div>*/}
                  {/*  </div>*/}
                  {/*  <div className={styles.item}>*/}
                  {/*    <div className={[styles.icon, styles.icon2].join(' ')} />*/}
                  {/*    <div className={styles.label}>新增用户</div>*/}
                  {/*    <div className={styles.text}>{todayInsertUser}个</div>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </div>

              {/* <div className={styles.row}>
                <div className={[styles.card, styles.moduleFe].join(' ')}>
                  <div className={styles.cardTitle}>
                    {intl.formatMessage({ defaultMessage: '前端集成' })}
                  </div>
                  <div className={styles.blocks}>
                    <div className={styles.block}>
                      <div className={styles.title}>SDK</div>
                      <div className={styles.items}>
                        {renderFeItem(styles.react, 'REACT', '', '')}
                        {renderFeItem(styles.vue, 'VUE', '', '')}
                      </div>
                    </div>
                    <div className={styles.block}>
                      <div className={styles.title}>
                        {intl.formatMessage({ defaultMessage: 'ADMIN后台' })}
                      </div>
                      <div className={styles.items}>
                        {renderFeItem(styles.react, 'REACT', '', '')}
                        {renderFeItem(styles.vue, 'VUE', '', '')}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>

            <div className="flex-shrink-0 ml-18px w-380px relative">
              <Notice handleToggleDesigner={handleToggleDesigner} />
              <Suspense fallback={<div />}>
                {showType == 'guide' ? <Guide handleToggleDesigner={handleToggleDesigner} /> : null}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
