import { CaretRightOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { useImmer } from 'use-immer'

import type { AuthProvResp } from '@/interfaces/auth'

import IconFont from '../iconfont'
import AuthMainCheck from './subs/Check'
import AuthMainEdit from './subs/Edit'
// import AuthMainIdentity from './subs/auth-main-identity'
import AuthMainRole from './subs/Role'
import AuthMainUser from './subs/User'

interface Props {
  content: AuthProvResp
  showTopType: string
  showBottomType: string
}

export default function AuthContainer({ content, showTopType, showBottomType }: Props) {
  const [viewer, setViewer] = useImmer<React.ReactNode>('')
  const [title, setTitle] = useImmer<React.ReactNode>('')
  const handleIconClick = () => {
    console.log('aaa')
  }

  useEffect(() => {
    switch (showTopType) {
      case 'outline':
        setTitle('概览')
        setViewer(<div>概览</div>)
        break
      case 'userManage':
        setTitle('用户管理')
        setViewer(<AuthMainUser />)
        break
      case 'roleManage':
        setTitle('角色管理')
        setViewer(<AuthMainRole />)
        break
      case 'action':
        setTitle('操作日志')
        setViewer(<div>操作日志</div>)
        break
      case 'login':
        setTitle('登入体验')
        setViewer(<div>登入体验</div>)
        break
      case 'connect':
        setTitle('连接器')
        setViewer(<div>连接器</div>)
        break
      case 'webhooks':
        setTitle('webhooks')
        setViewer(<div>webhooks</div>)
        break
      default:
        setViewer(<div>error</div>)
        break
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTopType])

  useEffect(() => {
    if (content) {
      switch (showBottomType) {
        case 'data':
          setTitle('身份验证')
          setViewer(<AuthMainCheck content={content} />)
          break
        case 'edit':
          setTitle('身份验证')
          setViewer(<AuthMainEdit content={content} />)
          break
        default:
          setViewer(JSON.stringify(content))
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBottomType, content])
  return (
    <div className="pl-6 pr-10 mt-6">
      <div className="flex justify-start items-center mb-5 ">
        <span className="text-lg flex-grow font-bold">
          验证鉴权
          <span className="text-base flex-grow font-bold">
            {' '}
            <CaretRightOutlined /> {title}
          </span>
        </span>
        <IconFont type="icon-lianxi" className="text-[22px]" onClick={handleIconClick} />
        <IconFont type="icon-wenjian1" className="text-[22px] ml-4" onClick={handleIconClick} />
        <IconFont type="icon-bangzhu" className="text-[22px] ml-4" onClick={handleIconClick} />
      </div>
      {viewer}
    </div>
  )
}
