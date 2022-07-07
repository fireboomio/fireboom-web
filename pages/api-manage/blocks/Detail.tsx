import { AppleOutlined } from '@ant-design/icons'
import { Badge, Select, Table } from 'antd'
import RcTab from 'pages/components/rc-tab'
import { FC, useCallback, useEffect, useState } from 'react'
import { parse } from 'graphql'
import styles from './Detail.module.scss'

type DetailProps = {
  //
}

const tabs = [
  {
    title: '请求参数',
    key: '0',
  },
  {
    title: '注入参数',
    key: '1',
  },
]

const gqlSchemaStr = `
  type weather_Summary {
    title: String
    description: String
    icon: String
    _join: Query!
  }

  type weather_Weather {
    summary: weather_Summary
    temperature: weather_Temperature
    wind: weather_Wind
    clouds: weather_Clouds
    timestamp: Int
    _join: Query!
  }

  type weather_City {
    id: ID
    name: String
    country: String
    coord: weather_Coordinates
    weather: weather_Weather
    _join: Query!
  }

  type Query {
    weather_getCityByName(name: String!, country: String, config: weather_ConfigInput): weather_City
  }
`

const gqlQueryStr = `
  {
    getCityByName: weather_getCityByName(name: "Berlin") {
      id
      name
      weather {
        summary {
          title
          description
        }
      }
    }
  }
`

const columns = [
  {
    title: '字段名称',
    dataIndex: 'fieldName',
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
  },
  {
    title: '是否必须',
    dataIndex: 'required',
  },
]

const Detail: FC<DetailProps> = () => {
  const gqlSchemaDef = parse(gqlSchemaStr).definitions
  const gqlQueryDef = parse(gqlQueryStr).definitions
  const [dataSource, setDataSource] = useState([])

  const getSubFields = useCallback((parentField, selections, subFieldType) => {
    parentField.children = selections.map((i) => {
      const fieldName = i.name.value
      const fieldDef = gqlSchemaDef.find((i) => i.name.value === subFieldType)
      const curFieldType = fieldDef.fields.find((i) => i.name.value === fieldName).type.name.value
      const fieldType = curFieldType === 'String' || curFieldType === 'ID' ? curFieldType : 'object'
      const obj = {
        fieldName,
        fieldType,
        required: '否',
      }
      if (i.selectionSet) {
        getSubFields(obj, i.selectionSet.selections, curFieldType)
      }
      return obj
    })
  }, [])

  useEffect(() => {
    const queryName = gqlQueryDef[0].selectionSet.selections[0].name.value

    const topLevelQueryFiedls = gqlQueryDef[0].selectionSet.selections[0].selectionSet.selections
    const temp = topLevelQueryFiedls.map((i) => {
      const fieldName = i.name.value
      const rootType = gqlSchemaDef
        .find((i) => i.name.value === 'Query')
        .fields.find((i) => i.name.value === queryName).type.name.value
      const fieldDef = gqlSchemaDef.find((i) => i.name.value === rootType)
      const curFieldType = fieldDef.fields.find((i) => i.name.value === fieldName).type.name.value
      const fieldType = curFieldType === 'String' || curFieldType === 'ID' ? curFieldType : 'object'

      const obj = {
        fieldName,
        fieldType,
        required: '否',
      }
      if (i.selectionSet) {
        getSubFields(obj, i.selectionSet.selections, curFieldType)
      }
      return obj
    })
    setDataSource(temp)
    console.log(gqlSchemaDef, 'schema')
    console.log(gqlQueryDef, 'query')
  }, [])

  return (
    <>
      <div className="flex items-center">
        <div className={`flex items-center space-x-1 ${styles.label}`}>
          <span className="text-12px  text-[#5F6269] leading-17px">注册接口</span>
          <AppleOutlined />
        </div>
        <div className="flex items-center flex-1">
          <div className="flex items-center space-x-1">
            <span className="text-[#AFB0B4]">#23234456</span>
            <AppleOutlined />
            <AppleOutlined />
          </div>
          <div className="flex items-center space-x-1 ml-7">
            <Badge status="success" color="#1BDD8A" />
            <span className="text-[#000000D9] leading-20px">公开</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-[#5F6269] ${styles.label}`}>POST</span>
        <span className="flex-1 text-[#000000D9]">/user/reg</span>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-[#5F6269] ${styles.label}`}>用户角色</span>
        <div className="flex-1 flex items-center">
          <Select className="w-160px"></Select>
          <Select className="flex-1" allowClear></Select>
        </div>
      </div>
      <div className="mt-42px">
        <RcTab tabs={tabs} />
        <Table className="mt-6"></Table>
      </div>
      <div className="mt-42px">
        <div className="text-[#5F6269] leading-22px text-16px">返回响应</div>
        <div className="mt-3">
          <span className={styles.caption}>成功（201）</span>
          <div className={`${styles.content}`}>
            <div className="leading-20px text-[##5F6269]">
              <span>HTTP 状态码：201</span>
              <span className="ml-82px">内容格式：JSON</span>
            </div>
            <Table
              className="mt-6"
              columns={columns}
              dataSource={dataSource}
              rowKey="fieldName"
              pagination={false}
            ></Table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Detail
