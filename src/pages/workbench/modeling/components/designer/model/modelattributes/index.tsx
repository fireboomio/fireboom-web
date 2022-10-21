import { DeleteOutlined } from '@ant-design/icons'
import type { ModelAttribute } from '@mrleebo/prisma-ast'

import type { Model } from '@/interfaces/modeling'

import ModelAttributeCell from './model-attribute-cell'

interface Props {
  modelAttributes: ModelAttribute[]
  currentModel: Model
  handleDeleteAttribute: (originalAttribute: ModelAttribute) => void
  deleteEmptyAttributes: () => void
  handleUpdateAttribute: (originalAttribute: ModelAttribute, newAttribute: ModelAttribute) => void
}

const ModelAttributes = ({
  deleteEmptyAttributes,
  modelAttributes,
  handleUpdateAttribute,
  handleDeleteAttribute,
  currentModel
}: Props) => (
  <>
    {modelAttributes.map((attr, idx) => (
      <div key={idx} className="flex flex-row">
        <ModelAttributeCell
          modelAttribute={attr}
          currentModel={currentModel}
          deleteEmptyAttributes={deleteEmptyAttributes}
          handleUpdateAttribute={(newAttribute: ModelAttribute) =>
            handleUpdateAttribute(attr, newAttribute)
          }
        />
        <DeleteOutlined
          className="ml-auto ant-space-align-center"
          onClick={() => handleDeleteAttribute(attr)}
        />
      </div>
    ))}
  </>
)

export default ModelAttributes
