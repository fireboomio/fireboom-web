/* eslint-disable react-hooks/exhaustive-deps */
import { useContext } from 'react'

import { DatasourceToggleContext } from '@/lib/context/datasource-context'

import DatasourceContainer from '../components/Container'

export default function Datasource() {
  const { showType, content } = useContext(DatasourceToggleContext)
  return <DatasourceContainer showType={showType} content={content} />
}
