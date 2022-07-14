import { AppleOutlined, CaretRightOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp } from '@/interfaces/auth'

import AuthMainCheck from './subs/auth-main-check'
import AuthMainEdit from './subs/auth-main-edit'
import AuthMainIdentity from './subs/auth-main-identity'
import AuthMainRole from './subs/auth-main-role'
import AuthMainSet from './subs/auth-main-setting'

interface Props {
  content: AuthProvResp
  showType: string
}

export default function AuthContainer({ content, showType }: Props) {
  const [viewer, setViewer] = useImmer<React.ReactNode>('')
  const [title, setTitle] = useImmer('')
  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    if (content) {
      console.log(showType)
      switch (showType) {
        case 'data':
          setTitle('身份验证')
          setViewer(<AuthMainCheck content={content} />)
          break
        case 'edit':
          setTitle('身份验证')
          setViewer(<AuthMainEdit content={content} />)
          break
        case 'setting':
          setTitle('')
          setViewer(<AuthMainSet />)
          break
        case 'identity':
          setTitle('身份鉴权')
          setViewer(<AuthMainIdentity content={content} />)
          break
        case 'role':
          setTitle('角色配置')
          setViewer(<AuthMainRole />)
          break
        default:
          setViewer(JSON.stringify(content))
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showType, content])

  return (
    <div className="pl-6 pr-10 mt-6">
      <div className="flex justify-start items-center mb-5 ">
        {showType == 'setting' ? (
          <span className="text-lg flex-grow font-bold">设置</span>
        ) : (
          <span className="text-lg flex-grow font-bold">
            验证鉴权
            <span className="text-base flex-grow font-bold">
              {' '}
              <CaretRightOutlined /> {title}
            </span>
          </span>
        )}
        <AppleOutlined className="text-base" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
        <AppleOutlined className="text-base ml-4" onClick={handleIconClick} />
      </div>
      {viewer}
    </div>
  )
}
