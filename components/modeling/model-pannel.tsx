import { AppleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { getSchema } from '@mrleebo/prisma-ast'
import { Select, Tooltip } from 'antd'
import axios from 'axios'
import { useContext, useEffect } from 'react'

import type { Entity, Result, SchemaResp, DBSourceResp } from '@/interfaces'
import { ModelingContext } from '@/lib/modeling-context'

import styles from './model-pannel.module.scss'
import ModelEntityList from './subs/model-entity-list'

interface Props {
  sourceOptions: DBSourceResp[]
}

const fetcher = (url: string, params?: Record<string, string>) =>
  axios.get<Result<SchemaResp>>(url, { params: params }).then((res) => {
    return res.data.result
  })

export default function ModelPannel({ sourceOptions }: Props) {
  const { entities: _, setEntities } = useContext(ModelingContext)

  useEffect(() => {
    fetcher('/api/schemas/1')
      .then((res) => {
        setEntities(
          getSchema(res.body).list.filter((l) => ['enum', 'model'].includes(l.type)) as Entity[]
        )
      })
      .catch((err: Error) => {
        throw err
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const schOpts = sourceOptions.map((s) => ({
    label: (
      <>
        <AppleOutlined /> {s.name}
      </>
    ),
    value: `${s.id}`,
  }))

  function handleChange(value: string) {
    fetcher(`/api/schemas/${value}`)
      .then((res) => {
        setEntities(
          getSchema(res.body).list.filter((l) => ['enum', 'model'].includes(l.type)) as Entity[]
        )
      })
      .catch((err: Error) => {
        throw err
      })
  }

  return (
    <>
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
          <AppleOutlined onClick={console.log} />
          <AppleOutlined onClick={console.log} />
          <AppleOutlined onClick={console.log} />
          <AppleOutlined onClick={console.log} />
          <AppleOutlined onClick={console.log} />
          <AppleOutlined onClick={console.log} />
        </div>
      </div>

      <ModelEntityList />
    </>
  )
}
