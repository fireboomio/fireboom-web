import { AppleOutlined, MoreOutlined } from '@ant-design/icons'

import type { Entity } from '@/interfaces/model'

interface Props {
  entity: Entity
}

export default function TableItem({ entity }: Props) {
  function handleDropdown() {
    return 'bbb'
  }

  return (
    <div className="flex justify-start items-center py-10px" key={entity.name}>
      <MoreOutlined className="mx-2px"></MoreOutlined>
      <AppleOutlined className="ml-2px mr-2"></AppleOutlined>
      <div className="text-sm font-normal leading-16px">{entity.name}</div>
      <MoreOutlined className="m-auto mr-0 pr-2" onClick={handleDropdown}></MoreOutlined>
    </div>
  )
}
