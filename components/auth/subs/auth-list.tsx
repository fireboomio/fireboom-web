import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useContext } from 'react'

import type { AuthProvItem } from '@/interfaces/auth'
import { AuthContext, AuthDispatchContext } from '@/lib/context'

import styles from './auth-common-main.module.scss'
import FilesItem from './auth-item'

interface Props {
  onClickItem: (dsItem: AuthProvItem) => void
}

export default function AuthProvList({ onClickItem }: Props) {
  const FSList = useContext(AuthContext)
  const dispatch = useContext(AuthDispatchContext)

  const getNextId = () => Math.max(...FSList.map((b) => b.id)) + 1

  function addTable() {
    const data = { id: getNextId(), name: '', info: {} } as AuthProvItem
    dispatch({ type: 'added', data: data })
  }

  return (
    <>
      <div className="flex justify-between items-center p-4 border-[#5f62691a] border-b-1">
        <span className="text-base  leading-5 font-bold">概览</span>
        <div className="flex items-center">
          <Button
            className={styles['add-btn']}
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
            onClick={addTable}
          />
        </div>
      </div>
      <div className="mt-3">
        {FSList.map((authProvItem) => (
          <FilesItem
            key={authProvItem.id}
            authProvItem={authProvItem}
            onClickItem={onClickItem}
          />
        ))}
      </div>
    </>
  )
}
