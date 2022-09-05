import React, { useContext, useEffect } from 'react'
import type { SWRResponse } from 'swr'

import { AuthListType } from '@/interfaces/auth'
import { Connector } from '@/interfaces/connector'
import { Experience as ExperienceType } from '@/interfaces/experience'
import { ConnectorContext } from '@/lib/context/auth-context'
import { useFetchConnector } from '@/lib/service/connector'
import { useFetchExperience } from '@/lib/service/experience'

import ExperiencePreview from './ExperiencePreview'
import ExperienceSetting from './ExperienceSetting'
interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
}
const Experience: React.FC<Props> = ({ handleTopToggleDesigner }) => {
  const experienceDataRes: SWRResponse<ExperienceType, Error> = useFetchExperience()
  const connectorsDataRes: SWRResponse<Connector[], Error> = useFetchConnector()
  const { data: experienceData } = experienceDataRes
  const { data: connectorsData } = connectorsDataRes
  const { connectorDispatch } = useContext(ConnectorContext)

  useEffect(() => {
    connectorDispatch({ type: 'fetchConnector', payload: connectorsData || [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorsData])
  return (
    <div className="flex">
      {experienceData && (
        <ExperienceSetting
          handleTopToggleDesigner={handleTopToggleDesigner}
          data={experienceData}
          connectorsData={connectorsData}
        />
      )}
      <ExperiencePreview />
    </div>
  )
}
export default Experience
