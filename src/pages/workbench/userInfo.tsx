import { loader } from '@monaco-editor/react'
import axios from 'axios'
import { useState } from 'react'
import ReactJson from 'react-json-view'

loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } })

export default function UserInfo() {
  const [info, setInfo] = useState()

  axios.get('/api/v1/oidc/userInfo').then(info => {
    setInfo(info.data)
  })

  // const { config } = useContext(ConfigContext)
  // const apiHost =
  //   config.apiHost || `${location.protocol}//${location.pathname}:${location.protocol}`
  // const cookieId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  // const cookieUser = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, '$1')
  // document.cookie = `id=${cookieId}; path=/; domain=${location.pathname}:${location.protocol}`
  // document.cookie = `user=${cookieUser}; path=/; domain=${location.pathname}:${location.protocol}`
  // void axios
  //   .get(`${apiHost}/app/main/auth/cookie/user`, {
  //     withCredentials: true,
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'WG-SDK-Version': '1.0.0-next.32'
  //     }
  //   })
  //   .then(res => {
  //     console.log('user请求结果', res.data)
  //     setInfo(res.data.toString())
  //   })

  return (
    <div className="h-full flex flex-col">
      <div className="flex-0 px-4 font-500 text-18px leading-40px bg-white">登录用户</div>
      <div className="flex-1 p-4 h-full">
        {info ? <ReactJson src={info} iconStyle="triangle" name={false} /> : null}
      </div>
    </div>
  )
}
