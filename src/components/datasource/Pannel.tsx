import { PlusOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import { useContext, useState } from 'react'

import type { DatasourceResp } from '@/interfaces/datasource'
import {
  DatasourceContext,
  DatasourceDispatchContext,
  DatasourceToggleContext
} from '@/lib/context/datasource-context'

import styles from './Pannel.module.less'
import DatasourceItem from './subs/PannelItem'

interface Props {
  onClickItem: (dsItem: DatasourceResp) => void
}
interface ListProps {
  onClickItem: (dsItem: DatasourceResp) => void
  // datasourceType: number
}
const { Panel } = Collapse

function DatasourceList({ onClickItem }: ListProps) {
  const datasource = useContext(DatasourceContext)

  return (
    <>
      {datasource
        // .filter(item => item.sourceType == datasourceType)
        .map(item => {
          if (item.name != '')
            return <DatasourceItem key={item.id} datasourceItem={item} onClickItem={onClickItem} />
        })}
    </>
  )
}

export default function DatasourcePannel({ onClickItem }: Props) {
  const dispatch = useContext(DatasourceDispatchContext)
  const datasource = useContext(DatasourceContext)
  const { handleToggleDesigner } = useContext(DatasourceToggleContext)
  const [isHovering, setIsHovering] = useState(false)

  function _addTable(datasourceType: number) {
    const data = {
      id: -(datasource.length + 1),
      name: '',
      config: {},
      sourceType: datasourceType,
      switch: 0
    } as DatasourceResp
    dispatch({ type: 'added', data: data })
    onClickItem(data)
  }

  // @ts-ignore
  function handleClick(e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    e.stopPropagation()
    handleToggleDesigner('db-select')
  }

  const header = (
    <div
      className="flex justify-between items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="w-52 flex justify-between py-2">外部数据源</div>

      <div className={isHovering ? 'block' : 'hidden'}>
        <PlusOutlined onClick={handleClick} />
      </div>
    </div>
  )

  return (
    <>
      <div className={styles['datasource-collapse']}>
        <Collapse ghost bordered>
          <Panel header={header} key={1}>
            <DatasourceList onClickItem={onClickItem} />
          </Panel>
        </Collapse>
      </div>
    </>
  )
}
