import type React from 'react'
import { useEffect, useState } from 'react'
import type { SWRResponse } from 'swr'

import RcTab from '@/components/rc-tab'
import type { AuthListType } from '@/interfaces/auth'
import type { Connector } from '@/interfaces/connector'
import type { BrandType, Experience as ExperienceType, OtherType } from '@/interfaces/experience'
import { getFetcher } from '@/lib/fetchers'
import { useFetchConnector } from '@/lib/service/connector'
import { useFetchExperience } from '@/lib/service/experience'

import Brand from './Brand'
import ExperiencePreview from './ExperiencePreview'
import ExperienceSetting from './ExperienceSetting'
import Other from './Other'

interface Props {
  handleTopToggleDesigner: (authType: AuthListType) => void
}

const tabs = [
  { title: '品牌', key: '0' },
  { title: '登录方式', key: '1' },
  { title: '其他', key: '2' }
]

const Experience: React.FC = () => {
  const experienceDataRes: SWRResponse<ExperienceType, Error> = useFetchExperience()
  const connectorsDataRes: SWRResponse<Connector[], Error> = useFetchConnector()
  const { data: experienceData } = experienceDataRes
  const { data: connectorsData } = connectorsDataRes
  // const { connectorDispatch } = useContext(ConnectorContext)
  const [tabActiveKey, setTabActiveKey] = useState('0')
  const [brandData, setBrandData] = useState<BrandType>()
  const [previewData, setPreviewData] = useState<BrandType>()
  const [otherData, setOtherData] = useState<OtherType>()
  const [refreshFlag, setRefreshFlag] = useState(false)

  useEffect(() => {
    // connectorDispatch({ type: 'fetchConnector', payload: connectorsData || [] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectorsData])

  useEffect(() => {
    void getFetcher('/auth/brand').then(x => {
      setBrandData({
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        darkMode: x.color.isDarkModeEnabled,
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        color: x.color.primaryColor,
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        logo: x.branding.logoUrl,
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        slogan: x.branding.slogan
      })
    })
  }, [refreshFlag])

  useEffect(() => {
    void getFetcher('/auth/otherConfig').then(x => {
      setOtherData({
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        enabled: x.enabled,
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        contractUrl: x.contentUrl
      })
    })
  }, [refreshFlag])

  return (
    <>
      <RcTab
        tabs={tabs}
        onTabClick={x => {
          setRefreshFlag(!refreshFlag)
          setTabActiveKey(x)
        }}
        activeKey={tabActiveKey}
      />

      <div className="flex">
        {tabActiveKey === '0' ? (
          <Brand data={brandData} onPreview={setPreviewData} />
        ) : tabActiveKey === '1' ? (
          <>
            {experienceData && (
              <ExperienceSetting data={experienceData} connectorsData={connectorsData} />
            )}
          </>
        ) : (
          <Other data={otherData} />
        )}

        <ExperiencePreview previewData={previewData} />
      </div>
    </>
  )
}

export default Experience
