import { FormOutlined } from '@ant-design/icons'
import { Button, Select } from 'antd'
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import type { DBSourceResp } from '@/interfaces/modeling'
import { DATABASE_SOURCE, MANAGE_DATASOURCE_URL } from '@/lib/constants/fireBoomConstants'
import useDBSource from '@/lib/hooks/useDBSource'

import refreshIcon from '../../assets/refresh.svg'
import styles from './pannel.module.less'

interface Props {
  sourceOptions: DBSourceResp[]
  onChangeSource: (value: number) => void
}

const DBSourceSelect = ({ sourceOptions, onChangeSource }: Props) => {
  const intl = useIntl()
  const { mutate } = useSWRConfig()
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
        value={paramId && paramId !== '0' ? Number(paramId) : ''}
        options={sourceOptions.map(x => {
          let svg = '/assets/icon/db-other.svg'
          switch (x.sourceType) {
            case 1:
              svg =
                {
                  mysql: '/assets/icon/mysql.svg',
                  pgsql: '/assets/icon/pg.svg',
                  graphql: '/assets/icon/graphql.svg',
                  mongodb: '/assets/icon/mongodb.svg',
                  rest: '/assets/icon/rest.svg',
                  sqlite: '/assets/icon/sqlite.svg'
                }[String(x.config.dbType).toLowerCase()] || svg
              break
            case 2:
              svg = '/assets/icon/rest.svg'
              break
            case 3:
              svg = '/assets/icon/graphql.svg'
              break
          }
          return {
            label: (
              <div className="flex items-center">
                <img className="mr-1 w-3 h-3" alt={x.name} src={svg} />
                {x.name}
              </div>
            ),
            value: x.id
          }
        })}
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
                {intl.formatMessage({ defaultMessage: '管理' })}
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
          void mutate(DATABASE_SOURCE)
          onChangeSource(id)
        }}
      >
        <img alt="刷新" src={refreshIcon} className="w-4 h-4" />
      </div>
    </div>
  )
}

export default DBSourceSelect
