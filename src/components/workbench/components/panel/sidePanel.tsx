import { Tooltip } from 'antd'
import type React from 'react'
import { useEffect, useState } from 'react'

import styles from './sidePanel.module.less'

export interface SidePanelProps {
  title: string
  action?: React.ReactNode
  open?: boolean
  hideAdd?: boolean
  children?: React.ReactNode
  defaultOpen?: boolean
  onAdd?: () => void
  onOpen?: (flag: boolean) => void
}

export default function SidePanel(props: SidePanelProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (props.open !== undefined) {
      handelOpen(props.open)
    } else if (props.defaultOpen) {
      handelOpen(true)
    }
  }, [props.defaultOpen, props.open])

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
            <Tooltip title="新建">
              <div className={styles.add} onClick={props.onAdd} />
            </Tooltip>
          )}
        </div>
      </div>
      <div className={`${open ? '' : 'hidden'} ${styles.content}`}>{props.children}</div>
    </div>
  )
}
