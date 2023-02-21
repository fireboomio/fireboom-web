import { Button, message } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import { mutateAuth, useAuthList } from '@/hooks/store/auth'
import type { AuthProvResp } from '@/interfaces/auth'
import { AuthToggleContext } from '@/lib/context/auth-context'
import { ConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests from '@/lib/fetchers'

import AuthCheck from '../components/Check'
import AuthEdit from '../components/Edit'

export default function AuthConfigContainer() {
  const intl = useIntl()
  const { onRefreshMenu } = useContext(WorkbenchContext)
  const [content, setContent] = useState<AuthProvResp>()
  const [editFlag, setEditFlag] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { config } = useContext(ConfigContext)
  const authList = useAuthList()
  useEffect(() => {
    // 如果id为new，则视为新增
    if (id === 'new') {
      setEditFlag(true)
      setContent({
        point: '',
        config: {},
        id: 0,
        name: '',
        authSupplier: 'openid',
        switchState: []
      })
      return
    }

    void requests.get<unknown, AuthProvResp[]>('/auth').then(res => {
      res.forEach(row => {
        if (row.id === Number(id)) {
          setEditFlag(false)
          setContent(row)
        }
      })
    })
  }, [id])

  useEffect(() => {
    if (id !== 'create' && id !== 'new') {
      setEditFlag(false)
      setContent(authList?.find(item => item.id === Number(id)))
    }
  }, [authList, id])

  const onEdit = (content: AuthProvResp) => {
    void mutateAuth()
    setContent(content)
    navigate(`/workbench/auth/${content.id}`)
  }

  const onTest = () => {
    // 生成回调地址，此处假设使用hash路由，如果更改路由方式需要调整
    const callbackURL = new URL(location.toString())
    callbackURL.hash = '#/workbench/userInfo'
    let target
    try {
      target = new URL(content?.point + encodeURIComponent(callbackURL.toString()))
    } catch (e) {
      message.error(
        intl.formatMessage({ defaultMessage: '地址异常，请检查系统设置中的API域名是否正确' })
      )
      console.error(e)
      return
    }
    window.open(target.toString())
  }

  return (
    <div className="flex flex-col h-full common-form items-stretch justify-items-stretch">
      {' '}
      <div
        className="bg-white flex flex-0 h-54px pl-11 items-center"
        style={{ borderBottom: '1px solid rgba(95,98,105,0.1)' }}
      >
        <img src="/assets/icon/oidc.svg" className="h-14px mr-1.5 w-14px" alt="文件" />
        {content?.name || <FormattedMessage defaultMessage="创建身份认证器" />}
        <div className="flex-1"></div>
        {!editFlag ? (
          <>
            <Button className={'btn-test  mr-4'} onClick={onTest}>
              <FormattedMessage defaultMessage="测试" />
            </Button>
            <Button className={'btn-save  mr-11'} onClick={() => setEditFlag(true)}>
              <FormattedMessage defaultMessage="编辑" />
            </Button>
          </>
        ) : null}
      </div>
      <div
        className="bg-white rounded-4px flex-1 mx-3 mt-3 min-h-0 pl-8 overflow-y-auto"
        style={{
          border: '1px solid rgba(95,98,105,0.1)',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0'
        }}
      >
        <AuthToggleContext.Provider
          value={{ handleBottomToggleDesigner: () => setEditFlag(!editFlag) }}
        >
          {content ? (
            editFlag ? (
              <AuthEdit content={content} onChange={onEdit} onTest={onTest} />
            ) : (
              <AuthCheck content={content} />
            )
          ) : (
            ''
          )}
        </AuthToggleContext.Provider>
      </div>
    </div>
  )
}
