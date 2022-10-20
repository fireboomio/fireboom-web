import { useContext } from 'react'

import type { FilterState } from '@/components/PrismaTable/libs/types'
import { updatePreviewFiltersAction } from '@/lib/actions/PrismaSchemaActions'
import { PrismaSchemaContext } from '@/lib/context/prismaSchemaContext'

type PreviewFiltersContext = {
  previewFilters: FilterState[]
  updatePreviewFilters: (filters: FilterState[]) => void
}

const usePreviewFilters = (): PreviewFiltersContext => {
  const {
    state: { previewFilters },
    dispatch
  } = useContext(PrismaSchemaContext)
  const updatePreviewFilters = (newFilters: FilterState[]) => {
    return dispatch(updatePreviewFiltersAction(newFilters))
  }
  return {
    previewFilters,
    updatePreviewFilters
  }
}

export default usePreviewFilters
