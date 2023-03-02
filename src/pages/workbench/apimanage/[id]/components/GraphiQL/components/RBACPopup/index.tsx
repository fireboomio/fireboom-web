import { Checkbox, Dropdown, Radio, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { CircleCloseOutlined, CircleRemoveOutlined, PlusCircleFilled } from '@/components/icons'
import RoleDiagram from '@/components/RoleDiagram'
import type { Role } from '@/interfaces/user'
import requests from '@/lib/fetchers'

import styles from './index.module.less'

interface RBACPopupProps {
  value?: {
    rule?: string
    value?: string[]
  }
  onChange?: (v: { rule: string; value: string[] }) => void
}

const RBACPopup = ({ value, onChange }: RBACPopupProps) => {
  const [rule, setRule] = useState(value?.rule ?? 'requireMatchAll')
  const [selected, setSelected] = useState(value?.value ?? [])
  const [roles, setRoles] = useState<Role[]>([])

  const onAllCheckChange = () => {
    if (selected.length !== roles.length) {
      const allValue = roles.map(r => r.code)
      setSelected(allValue)
      onChange?.({ rule, value: allValue })
    } else {
      setSelected([])
      onChange?.({ rule, value: [] })
    }
  }

  const onCheck = (checked: boolean, role: string) => {
    const clone = [...selected]
    if (checked) {
      clone.push(role)
    } else {
      clone.splice(clone.indexOf(role), 1)
    }
    setSelected(clone)
    onChange?.({ rule, value: clone })
  }

  const removeSelected = (index: number) => {
    const clone = [...selected]
    clone.splice(index, 1)
    setSelected(clone)
    onChange?.({ rule, value: clone })
  }

  const clearSelected = () => {
    setSelected([])
    onChange?.({ rule, value: [] })
  }

  const onSetRule = (v: string) => {
    setRule(v)
    onChange?.({ rule: v, value: selected })
  }

  useEffect(() => {
    setSelected(value?.value ?? [])
    setRule(value?.rule ?? '')
  }, [value, setSelected])

  useEffect(() => {
    requests.get('/role').then(res => {
      setRoles(res as unknown as Role[])
    })
  }, [])

  return (
    <div className="bg-white rounded shadow w-143">
      <div className="bg-[rgba(95,98,105,0.05)] py-2.5 px-3">
        <Radio.Group
          className={styles.radioGroup}
          value={rule}
          options={[
            { label: 'requireMatchAll', value: 'requireMatchAll' },
            { label: 'requireMatchAny', value: 'requireMatchAny' },
            { label: 'denyMatchAll', value: 'denyMatchAll' },
            { label: 'denyMatchAny', value: 'denyMatchAny' }
          ]}
          size="small"
          onChange={e => onSetRule(e.target.value)}
        />
      </div>
      <div className="flex py-2.5 px-3">
        {rule && <RoleDiagram className="mr-6" rule={rule} />}
        <div className="flex flex-wrap flex-1 gap-x-2 gap-y-2 roles">
          {!selected.length && (
            <div className="flex h-full w-full text-gray-500 items-center justify-center">
              <FormattedMessage defaultMessage="没有选定角色，请点击下方加号添加" />
            </div>
          )}
          {selected.map((role, index) => (
            <div
              key={role}
              className="border-solid border rounded-sm flex border-[rgba(175,176,180,0.4)] h-6.5 text-sm px-2 items-center"
            >
              {role}
              <CircleCloseOutlined
                className="cursor-pointer text-xs ml-1.5 text-[#5F6269]"
                onClick={() => removeSelected(index)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col ml-2 items-center justify-end">
          <CircleRemoveOutlined className="cursor-pointer" onClick={clearSelected} />
          <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            disabled={!rule}
            dropdownRender={() => (
              <div className="bg-white">
                <div className="border-solid flex border-0 border-[rgba(95,98,105,0.1)] text-xs py-2.5 pr-2 pl-3 !border-b">
                  <Checkbox
                    className={styles.checkbox}
                    checked={selected.length === roles.length}
                    indeterminate={!!selected.length && selected.length !== roles.length}
                    onChange={onAllCheckChange}
                  >
                    <FormattedMessage
                      defaultMessage="共{count}项数据"
                      values={{ count: roles.length }}
                    />
                  </Checkbox>
                </div>
                <div className="py-1">
                  {roles.map(role => (
                    <div className="flex py-1 pr-2 pl-3 items-center" key={role.code}>
                      <Checkbox
                        className={styles.checkbox}
                        checked={selected.includes(role.code)}
                        onChange={e => onCheck(e.target.checked, role.code)}
                      />
                      <span className="mr-2 text-sm ml-1">{role.code}</span>
                      <span className="ml-auto text-xs text-[rgba(153,153,153,0.6)]">
                        {role.remark}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          >
            {!rule ? (
              <Tooltip title={<FormattedMessage defaultMessage="请先选择匹配模式" />}>
                <PlusCircleFilled className="cursor-pointer mt-2" />
              </Tooltip>
            ) : (
              <PlusCircleFilled className="cursor-pointer mt-2" />
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default RBACPopup
