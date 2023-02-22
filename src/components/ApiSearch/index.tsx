import type { InputRef } from 'antd'
import { Input, Radio } from 'antd'
import clsx from 'clsx'
import { curry, flatMapDeep, get, omit, values } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Close, File, Filter, Search } from '@/components/icons'
import type { OperationResp } from '@/hooks/store/api'
import { useApiList } from '@/hooks/store/api'
import { useEventBus } from '@/lib/event/events'
import { intl } from '@/providers/IntlProvider'
import { registerHotkeyHandler } from '@/services/hotkey'

import iconEmpty from './assets/empty.svg'
import styles from './index.module.less'

export default function ApiSearch() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  useEventBus('openApiSearch', () => {
    setOpen(true)
  })
  const [searchInput, setSearchInput] = useState('')
  const inputRef = useRef<InputRef>(null)

  // tab相关变量
  const [activeTab, setActiveTab] = useState('')
  const tabs = [
    { key: '', label: intl.formatMessage({ defaultMessage: '全部' }) },
    { key: 'queries', label: intl.formatMessage({ defaultMessage: '查询' }) },
    { key: 'mutations', label: intl.formatMessage({ defaultMessage: '变更' }) },
    { key: 'subscriptions', label: intl.formatMessage({ defaultMessage: '订阅' }) }
  ]

  // 筛选相关变量
  const [filterMap, setFilterMap] = useState<
    Record<string, { value: any; fun: (api: OperationResp) => boolean }>
  >({})
  const enabledFilter = useMemo(() => values(filterMap), [filterMap])
  const [filterOpen, setFilterOpen] = useState(true)

  const buildBaseFilter = (key: string, title: string) => ({
    key,
    title,
    filterFun: curry((filterValue: boolean, api: OperationResp) => get(api, key) === filterValue),
    options: [
      {
        label: intl.formatMessage({ defaultMessage: '是' }),
        value: true
      },
      { label: intl.formatMessage({ defaultMessage: '否' }), value: false }
    ]
  })
  const filterFields = [
    buildBaseFilter('inlegal', intl.formatMessage({ defaultMessage: '是否非法' })),
    buildBaseFilter('enable', intl.formatMessage({ defaultMessage: '是否开启' })),
    buildBaseFilter('isPublic', intl.formatMessage({ defaultMessage: '是否公开' })),
    buildBaseFilter('liveQuery', intl.formatMessage({ defaultMessage: '是否实时' }))
  ]

  // api相关变量
  const apiList = useApiList()
  const filteredList = useMemo(
    () =>
      flatMapDeep(apiList, x => (x.children ? x.children : x))?.filter(api => {
        // 过滤掉目录
        if (api.isDir) {
          return false
        }
        // 应用筛选内容
        if (enabledFilter.find(x => !x.fun(api))) {
          return false
        }
        // tab过滤
        if (!api.operationType.includes(activeTab)) {
          return false
        }
        // 模糊搜索匹配
        return api.path.toLowerCase().includes(searchInput.toLowerCase())
      }) ?? [],
    [apiList, enabledFilter, searchInput, activeTab]
  )

  //快捷键
  useEffect(() => {
    return registerHotkeyHandler('esc', () => {
      setOpen(false)
    })
  }, [])

  // 状态清空
  useEffect(() => {
    setSearchInput('')
    setFilterMap({})
    setFilterOpen(true)
    setActiveTab('')
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus?.()
      }, 100)
    }
  }, [open])

  function gotoAPI(api: any) {
    navigate(`/workbench/apimanage/${api.id}`)
    setOpen(false)
  }

  if (!open) {
    return null
  }

  return (
    <div className={styles.mask} onClick={() => setOpen(false)}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <Close className={styles.panelClose} onClick={() => setOpen(false)} />
        <div className={styles.search}>
          <Search className="ml-18px text-[#333]" />
          <Input
            ref={inputRef}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setOpen(false)
              }
            }}
            onChange={e => setSearchInput(e.target.value)}
            value={searchInput}
            bordered={false}
            className={styles.searchInput}
            allowClear
          />
        </div>

        <div className={styles.tabLine}>
          {tabs.map(tab => (
            <div
              onClick={() => setActiveTab(tab.key)}
              className={`${styles.tab} ${tab.key === activeTab ? styles.active : ''}`}
              key={tab.key}
            >
              {tab.label}
            </div>
          ))}
          <div className="flex-1" />
          <div
            className={`${styles.filterBtn} ${filterOpen ? styles.active : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            {enabledFilter.length === 0 ? (
              <Filter className="mr-1" />
            ) : (
              <div className={styles.count}>{enabledFilter.length}</div>
            )}
            {intl.formatMessage({ defaultMessage: '筛选' })}
          </div>
        </div>

        <div className={styles.bodyContainer}>
          <div className={styles.resultContainer}>
            {filteredList.length === 0 && (
              <div className="w-full h-full flex items-center justify-center flex-col">
                <img src={iconEmpty} alt="" />
                <div className="mt-6 font-14px leading-20px text-[#787D8B]">
                  没有找到相关文件，请重新搜索
                </div>
              </div>
            )}
            {filteredList.map(item => (
              <div
                onClick={() => gotoAPI(item)}
                className={clsx(styles.item, {
                  [styles.disable]: !item.enable,
                  [styles.illegal]: item.inlegal
                })}
                key={item.id}
              >
                <div className={styles.icon}>
                  <File />
                  {item.liveQuery && <div className={styles.dot} />}
                </div>
                <span
                  className={`${styles.method} ${
                    {
                      GET: styles.methodGet,
                      POST: styles.methodPost
                    }[item.method]
                  }`}
                >
                  {item.method}
                </span>
                {item.method && <span className="mx-2px">-</span>}
                <span className={styles.name}>{item.path.substring(1)}</span>
                {item.inlegal && (
                  <span className={styles.illegalLabel}>
                    {intl.formatMessage({ defaultMessage: '非法' })}
                  </span>
                )}
              </div>
            ))}
          </div>
          {filterOpen && (
            <div className={styles.filterContainer}>
              <div className={styles.title}>
                {intl.formatMessage({ defaultMessage: '过滤选项' })}
                <span className={styles.clear} onClick={() => setFilterMap({})}>
                  清空
                </span>
              </div>
              <div className="pt-3">
                {filterFields.map(row => (
                  <div className={styles.row} key={row.key}>
                    <div className={styles.rowTitle}>
                      {row.title}
                      <span
                        onClick={() => {
                          setFilterMap(omit(filterMap, row.key))
                        }}
                        className={styles.clearRow}
                      >
                        清空
                      </span>
                    </div>
                    <Radio.Group
                      name="radiogroup"
                      value={filterMap[row.key]?.value}
                      onChange={e => {
                        setFilterMap({
                          ...filterMap,
                          [row.key]: { value: e.target.value, fun: row.filterFun(e.target.value) }
                        })
                      }}
                    >
                      {row.options.map(option => (
                        <Radio key={option.label} value={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
