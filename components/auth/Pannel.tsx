/* eslint-disable camelcase */
import { PlusOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import { useContext, useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { AuthListType, AuthProvResp } from '@/interfaces/auth'
import { AuthContext, AuthDispatchContext } from '@/lib/context/auth-context'

import styles from './Common.module.scss'
import AuthItem from './subs/ItemBottom'

interface Props {
  onClickItem: (authItem: AuthProvResp) => void
  handleTopToggleDesigner: (authType: AuthListType) => void
}

const { Panel } = Collapse

const initSettingPage: AuthListType = {
  name: '用户管理',
  type: 'userManage',
}

const typeList: AuthListType[] = [
  { name: '概览', type: 'outline' },
  { name: '用户', type: 'title' },
  { name: '用户管理', type: 'userManage' },
  { name: '角色管理', type: 'roleManage' },
  { name: '操作日志', type: 'log' },

  { name: '通用', type: 'title' },
  { name: '登入体验', type: 'login' },
  { name: '连接器', type: 'connect' },
  { name: 'webhooks', type: 'webhooks' },

  { name: '设置', type: 'title' },
  { name: '数据库', type: 'db' },
]

export default function AuthPannel({ onClickItem, handleTopToggleDesigner }: Props) {
  const authList = useContext(AuthContext)
  const dispatch = useContext(AuthDispatchContext)
  const [activeKey, setActiveKey] = useImmer<string[]>([])
  const [selectedType, setSelectedType] = useImmer('userManage')

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

      {typeList.map(x => {
        return x.type === 'title' ? (
          <h2 className="ml-6 mt-3.5 text-[#AFB0B4] text-12px">{x.name}</h2>
        ) : (
          <div
            className={`pl-8 py-2.5 cursor-pointer hover:bg-[#F8F8F9] ${
              x.type === selectedType ? 'bg-[#F8F8F9]' : ''
            }`}
            onClick={() => {
              setSelectedType(x.type)
              handleTopToggleDesigner(x)
            }}
          >
            <div className="text-[#000000] h-4 leading-4">{x.name}</div>
          </div>
        )
      })}

      <div className="mt-3 absolute w-full bottom-1 h-50" style={{ overflow: 'auto' }}>
        <Collapse
          ghost
          bordered
          activeKey={activeKey}
          onChange={keys => setActiveKey(keys as string[])}
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
