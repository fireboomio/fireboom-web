import type { Enums, SchemaModel } from '@paljs/types'
import { Button } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import { useEffect } from 'react'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import { filterOperators } from '@/components/PrismaTable/components/Filter/FilterHelper'
import FilterRow from '@/components/PrismaTable/components/Filter/FilterRow'
import type { FilterState } from '@/components/PrismaTable/libs/types'
import styles from '@/pages/workbench/modeling/components/pannel/pannel.module.less'

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
    <div className="w-lg py-12px px-8px">
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
      <Button className="w-468px mb-24px" type="dashed" onClick={addNewFilter}>
        + 新增筛选条件
      </Button>
      <ButtonGroup className="flex gap-4 w-full justify-end m-0 mt-8px">
        <Button onClick={handleCancel}>取消</Button>
        <Button className={styles['add-btn']} onClick={handleSave}>
          保存
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default FilterContainer
