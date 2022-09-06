/* eslint-disable camelcase */
import { PlusOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { AuthListType, AuthProvResp } from '@/interfaces/auth'
import { AuthContext, AuthDispatchContext } from '@/lib/context/auth-context'

import styles from './Common.module.scss'
import AuthItem from './subs/ItemBottom'
import AuthItemTop from './subs/ItemTop'

interface Props {
  onClickItem: (authItem: AuthProvResp) => void
  handleTopToggleDesigner: (authType: AuthListType) => void
}

const { Panel } = Collapse

const initSettingPage: AuthListType = {
  name: '用户管理',
  type: 'userManage',
}

const firstTypeList: AuthListType[] = [
  {
    name: '用户管理',
    type: 'userManage',
  },
  {
    name: '角色管理',
    type: 'roleManage',
  },
  {
    name: '操作日志',
    type: 'log',
  },
]

const secondTypeList: AuthListType[] = [
  {
    name: '登入体验',
    type: 'login',
  },
  {
    name: '连接器',
    type: 'connect',
  },
  {
    name: 'webhooks',
    type: 'webhooks',
  },
]

const thirdTypeList: AuthListType[] = [
  {
    name: '数据库',
    type: 'db',
  },
]

export default function AuthPannel({ onClickItem, handleTopToggleDesigner }: Props) {
  const authList = useContext(AuthContext)
  const dispatch = useContext(AuthDispatchContext)
  const [activeKey, setActiveKey] = useImmer([] as Array<string>)

  // const getNextId = () => Math.max(...FSList.map((b) => b.id)) + 1
  function addTable() {
    const data = {
      id: -(authList.length + 1),
      name: '',
      authSupplier: 'openid',
      switchState: [],
      config: '2',
    } as unknown as AuthProvResp
    dispatch({ type: 'added', data: data })
    onClickItem(data)
  }

  const genExtra = () => (
    <PlusOutlined
      onClick={event => {
        event.stopPropagation()
        setActiveKey(activeKey.concat('1'))
        addTable()
      }}
    />
  )

  useEffect(() => {
    handleTopToggleDesigner(initSettingPage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative h-200">
      <div className="border-gray border-b ">
        <div className={`${styles.title} text-lg font-bold mt-6 ml-4 mb-8`}>身份验证</div>
      </div>
      <AuthItemTop
        handleTopToggleDesigner={handleTopToggleDesigner}
        authType={{ name: '概览', type: 'outline' }}
      />

      <h2 className="ml-6 mt-3.5 text-[#AFB0B4] text-12px">用户</h2>
      {firstTypeList.map(authType => (
        <AuthItemTop
          key={authType.type}
          handleTopToggleDesigner={handleTopToggleDesigner}
          authType={authType}
        />
      ))}
      <h2 className="ml-6 mt-3.5 text-[#AFB0B4] text-12px">通用</h2>
      {secondTypeList.map(authType => (
        <AuthItemTop
          key={authType.type}
          handleTopToggleDesigner={handleTopToggleDesigner}
          authType={authType}
        />
      ))}
      <h2 className="ml-6 mt-3.5 text-[#AFB0B4] text-12px">设置</h2>
      {thirdTypeList.map(authType => (
        <AuthItemTop
          key={authType.type}
          handleTopToggleDesigner={handleTopToggleDesigner}
          authType={authType}
        />
      ))}

      <div className="mt-3 absolute w-full bottom-1 h-50" style={{ overflow: 'auto' }}>
        <Collapse
          ghost
          bordered
          activeKey={activeKey}
          onChange={keys => {
            setActiveKey(keys as string[])
          }}
        >
          <Panel header="其他供应商" key={'1'} extra={genExtra()}>
            {authList.map(authItem => {
              if (authItem.name != '')
                return <AuthItem key={authItem.id} authItem={authItem} onClickItem={onClickItem} />
            })}
          </Panel>
        </Collapse>
      </div>
    </div>
  )
}
