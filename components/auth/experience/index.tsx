import React, { useContext, useEffect, useState } from 'react'
import type { SWRResponse } from 'swr'

import RcTab from '@/components/rc-tab'
import { AuthListType } from '@/interfaces/auth'
import { Connector } from '@/interfaces/connector'
import { Experience as ExperienceType } from '@/interfaces/experience'
import { ConnectorContext } from '@/lib/context/auth-context'
import { useFetchConnector } from '@/lib/service/connector'
import { useFetchExperience } from '@/lib/service/experience'

import Brand from './Brand'
import ExperiencePreview from './ExperiencePreview'
import ExperienceSetting from './ExperienceSetting'

interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
}

const tabs = [
  { title: '品牌', key: '0' },
  { title: '登录方式', key: '1' },
  { title: '其他', key: '2' },
]

const Experience: React.FC<Props> = ({ handleTopToggleDesigner }) => {
  const experienceDataRes: SWRResponse<ExperienceType, Error> = useFetchExperience()
  const connectorsDataRes: SWRResponse<Connector[], Error> = useFetchConnector()
  const { data: experienceData } = experienceDataRes
  const { data: connectorsData } = connectorsDataRes
  const { connectorDispatch } = useContext(ConnectorContext)
  const [tabActiveKey, setTabActiveKey] = useState('1')

  useEffect(() => {
    connectorDispatch({ type: 'fetchConnector', payload: connectorsData || [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorsData])

  return (
    <>
      <RcTab tabs={tabs} onTabClick={setTabActiveKey} activeKey={tabActiveKey} />

      <div className="flex">
        {tabActiveKey === '0' ? (
          <Brand data={experienceData} />
        ) : tabActiveKey === '1' ? (
          <>
            {experienceData && (
              <ExperienceSetting
                handleTopToggleDesigner={handleTopToggleDesigner}
                data={experienceData}
                connectorsData={connectorsData}
              />
            )}
          </>
        ) : (
          <></>
        )}

        <ExperiencePreview />
      </div>
    </>
  )
}

export default Experience
