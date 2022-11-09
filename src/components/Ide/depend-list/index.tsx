/* eslint-disable @typescript-eslint/no-unsafe-return */
import { LoadingOutlined } from '@ant-design/icons'
import type { SelectProps } from 'antd'
import { Select, Spin } from 'antd'
import { debounce } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getDependList, getDependVersions } from '@/lib/service/depend'

import iconCross from '../assets/cross.svg'
import iconDepend from '../assets/depend.svg'
import iconDoubleLeft from '../assets/double-left.svg'
import iconRefresh from '../assets/refresh.svg'
import iconUpAndDown from '../assets/up-and-down.svg'
import type { Depend } from '../index'
import ideStyles from './index.module.less'

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>
  debounceTimeout?: number
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState<ValueType[]>([])
  const fetchRef = useRef(0)
  const selectRef = useRef(null)

  const debounceFetcher = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const loadOptions = async (value: string) => {
      fetchRef.current += 1
      setOptions([])
      setFetching(true)

      void fetchOptions(value).then(newOptions => {
        setOptions(newOptions)
        setFetching(false)
      })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  return (
    <Select
      className="test"
      labelInValue
      ref={selectRef}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      getPopupContainer={triggerNode => triggerNode.parentElement}
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      onChange={(value, options) => {
        if (props.onChange && selectRef.current) {
          // 调用blur
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          ;(selectRef.current as any).blur()
          props.onChange(value, options)
        }
      }}
      options={options}
    />
  )
}

type SearchDependProps = {
  // 搜索之后添加依赖
  onAddDepend: (depend: string) => void
}

// 搜索依赖
const SearchDepend = (props: SearchDependProps) => {
  type Depend = { label: string; value: string }
  const [value, setValue] = useState<Depend[] | null>([])
  return (
    <div className="search flex justify-between items-center">
      {/* 搜索 */}
      <DebounceSelect
        mode="multiple"
        value={value}
        placeholder="搜索依赖"
        fetchOptions={getDependList}
        onChange={newValue => {
          if (Array.isArray(newValue) && newValue.length > 0) {
            props.onAddDepend(newValue[0].label)
          }
          setValue([])
        }}
        className="input"
      />
      <img src={iconDepend} alt="依赖" />
    </div>
  )
}

type DependListProps = {
  // 本地依赖
  localDepend: string[]
  dependList: Depend[]
  // 点击缩起依赖区域
  onFold: () => void
  // 依赖变化回调
  onDependChange?: (depend: Depend) => void
  // 依赖被删除回调
  onDependDelete?: (dependName: string) => void
  // 将依赖插入代码
  onInsertLocalDepend?: (dependName: string) => void
  // 将依赖插入代码
  onChangeDependVersion?: (depend: Record<string, string>) => void
}

