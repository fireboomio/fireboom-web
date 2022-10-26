import { Divider, Image, Layout as ALayout, Menu } from 'antd'
import { Footer } from 'antd/lib/layout/layout'
import type { PropsWithChildren } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import Player from '@/components/player'
import StatusBar from '@/components/status-bar'
import Window from '@/components/window'
import type { Info } from '@/interfaces/common'
import requests from '@/lib/fetchers'

import styles from './layout.module.less'

const { Sider, Content } = ALayout

interface BarOnce {
  version: string
  env: string
}

interface MenuT {
  title: string
  icon: React.ReactNode
  link: string
  position: string
  svg: React.ReactNode
}

const menus: MenuT[] = [
  {
    title: '首页',
    icon: (
      <Link to={'/'}>
        <Image height={26} width={26} src="/assets/home_dark.svg" alt="主页" preview={false} />
      </Link>
    ),
    link: '/',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/home.svg" alt="主页" preview={false} />
  },
  {
    title: '数据建模',
    icon: (
      <Link to={'/modeling'}>
        <Image
          height={26}
          width={26}
          src="/assets/modeling_dark.svg"
          alt="数据建模"
          preview={false}
        />
      </Link>
    ),
    link: '/modeling',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/modeling.svg" alt="数据建模" preview={false} />
  },
  {
    title: '认证鉴权',
    icon: (
      <Link to={'/auth'}>
        <Image height={26} width={26} src="/assets/auth_dark.svg" alt="认证鉴权" preview={false} />
      </Link>
    ),
    link: '/auth',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/auth.svg" alt="认证鉴权" preview={false} />
  },
  {
    title: '文件存储',
    icon: (
      <Link to={'/storage'}>
        <Image
          height={26}
          width={26}
          src="/assets/storage_dark.svg"
          alt="文件存储"
          preview={false}
        />
      </Link>
    ),
    link: '/storage',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/storage.svg" alt="文件存储" preview={false} />
  },
  // {
  //   title: '数据来源',
  //   icon: <IconFont type="icon-chucun-weixuanzhong" />,
  //   link: '/datasource',
  //   position: 'top',
  //   svg: <Image  height={26} width={26} src="/assets/datasource.svg" alt="数据来源" preview={false} />,
  // },
  {
    title: 'API 管理',
    icon: (
      <Link to={'/apimanage'}>
        <Image height={26} width={26} src="/assets/api_dark.svg" alt="API 管理" preview={false} />
      </Link>
    ),
    link: '/apimanage',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/api.svg" alt="API 管理" preview={false} />
  },
  {
    title: 'GraphQL',
    icon: (
      <Link to={'/graphiql'}>
        <Image
          height={26}
          width={26}
          src="/assets/graphiql_dark.svg"
          alt="GraphQL"
          preview={false}
        />
      </Link>
    ),
    link: '/graphiql',
    position: 'top',
    svg: <Image height={26} width={26} src="/assets/graphiql.svg" alt="GraphQL" preview={false} />
  },
  {
    title: '帮助',
    icon: (
      <Link to={'/help'}>
        <Image height={26} width={26} src="/assets/help_dark.svg" alt="帮助" preview={false} />
      </Link>
    ),
    link: '/help',
    position: 'bottom',
    svg: <Image height={26} width={26} src="/assets/help.svg" alt="帮助" preview={false} />
  },
  {
    title: '支持',
    icon: (
      <Link to={'/support'}>
        <Image height={26} width={26} src="/assets/support_dark.svg" alt="支持" preview={false} />
      </Link>
    ),
    link: '/support',
    position: 'bottom',
    svg: <Image height={26} width={26} src="/assets/support.svg" alt="支持" preview={false} />
  },
  {
    title: '设置',
    icon: (
      <Link to={'/setting'}>
        <Image height={26} width={26} src="/assets/setting_dark.svg" alt="设置" preview={false} />
      </Link>
    ),
    link: '/setting',
    position: 'bottom',
    svg: <Image height={26} width={26} src="/assets/setting.png" alt="设置" preview={false} />
  }
]

export default function Layout(props: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()
  const [info, setInfo] = useState<Info>()
  const [version, setVersion] = useState<string>('--')
  const [env, setEnv] = useState<string>('--')
  const [showWindow, setShowWindow] = useState(false)

  const windowStyle = useMemo(() => {
    const diff = collapsed ? '80px' : '200px'
    return { width: `calc(100vw - ${diff})` }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed])

  const topMenuItems = useMemo(
    () =>
      menus
        .filter(m => m.position === 'top')
        .map(m => ({
          key: m.link,
          icon: m.link === pathname ? m.svg : m.icon,
          label: <Link to={m.link}>{m.title}</Link>
        })),
    [pathname]
  )

  const bottomMenuItems = useMemo(
    () =>
      menus
        .filter(m => m.position === 'bottom')
        .map(m => ({
          key: m.link,
          icon: m.icon,
          label: <Link to={m.link}>{m.title}</Link>
        })),
    []
  )

  useEffect(() => {
    void requests.get<unknown, BarOnce>('/wdg/barOnce').then(res => {
      setVersion(res.version)
      setEnv(res.env)
    })
  }, [])

  useEffect(() => {
    void fetch(`/api/v1/wdg/state`).then(res => {
      const reader = res.body?.getReader()
      if (!reader) return

      // @ts-ignore
      const process = ({ value, done }) => {
        if (done) return

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const data = new Response(value)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          void data.json().then(res => setInfo(res))
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error)
        }

        // @ts-ignore
        void reader.read().then(process)
      }

      // @ts-ignore
      void reader.read().then(process)
    })
  }, [])

  return (
    <ALayout>
      <Player className="top-4 right-65 z-500 fixed" status={info?.engineStatus ?? '--'} />
      <Sider
        className={`${styles['sider']} h-full min-h-screen bg-[#FBFBFB] border`}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
      >
        <div className="flex my-5 mx-6 items-center">
          <Link to="/" className="flex items-center">
            <Image width={36} height={36} src="/assets/logo.png" alt="FireBoom" preview={false} />

            <span
              className={`${
                collapsed ? styles['logo-label-collapsed'] : styles['logo-label']
              } ml-2 font-bold text-xl text-black`}
            >
              FireBoom
            </span>
          </Link>
        </div>
        <Divider className={styles['sider-divider']} />

        <Menu
          selectedKeys={[pathname]}
          className="bg-[#FBFBFB] mt-10"
          mode="inline"
          items={topMenuItems}
        />

        <div className="w-full bottom-12 absolute">
          <Menu
            selectedKeys={[pathname]}
            className="bg-[#FBFBFB]"
            mode="inline"
            items={bottomMenuItems}
          />
        </div>
      </Sider>

      <ALayout className="site-layout" style={{ height: '100vh' }}>
        <Content className="bg-white">{props.children}</Content>
        {showWindow ? (
          <Window style={windowStyle} toggleWindow={() => setShowWindow(!showWindow)} />
        ) : (
          <></>
        )}
        <Footer className={styles.footer}>
          <StatusBar
            version={version}
            env={env}
            errorInfo={info?.errorInfo}
            engineStatus={info?.engineStatus}
            hookStatus={info?.hookStatus}
            toggleWindow={() => setShowWindow(!showWindow)}
          />
        </Footer>
      </ALayout>
    </ALayout>
  )
}
