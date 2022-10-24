import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import requests from '@/lib/fetchers'

import { useAPIManager } from '../../hooks'
import FlowChart from './FlowChart'

const APIFlowChart = ({ id }: { id: string }) => {
  const params = useParams()
  const { apiDesc } = useAPIManager()

  useEffect(() => {
    requests.get(`/operateApi/hooks/${id}`).then(resp => {
      console.log(resp)
    })
  }, [id])

  return <FlowChart />
}

export default APIFlowChart
