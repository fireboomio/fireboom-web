import { message, Select } from 'antd'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

import type { DMFModel } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'
import type { RelationMap } from '@/lib/helpers/prismaRelation'
import { findAllRelationInSchema } from '@/lib/helpers/prismaRelation'

import styles from './index.module.less'
import type { Datasource } from './interface'

interface CRUDSiderProps {
  onSelectedModelChange: (
    model: DMFModel,
    datasource: Datasource,
    models: DMFModel[],
    relationMap: RelationMap,
    dmf: string
  ) => void
}

export default function CRUDSider(props: CRUDSiderProps) {
  // 刷新列表
  const [dataSourceList, setDataSourceList] = useState<Datasource[]>([])
  const [currentDataSourceId, setCurrentDataSourceId] = useState<number>()
  const [currentModel, setCurrentModel] = useState<DMFModel>()
  const [modelList, setModelList] = useState<DMFModel[]>([])
  const [dmf, setDmf] = useState<string>('')
  const [relationMaps, setRelationMaps] = useState<Record<string, RelationMap>>()
  useEffect(() => {
    void queryDataSourceList()
  }, [])

  useEffect(() => {
    void loadModelList()
  }, [currentDataSourceId])
  async function loadModelList() {
    if (!currentDataSourceId) {
      return
    }
    const hide = message.loading('正在加载模型列表')
    try {
      const nativeDMF = await requests.get<unknown, string>(
        `/prisma/nativeDMF/${currentDataSourceId}`,
        {
          timeout: 15e3
        }
      )
      setDmf(nativeDMF)
      const res = await requests.get<unknown, { models: DMFModel[]; schemaContent: string }>(
        `/prisma/dmf/${currentDataSourceId}`,
        { timeout: 15e3 }
      )
      setModelList(res.models || [])
      setCurrentModel(res.models?.[0])
      setRelationMaps(findAllRelationInSchema(res.schemaContent))
    } catch (e) {
      console.error(e)
    }
    hide()
  }
  useEffect(() => {
    if (!currentModel) {
      return
    }
    props.onSelectedModelChange(
      currentModel,
      dataSourceList.find(item => item.id === currentDataSourceId)!,
      modelList,
      relationMaps?.[currentModel.name]!,
      dmf
    )
  }, [currentModel])

  const queryDataSourceList = async () => {
    const result = await requests.get<unknown, Datasource[]>('/dataSource?datasourceType=1')
    setDataSourceList(result)
    if (!result.find(item => item.id === currentDataSourceId)) {
      setCurrentDataSourceId(result?.[0]?.id)
    }
  }

  return (
    <div className={'common-form ' + styles.sider}>
      <div className="flex w-full items-center">
        <Select
          value={currentDataSourceId}
          onChange={value => {
            setCurrentDataSourceId(value)
          }}
          showSearch
          filterOption={(input, option) => {
            return (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
          }}
          className="flex-1"
          options={dataSourceList.map(x => {
            let svg = '/assets/icon/db-other.svg'
            switch (x.sourceType) {
              case 1:
                svg =
                  {
                    mysql: '/assets/icon/mysql.svg',
                    pgsql: '/assets/icon/pg.svg',
                    graphql: '/assets/icon/graphql.svg',
                    mongodb: '/assets/icon/mongodb.svg',
                    rest: '/assets/icon/rest.svg',
                    sqlite: '/assets/icon/sqlite.svg'
                  }[String(x.config.dbType).toLowerCase()] || svg
                break
              case 2:
                svg = '/assets/icon/rest.svg'
                break
              case 3:
                svg = '/assets/icon/graphql.svg'
                break
            }
            return {
              name: x.name,
              label: (
                <div className="flex items-center">
                  <img className="mr-1 w-3 h-3" alt={x.name} src={svg} />
                  {x.name}
                </div>
              ),
              value: x.id
            }
          })}
        />
        <div
          className="ml-1 w-28px h-28px bg-[#f7f7f7] flex items-center justify-center cursor-pointer"
          onClick={loadModelList}
        >
          <img width={18} height={18} src="/assets/refresh.svg" alt="刷新" />
        </div>
      </div>
      <div className="py-5px overflow-y-auto pa">
        {modelList.map(item => (
          <div
            className={clsx({
              [styles.siderItem]: true,
              [styles.siderItemActive]: currentModel?.name === item.name
            })}
            key={item.name}
            onClick={() => setCurrentModel(item)}
          >
            <img className="mr-3" src="/assets/model.svg" alt="刷新" />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}
