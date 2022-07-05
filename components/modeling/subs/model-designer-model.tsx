/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Attribute, Field, Func, ModelAttribute } from '@mrleebo/prisma-ast'
import { Input, Modal } from 'antd'
import { useEffect, useCallback } from 'react'
import { useImmer } from 'use-immer'

import { Model } from '@/interfaces/modeling'
import { PRISMA_BASE_TYPES } from '@/lib/common'

import ModelDesignerColumnName from './designer-column-name'

interface Props {
  model: Model
}

interface PropoverProps {
  onClick: (value: string) => void
}

function TypeModalContent({ onClick }: PropoverProps) {
  const [types, setTypes] = useImmer(PRISMA_BASE_TYPES)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTypes(types.filter((type) => type.toLowerCase().includes(e.target.value)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Input autoFocus className="" size="small" placeholder="Basic usage" onChange={onChange} />
      {/* <div className="h-1px w-full border border-solid border-[#5F6269] border-opacity-10 my-2 mt-3" /> */}
      <ul>
        {types.map((type, idx) => (
          <li key={idx}>
            <div className="my-2 cursor-pointer hover:bg-[#F8F8F9]" onClick={() => onClick(type)}>
              {type}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function AttrDefault({ attr }: { attr: Attribute }) {
  if (!attr.args || attr.args.length === 0) return <>@{attr.name}()</>

  return (
    <>
      {attr.args.map((arg, idx) => {
        let value = <></>
        if (typeof arg.value === 'string')
          value = <span className="text-[#ECA160]">{arg.value}</span>
        else if (
          Object.prototype.hasOwnProperty.call(arg.value, 'type') &&
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          arg.value.type! === 'function'
        )
          value = <span className="text-[#ECA160]">{(arg.value as Func).name}()</span>

        return (
          <div key={idx} className="text-[#1B25C9]">
            @{attr.name}({value})
          </div>
        )
      })}
    </>
  )
}

function AttrRelation({ attr }: { attr: Attribute }) {
  if (!attr.args || attr.args.length === 0) return <>@{attr.name}()</>

  // @ts-ignore
  const fieldsObj = attr.args.find((a) => a.value.key === 'fields')
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const fields = (fieldsObj.value.value.args as string[]).join(', ')
  // @ts-ignore
  const refObj = attr.args.find((a) => a.value.key === 'references')
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const refs = (refObj.value.value.args as string[]).join(', ')
  return (
    <div className="text-[#1B25C9]">
      @relation(fields: [<span className="text-[#ECA160]">{fields}</span>], references: [
      <span className="text-[#ECA160]">{refs}</span>])
    </div>
  )
}

function TableAttr({ attributes }: { attributes: ModelAttribute[] }) {
  return (
    <>
      {attributes?.map((attr, idx) => {
        const args = attr.args.map((arg) => {
          // @ts-ignore
          switch (arg.value.key) {
            case 'fields':
              // @ts-ignore
              return { k: 'fields', v: arg.value.value.args.join(', ') }
            case 'name':
              // @ts-ignore
              return { k: 'name', v: arg.value.value }
            default:
              return
          }
        })

        const argv = args.map((arg, idx) => {
          if (idx !== 0)
            return (
              <span key={idx}>
                {/* @ts-ignore */}
                ,&nbsp;{arg.k}: {arg.k !== 'name' ? '[' : ''}
                {/* @ts-ignore */}
                <span className="text-[#ECA160]">{arg.v}</span>
                {/* @ts-ignore */}
                {arg.k !== 'name' ? ']' : ''}
              </span>
            )
          else
            return (
              <span key={idx}>
                {/* @ts-ignore */}
                {arg.k}: {arg.k !== 'name' ? '[' : ''}
                {/* @ts-ignore */}
                <span className="text-[#ECA160]">{arg.v}</span>
                {/* @ts-ignore */}
                {arg.k !== 'name' ? ']' : ''}
              </span>
            )
        })

        return (
          <div key={idx} className="flex my-1.5 text-sm font-normal leading-7">
            @{attr.name}({argv})
          </div>
        )
      })}
    </>
  )
}

export default function ModelDesignerModel({ model }: Props) {
  const properties = model.properties ?? []

  const [typePopVisible, setTypePopVisible] = useImmer(false)
  const [activeCell, setActiveCell] = useImmer({ col: '', idx: -1 })
  const [fields, setFields] = useImmer<Field[]>(
    properties.filter((p) => p.type === 'field') as Field[]
  )
  const [attributes, _setAttributes] = useImmer<ModelAttribute[]>(
    properties.filter((p) => p.type === 'attribute') as ModelAttribute[]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setFields(properties.filter((p) => p.type === 'field') as Field[]), [model])

  function handleTypeSelect(_value: string) {
    // TODO: 更新 cell 类型
    setTypePopVisible(false)
  }

  function handleTypeClick(idx: number) {
    setTypePopVisible(true)
    setActiveCell({ col: 'type', idx: idx })
  }

  return (
    <>
      {fields?.map((field, idx) => (
        <div key={idx} className="flex my-1.5 text-sm font-normal leading-7">
          <ModelDesignerColumnName data={field.name} />

          <div
            className="h-6 w-full max-w-150px hover:bg-[#F8F8F9] cursor-pointer"
            style={
              activeCell.col === 'type' && activeCell.idx === idx
                ? { backgroundColor: '#F8F8F9' }
                : {}
            }
            onClick={() => handleTypeClick(idx)}
          >
            <span
              style={
                PRISMA_BASE_TYPES.includes(field.fieldType as string)
                  ? { color: '#1BB659' }
                  : { color: '#99109B' }
              }
            >
              {field.fieldType as string}
            </span>
          </div>

          <div className="h-6 w-full flex">
            {field.attributes?.map((attr, idx) => (
              <div key={idx} className="mr-3 cursor-pointer hover:bg-[#F8F8F9]">
                {attr.name === 'id' && <div className="text-[#1B25C9]">@id()</div>}
                {attr.name === 'default' && <AttrDefault attr={attr} />}
                {attr.name === 'unique' && <div className="text-[#1B25C9]">@unique()</div>}
                {attr.name === 'relation' && <AttrRelation attr={attr} />}
              </div>
            ))}
          </div>
        </div>
      ))}

      <TableAttr attributes={attributes} />

      <Modal
        className="max-w-264px"
        mask={false}
        closable={false}
        footer={null}
        title="字段类型"
        visible={typePopVisible}
        destroyOnClose={true}
        onCancel={() => {
          setActiveCell({ col: '', idx: -1 })
          setTypePopVisible(false)
        }}
      >
        <TypeModalContent onClick={handleTypeSelect} />
      </Modal>
    </>
  )
}
