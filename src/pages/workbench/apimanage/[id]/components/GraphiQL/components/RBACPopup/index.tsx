import { CloseOutlined, DeleteFilled, PlusCircleFilled } from '@ant-design/icons'
import { Checkbox, Dropdown, Empty, Radio } from 'antd'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'

import type { Role } from '@/interfaces/user'
import requests from '@/lib/fetchers'

import styles from './index.module.less'

interface RBACPopupProps {
  initialValue?: {
    rule: string
    value: string[]
  }
  onChange?: (v: { rule: string; value: string[] }) => void
}

const RBACPopup = ({ initialValue, onChange }: RBACPopupProps) => {
  const [rule, setRule] = useState(initialValue?.rule ?? 'requireMatchAll')
  const [selected, setSelected] = useState(initialValue?.value ?? [])
  const [roles, setRoles] = useState<Role[]>([])

  const onAllCheckChange = () => {
    if (selected.length !== roles.length) {
      setSelected(roles.map(r => r.code))
    } else {
      setSelected([])
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
  }

  const removeSelected = (index: number) => {
    const clone = [...selected]
    clone.splice(index, 1)
    setSelected(clone)
  }

  const clearSelected = () => {
    setSelected([])
  }

  useEffect(() => {
    requests.get('/role').then(res => {
      setRoles(res.data.result as Role[])
    })
  }, [])

  return (
    <div className={clsx('bg-white rounded', styles.wrapper)}>
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
          onChange={e => setRule(e.target.value)}
        />
      </div>
      <div className="py-2.5 px-3">
        <div className="flex flex-wrap gap-x-2 gap-y-2 roles">
          {selected.map((role, index) => (
            <div
              key={role}
              className="border-solid border rounded-sm flex border-[rgba(175,176,180,0.4)] h-6.5 text-sm px-2 items-center"
            >
              {role}
              <CloseOutlined
                className="cursor-pointer text-xs ml-1.5 text-[#5F6269]"
                onClick={() => removeSelected(index)}
              />
            </div>
          ))}
        </div>
        {!selected.length && (
          <div className="flex h-6.5 text-gray-500 items-center justify-center">
            没有选定角色，请点击下方加号添加
          </div>
        )}
        <div className="flex mt-2 items-center justify-end">
          <DeleteFilled className="!text-[rgba(95,98,105,0.1)]" onClick={clearSelected} />
          <Dropdown
            trigger={['click']}
            placement="bottomLeft"
            overlay={
              <div className="bg-white">
                <div className="border-solid flex border-0 border-[rgba(95,98,105,0.1)] text-xs py-2.5 pr-2 pl-3 !border-b">
                  <Checkbox
                    className={styles.checkbox}
                    checked={selected.length === roles.length}
                    indeterminate={!!selected.length && selected.length !== roles.length}
                    onChange={onAllCheckChange}
                  >
                    共{roles.length}项数据
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
            }
          >
            <PlusCircleFilled className="ml-2 !text-[#116DF8]" />
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

export default RBACPopup
