import { Tabs } from 'antd'
import type { ConstDirectiveNode } from 'graphql'
import { Kind } from 'graphql'

import CustomLabel from './CustomLabel'
import DirectiveDescription from './DirectiveDescription'
import styles from './index.module.less'

interface ArgumentDirectivePopupProps {
  initialValue?: string
  onInject?: (name: string, val: ConstDirectiveNode) => void
}

const ArgumentDirectivePopup = ({ initialValue, onInject }: ArgumentDirectivePopupProps) => {
  return (
    <div className="bg-white rounded flex shadow">
      <Tabs
        className={styles.tabs}
        tabPosition="left"
        items={[
          {
            label: (
              <CustomLabel
                label="@fromClaim"
                onInject={() =>
                  onInject?.('fromClaim', {
                    kind: Kind.DIRECTIVE,
                    name: { kind: Kind.NAME, value: 'fromClaim' },
                    arguments: [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: 'name' },
                        value: { kind: Kind.ENUM, value: 'REPLACE_ME' }
                      }
                    ]
                  })
                }
              />
            ),
            key: 'fromClaim',
            children: (
              <DirectiveDescription
                name="@fromClaim"
                title="从用户信息中提取参数作为输入值"
                code={`query myQuery ($userId: String! @fromClaim(name: USERID)
  $name: String! @fromClaim(name: NAME)
  $email: String! @fromClaim(name: EMAIL)
) {}`}
              />
            )
          },
          {
            label: (
              <CustomLabel
                label="@jsonSchema"
                onInject={() =>
                  onInject?.('jsonSchema', {
                    kind: Kind.DIRECTIVE,
                    name: { kind: Kind.NAME, value: 'jsonSchema' },
                    arguments: [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: 'pattern' },
                        value: { kind: Kind.ENUM, value: '"REPLACE_ME"' }
                      }
                    ]
                  })
                }
              />
            ),
            key: 'jsonSchema',
            children: (
              <DirectiveDescription
                name="@jsonSchema"
                title="入参校验，用于入参校验"
                code={`query myQuery ($message: String!
  @jsonSchema(
    title: "Message"
    description: "Describe the message"
    pattern: "^[a-zA-Z 0-9]+$"
    commonPattern: EMAIL
    commonPattern: DOMAIN
    minLength: 3
    maxLength: 5
    minimum: 1
    maximum: 1
    exclusiveMaximum: 2
    exclusiveMinimum: 2
    maxItems: 1
    minItems: 1
    multipleOf: 1
    uniqueItems: true
  )
) {}`}
              />
            )
          },
          {
            label: (
              <CustomLabel
                label="@hooksVariable"
                // onInject={() => onInject?.('@hooksVariable')}
                onInject={() =>
                  onInject?.('hooksVariable', {
                    kind: Kind.DIRECTIVE,
                    name: { kind: Kind.NAME, value: 'hooksVariable' }
                  })
                }
              />
            ),
            key: 'hooksVariable',
            children: (
              <DirectiveDescription
                name="@hooksVariable"
                title="hooks 函数参数，仅用于自定义 hooks 中"
                code={`query myQuery ($filter: String! @hooksVariable) {}`}
              />
            )
          },
          {
            label: (
              <CustomLabel
                label="@injectGeneratedUUID"
                onInject={() =>
                  onInject?.('injectGeneratedUUID', {
                    kind: Kind.DIRECTIVE,
                    name: { kind: Kind.NAME, value: 'injectGeneratedUUID' }
                  })
                }
              />
            ),
            key: 'injectGeneratedUUID',
            children: (
              <DirectiveDescription
                name="@injectGeneratedUUID"
                title="自动注入 UUID，用户无需传参"
                code={`query myQuery ($id: String! @injectGeneratedUUID) {}`}
              />
            )
          },
          {
            label: (
              <CustomLabel
                label="@injectCurrentDatetime"
                onInject={() =>
                  onInject?.('injectCurrentDateTime', {
                    kind: Kind.DIRECTIVE,
                    name: { kind: Kind.NAME, value: 'injectCurrentDateTime' },
                    arguments: [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: 'format' },
                        value: { kind: Kind.ENUM, value: 'UnixDate' }
                      }
                    ]
                  })
                }
              />
            ),
            key: 'injectCurrentDatetime',
            children: (
              <DirectiveDescription
                name="@injectCurrentDatetime"
                title="自动注入当前时间，用户无需传参"
                code={`query myQuery ($updatedAt: DateTime! @injectCurrentDateTime(format: UnixDate)) {}`}
              />
            )
          },
          {
            label: (
              <CustomLabel
                label="@injectEnvironmentVariable"
                onInject={() =>
                  onInject?.('injectEnvironmentVariable', {
                    kind: Kind.DIRECTIVE,
                    name: { kind: Kind.NAME, value: 'injectEnvironmentVariable' },
                    arguments: [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: 'name' },
                        value: { kind: Kind.ENUM, value: '"REPLACE_ME"' }
                      }
                    ]
                  })
                }
              />
            ),
            key: 'injectEnvironmentVariable',
            children: (
              <DirectiveDescription
                name="@injectEnvironmentVariable"
                title="自动注入环境变量的值，用户无需传参"
                code={`query myQuery ($applicationID: String! @injectEnvironmentVariable(name: "AUTH_APP_ID")) {}`}
              />
            )
          },
          {
            label: (
              <CustomLabel
                label="@internal"
                onInject={() =>
                  onInject?.('internal', {
                    kind: Kind.DIRECTIVE,
                    name: { kind: Kind.NAME, value: 'internal' }
                  })
                }
              />
            ),
            key: 'internal',
            children: (
              <DirectiveDescription
                name="@internal"
                title="内部变量，标记某个字段为内部变量，方便后续查询语句中使用"
                code={`query myQuery ($code: ID!, $capitalAlias: String! @internal) {
  country: countries_country(code: $code) {
    code
    name
    capital @export(as: "capitalAlias")
    weather: _join {
      weather_getCityByName(name: $capitalAlias) {
        weather {
          temperature {
            actual
          }
        }
      }
    }
  }
}`}
              />
            )
          }
        ]}
      />
    </div>
  )
}

export default ArgumentDirectivePopup
