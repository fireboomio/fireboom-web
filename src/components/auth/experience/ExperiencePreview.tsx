import { Image, Select, Tabs } from 'antd'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import type { BrandType } from '@/interfaces/experience'

import mobilePreview from './assets/mobile-preview.png'
import pcPreview from './assets/pc-preview.png'
import styles from './ExperiencePreview.module.less'

const { Option } = Select
const { TabPane } = Tabs

export default function ExperiencePreview({ previewData }: { previewData?: BrandType }) {
  const pcImgRef = useRef<any>()
  const mobileImgRef = useRef<any>()
  const appImgRef = useRef<any>()
  const pcImgWidth = pcImgRef.current?.clientWidth || 0
  const mobileImgWidth = mobileImgRef.current?.clientWidth || 0
  const appImgWidth = appImgRef.current?.clientWidth || 0
  const [pcScale, setPcScale] = useState(0)
  const [mobileScale, setMobileScale] = useState(0)
  const [appScale, setAppScale] = useState(0)
  const [refreshWidth, setRefreshWidth] = useState(false)
  useEffect(() => {
    setPcScale(pcImgWidth / 1440)
  }, [pcImgWidth, refreshWidth])
  useEffect(() => {
    setMobileScale(mobileImgWidth / 750)
  }, [mobileImgWidth, refreshWidth])
  useEffect(() => {
    setAppScale(appImgWidth / 750)
  }, [appImgWidth, refreshWidth])
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setPcScale((pcImgRef.current?.clientWidth ?? 0) / 1440)
      setMobileScale((mobileImgRef.current?.clientWidth ?? 0) / 750)
      setAppScale((appImgRef.current?.clientWidth ?? 0) / 750)
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <div className={styles.experiencePreviewWrapper}>
      <div className={styles.experiencePreviewTitle}>
        <div className={styles.experiencePreviewTitleLeft}>
          <span>{'//'}</span>
          <span>登录预览</span>
        </div>
        <div className={styles.experiencePreviewTitleRight}>
          <Select defaultValue="英文" style={{ width: 120 }}>
            <Option value="英文">英文</Option>
            <Option value="中文">中文</Option>
          </Select>
          <Select defaultValue="浅色" style={{ width: 120 }}>
            <Option value="浅色">浅色</Option>
            <Option value="深色">深色</Option>
          </Select>
        </div>
      </div>
      <div className={styles.experiencePreviewDetailContent}>
        <Tabs
          tabPosition="top"
          animated={false}
          className={styles.tabStyle}
          centered
          type="card"
          defaultActiveKey="桌面网页"
          onChange={() => {
            setTimeout(() => {
              setRefreshWidth(!refreshWidth)
            }, 0)
          }}
        >
          <TabPane tab="桌面网页" key="桌面网页">
            <div ref={pcImgRef} className="relative">
              <Image width="100%" height="100%" src={pcPreview} alt="FireBoom" preview={false} />
              {previewData && (
                <div
                  className="absolute w-1440px h-800px left-0 top-0"
                  style={{
                    transform: `scale(${pcScale})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <div className="mt-32px ml-40px flex items-center">
                    <img height="32px" src={previewData.logo} alt="" className="mr-12px" />
                    <span className="text-[#FDFDFD] text-24px">{previewData.slogan}</span>
                  </div>
                  <div
                    className="absolute left-772px top-432px w-312px leading-48px text-center rounded-8px text-white text-16px"
                    style={{
                      background: previewData.color
                    }}
                  >
                    登录
                  </div>
                </div>
              )}
            </div>
          </TabPane>
          <TabPane tab="移动网页" key="移动网页">
            <div ref={mobileImgRef} className="relative">
              <Image
                width="100%"
                style={{
                  maxHeight: 500
                }}
                src={mobilePreview}
                alt="FireBoom"
                preview={false}
              />
              {previewData && (
                <div
                  className="absolute w-750px h-1624px left-0 top-0"
                  style={{
                    transform: `scale(${mobileScale})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <div className="mt-256px h-176px">
                    <img height="176px" src={previewData.logo} alt="" className="block m-auto" />
                  </div>
                  <div className="mt-6 text-center leading-12 font-bold text-40px">
                    {previewData.slogan}
                  </div>
                  <div
                    className="absolute left-74px top-962px w-600px leading-88px text-center rounded-8px text-white text-32px"
                    style={{
                      background: previewData.color
                    }}
                  >
                    登录
                  </div>
                </div>
              )}
            </div>
          </TabPane>
          <TabPane tab="移动原生" key="移动原生">
            <div ref={appImgRef} className="relative">
              <Image
                width="100%"
                style={{
                  maxHeight: 500
                }}
                src={mobilePreview}
                alt="FireBoom"
                preview={false}
              />
              {previewData && (
                <div
                  className="absolute w-750px h-1624px left-0 top-0"
                  style={{
                    transform: `scale(${appScale})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <div className="mt-256px h-176px">
                    <img height="176px" src={previewData.logo} alt="" className="block m-auto" />
                  </div>
                  <div className="mt-6 text-center leading-12 font-bold text-40px">
                    {previewData.slogan}
                  </div>
                  <div
                    className="absolute left-74px top-962px w-600px leading-88px text-center rounded-8px text-white text-32px"
                    style={{
                      background: previewData.color
                    }}
                  >
                    登录
                  </div>
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}
