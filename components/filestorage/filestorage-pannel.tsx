import type { FileStorageItem } from '@/interfaces/filestorage'

import styles from './filestorage-pannel.module.scss'
import FileStorageList from './subs/filestorage-list'

interface Props {
  onClickItem: (fsItem: FileStorageItem) => void
  handleToggleDesigner: (fileStorageItem: FileStorageItem) => void
}

export default function FileStoragePannel({ onClickItem, handleToggleDesigner }: Props) {
  return (
    <>
      <div className="border-gray border-b ">
        <div className={`${styles.title} text-lg font-bold mt-6 ml-4 mb-8`}>存储</div>
      </div>

      <FileStorageList onClickItem={onClickItem} handleToggleDesigner={handleToggleDesigner} />
    </>
  )
}
