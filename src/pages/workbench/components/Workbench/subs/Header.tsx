import { App, message, Modal, Tooltip } from 'antd'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useLocation, useNavigate } from 'react-router-dom'

import { useConfigContext } from '@/lib/context/ConfigContext'
import { WorkbenchContext } from '@/lib/context/workbenchContext'
import requests, { getAuthKey } from '@/lib/fetchers'
import { ServiceStatus } from '@/pages/workbench/apimanage/crud/interface'
import LoginPanel from '@/pages/workbench/components/Workbench/subs/LoginPanel'
import { registerHotkeyHandler } from '@/services/hotkey'

import iconGithub from '../assets/github.svg'
import iconKeyboard from '../assets/keyboard.svg'
import iconPreview from '../assets/preview.svg'
import iconQuestion from '../assets/question.svg'
import iconRefresh from '../assets/refresh.svg'
import iconSetting from '../assets/setting.svg'
import styles from './header.module.less'

export default function Header(props: { onToggleSider: () => void; engineStatus?: ServiceStatus }) {
  const intl = useIntl()
  const { appRuntime } = useConfigContext()

  const hotkeys = useMemo(
    () => [
      {
        keys: ['alt/^', 'h'],
        desc: intl.formatMessage({ defaultMessage: '打开快捷键提示' })
      },
      {
        keys: ['alt/^', 'n'],
        desc: intl.formatMessage({ defaultMessage: '新建APi/新建模型' })
      },
      {
        keys: ['alt/^', 'b'],
        desc: intl.formatMessage({ defaultMessage: '批量新建API' })
      },
      {
        keys: ['alt/^', 'c'],
        desc: intl.formatMessage({ defaultMessage: '编译' })
      },
      {
        keys: ['alt/^', 'm'],
        desc: intl.formatMessage({ defaultMessage: '切换API设计和模型设计' })
      },
      // {
      //   keys: ['alt/^', '+'],
      //   desc: '打开入参指令'
      // },
      // {
      //   keys: ['alt/^', '-'],
      //   desc: '插入响应转换'
      // },
      {
        keys: ['alt/^', 'r'],
        desc: intl.formatMessage({ defaultMessage: '运行当前Operation' })
      },
      {
        keys: ['alt/^', 't'],
        desc: intl.formatMessage({ defaultMessage: '模型设计页切换设计/数据视图' })
      },
      {
        keys: ['alt/^', 'shift', 'd'],
        desc: intl.formatMessage({ defaultMessage: '创建当前API的拷贝' })
      },
      {
        keys: ['alt/^', 'shift', 'c'],
        desc: intl.formatMessage({ defaultMessage: '复制当前API请求链接' })
      },
      {
        keys: ['alt/^', 'shift', 't'],
        desc: intl.formatMessage({
          defaultMessage: 'API编辑页切换Json/表单模式，模型设计页切换设计/代码模式'
        })
      }
    ],
    [intl]
  )
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isHideSide } = useContext(WorkbenchContext)

  const compiling =
    props.engineStatus === ServiceStatus.Starting || props.engineStatus === ServiceStatus.Building

  const doCompile = () => {
    if (!appRuntime.dev) {
      message.error('生产环境禁止重新编译')
      return
    }
    if (compiling) {
      return
    }
    void requests
      .get('/engine/restart')
      .then(() => void message.success(intl.formatMessage({ defaultMessage: '开始编译' })))
  }

  const { modal } = App.useApp()
  const showHotkey = useCallback(() => {
    Modal.destroyAll()
    modal.info({
      width: '800px',
      icon: null,
      title: intl.formatMessage({ defaultMessage: '页面快捷键' }),
      content: (
        <div className="flex flex-wrap">
          {hotkeys.map(keymap => (
            <div key={keymap.desc} className="flex pt-1 pr-4 pb-3 pl-1 w-1/2 items-start">
              <div className="flex-shrink-0 w-40">
                {keymap.keys.map(k => (
                  <kbd className="rounded bg-true-gray-200 text-sm mr-1.5 py-1 px-1.5" key={k}>
                    {k}
                  </kbd>
                ))}
              </div>
              <span>{keymap.desc}</span>
            </div>
          ))}
        </div>
      ),
      okText: intl.formatMessage({ defaultMessage: '知道了' })
    })
  }, [hotkeys, intl, modal])

  // 快捷键
  useEffect(() => {
    const unbind1 = registerHotkeyHandler('alt+c,^+c', () => {
      doCompile()
    })
    const unbind2 = registerHotkeyHandler('alt+h,^+h', () => {
      showHotkey()
    })
    return () => {
      unbind1()
      unbind2()
    }
  }, [])
  return (
    <>
      <div className={styles.header}>
        <div
          className={!isHideSide ? styles.dashboardIcon : styles.dashboardIcon2}
          onClick={() => props.onToggleSider()}
        />
        <div className={styles.logo} onClick={() => navigate('/workbench')} />
        <div className={styles.splitLine} />
        <div className={styles.title}>
          <FormattedMessage defaultMessage="飞布控制台" description="标题" />
        </div>
        {/*<div className={styles.titleIcon} />*/}
        <div className="flex-1" />
        {pathname === '/workbench/rapi' ? (
          <>
            <LoginPanel />
            <div className={styles.splitLine} style={{ margin: '0 26px' }} />
            {/*<Dropdown*/}
            {/*  className="mr-4"*/}
            {/*  overlay={*/}
            {/*    <Menu*/}
            {/*      items={[*/}
            {/*        ...authList.map(auth => ({*/}
            {/*          key: auth.id,*/}
            {/*          label: <div onClick={() => doLogin(auth)}>{auth.name}</div>*/}
            {/*        })),*/}
            {/*        {*/}
            {/*          key: '0',*/}
            {/*          label: <div onClick={doLogout}>登出</div>*/}
            {/*        }*/}
            {/*      ]}*/}
            {/*    />*/}
            {/*  }*/}
            {/*>*/}
            {/*  <div className="cursor-pointer flex h-1/1 items-center">登录OIDC</div>*/}
            {/*</Dropdown>*/}

            <div
              className="cursor-pointer h-5 text-0px"
              onClick={() => {
                window.open(`/api/engine/swagger?auth-key=${getAuthKey()}`, '_blank')
              }}
            >
              <img src="/assets/download.svg" alt="" />
            </div>
          </>
        ) : (
          <>
            {appRuntime.dev ? (
              <div className={styles.headBtn} onClick={doCompile}>
                {!compiling ? (
                  <img src={iconRefresh} className="h-5 w-5.25" alt="编译" />
                ) : (
                  <img src="/assets/compile.gif" className={styles.compiling} alt="编译" />
                )}
              </div>
            ) : null}
            <div
              className={styles.headBtn}
              onClick={() => window.open('/#/workbench/rapi?t=' + Date.now(), 'fb_rapi')}
            >
              <img src={iconPreview} className="h-5 w-5" alt="预览" />
            </div>
            {/*<div className={styles.headBtn}>*/}
            {/*  <img src={HeaderDeploy} className="h-5 w-5" alt="部署" />*/}
            {/*</div>*/}
          </>
        )}
        <div className={styles.splitLine} style={{ margin: '0 26px' }} />
        {/* <Tooltip title="生成prisma sdk">
          <svg
            className="cursor-pointer"
            width="1em"
            height="1em"
            viewBox="0 0 32 32"
            onClick={generatePrismaSDK}
          >
            <path
              fill="#0c344b"
              fillRule="evenodd"
              d="m25.21 24.21l-12.471 3.718a.525.525 0 0 1-.667-.606l4.456-21.511a.43.43 0 0 1 .809-.094l8.249 17.661a.6.6 0 0 1-.376.832Zm2.139-.878L17.8 2.883A1.531 1.531 0 0 0 16.491 2a1.513 1.513 0 0 0-1.4.729L4.736 19.648a1.592 1.592 0 0 0 .018 1.7l5.064 7.909a1.628 1.628 0 0 0 1.83.678l14.7-4.383a1.6 1.6 0 0 0 1-2.218Z"
            ></path>
          </svg>
        </Tooltip> */}
        <div
          className="cursor-pointer flex-0 h-5 mb-1px text-0px w-4"
          onClick={() => window.open('https://github.com/fireboomio', '_blank')}
        >
          <img src={iconGithub} alt="" />
        </div>
        <div
          className={styles.helpIcon}
          onClick={() => window.open('https://www.fireboom.io/', '_blank')}
        >
          <img src={iconQuestion} alt="" />
        </div>
        <Tooltip title={intl.formatMessage({ defaultMessage: '快捷键' })}>
          <div className="cursor-pointer flex h-5 ml-4 items-center" onClick={showHotkey}>
            <img src={iconKeyboard} alt="" />
          </div>
        </Tooltip>
        <div className={styles.configIcon} onClick={() => navigate('/workbench/setting')}>
          <img src={iconSetting} alt="" />
        </div>
        {/*<div className={styles.avatar}>*/}
        {/*  <img className="h-5 w-5" alt="avatar" src="/assets/total-user.png" />*/}
        {/*</div>*/}
      </div>
    </>
  )
}
