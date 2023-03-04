import { Empty } from 'antd'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import type { DMFModel } from '@/interfaces/datasource'
import type { RelationMap } from '@/lib/helpers/prismaRelation'
import type { Datasource } from '@/pages/workbench/apimanage/crud/interface'

import Body from './body'
import styles from './index.module.less'
import Sider from './sider'

export default function CRUDIndex() {
  const [currentModel, setCurrentModel] = useState<DMFModel>()
  const [modelList, setModelList] = useState<DMFModel[]>()
  const [relationMap, setRelationMap] = useState<RelationMap>()
  const [isEmpty, setIsEmpty] = useState<boolean>()
  const [dmf, setDmf] = useState<string>()
  const [currentDatasource, setCurrentDatasource] = useState<Datasource>()
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.back} onClick={() => history.go(-1)}>
            <img className="mr-1" width={12} height={7} src="/assets/back.svg" alt="返回" />
            <FormattedMessage defaultMessage="返回上一级" />
          </div>
          <FormattedMessage defaultMessage="CRUD生成器" />
        </div>
        <div className="flex flex-1 min-h-0">
          <Sider
            onEmpty={() => {
              setIsEmpty(true)
            }}
            onSelectedModelChange={(model, datasource, modelList, relationMap, dmf) => {
              setCurrentModel(model)
              // @ts-ignore
              setCurrentDatasource(datasource)
              setModelList(modelList)
              setRelationMap(relationMap)
              setDmf(dmf)
              setIsEmpty(false)
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
            <Body
              model={currentModel}
              dbName={currentDatasource?.config.apiNamespace ?? ''}
              modelList={modelList}
              relationMap={relationMap}
              dmf={dmf}
            />
          )}
        </div>
      </div>
    </div>
  )
}
