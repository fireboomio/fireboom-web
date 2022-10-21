import { Layout } from 'antd'
import keyBy from 'lodash/keyBy'
import mapValues from 'lodash/mapValues'
import { Outlet, useLocation } from 'react-router-dom'

import Panel from '@/components/auth/Pannel'
import type { AuthListType } from '@/interfaces/auth'

const { Sider, Content } = Layout

const typeList: AuthListType[] = [
  { name: '概览', type: 'outline' },
  { name: '用户', type: 'title' },
  { name: '用户管理', type: 'userManage' },
  // { name: '操作日志', type: 'log' },

  { name: '通用', type: 'title' },
  { name: '登入体验', type: 'login' },
  { name: '连接器', type: 'connect' },
  // { name: 'webhooks', type: 'webhooks' },

  { name: '设置', type: 'title' },
  { name: '数据库', type: 'db' }
]

const typeMap = mapValues(keyBy(typeList, 'type'), x => x.name)

export default function AuthPage() {
  const location = useLocation()
  const type = (location.pathname.match(/\/auth\/(\w+)/) ?? [])[1] ?? ''
  console.log(type)
  return (
    <Layout className="h-100vh">
      <Sider width={270} theme="light">
        <Panel typeList={typeList} />
      </Sider>
      <Content className="h-100vh flex flex-col">
        <div className="h-15 flex-0 bg-white text-[#222222] font-600 flex items-center pl-6 text-17px">
          身份验证/{typeMap[type]}
        </div>
        <div className="flex-1 min-h-0 px-6 bg-white">
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}
