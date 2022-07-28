import { useContext } from 'react'

import type { DatasourceResp } from '@/interfaces/datasource'
import { DatasourceContext } from '@/lib/context'

import DatasourceDBItem from './datasource-item'

interface Props {
  onClickItem: (dsItem: DatasourceResp) => void
  Datasourcetype: number
}

export default function DatasourceDBList({ onClickItem, Datasourcetype }: Props) {
  const datasource = useContext(DatasourceContext)

  return (
    <>
      <div>
        {datasource
          .filter((item) => item.source_type == Datasourcetype)
          .map((datasourceItem) => (
            <DatasourceDBItem
              key={datasourceItem.id}
              datasourceItem={datasourceItem}
              onClickItem={onClickItem}
              Datasourcetype={Datasourcetype}
            />
          ))}
      </div>
    </>
  )
}
