import { FormOutlined } from '@ant-design/icons'
import { Button, Select } from 'antd'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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

  const handleManageSourceClick = () => {
    navigate(MANAGE_DATASOURCE_URL)
  }

  const inited = useRef<boolean>()

  useEffect(() => {
    if (!sourceOptions.length) {
      return
    }
    if (inited.current) {
      return
    }
    inited.current = true
    const search = location.hash.split('?')[1] || ''
    const defaultDB = Number(search.match(/(?:^|\?|&)id=([\d+])/)?.[1])
    onChangeSource(defaultDB)
  }, [sourceOptions])

  return (
    <div className={styles['select-contain']}>
      <Select
        className={styles.select}
        onChange={onChangeSource}
        optionLabelProp="label"
        value={id}
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
        {sourceOptions.map(({ id, name }) => (
          <Select.Option label={name} key={id} value={id}>
            {name}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}

export default DBSourceSelect