// 依赖列表
const DependList = (props: DependListProps) => {
  const [dependList, setDependList] = useState<Map<string, string | null>>(new Map([]))
  // 新增一个选择version的select框, 控制其显示的变量, 互斥
  const [showSelectVersion, setShowSelectVersion] = useState<number>(-1)
  // 存储版本列表, 为了用户体验, 使用对象存储, key为依赖名, value为版本列表
  const [versionList, setVersionList] = useState<
    Record<string, { label: string; value: string }[]>
  >({})
  const [versionLoading, setVersionLoading] = useState<number>(-1)
  const firstUpload = useRef(true)
  const firstSetDependList = useRef(false)

  useEffect(() => {
    if (props.dependList.length !== 0) {
      const map = new Map<string, string | null>()
      props.dependList.forEach(item => {
        map.set(item.name, item.version)
      })
      setDependList(map)
      firstSetDependList.current = true
    }
  }, [props.dependList])

  useEffect(() => {
    // 如果当前firstSetDependList为true, 说明是第一次设置依赖列表, 不需要触发依赖变化回调
    if (firstSetDependList.current) {
      firstSetDependList.current = false
      return
    }
    // 副作用首次不会触发onchange
    if (firstUpload.current) {
      firstUpload.current = false
      return
    }
    const dependListObj: Depend = {}
    dependList.forEach((value, key) => {
      if (value !== null) {
        dependListObj[key] = value
      }
    })
    // 依赖为空, 则调用回调
    // 或者dependListObj和versionList的key长度不一致, 造成不一致的原因是部分依赖value为null, 则不需要调用回调
    if (dependList.size === 0 || Object.keys(dependListObj).length === dependList.size) {
      props.onDependChange?.(dependListObj)
    }
  }, [dependList])

  useEffect(() => {
    // 捕获body的点击事件, 如果点击的不是select, 则隐藏select
    const bodyClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        !['version-flag', 'version-select'].includes(target.id) &&
        !target.classList.contains('version-select') &&
        !['ant-select-selection-item'].includes(target.className)
      ) {
        if (showSelectVersion !== -1) {
          setShowSelectVersion(-1)
        }
      }
    }
    document.body.addEventListener('click', bodyClick)
    return () => {
      document.body.removeEventListener('click', bodyClick)
    }
  }, [showSelectVersion])

  // 获取依赖版本列表
  const getVersions = async (
    dependName: string,
    index?: number,
    // 是否是点击version触发的, 如果是, 调用ShowSelectVersion, 否则不调用
    isClickVersion = true
  ): Promise<{ versions: any; latest: string }> => {
    const _setShowSelectVersion = (index?: number) => {
      if (index !== undefined && isClickVersion) {
        setShowSelectVersion(index)
      }
    }
    if (versionList[dependName]) {
      _setShowSelectVersion(index)
      return { versions: versionList[dependName], latest: versionList[dependName][0].value }
    }
    // 如果传递了index
    if (index !== undefined) {
      setVersionLoading(index)
    }
    const { list: versions, latest } = await getDependVersions(dependName)
    versions.reverse()
    setVersionList(prev => ({ ...prev, [dependName]: versions }))
    _setShowSelectVersion(index)
    setVersionLoading(-1)
    return { versions, latest }
  }

  // 添加依赖
  // eslint-disable-next-line @typescript-eslint/require-await
  const addDepend = async (name: string) => {
    // 查询版本列表是一个异步过程, 在这里进行异步操作
    void getVersions(name, dependList.size, false).then(res => {
      // 重新渲染, 设置version
      setDependList(prev => {
        const newDependList = new Map(prev)
        newDependList.set(name, res.latest)
        return newDependList
      })
    })
    // 默认设置一个null作为version, 为null的version其代表了暂时不显示
    dependList.set(name, null)
    console.log('aha', dependList)
    setDependList(new Map([...dependList]))
  }

  // 删除依赖
  const removeDepend = (name: string) => {
    dependList.delete(name)
    props.onDependDelete?.(name)
    setDependList(new Map([...dependList]))
  }

  // 更新依赖
  const updateDepend = (name: string, version: string) => {
    dependList.set(name, version)
    setDependList(new Map([...dependList]))
  }

  return (
    <div className={`${ideStyles['ide-container-depend-list']}`}>
      <div className="title-top flex justify-between items-center">
        <div className="title text-1xl select-none">全局依赖</div>
        <span
          className="cursor-pointer"
          onClick={() => {
            props.onFold()
          }}
        >
          <img src={iconDoubleLeft} alt="折叠" />
        </span>
      </div>
      {/* 搜索 */}
      <SearchDepend onAddDepend={addDepend} />
      {/* 列表 */}
      <div className="list">
        {/* 迭代depend map */}
        {[...dependList.entries()].map(([name, version], index) => {
          return (
            <div
              id="item"
              className={'item flex justify-between items-center cursor-pointer'}
              key={index}
            >
              <div
                className={`name ${
                  showSelectVersion === index ? 'show-select-version-name' : ''
                } truncate`}
              >
                {name}
              </div>
              <div className="version flex">
                {showSelectVersion === -1 && (
                  <span
                    style={{ whiteSpace: 'nowrap' }}
                    id="version-flag"
                    onClick={() => {
                      void getVersions(name, index)
                    }}
                  >
                    {version}
                  </span>
                )}
                {/* 在进行选择版本时, 现有版本消失 */}
                <div className="select" id="version-select">
                  {/* loading */}
                  {versionLoading === index && <LoadingOutlined color="#ADADAD;" />}
                  {versionLoading !== index && showSelectVersion === index && (
                    <Select
                      popupClassName="version-select"
                      virtual={false}
                      open
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      optionFilterProp="children"
                      showSearch
                      labelInValue
                      size="small"
                      options={versionList[name]}
                      defaultValue={{
                        label: version,
                        value: version === 'latest' ? versionList[name][0].value : version
                      }}
                      onBlur={() => {
                        setShowSelectVersion(index)
                      }}
                      onChange={item => {
                        updateDepend(name, item.value as string)
                        setShowSelectVersion(-1)
                      }}
                    />
                  )}
                  {versionLoading !== index && showSelectVersion === -1 && (
                    <div className="select-icon">
                      <img src={iconUpAndDown} alt="选择版本" />
                    </div>
                  )}
                </div>
              </div>
              {/* 悬停操作区域 */}
              <div
                className={`hover-area ${
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  showSelectVersion === index && 'show-select-version'
                } flex justify-between`}
              >
                {/*<img src={iconUpAndDown} alt="选择版本" />*/}
                <span onClick={() => version && props.onChangeDependVersion?.({ [name]: version })}>
                  <img src={iconRefresh} alt="刷新" />
                </span>
                <span className="ml-2" onClick={() => removeDepend(name)}>
                  <img src={iconCross} alt="移除" />
                </span>
              </div>
            </div>
          )
        })}
      </div>
      <div className="p-14px">
        <div className="text-default font-500">内部依赖</div>
        {props.localDepend.map(item => (
          <div
            onDoubleClick={() => props.onInsertLocalDepend?.(item)}
            key={item}
            className="truncate text-[#333] font-14px leading-30px cursor-pointer"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DependList
