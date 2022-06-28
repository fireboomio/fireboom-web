import React from 'react'

import ModelDesignerBreadcrumb from './subs/model-designer-breadcrumb'
import ModelDesignerTitle from './subs/model-designer-title'

export default function ModelDesigner({ children }: React.PropsWithChildren) {
  return (
    <div className="p-6">
      <ModelDesignerTitle />
      <ModelDesignerBreadcrumb />
      {children}
    </div>
  )
}
