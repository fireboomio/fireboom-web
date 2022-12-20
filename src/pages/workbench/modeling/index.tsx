import useSWRImmutable from 'swr/immutable'
import { fetchDBSources } from '@/lib/clients/fireBoomAPIOperator'
import { DATABASE_SOURCE } from '@/lib/constants/fireBoomConstants'

import { useLocation, useNavigate } from 'react-router-dom'
const Modeling = () => {
  const navigate = useNavigate()
  const { data } = useSWRImmutable(DATABASE_SOURCE, fetchDBSources, {
    revalidateOnMount: true
  })
  navigate('/workbench/modeling/' + data?.[0].id ?? 0)
  return null
}

export default Modeling
