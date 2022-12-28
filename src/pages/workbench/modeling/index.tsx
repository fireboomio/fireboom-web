import { useNavigate } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import { fetchDBSources } from '@/lib/clients/fireBoomAPIOperator'
import { DATABASE_SOURCE } from '@/lib/constants/fireBoomConstants'

import Modeling from './[id]'

const ModelingWrapper = () => {
  const navigate = useNavigate()
  const { data } = useSWRImmutable(DATABASE_SOURCE, fetchDBSources, {
    revalidateOnMount: true
  })
  const id = data?.[0]?.id
  if (id) {
    navigate('/workbench/modeling/' + id)
    return null
  } else {
    return <Modeling />
  }
}

export default ModelingWrapper
