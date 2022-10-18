import { Tabs } from 'antd'

import DirectiveDescription from './DirectiveDescription'
import styles from './index.module.less'

interface ArgumentDirectivePopupProps {
  initialValue?: string
}

const ArgumentDirectivePopup = ({ initialValue }: ArgumentDirectivePopupProps) => {
  return (
    <div className="bg-white rounded flex shadow">
      <Tabs
        className={styles.tabs}
        tabPosition="left"
        items={[
          {
            label: '@fromClaim',
            key: 'fromClaim',
            children: (
              <DirectiveDescription
                name="@fromClaim"
                title="从用户信息中提取参数作为输入值"
                code={`$userId: String! @fromClaim(name: USERID)
$name: String! @fromClaim(name: NAME)
$email: String! @fromClaim(name: EMAIL)`}
              />
            )
          },
          {
            label: '@jsonSchema',
            key: 'jsonSchema',
            children: (
              <DirectiveDescription
                name="@jsonSchema"
                title="入参校验，用于入参校验"
                code={`$message: String!
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
)`}
              />
            )
          },
          {
            label: '@hooksVariable',
            key: 'hooksVariable',
            children: (
              <DirectiveDescription
                name="@hooksVariable"
                title="hooks 函数参数，仅用于自定义 hooks 中"
                code={`$filter: String! @hooksVariable`}
              />
            )
          },
          {
            label: '@injectGeneratedUUID',
            key: 'injectGeneratedUUID',
            children: (
              <DirectiveDescription
                name="@injectGeneratedUUID"
                title="自动注入 UUID，用户无需传参"
                code={`$id: String! @injectGeneratedUUID`}
              />
            )
          },
          {
            label: '@injectCurrentDatetime',
            key: 'injectCurrentDatetime',
            children: (
              <DirectiveDescription
                name="@injectCurrentDatetime"
                title="自动注入当前时间，用户无需传参"
                code={`$updatedAt: DateTime! @injectCurrentDateTime(format: UnixDate)`}
              />
            )
          },
          {
            label: '@injectEnvironmentVariable',
            key: 'injectEnvironmentVariable',
            children: (
              <DirectiveDescription
                name="@injectEnvironmentVariable"
                title="自动注入环境变量的值，用户无需传参"
                code={`$applicationID: String! @injectEnvironmentVariable(name: "AUTH_APP_ID")`}
              />
            )
          },
          {
            label: '@internal',
            key: 'internal',
            children: (
              <DirectiveDescription
                name="@internal"
                title="内部变量，标记某个字段为内部变量，方便后续查询语句中使用"
                code={`query ($code: ID!, $capitalAlias: String! @internal) {
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
