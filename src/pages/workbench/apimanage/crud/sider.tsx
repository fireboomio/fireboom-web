import { message, Select } from 'antd'
import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import { useDataSourceList } from '@/hooks/store/dataSource'
import type { DMFModel } from '@/interfaces/datasource'
import { DataSourceKind } from '@/interfaces/datasource'
import { fetchPrismaDMF, fetchPrismaSDL } from '@/lib/clients/fireBoomAPIOperator'
import { MAGIC_DELETE_ENTITY_NAME } from '@/lib/constants/fireBoomConstants'
import requests from '@/lib/fetchers'
import type { RelationMap } from '@/lib/helpers/prismaRelation'
import { findAllRelationInSchema } from '@/lib/helpers/prismaRelation'
import type { ApiDocuments } from '@/services/a2s.namespace'
import { getDataSourceIcon, isDatabaseKind } from '@/utils/datasource'

import styles from './index.module.less'

interface CRUDSiderProps {
  onEmpty: () => void
  onSelectedModelChange: (
    model: DMFModel,
    datasource: ApiDocuments.Datasource,
    models: DMFModel[],
    relationMap: RelationMap,
    dmf: string
  ) => void
}

export default function CRUDSider(props: CRUDSiderProps) {
  const intl = useIntl()
  // 刷新列表
  const dataSourceList = useDataSourceList()
  const [currentDataSourceName, setCurrentDataSourceName] = useState<string>()
  const [currentModel, setCurrentModel] = useState<DMFModel>()
  const [modelList, setModelList] = useState<DMFModel[]>([])
  const [dmf, setDmf] = useState<string>('')
  const [relationMaps, setRelationMaps] = useState<Record<string, RelationMap>>()

  const readyRef = useRef(false)
  const currentName = useRef<string>()

  const filterDataSourceList = useMemo(() => {
    return dataSourceList
      ? dataSourceList.filter(item => isDatabaseKind(item) && item.enabled)
      : dataSourceList
  }, [dataSourceList])

  useEffect(() => {
    if (!filterDataSourceList) {
      return
    }
    if (filterDataSourceList.length === 0) {
      props.onEmpty()
    }
    if (!filterDataSourceList.find(item => item.name === currentDataSourceName)) {
      setCurrentDataSourceName(filterDataSourceList?.[0]?.name)
    }
  }, [filterDataSourceList, currentDataSourceName])
  useEffect(() => {
    void loadModelList()
  }, [currentDataSourceName])
  async function loadModelList() {
    if (!currentDataSourceName) {
      return
    }
    currentName.current = currentDataSourceName
    const hide = message.loading(intl.formatMessage({ defaultMessage: '正在加载模型列表' }))
    try {
      const nativeSDL = await requests.get<unknown, string>(
        `/datasource/graphql/${currentDataSourceName}`,
        {
          timeout: 15e3
        }
      )
      const [dmmf, sdl] = await Promise.all([
        fetchPrismaDMF(currentDataSourceName, { crud: true }),
        fetchPrismaSDL(currentDataSourceName, { crud: true }).catch(() => '')
      ])

      if (currentName.current === currentDataSourceName) {
        setDmf(nativeSDL)
        const models = (dmmf.datamodel.models ?? []).filter(
          model => model.name !== MAGIC_DELETE_ENTITY_NAME
        )
        setModelList(models)
        setCurrentModel(models[0])
        setRelationMaps(findAllRelationInSchema(sdl))
        readyRef.current = true
      }
    } catch (e) {
      console.error(e)
    }
    hide()
  }
  useEffect(() => {
    if (!currentModel || !filterDataSourceList || !readyRef.current) {
      return
    }
    props.onSelectedModelChange(
      currentModel,
      filterDataSourceList.find(item => item.name === currentDataSourceName)!,
      modelList,
      relationMaps?.[currentModel.name]!,
      dmf
    )
  }, [currentDataSourceName, currentModel, dmf, filterDataSourceList, modelList, relationMaps])

  if (!filterDataSourceList) {
    return null
  }

  return (
    <div className={'common-form ' + styles.sider}>
      <div className="flex w-full items-center">
        <Select
          value={currentDataSourceName}
          onChange={value => {
            readyRef.current = false
            setCurrentDataSourceName(value)
          }}
          className="flex-1"
          options={filterDataSourceList.map(x => {
            const icon = getDataSourceIcon(x)
            return {
              name: x.name,
              label: (
                <div className="flex items-center">
                  <img className="h-3 mr-1 w-3" alt={x.name} src={icon} />
                  {x.name}
                </div>
              ),
              value: x.name
            }
          })}
        />
        <div
          className="cursor-pointer flex bg-[#f7f7f7] h-28px ml-1 w-28px items-center justify-center"
          onClick={loadModelList}
        >
          <img
            width={18}
            height={18}
            src={`${import.meta.env.BASE_URL}assets/refresh.svg`}
            alt="刷新"
          />
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
            <img className="mr-3" src={`${import.meta.env.BASE_URL}assets/model.svg`} alt="刷新" />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}
