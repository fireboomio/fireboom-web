import { Tabs } from 'antd'
import type { GraphQLDirective } from 'graphql'
import { useState } from 'react'

import CustomLabel from './CustomLabel'
import DirectiveDescription from './DirectiveDescription'
import styles from './index.module.less'

interface ArgumentDirectivePopupProps {
  directives: ReadonlyArray<GraphQLDirective>
  onInject?: (directive: GraphQLDirective) => void
}

const DirectivePopup = ({ directives, onInject }: ArgumentDirectivePopupProps) => {
  const [activeKey, setActiveKey] = useState('fromClaim')
  return (
    <div className="bg-white rounded flex shadow">
      <Tabs
        className={styles.tabs}
        tabPosition="left"
        activeKey={activeKey}
        onChange={setActiveKey}
        items={directives.map(directive => {
          const [desc, exampleCode] = directive.description?.split(/\n?\s*@example /) ?? ['', '']
          return {
            key: directive.name,
            label: (
              <CustomLabel
                onMouseEnter={() => setActiveKey(directive.name)}
                label={`@${directive.name}`}
                onInject={() => onInject?.(directive)}
              />
            ),
            children: (
              <DirectiveDescription
                name={`@${directive.name}`}
                title={desc}
                code={exampleCode ?? `@${directive.name}`}
              />
            )
          }
        })}
      />
    </div>
  )
}

export default DirectivePopup
