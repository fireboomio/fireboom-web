import { message, Select } from 'antd'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

import type { DMFModel } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'

import styles from './index.module.less'
import type { Datasource } from './interface'

interface CRUDSiderProps {
  onSelectedModelChange: (model: DMFModel, datasource: Datasource, models: DMFModel[]) => void
}

export default function CRUDSider(props: CRUDSiderProps) {
  // 刷新列表
  const [dataSourceList, setDataSourceList] = useState<Datasource[]>([])
  const [currentDataSourceId, setCurrentDataSourceId] = useState<number>()
  const [currentModel, setCurrentModel] = useState<DMFModel>()
  const [modelList, setModelList] = useState<DMFModel[]>([])
  useEffect(() => {
    void queryDataSourceList()
  }, [])

  useEffect(() => {
    if (!currentDataSourceId) {
      return
    }
    const hide = message.loading('正在加载模型列表')
    requests
      .get<unknown, { models: DMFModel[] }>(`/prisma/dmf/${currentDataSourceId}`)
      .then(res => {
        setModelList(res.models)
        setCurrentModel(res.models[0])
        hide()
      })
  }, [currentDataSourceId])
  useEffect(() => {
    if (!currentModel) {
      return
    }
    props.onSelectedModelChange(
      currentModel,
      dataSourceList.find(item => item.id === currentDataSourceId)!,
      modelList
    )
  }, [currentModel])

  const queryDataSourceList = async () => {
    const result = await requests.get<unknown, Datasource[]>('/dataSource?datasourceType=1')
    setDataSourceList(result)
    if (!result.find(item => item.id === currentDataSourceId)) {
      setCurrentDataSourceId(result[0].id)
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
          options={dataSourceList}
          fieldNames={{ label: 'name', value: 'id' }}
        />
        <div
          className="ml-1 w-28px h-28px bg-[#f7f7f7] flex items-center justify-center cursor-pointer"
          onClick={queryDataSourceList}
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
