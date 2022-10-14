import { type CheckboxOptionType, Radio, Select } from 'antd'
import { useState } from 'react'

import { FilterIcon } from '../icons'
import styles from './filter.module.less'

interface ExplorerFilterProps {
  filters: ReadonlyArray<CheckboxOptionType>
  selected?: string
  setSelected?: (v: string | undefined) => void
}

const ExplorerFilter = ({ filters, selected, setSelected }: ExplorerFilterProps) => {
  const [opened, setOpened] = useState(false)

  return (
    <div className={`${styles.container} ${opened ? styles.opened : ''}`}>
      <div className="flex items-center overflow-x-hidden">
        <Select className={styles.select} options={[]} allowClear />
        <button onClick={() => setOpened(!opened)} className={styles.button}>
          筛选
          <FilterIcon className="ml-1" />
        </button>
      </div>
      {opened && (
        <div className="flex h-9 pt-1 right-0 bottom-0 left-0 z-2 absolute items-center justify-center">
          <Radio.Group
            className={styles.radio}
            value={selected}
            // @ts-ignore
            options={filters}
            onChange={e => setSelected?.(e.target.value as string)}
          />
        </div>
      )}
    </div>
  )
}

export default ExplorerFilter
