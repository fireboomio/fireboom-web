import {
  FormOutlined,
  DeploymentUnitOutlined,
  SecurityScanOutlined,
  GlobalOutlined,
  ControlOutlined,
  FundViewOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'

import type { SettingType } from '@/interfaces/setting'

import SettingItem from './setting-item'
interface Props {
  handleToggleDesigner: (settingType: SettingType) => void
}

const settingTypeList: SettingType[] = [
  {
    name: '外观',
    type: 'colorTheme',
    icon: <FormOutlined />,
  },
  {
    name: '系统',
    type: 'system',
    icon: <DeploymentUnitOutlined />,
  },
  {
    name: '安全',
    type: 'secure',
    icon: <SecurityScanOutlined />,
  },
  {
    name: '跨域',
    type: 'cors',
    icon: <GlobalOutlined />,
  },
  {
    name: 'API Token',
    type: 'API Token',
    icon: <ControlOutlined />,
  },
  {
    name: '环境变量',
    type: 'path',
    icon: <FundViewOutlined />,
  },
  {
    name: '版本',
    type: 'version',
    icon: <InfoCircleOutlined />,
  },
]

export default function SettingList({ handleToggleDesigner }: Props) {
  return (
    <>
      <div className="mt-3">
        {settingTypeList.map((settingType) => (
          <SettingItem
            key={settingType.type}
            handleToggleDesigner={handleToggleDesigner}
            settingType={settingType}
          />
        ))}
      </div>
    </>
  )
}
