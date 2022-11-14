import React from 'react'

import type { DMFModel } from '@/interfaces/datasource'

import Body from './body'
import styles from './index.module.less'
import Sider from './sider'

export default function CRUDIndex() {
  const [currentModel, setCurrentModel] = React.useState<DMFModel>()
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
          <Sider onSelectedModelChange={setCurrentModel} />
          <Body model={currentModel} />
        </div>
      </div>
    </div>
  )
}
