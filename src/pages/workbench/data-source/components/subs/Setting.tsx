/* eslint-disable react/prop-types */
import { PlusCircleFilled } from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import { Button, Select, Switch } from 'antd'
import type { InputObjectTypeDefinitionNode, ObjectTypeDefinitionNode } from 'graphql'
import { parse } from 'graphql'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useImmer } from 'use-immer'

import IconFont from '@/components/Iconfont'
import type { DatasourceResp, DMFResp, ReplaceJSON } from '@/interfaces/datasource'
import requests from '@/lib/fetchers'

import styles from './Setting.module.less'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

interface OptionT {
  label: string
  value: string
}

interface DataType {
  id: string
  table: string
  field: string
  resType: string
  inputType: string
  isOpen: boolean
}

interface Model {
  name: string
  fields: Array<{ name: string; title: string }>
}

interface Props {
  initSchema: string
  replaceJSON: ReplaceJSON[]
  content: DatasourceResp
}

const Setting: React.FC<Props> = ({ replaceJSON, initSchema, content }) => {
  const { id: currDBId } = useParams()
  const [data, setData] = useImmer<DataType[]>([])
  const [model, setModel] = useState<Model[]>([])
  const [tableOpts, setTableOpts] = useState<OptionT[]>([])
  const [inputOpts, setInputOpts] = useState<OptionT[]>([])
  const [outOpts, setOutOpts] = useState<OptionT[]>([])
  const [schemaExtension, setSchemaExtension] = useState(initSchema)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  useEffect(() => {
    if (!replaceJSON) return

    setData(
      replaceJSON.map((x, idx) => ({
        id: idx.toString(),
        table: x.table,
        field: x.field,
        resType: x.resType,
        inputType: x.inputType,
        isOpen: x?.isOpen || false
      }))
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaceJSON])

  useEffect(() => {
    if (!schemaExtension) return

    try {
      const ops = parse(schemaExtension, { noLocation: true }).definitions
      const inputOpts = ops
        .filter(op => op.kind === 'InputObjectTypeDefinition')
        .map(x => ({
          label: (x as InputObjectTypeDefinitionNode).name.value,
          value: (x as InputObjectTypeDefinitionNode).name.value
        }))
      setInputOpts(inputOpts)

      const outOpts = ops
        .filter(op => op.kind === 'ObjectTypeDefinition')
        .map(x => ({
          label: (x as ObjectTypeDefinitionNode).name.value,
          value: (x as ObjectTypeDefinitionNode).name.value
        }))
      setOutOpts(outOpts)
    } catch (error) {
      return
    }
  }, [schemaExtension])

  useEffect(() => {
    void requests
      .get<unknown, DMFResp>(`/prisma/dmf/${currDBId ?? ''}`, { timeout: 15e3 })
      .then(x => {
        const model = (x.models || []).map(m => ({
          name: m.name,
          fields: m.fields.map(f => ({ name: f.name, title: f.title }))
        }))
        setModel(model)
        return model
      })
      .then(x => setTableOpts(x.map(m => ({ label: m.name, value: m.name }))))
  }, [currDBId])

  function makeField(x: DataType) {
    const fields = model.find(m => m.name === x.table)?.fields
    return fields?.map(x => ({ label: x.name, value: x.name }))
  }

  function handleTableChange(val: string, item: DataType) {
    setData(draft => {
      const one = draft.find(x => x.id === item.id)
      one!.table = val
    })
  }

  function handleFieldChange(val: string, item: DataType) {
    setData(draft => {
      const one = draft.find(x => x.id === item.id)
      one!.field = val
    })
  }

  function handleInputChange(val: string, item: DataType) {
    setData(draft => {
      const one = draft.find(x => x.id === item.id)
      one!.inputType = val
    })
  }

  function handleOutChange(val: string, item: DataType) {
    setData(draft => {
      const one = draft.find(x => x.id === item.id)
      one!.resType = val
    })
  }

  function handleOpenChange(val: boolean, item: DataType) {
    setData(draft => {
      const one = draft.find(x => x.id === item.id)
      one!.isOpen = val
    })
  }

  function add() {
    setData(draft =>
      draft.concat({
        id: Date.now().toString(),
        table: '',
        field: '',
        resType: '',
        inputType: '',
        isOpen: true
      })
    )
  }

  function save() {
    const payload = {
      ...content,
      config: {
        ...content.config,
        replaceJSONTypeFieldConfiguration: data,
        schemaExtension: schemaExtension
      }
    }
    void requests.put('/dataSource', payload)
  }

  function handleDelete(item: DataType) {
    setData(draft => draft.filter(x => x.id !== item.id))
  }

  return (
    <div className="flex gap-6 h-[calc(100vh_-_190px)]">
      <div className="w-2/5">
        <div className={`${styles['head']}`}>
          <span>自定义类型</span>
        </div>
        <Editor
          language="graphql"
          value={schemaExtension}
          onChange={x => setSchemaExtension(x ?? '')}
          // className="py-3"
        />
      </div>

      <div className="w-3/5">
        <div className={`${styles['head']} !pr-3 flex items-center justify-between`}>
          <span>字段类型映射</span>

          <Button
            size="small"
            className={`${styles['btn']} flex items-center justify-evenly cursor-pointer`}
            onClick={save}
          >
            <img
              alt="baocun"
              src="assets/iconfont/baocun.svg"
              style={{ height: '1em', width: '1em', color: '#5F6269' }}
            />
            <span className="text-sm">保存</span>
          </Button>
        </div>

        <div className="relative py-3 px-3.5 bg-[#FFFFFF]">
          <PlusCircleFilled
            onClick={add}
            className="absolute right-2 top-1 z-2 cursor-pointer !text-[#649FFF]"
          />
          <table className="w-full bg-[#FFFFFFFF] disable-common-select">
            <thead className="leading-38px bg-[#5F62690D]">
              <tr className="">
                <th>表</th>
                <th>字段</th>
                <th>响应类型</th>
                <th>输入类型</th>
                <th>是否开启</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((x, idx) => (
                <tr
                  key={idx}
                  onMouseEnter={() => setHoverIdx(idx)}
                  onMouseLeave={() => setHoverIdx(null)}
                  className={`${hoverIdx === idx ? 'bg-[#F8F8F9FF]' : ''} h-45px`}
                >
                  <td>
                    <Select
                      className="disable-common-select"
                      defaultValue={x.table}
                      style={{ width: 120 }}
                      bordered={false}
                      options={tableOpts}
                      value={x.table}
                      onChange={val => handleTableChange(val, x)}
                    />
                  </td>
                  <td>
                    <Select
                      className="disable-common-select"
                      defaultValue=""
                      style={{ width: 120 }}
                      bordered={false}
                      options={makeField(x)}
                      value={x.field}
                      onChange={val => handleFieldChange(val, x)}
                    />
                  </td>
                  <td>
                    <Select
                      className="disable-common-select"
                      defaultValue=""
                      style={{ width: 120 }}
                      bordered={false}
                      options={outOpts}
                      value={x.resType}
                      onChange={val => handleOutChange(val, x)}
                    />
                  </td>
                  <td>
                    <Select
                      className="disable-common-select"
                      defaultValue=""
                      style={{ width: 120 }}
                      bordered={false}
                      options={inputOpts}
                      value={x.inputType}
                      onChange={val => handleInputChange(val, x)}
                    />
                  </td>
                  <td>
                    <Switch
                      className="w-8 h-2"
                      checked={x.isOpen}
                      onChange={val => handleOpenChange(val, x)}
                    />
                  </td>
                  <td>
                    <img
                      alt="shanchu"
                      src="assets/iconfont/shanchu.svg"
                      style={{ height: '1em', width: '1em' }}
                      onClick={() => handleDelete(x)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Setting
