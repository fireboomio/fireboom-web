import { Divider, Card, Row, Col } from 'antd'
import ReactECharts from 'echarts-for-react'

import styles from '@/components/auth/subs/outLine.module.scss'

export default function AuthOutLine() {
  return (
    <div className={styles.container}>
      <Divider style={{ margin: '10px 0 24px' }} />
      <div>
        <Row gutter={28}>
          <Col span={8}>
            <Card bodyStyle={{ padding: '20px 24px' }} bordered>
              <div className={styles.cardTitleLine}>
                <div className={styles.cardTitleLineTitle}>总用户</div>
                <div className={styles.cardTitleLineTipIcon} />
              </div>
              <div className={styles.cardDetailLine}>
                <div className={styles.cardDetailLineNumber}>
                  3<span className={styles.cardDetailLineNumberText}>人</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ padding: '20px 24px' }} bordered>
              <div className={styles.cardTitleLine}>
                <div className={styles.cardTitleLineTitle}>今日新增</div>
                <div className={styles.cardTitleLineTipIcon} />
              </div>
              <div className={styles.cardDetailLine}>
                <div className={styles.cardDetailLineNumber}>
                  3<span className={styles.cardDetailLineNumberText}>人</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ padding: '20px 24px' }} bordered>
              <div className={styles.cardTitleLine}>
                <div className={styles.cardTitleLineTitle}>7月新增</div>
                <div className={styles.cardTitleLineTipIcon} />
              </div>
              <div className={styles.cardDetailLine}>
                <div className={styles.cardDetailLineNumber}>
                  3<span className={styles.cardDetailLineNumberText}>人</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div className={styles.chart} style={{ marginTop: 12 }}>
        <Card bodyStyle={{ padding: 0 }} bordered>
          <ReactECharts style={{ height: 244 }} option={{
            grid: {
              top: '15%',
              left: '40',
              right: '30',
              bottom: '30'
            },
            xAxis: {
              data: ['A', 'B', 'C', 'D', 'E'],
              axisTick: { show:false }
            },
            yAxis: {
            },
            series: [
              {
                data: [10, 22, 28, 23, 19],
                type: 'line'
              }
            ]
          }} />
        </Card>
      </div>
      <div className={styles.chart} style={{ marginTop: 12 }}>
        <Row gutter={28}>
          <Col span={8}>
            <Card bodyStyle={{ padding: '20px 24px' }} bordered>
              <div className={styles.cardTitleLine}>
                <div className={styles.cardTitleLineTitle}>总用户</div>
                <div className={styles.cardTitleLineTipIcon} />
              </div>
              <div className={styles.cardDetailLine}>
                <div className={styles.cardDetailLineNumber}>
                  3<span className={styles.cardDetailLineNumberText}>人</span>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ padding: '20px 24px' }} bordered>
              <div className={styles.cardTitleLine}>
                <div className={styles.cardTitleLineTitle}>今日新增</div>
                <div className={styles.cardTitleLineTipIcon} />
              </div>
              <div className={styles.cardDetailLine}>
                <div className={styles.cardDetailLineNumber}>
                  3<span className={styles.cardDetailLineNumberText}>人</span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
