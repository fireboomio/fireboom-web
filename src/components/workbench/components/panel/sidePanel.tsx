import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react'

import styles from './sidePanel.module.scss'

export interface SidePanelProps {
  title: string
  action?: React.ReactNode
  children?: React.ReactNode
  defaultOpen?: boolean
  onAdd?: () => void
}

export default function SidePanel(props: SidePanelProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(!!props.defaultOpen)
  }, [])

  return (
    <div className={`${styles.container} ${open ? styles.active : ''}`}>
      <div
        className={`${styles.header} ${open ? styles.headerOpen : ''}`}
        onClick={_ => setOpen(!open)}
      >
        <div className={styles.arrow} />
        <div className={styles.title}>{props.title}</div>
        <div className={styles.action} onClick={e => e.stopPropagation()}>
          {props.action ? props.action : <div className={styles.add} onClick={props.onAdd} />}
        </div>
      </div>
      <div className={`${open ? '' : 'hidden'} ${styles.content}`}>{props.children}</div>
    </div>
  )
}
