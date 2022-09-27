import { Divider, Card, Row, Col, Tooltip, DatePicker, Image } from 'antd'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import moment from 'moment'
import { useEffect, useState } from 'react'

import styles from '@/components/auth/subs/outLine.module.scss'
import requests from '@/lib/fetchers'

interface NewUser {
  sevenDayUser: { count: number; upCount: number }
  todayInsertUser: { count: number; upCount: number }
  totalUser: number
}

interface ActiveUser {
  dayActive: { count: number; upCount: number }
  weekActive: { count: number; upCount: number }
  monthActive: { count: number; upCount: number }
  thirtyActive: Array<{ count: number; dataString: string }>
}

export default function AuthOutLine() {
  const [chartDate, setChartDate] = useState<moment.Moment>(moment())
  const [newUser, setNewUser] = useState<NewUser>()
  const [activeUser, setActiveUser] = useState<ActiveUser>()
  // 获取用户数数据
  useEffect(() => {
    void requests.get<unknown, NewUser>('/auth/home/').then(result => {
      setNewUser(result)
    })
  }, [])
  // 获取日活信息
  useEffect(() => {
    void requests
      .get<unknown, ActiveUser>('/auth/home/active/', {
        params: { endDate: chartDate?.format('YYYY-MM-DD') },
      })
      .then(result => {
        setActiveUser(result)
      })
  }, [chartDate])

  // 切换日活数据查询日期
  const onDateChange = (date: moment.Moment | null, _: string) => {
    setChartDate(date || moment())
  }

  // 用户日活折线图配置项
  const chartOptions = activeUser?.thirtyActive
    ? {
        grid: {
          top: '25',
          left: '40',
          right: '30',
          bottom: '30',
        },
        lineStyle: {
          color: 'rgba(24, 40, 168, 1)',
        },
        xAxis: {
          data: activeUser?.thirtyActive.map(x => x.dataString),
          axisTick: { show: false },
          axisLabel: { color: 'rgba(95, 98, 105, 0.6)' },
          axisLine: { lineStyle: { color: 'rgba(95,98,105,0.1)' } },
        },
        yAxis: {
          axisLabel: { color: 'rgba(95, 98, 105, 0.6)' },
          axisLine: { lineStyle: { color: 'rgba(95,98,105,0.1)' }, show: true },
          splitLine: { show: false },
        },
        series: [
          {
            name: '日活用户',
            tooltip: { show: true },
            showSymbol: false,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(24, 40, 168, 0.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(0, 156, 255, 0)',
                    },
                  ],
                  false
                ),
              },
            },
            data: activeUser?.thirtyActive.map(x => x.count),
            type: 'line',
          },
        ],
      }
    : null

  // 渲染页面中各单项数据卡片
  const renderCard = ({
    title,
    tooltip,
    count,
    upCount,
    icon,
  }: {
    title: string
    tooltip: string
    count?: number
    upCount?: number
    icon?: string
  }) => {
    return (
      <Card bodyStyle={{ padding: '20px 24px' }} bordered>
        <div className={styles.cardTitleLine}>
          <div className={styles.cardTitleLineTitle}>{title}</div>
          <Tooltip title={tooltip}>
            <div className={styles.cardTitleLineTipIcon} />
          </Tooltip>
        </div>
        <div className={styles.cardDetailLine}>
          {count !== void 0 && (
            <>
              <div className={styles.cardDetailLineNumber}>
                {count}
                <span className={styles.cardDetailLineNumberText}>人</span>
              </div>
              {upCount ? (
                <div
                  style={{ marginLeft: 20, marginTop: 6 }}
                  className={styles[upCount > 0 ? 'up' : 'down']}
                >
                  <div className={styles.Icon} />
                  {Math.abs(upCount)}
                </div>
              ) : null}
            </>
          )}
        </div>
        {icon && (
          <Image
            src={icon}
            height={37}
            width={37}
            preview={false}
            alt="用户"
            rootClassName={styles.cardIcon}
          />
        )}
      </Card>
    )
  }

  return (
    <div className={styles.container}>
      <Divider style={{ margin: '10px 0 24px' }} />
      <div>
        <Row gutter={28}>
          <Col span={8}>
            {renderCard({
              title: '总用户',
              tooltip: '总用户',
              count: newUser?.totalUser,
              upCount: 0,
              icon: '/assets/total-user.png',
            })}
          </Col>
          <Col span={8}>
            {renderCard({
              title: '今日新增',
              tooltip: '今日注册到你应用上到新用户数',
              count: newUser?.todayInsertUser.count,
              upCount: newUser?.todayInsertUser.upCount,
              icon: '/assets/today-user.png',
            })}
          </Col>
          <Col span={8}>
            {renderCard({
              title: '7日新增',
              tooltip: '最近7日注册到你应用上到新用户数',
              count: newUser?.sevenDayUser.count,
              upCount: newUser?.sevenDayUser.upCount,
              icon: '/assets/week-user.png',
            })}
          </Col>
        </Row>
      </div>
      <div className={styles.chart} style={{ marginTop: 12 }}>
        <Card bodyStyle={{ padding: 0 }} bordered>
          <div className="pl-6 pt-5 h-18">
            <div className="text-base leading-22px flex items-center">
              日活用户
              <Tooltip title="每日登录过你的应用到独立用户数">
                <div className={styles.cardTitleLineTipIcon} style={{ marginLeft: 2 }} />
              </Tooltip>
            </div>
            {activeUser?.dayActive?.count !== void 0 && (
              <div className={styles.cardDetailLine} style={{ marginTop: 10 }}>
                <div className={styles.cardDetailLineNumber}>
                  {activeUser?.dayActive.count}
                  <span className={styles.cardDetailLineNumberText}>人</span>
                </div>
                {activeUser?.dayActive.upCount ? (
                  <div
                    style={{ marginTop: 7 }}
                    className={styles[activeUser?.dayActive.upCount > 0 ? 'up' : 'down']}
                  >
                    <div className={styles.Icon} />
                    {Math.abs(activeUser?.dayActive.upCount)}
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <div className="absolute top-5 right-8">
            <DatePicker defaultValue={chartDate} onChange={onDateChange} />
          </div>

          <div style={{ height: 244 }}>
            {chartOptions && <ReactECharts style={{ height: 244 }} option={chartOptions} />}
          </div>
        </Card>
      </div>
      <div className={styles.chart} style={{ marginTop: 12 }}>
        <Row gutter={28}>
          <Col span={8}>
            {renderCard({
              title: '周活用户',
              tooltip: '最近7日登录过你的应用到独立用户数',
              count: activeUser?.weekActive.count,
              upCount: activeUser?.weekActive.upCount,
            })}
          </Col>
          <Col span={8}>
            {renderCard({
              title: '月活用户',
              tooltip: '最近30日登录过你的应用到独立用户数',
              count: activeUser?.monthActive.count,
              upCount: activeUser?.monthActive.upCount,
            })}
          </Col>
        </Row>
      </div>
    </div>
  )
}
