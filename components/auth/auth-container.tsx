import { AppleOutlined, CaretRightOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvItem } from '@/interfaces/auth'

import AuthMainCheck from './subs/auth-main-check'
import AuthMainContent from './subs/auth-main-role'
import AuthMainSet from './subs/auth-main-set'

interface Props {
  content: AuthProvItem
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
          setViewer(<AuthMainContent content={content} />)
          break
        case 'edit':
          setTitle('身份验证')
          setViewer(<AuthMainCheck content={content} />)
          break
        case 'setting':
          setTitle('')
          setViewer(<AuthMainSet content={content} />)
          break
        case 'identity':
          setTitle('身份鉴权')
          setViewer(<AuthMainSet content={content} />)
          break
        case 'role':
          setTitle('角色配置')
          setViewer(<AuthMainSet content={content} />)
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
          '设置'
        ) : (
          <span className="text-lg flex-grow font-bold">
            验证鉴权 
           <span className="text-base flex-grow font-bold"> <CaretRightOutlined /> {title}</span> 
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
