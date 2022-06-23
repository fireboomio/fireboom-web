import { AppleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { getSchema } from '@mrleebo/prisma-ast'
import type { Block } from '@mrleebo/prisma-ast'
import { Select, Tooltip } from 'antd'
import axios from 'axios'
import { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { Result, SchemaResp } from '@/interfaces'

import { EntitiesContext } from './model-context'
import styles from './model-pannel.module.scss'
import ModelEntityList from './subs/model-entity-list'

interface Props {
  schemaOptions: SchemaResp[]
}

const fetcher = (url: string, params?: Record<string, string>) =>
  axios.get<Result<string>>(url, { params: params }).then((res) => {
    return res.data.result
  })

export default function ModelPannel({ schemaOptions }: Props) {
  const [entities, setEntities] = useImmer([] as Block[])

  useEffect(() => {
    fetcher('http://localhost:8080/schema.json')
      .then((res) => {
        setEntities(getSchema(res).list.filter((l) => ['model', 'enum'].includes(l.type)))
      })
      .catch((err: Error) => {
        throw err
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const schOpts = schemaOptions.map((s) => ({
    label: (
      <>
        <AppleOutlined /> {s.name}
      </>
    ),
    value: `${s.id}`,
  }))

  function handleChange(value: string) {
    fetcher('http://localhost:8080/schema.json', { id: value })
      .then((res) => {
        setEntities(getSchema(res).list.filter((l) => ['model', 'enum'].includes(l.type)))
      })
      .catch((err: Error) => {
        throw err
      })
  }

  //pannel 点击搜索框下6个按钮对应回调
  function introSpector_one() {
    console.log('触发introSpector_one操作')
  }

  function downLoad_two() {
    console.log('触发downLoad操作')
  }

  function upload_three() {
    console.log('触发CloudUploadr操作')
  }

  function connectCloudLocal_four() {
    console.log('触发connectCloudLocal操作')
  }

  function checkThing_fif() {
    console.log('触发connectCloudLocal操作')
  }

  function entity_Relationship_six() {
    console.log('触发Entity_Relationship操作')
  }

  return (
    <EntitiesContext.Provider value={{ entities, setEntities }}>
      <div className={styles.pannel}>
        <div className={styles.title}>数据建模</div>

        <div className={styles['select-contain']}>
          <Select
            className={styles.select}
            onChange={handleChange}
            defaultValue={schOpts[0].value}
            options={schOpts}
          />
          <Tooltip title="prompt text">
            <InfoCircleOutlined className="ml-1.5 text-base hidden" style={{ color: '#F79500' }} />
          </Tooltip>
        </div>

        <div className={styles.actions}>
          <AppleOutlined onClick={introSpector_one} />
          <AppleOutlined onClick={downLoad_two} />
          <AppleOutlined onClick={upload_three} />
          <AppleOutlined onClick={connectCloudLocal_four} />
          <AppleOutlined onClick={checkThing_fif} />
          <AppleOutlined onClick={entity_Relationship_six} />
        </div>
      </div>

      <ModelEntityList />
    </EntitiesContext.Provider>
  )
}
