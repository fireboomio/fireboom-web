import { AppleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { getSchema } from '@mrleebo/prisma-ast'
import { Select, Tooltip } from 'antd'
import axios from 'axios'
import { useContext, useEffect } from 'react'

import type { Result, SchemaResp, DBSourceResp } from '@/interfaces'
import { ModelingContext } from '@/lib/context'

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
  const { blocks: _, setBlocks } = useContext(ModelingContext)

  useEffect(() => {
    fetcher(`/api/schemas/${sourceOptions[0].id}`)
      .then((res) => setBlocks(getSchema(res.body).list.map((item, idx) => ({ ...item, id: idx }))))
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
      .then((res) => setBlocks(getSchema(res.body).list.map((item, idx) => ({ ...item, id: idx }))))
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
            optionLabelProp="label"
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
