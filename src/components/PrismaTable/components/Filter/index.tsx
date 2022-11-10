import type { Enums, SchemaModel } from '@paljs/types'
import ButtonGroup from 'antd/lib/button/button-group'
import { useEffect } from 'react'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import { filterOperators } from '@/components/PrismaTable/components/Filter/FilterHelper'
import FilterRow from '@/components/PrismaTable/components/Filter/FilterRow'
import type { FilterState } from '@/components/PrismaTable/libs/types'

import styles from './index.module.less'

interface Props {
  currentModelName: string
  models: SchemaModel[]
  enums: Enums[]
  originalFilters: FilterState[]
  updateOriginalFilters: (filters: FilterState[]) => void
  setFilterVisible: Updater<boolean>
}

const FilterContainer = ({
  models,
  enums,
  currentModelName,
  originalFilters,
  updateOriginalFilters,
  setFilterVisible
}: Props) => {
  const currentModel = models.find(m => m.id === currentModelName)
  const [filters, setFilters] = useImmer<FilterState[]>(originalFilters)

  useEffect(() => {
    setFilters(originalFilters)
  }, [originalFilters, setFilters])

  if (!currentModel) {
    return <div>当前实体不存在</div>
  }

  const addNewFilter = () => {
    setFilters(f => {
      const newFilter: FilterState = {
        operator: Object.keys(filterOperators)[0],
        relationField: undefined,
        value: undefined,
        field: currentModel.fields[0]
      }
      f.push(newFilter)
    })
  }

  const deleteFilter = (index: number) => {
    setFilters(fs => {
      fs.splice(index, 1)
    })
  }

  const handleCancel = () => {
    setFilterVisible(false)
    setFilters([...originalFilters])
  }
  const handleSave = () => {
    setFilterVisible(false)
    updateOriginalFilters(filters.filter(f => f.value))
  }

  const handleFilterUpdate = (index: number) => (filter: FilterState) => {
    setFilters(f => {
      f[index] = filter
    })
  }

  return (
    <div className={`w-466px py-4px common-form ${styles.filterContainer}`}>
      {filters.map((filter, idx) => {
        return (
          <FilterRow
            key={idx}
            filter={filter}
            updateFilter={handleFilterUpdate(idx)}
            deleteFilter={() => deleteFilter(idx)}
            currentModel={currentModel}
            models={models}
            enums={enums}
          />
        )
      })}
      <div className={styles.filterBtn} onClick={addNewFilter}>
        + 新增筛选条件
      </div>
      <ButtonGroup className="flex gap-2 w-full justify-end pr-24px mt-18px">
        <div className={styles.cancelBtn} onClick={handleCancel}>
          取消
        </div>
        <div className={styles.addBtn} onClick={handleSave}>
          保存
        </div>
      </ButtonGroup>
    </div>
  )
}

export default FilterContainer
