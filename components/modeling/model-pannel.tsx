import { AppleOutlined, QrcodeOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Select, Tooltip } from 'antd'
import { useImmer } from 'use-immer'

import { Entity } from '@/interfaces/modeling'

import { EntitiesContext } from './model-context'
import styles from './model-pannel.module.scss'
import ModelEntityList from './subs/model-entity-list'

const { Option } = Select

export default function ModelPannel() {
  const [entities, setEntities] = useImmer([
    { id: 1, name: 'users' },
    { id: 2, name: 'posts' },
    { id: 3, name: 'comments' },
  ] as Entity[])

  function handleChange(value: string) {
    console.log(`selected ${value}`)
  }

  function goRoute(target: object): void {
    const currentTarget = target as HTMLElement
    if (currentTarget.nodeName == 'svg')
      //事件委托，点击图标才触发事件
      console.log('跳转到页面', currentTarget)
  }

  return (
    <EntitiesContext.Provider value={{ entities, setEntities }}>
      <div className={styles.pannel}>
        <div className={styles.title}>数据建模</div>

        <div className={styles['select-contain']}>
          <Select className={styles.select} defaultValue="lucy" onChange={handleChange}>
            <Option value="jack" className={styles.Option}>
              <AppleOutlined className={styles['option-icon']}></AppleOutlined>Jack
            </Option>
            <Option value="lucy">
              <AppleOutlined className={styles['option-icon']}></AppleOutlined>Lucy
            </Option>
            <Option value="Yiminghe">
              <AppleOutlined className={styles['option-icon']}></AppleOutlined>yiminghe
            </Option>
            <Option value="manage" className={styles.manage}>
              <QrcodeOutlined className={styles['option-icon']} />
              管理
            </Option>
          </Select>
          <Tooltip title="prompt text">
            <InfoCircleOutlined style={{ marginLeft: '4px', fontSize: '15px', display: 'none' }} />
          </Tooltip>
        </div>

        <div
          className={styles.actions}
          onClick={(e) => {
            goRoute(e.target)
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <g fill-rule="nonzero" fill="none">
              <path
                d="M1 .6a.4.4 0 0 0-.4.4v13.625c0 .22.18.4.4.4h10.5a.4.4 0 0 0 .4-.4V4.345a1.4 1.4 0 0 0-.483-1.058L8.713.942A1.4 1.4 0 0 0 7.796.6H1z"
                stroke="#CDC2BC"
                stroke-width="1.2"
                fill="#242222"
              />
              <path fill="#242222" d="M10 8.75h2.75v5H10z" />
              <path
                d="M13.287 10.673H9.718a.5.5 0 0 0-.5.5v.25a.5.5 0 0 0 .5.5h3.569v1.076a.2.2 0 0 0 .329.153l2.141-1.81a.2.2 0 0 0 0-.306l-2.142-1.792a.2.2 0 0 0-.328.153v1.276z"
                fill="#F78A82"
              />
              <path fill="#CDC2BC" d="M7.8.758v4.376h4.072l-.58-2.094z" />
            </g>
          </svg>
          <svg width="15" height="16" viewBox="0 0 15 16" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-3 -2)" fill="none" fill-rule="evenodd">
              <rect fill="none" width="20" height="20" rx="2" />
              <g fill-rule="nonzero">
                <path
                  d="M4 2.6a.4.4 0 0 0-.4.4v13.625c0 .22.18.4.4.4h10.5a.4.4 0 0 0 .4-.4V6.345a1.4 1.4 0 0 0-.483-1.058l-2.704-2.345a1.4 1.4 0 0 0-.917-.342H4z"
                  stroke="#CDC2BC"
                  stroke-width="1.2"
                  fill="#242222"
                />
                <path fill="#242222" d="M13 10.75h2.75v5H13z" />
                <path
                  d="M13.732 12.673H17.3a.5.5 0 0 1 .5.5v.25a.5.5 0 0 1-.5.5h-3.568v1.076a.2.2 0 0 1-.33.153l-2.14-1.81a.2.2 0 0 1 0-.306l2.141-1.792a.2.2 0 0 1 .329.153v1.276z"
                  fill="#F78A82"
                />
                <path fill="#CDC2BC" d="M10.8 2.758v4.376h4.072l-.58-2.094z" />
              </g>
            </g>
          </svg>
          <svg width="18" height="14" viewBox="0 0 18 14" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-1 -3)" fill="none" fill-rule="evenodd">
              <rect fill="none" width="20" height="20" rx="2" />
              <g fill-rule="nonzero">
                <path
                  d="M15.004 8.292a3.599 3.599 0 0 1 3.227 3.575 3.598 3.598 0 0 1-3.616 3.594H5.112A4.102 4.102 0 0 1 1 11.363c0-1.036.388-2.026 1.093-2.785a4.086 4.086 0 0 1 2.139-1.22 5.431 5.431 0 0 1 1.676-2.946A5.429 5.429 0 0 1 9.565 3c2.95 0 5.36 2.36 5.44 5.292zm-.366 5.826c1.24 0 2.25-1.01 2.25-2.25 0-1.242-1.01-2.251-2.251-2.251h-.974V8.44a4.102 4.102 0 0 0-4.098-4.097A4.084 4.084 0 0 0 5.49 8.017l-.057.557-.558.044a2.767 2.767 0 0 0-2.53 2.746 2.757 2.757 0 0 0 2.75 2.754h9.544z"
                  fill="#CDC2BC"
                />
                <path fill="#242222" d="M6.385 13.769h6.462V17H6.385z" />
              </g>
              <path
                d="M10.346 14.167v2.326a.5.5 0 0 1-.5.5H9.5a.5.5 0 0 1-.5-.5v-2.326H7.718a.2.2 0 0 1-.153-.329l1.983-2.345a.2.2 0 0 1 .306 0l1.962 2.346a.2.2 0 0 1-.153.328h-1.317z"
                fill="#F78A82"
                fill-rule="nonzero"
              />
            </g>
          </svg>
          <svg width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-2 -2)" fill="none" fill-rule="evenodd">
              <rect fill="none" width="20" height="20" rx="2" />
              <path
                d="M3.582 2.6a.4.4 0 0 0-.4.4v12.933c0 .221.18.4.4.4h9.65a.4.4 0 0 0 .4-.4V3a.4.4 0 0 0-.4-.4h-9.65z"
                fill="#242222"
                fill-rule="nonzero"
                stroke="#CDC2BC"
                stroke-width="1.2"
              />
              <g fill-rule="nonzero">
                <path
                  fill="#242222"
                  d="M12.978 11.035l-1.945.43-1.332 2.064-1.74 1.099.145 1.905.762 1.123H16l1.453-.939v-1.684l-1.907-.688-.345-1.62-1.154-1.26z"
                />
                <path
                  d="M16.003 13.81A2.228 2.228 0 0 1 18 16.022a2.227 2.227 0 0 1-2.238 2.224H9.87a2.54 2.54 0 0 1-2.537-2.536c0-.642.24-1.255.677-1.725a2.53 2.53 0 0 1 1.324-.755c.142-.7.503-1.338 1.038-1.824a3.36 3.36 0 0 1 2.263-.874 3.373 3.373 0 0 1 3.368 3.276zm-.227 3.606c.768 0 1.392-.625 1.392-1.393 0-.769-.625-1.393-1.393-1.393h-.603v-.728a2.54 2.54 0 0 0-2.536-2.537c-1.306 0-2.39.978-2.524 2.274l-.035.345-.345.027a1.713 1.713 0 0 0-1.567 1.7c0 .94.764 1.703 1.703 1.705H15.776z"
                  stroke="#CDC2BC"
                  stroke-width=".3"
                  fill="#CDC2BC"
                />
              </g>
              <path
                d="M5.2 6.8h5.583"
                stroke="#FF837D"
                fill="#F78A82"
                fill-rule="nonzero"
                stroke-linecap="round"
              />
              <path d="M5.2 10h4.687" stroke="#CDC2BC" stroke-linecap="round" />
            </g>
          </svg>
          <svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-2 -4)" fill="none" fill-rule="evenodd">
              <rect fill="none" width="20" height="20" rx="2" />
              <path
                d="M10.5 16c4.142 0 7.5-3.015 7.5-5.5S14.642 5 10.5 5C6.358 5 3 8.015 3 10.5S6.358 16 10.5 16z"
                stroke="#CDC2BC"
                stroke-width="1.2"
                fill="#242222"
                fill-rule="nonzero"
              />
              <circle fill="#F78A82" fill-rule="nonzero" cx="10.5" cy="10.5" r="2.5" />
            </g>
          </svg>
          <svg width="16" height="10" viewBox="0 0 16 10" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-3 -6)" fill="none" fill-rule="evenodd">
              <rect fill="none" width="20" height="20" rx="2" />
              <path
                fill="#CDC2BC"
                d="M5.492 8.17v1.47h2.996v2.128H5.492v1.47h3.836v2.17H3V6h6.328v2.17zM11 6h3.766c1.176 0 2.06.275 2.653.826.593.55.889 1.363.889 2.436s-.383 1.974-1.148 2.702l1.022 3.444h-2.73l-.686-2.842h-1.274v2.842H11V6z"
              />
              <path
                d="M14.316 10.324c.299 0 .53-.114.693-.343.163-.229.245-.506.245-.833 0-.317-.091-.588-.273-.812A.869.869 0 0 0 14.274 8H13v2.324h1.316z"
                fill="#242222"
              />
            </g>
          </svg>
        </div>
      </div>

      <ModelEntityList></ModelEntityList>
    </EntitiesContext.Provider>
  )
}
