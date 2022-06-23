import { AppleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { getSchema } from '@mrleebo/prisma-ast'
import { Select, Tooltip } from 'antd'
import axios from 'axios'
import useSWR from 'swr'
import { useImmer } from 'use-immer'

import type { Result, Entity, SchemaResp } from '@/interfaces'

import { EntitiesContext } from './model-context'
import styles from './model-pannel.module.scss'
import ModelEntityList from './subs/model-entity-list'

interface Props {
  schemaOpts: SchemaResp[]
}

const fetcher = (url: string) =>
  axios.get<Result<string>>(url).then((res) => {
    return res.data.result
  })

export default function ModelPannel({ schemaOpts }: Props) {
  const [entities, setEntities] = useImmer([
    { id: 1, name: 'users', isEditing: false },
    { id: 2, name: 'posts', isEditing: false },
    { id: 3, name: 'comments', isEditing: false },
  ] as Entity[])

  const { data, error } = useSWR<string, Error>('http://localhost:8080/schema.json', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const schema = getSchema(data)
  console.log(schema)

  const schOpts = schemaOpts.map((s) => ({
    label: (
      <>
        <AppleOutlined /> {s.name}
      </>
    ),
    value: s.id,
  }))

  function handleChange(value: string) {
    console.log(`selected ${value}`)
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
          <Select className={styles.select} onChange={handleChange} options={schOpts} />
          <Tooltip title="prompt text">
            <InfoCircleOutlined style={{ marginLeft: '4px', fontSize: '15px', display: 'none' }} />
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
