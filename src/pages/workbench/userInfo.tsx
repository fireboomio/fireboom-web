import { loader } from '@monaco-editor/react'
import { Button, message } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export default function UserInfo() {
  const [info, setInfo] = useState()

  useEffect(() => {
    axios.get('/api/v1/oidc/userInfo').then(info => {
      setInfo(info.data)
    })
  }, [])

  const handleLogout = () => {
    axios.get('/api/v1/oidc/logout').then(() => {
      message.info('登出成功，即将关闭当前页面')
      setTimeout(() => {
        window.close()
      }, 3000)
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-0 px-4 font-500 text-18px leading-40px bg-white flex items-center">
        登录用户
        <Button className="ml-auto" onClick={handleLogout}>
          登出
        </Button>
      </div>
      <div className="flex-1 p-4 h-full">
        {info ? <ReactJson src={info} iconStyle="triangle" name={false} /> : null}
      </div>
    </div>
  )
}
