import type React from 'react'
import { useEffect, useState } from 'react'

import styles from './index.module.less'

export interface CollapsePanelBlockProps {
  title: string
  action?: React.ReactNode
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpen?: (flag: boolean) => void
}
export default function CollapsePanel({
  children
}: {
  children: React.ReactNode[] | React.ReactNode
}) {
  return <div className={styles.collapse}>{children}</div>
}

CollapsePanel.Block = function CollapsePanelBlock(props: CollapsePanelBlockProps) {
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
    <div className={`${styles.block} ${open ? styles.active : ''}`}>
      <div
        className={`${styles.header} ${open ? styles.headerOpen : ''}`}
        onClick={_ => handelOpen(!open)}
      >
        <div
          className={styles.arrow}
          style={{
            background: `url(${
              import.meta.env.BASE_URL
            }assets/workbench/panel-arrow.png) no-repeat center/contain`
          }}
        />
        <div className={styles.title}>{props.title}</div>
        <div className={styles.action} onClick={e => e.stopPropagation()}>
          {props.action ? props.action : null}
        </div>
      </div>
      <div className={`${open ? '' : 'hidden'} ${styles.content}`}>{props.children}</div>
    </div>
  )
}
