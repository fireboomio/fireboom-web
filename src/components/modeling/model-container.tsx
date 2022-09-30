import { AppleOutlined } from '@ant-design/icons'
import { Breadcrumb } from 'antd'
import { useContext, useMemo } from 'react'

import { Entity, Enum, Model } from '@/interfaces/modeling'
import { ModelingContext } from '@/lib/context'

import ModelDesignerEnum from './subs/model-designer-enum'
import ModelDesignerModel from './subs/model-designer-model'

interface Props {
  showType: 'data' | 'model' | 'enum'
  currEntityId: number | null
}

export default function ModelContainer({ showType, currEntityId }: Props) {
  const blocks = useContext(ModelingContext)

  const entity = useMemo(
    () => blocks.find((b) => b.id === currEntityId) as Entity,
    [blocks, currEntityId]
  )

  const handleIconClick = () => {
    console.log('aaa')
  }

  console.log(showType, entity)

  return (
    <div className="p-6">
      <div className="flex justify-start items-center mb-6">
        <span className="flex-grow text-lg font-medium">
          {showType === 'data' ? '浏览' : '编辑'} / {entity?.name}
        </span>
        <AppleOutlined className="text-base mr-3" onClick={handleIconClick} />
        <AppleOutlined className="text-base mr-3" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
      </div>

      <div className="flex justify-start items-center my-6">
        <Breadcrumb className="text-base flex-grow" separator=" ">
          <Breadcrumb.Item>{entity?.name}</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[#118AD1]">{showType}</Breadcrumb.Item>
        </Breadcrumb>
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base" onClick={handleIconClick} />
      </div>

      {showType === 'model' ? (
        <ModelDesignerModel model={entity as Model} />
      ) : showType === 'enum' ? (
        <ModelDesignerEnum enumEntity={entity as Enum} />
      ) : showType === 'data' ? (
        <h1>{entity?.name}</h1>
      ) : (
        ''
      )}
    </div>
  )
}
