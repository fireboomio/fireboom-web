import { Empty } from 'antd'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Body from './body'
import styles from './index.module.less'
import Sider from './sider'

export default function CRUDIndex() {
  const [isEmpty, setIsEmpty] = useState<boolean>()
  const [bodyData, setBodyData] = useState<any>()
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.back} onClick={() => history.go(-1)}>
            <img className="mr-1" width={12} height={7} src="/assets/back.svg" alt="返回" />
            <FormattedMessage defaultMessage="返回" />
          </div>
          <FormattedMessage defaultMessage="CRUD生成器" />
        </div>
        <div className="flex flex-1 min-h-0">
          <Sider
            onEmpty={() => {
              setIsEmpty(true)
            }}
            onSelectedModelChange={(model, datasource, modelList, relationMap, dmf) => {
              // @ts-ignore
              setIsEmpty(false)
              setBodyData({
                dmf,
                relationMap,
                model,
                modelList,
                dbName: datasource?.config.apiNamespace
              })
            }}
          />
          {isEmpty ? (
            <div className="flex flex-1 pt-25 justify-center">
              <Empty
                description={
                  <FormattedMessage
                    id="apiCrud.empty"
                    defaultMessage="使用该功能前，请先添加数据库"
                  />
                }
              />
            </div>
          ) : (
            bodyData && <Body bodyData={bodyData} />
          )}
        </div>
      </div>
    </div>
  )
}
