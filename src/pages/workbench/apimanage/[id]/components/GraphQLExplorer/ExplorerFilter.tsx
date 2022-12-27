import { type CheckboxOptionType, AutoComplete, Radio, Tooltip } from 'antd'
import { useCallback } from 'react'
import { useIntl } from 'react-intl'

import styles from './filter.module.less'
import { RefreshIcon } from './icons'

interface ExplorerFilterProps {
  filters: ReadonlyArray<CheckboxOptionType>
  selectedType?: string
  isLoading?: boolean
  dataSourceList: string[]
  selectedDataSource?: string
  onSeletedDataSource?: (v: string) => void
  setSelectedType?: (v: string | undefined) => void
  onRefresh?: () => void
}

const ExplorerFilter = ({
  isLoading,
  filters,
  dataSourceList,
  selectedType,
  selectedDataSource,
  onSeletedDataSource,
  setSelectedType,
  onRefresh
}: ExplorerFilterProps) => {
  const intl = useIntl()
  const _onRefresh = useCallback(() => {
    if (!isLoading) {
      onRefresh?.()
    }
  }, [isLoading, onRefresh])
  return (
    <div className={styles.container}>
      <div className="flex items-center">
        <AutoComplete
          className={styles.select}
          placeholder={intl.formatMessage({ defaultMessage: '筛选' })}
          options={dataSourceList.map(item => ({ label: item, value: item }))}
          value={selectedDataSource}
          onChange={onSeletedDataSource}
          allowClear
        />
        <Tooltip title={intl.formatMessage({ defaultMessage: '刷新' })}>
          <RefreshIcon className={`ml-3 ${isLoading ? 'animate-spin' : ''}`} onClick={_onRefresh} />
        </Tooltip>
      </div>
      <div className="flex h-9 pt-1 items-center justify-center">
        <Radio.Group
          className={styles.radio}
          value={selectedType}
          // @ts-ignore
          options={filters}
          onChange={e => setSelectedType?.(e.target.value as string)}
        />
      </div>
    </div>
  )
}

export default ExplorerFilter
