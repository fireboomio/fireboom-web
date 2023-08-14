import { useNavigate } from 'react-router-dom'
import useSWRImmutable from 'swr/immutable'

import { fetchDBSources } from '@/lib/clients/fireBoomAPIOperator'
import { DATABASE_SOURCE } from '@/lib/constants/fireBoomConstants'

import Modeling from './[name]'

const ModelingWrapper = () => {
  const navigate = useNavigate()
  const { data } = useSWRImmutable(DATABASE_SOURCE, fetchDBSources, {
    revalidateOnMount: true
  })
  const name = data?.[0]?.name
  if (name) {
    navigate(`/workbench/modeling/${name}`)
    return null
  } else {
    return <Modeling />
  }
}

export default ModelingWrapper
