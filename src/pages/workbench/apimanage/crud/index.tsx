import React, { useState } from 'react'

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
  const [dmf, setDmf] = useState<string>()
  const [currentDatasource, setCurrentDatasource] = useState<Datasource>()
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.back} onClick={() => history.go(-1)}>
            <img className="mr-1" width={12} height={7} src="/assets/back.svg" alt="返回" />
            返回上一级
          </div>
          CRUD生成器
        </div>
        <div className="flex flex-1 min-h-0">
          <Sider
            onSelectedModelChange={(model, datasource, modelList, relationMap, dmf) => {
              setCurrentModel(model)
              setCurrentDatasource(datasource)
              setModelList(modelList)
              setRelationMap(relationMap)
              setDmf(dmf)
            }}
          />
          <Body
            model={currentModel}
            dbName={currentDatasource?.config.apiNamespace ?? ''}
            modelList={modelList}
            relationMap={relationMap}
            dmf={dmf}
          />
        </div>
      </div>
    </div>
  )
}
