import type React from 'react'
import { useEffect, useState } from 'react'

import styles from './sidePanel.module.less'

export interface CollapsePanelBlockProps {
  title: string
  action?: React.ReactNode
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpen?: (flag: boolean) => void
}
export default function CollapsePanel({ children }: { children: React.ReactNode[] }) {
  return <div>{children}</div>
}
export function Block(props: CollapsePanelBlockProps) {
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
        </div>
      </div>
      <div className={`${open ? '' : 'hidden'} ${styles.content}`}>{props.children}</div>
    </div>
  )
}
