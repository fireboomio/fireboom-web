import type { FilterState } from '@/components/PrismaTable/libs/types'

import DynamicTable from './components/DynamicTable'

interface Props {
  model: string
  // namespace: string
  initialFilters: FilterState[]
  updateInitialFilters: (newFilters: FilterState[]) => void
  redirectToEntityWithFilters: (entityName: string, filters: FilterState[]) => void
}

const PrismaTable = ({
  // namespace,
  model,
  initialFilters,
  updateInitialFilters,
  redirectToEntityWithFilters
}: Props) => (
  <DynamicTable
    model={model}
    // namespace={namespace}
    usage="dataPreview"
    initialFilters={initialFilters}
    updateInitialFilters={updateInitialFilters}
    redirectToEntityWithFilters={redirectToEntityWithFilters}
  />
)

export default PrismaTable
