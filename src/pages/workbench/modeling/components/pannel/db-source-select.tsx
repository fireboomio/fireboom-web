import { FormOutlined } from '@ant-design/icons'
import { Button, Select } from 'antd'
import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { DBSourceResp } from '@/interfaces/modeling'
import { MANAGE_DATASOURCE_URL } from '@/lib/constants/fireBoomConstants'
import useDBSource from '@/lib/hooks/useDBSource'

import styles from './pannel.module.less'

interface Props {
  sourceOptions: DBSourceResp[]
  onChangeSource: (value: number) => void
}

const DBSourceSelect = ({ sourceOptions, onChangeSource }: Props) => {
  const { id } = useDBSource()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const handleManageSourceClick = () => {
    navigate(MANAGE_DATASOURCE_URL)
  }

  const inited = useRef<boolean>()

  useEffect(() => {
    if (!sourceOptions.length) return
    if (inited.current) return

    inited.current = true
    if (params.get('id')) {
      onChangeSource(+(params.get('id') as string))
    } else {
      onChangeSource(sourceOptions[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, sourceOptions])

  return (
    <div className={styles['select-contain']}>
      <Select
        className={styles.select}
        onChange={v => {
          setParams({ id: `${v}` })
          onChangeSource(v)
        }}
        optionLabelProp="label"
        value={id === 0 ? undefined : id}
        options={sourceOptions.map(x => ({ label: x.name, value: x.id }))}
        dropdownRender={menu => (
          <div className="divide-y">
            {menu}
            <div className="text-center">
              <Button
                className="w-full"
                icon={<FormOutlined />}
                type="link"
                onClick={handleManageSourceClick}
              >
                管理
              </Button>
            </div>
          </div>
        )}
      >
        {/* {sourceOptions.map(({ id, name }) => (
          <Select.Option label={name} key={id} value={id}>
            {name}
          </Select.Option>
        ))} */}
      </Select>
    </div>
  )
}

export default DBSourceSelect
