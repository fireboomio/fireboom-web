import { useEffect } from 'react'

import type { SettingType } from '@/interfaces/setting'

import styles from './setting-pannel.module.scss'
import FileStorageList from './subs/setting-list'

interface Props {
  handleToggleDesigner: (settingType: SettingType) => void
}
const initSettingPage: SettingType =  {
  name: '外观',
  type: 'colorTheme',
}
export default function SettingPannel({ handleToggleDesigner }: Props) {
  useEffect(() => {
    handleToggleDesigner(initSettingPage)
  },[])

  return (
    <>
      <div className="border-gray border-b ">
        <div className={`${styles.title} text-lg font-bold mt-6 ml-4 mb-8`}>设置</div>
      </div>

      <FileStorageList handleToggleDesigner={handleToggleDesigner} />
    </>
  )
}