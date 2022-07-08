import { AppleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { getSchema } from '@mrleebo/prisma-ast'
import { Select, Tooltip } from 'antd'
import { useContext, useEffect } from 'react'

import type { DBSourceResp, Entity, SchemaResp } from '@/interfaces/modeling'
import { ModelingDispatchContext } from '@/lib/context'
import { getFetcher } from '@/lib/fetchers'

import styles from './model-pannel.module.scss'
import ModelEntityList from './subs/model-entity-list'

interface Props {
  sourceOptions: DBSourceResp[]
  onChangeSource: (value: string) => void
  onClickEntity: (entity: Entity) => void
  onToggleDesigner: (entity: Entity) => void
}

export default function ModelPannel({
  sourceOptions,
  onChangeSource,
  onClickEntity,
  onToggleDesigner,
}: Props) {
  const dispatch = useContext(ModelingDispatchContext)

  useEffect(() => {
    getFetcher<SchemaResp>(`/api/v1/schemas/${sourceOptions[0].id}`)
      .then((res) =>
        dispatch({
          type: 'fetched',
          data: getSchema(res.body).list.map((item, idx) => ({ ...item, id: idx })),
        })
      )
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

  return (
    <>
      <div className={styles.pannel}>
        <div className={styles.title}>数据建模</div>

        <div className={styles['select-contain']}>
          <Select
            className={styles.select}
            onChange={onChangeSource}
            defaultValue={schOpts[0].value}
            optionLabelProp="label"
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

      <ModelEntityList onClickEntity={onClickEntity} onToggleDesigner={onToggleDesigner} />
    </>
  )
}
