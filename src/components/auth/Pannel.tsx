/* eslint-disable camelcase */
import { Collapse } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useImmer } from 'use-immer'

import type { AuthListType, AuthProvResp } from '@/interfaces/auth'

interface Props {
  onClickItem: (authItem: AuthProvResp) => void
  handleTopToggleDesigner: (authType: AuthListType) => void
}

const { Panel } = Collapse

const initSettingPage: AuthListType = {
  name: '用户管理',
  type: 'userManage'
}

export default function AuthPannel({ typeList }: { typeList: AuthListType[] }) {
  const [selectedType, setSelectedType] = useImmer('userManage')
  const navigate = useNavigate()

  return (
    <div className="bg-[#FDFDFD] h-full pl-6 pt-6">
      <div className="border-gray border-b pb-6">
        <div className={`text-17px leading-17px font-600`}>身份验证</div>
      </div>

      {typeList.map(x => {
        return x.type === 'title' ? (
          <h2 className="pt-4 text-[#99A0B1] text-12px leading-38px" key={x.name}>
            {x.name}
          </h2>
        ) : (
          <div
            key={x.name}
            className={`h-38px flex items-center cursor-pointer ${
              x.type === selectedType ? 'bg-[#F8F8F9] font-600' : ''
            }`}
            onClick={() => {
              setSelectedType(x.type)
              navigate(`/auth/${x.type}`)
            }}
          >
            <div className="text-[#222222] h-4 leading-4">{x.name}</div>
          </div>
        )
      })}
    </div>
  )
}
