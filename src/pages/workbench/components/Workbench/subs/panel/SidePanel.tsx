import { Tooltip } from 'antd'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import styles from './SidePanel.module.less'

export interface SidePanelProps {
  title: string
  action?: React.ReactNode
  open?: boolean
  hideAdd?: boolean
  children?: React.ReactNode
  defaultOpen?: boolean
  scrollBottom?: boolean
  onAdd?: () => void
  onOpen?: (flag: boolean) => void
}

export default function SidePanel(props: SidePanelProps) {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (props.open !== undefined) {
      handelOpen(props.open)
    } else if (props.defaultOpen) {
      handelOpen(true)
    }
  }, [props.defaultOpen, props.open])

  useEffect(() => {
    if (props.scrollBottom !== undefined) {
      if (contentRef?.current?.scrollTop) {
        contentRef.current.scrollTop = 1e6
      }
    }
  }, [props.scrollBottom])

  const handelOpen = (flag: boolean) => {
    setOpen(flag)
    props.onOpen && props.onOpen(flag)
  }

  return (
    <div className={`${styles.container} ${open ? styles.active : ''}`}>
      <div
        className={`${styles.header} ${open ? styles.headerOpen : ''}`}
        onClick={_ => handelOpen(!open)}
      >
        <div className={styles.arrow} />
        <div className={styles.title}>{props.title}</div>
        <div className={styles.action} onClick={e => e.stopPropagation()}>
          {props.action ? props.action : null}
          {props.hideAdd ? null : (
            <Tooltip title={intl.formatMessage({ defaultMessage: '新建' })}>
              <div className={styles.add} onClick={props.onAdd} />
            </Tooltip>
          )}
        </div>
      </div>
      <div ref={contentRef} className={`${open ? '' : 'hidden'} ${styles.content}`}>
        {props.children}
      </div>
    </div>
  )
}
