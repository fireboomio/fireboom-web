import { FormOutlined } from '@ant-design/icons'
import { Button, Select } from 'antd'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import type { DBSourceResp } from '@/interfaces/modeling'
import { MANAGE_DATASOURCE_URL } from '@/lib/constants/fireBoomConstants'
import useDBSource from '@/lib/hooks/useDBSource'

import refreshIcon from '../../assets/refresh.svg'
import styles from './pannel.module.less'

interface Props {
  sourceOptions: DBSourceResp[]
  onChangeSource: (value: number) => void
}

const DBSourceSelect = ({ sourceOptions, onChangeSource }: Props) => {
  const { id } = useDBSource()
  const navigate = useNavigate()

  // const { mutate } = useSWRConfig()

  const { id: paramId } = useParams()
  const handleManageSourceClick = () => {
    navigate(MANAGE_DATASOURCE_URL)
  }

  useEffect(() => {
    if (sourceOptions.length > 0 && !paramId) {
      navigate(`/workbench/modeling/${sourceOptions[0].id}`)
    }
  }, [sourceOptions, paramId])

  return (
    <div className={'common-form ' + styles['select-contain']}>
      <Select
        className={styles.select}
        onChange={v => {
          navigate(`/workbench/modeling/${v}`)
        }}
        optionLabelProp="label"
        value={paramId ? Number(paramId) : ''}
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
      <div
        className={styles.refreshBtn}
        onClick={() => {
          // mutate(DATABASE_SOURCE)
          onChangeSource(id)
        }}
      >
        <img alt="刷新" src={refreshIcon} className="w-4 h-4" />
      </div>
    </div>
  )
}

export default DBSourceSelect
