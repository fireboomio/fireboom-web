import type { Field } from '@mrleebo/prisma-ast'
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

export default function ModelDesignerModel({ model }: Props) {
  const [typePopVisible, setTypePopVisible] = useImmer(false)
  const [activeCell, setActiveCell] = useImmer({ col: '', idx: -1 })
  const [fields, setFields] = useImmer<Field[]>(
    model.properties.filter((p) => p.type === 'field') as Field[]
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setFields(model.properties.filter((p) => p.type === 'field') as Field[]), [model])

  function handleTypeSelect(value: string) {
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

          <div className="h-6 w-full hover:bg-[#F8F8F9]">{JSON.stringify(field.attributes)}</div>
        </div>
      ))}

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
