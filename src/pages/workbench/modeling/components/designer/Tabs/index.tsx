import clsx from 'clsx'
import { differenceBy } from 'lodash'
import { useContext, useEffect, useState } from 'react'

import { PrismaSchemaContext } from '@/lib/context/PrismaSchemaContext'
import useEntities from '@/lib/hooks/useEntities'

import iconClose from '../../../assets/close.svg'
import iconEdit from '../../../assets/edit-mode.svg'
import iconEntity from '../../../assets/entity.svg'
import iconEntityEdit from '../../../assets/entity-edit.svg'
import iconEnum from '../../../assets/enum.svg'
import iconEnumEdit from '../../../assets/enum-edit.svg'
import styles from './index.module.less'

interface Props {
  active: { name: string; type: string; isSource?: boolean }
  onClick: (item: any) => void
}

export default function Tabs({ active, onClick }: Props) {
  const { panel } = useContext(PrismaSchemaContext)
  const { entities, editMap, newMap } = useEntities()
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    const unExistList = differenceBy(list, entities, x => x.name).filter(x => !x.isSource)
    if (unExistList.length) {
      setList(list.filter(x => !unExistList.includes(x) || x.isSource))
    }
  }, [entities])
  useEffect(() => {
    if (!active) {
      return
    } else if (['model', 'enum'].includes(active.type)) {
      if (list.find(item => item.name === active.name)) {
        return
      }
      setList([...list, active])
    } else if (active.isSource) {
      if (list.find(item => item.name === active.name)) {
        return
      }
      setList([...list, active])
    }
  }, [active])
  return (
    <div className={styles.listWrapper}>
      <div className={styles.list}>
        {list.map((item, index) => {
          let icon
          const isEditing = editMap[item.name] || newMap[item.name]
          if (item.type === 'model') {
            icon = isEditing ? iconEntityEdit : iconEntity
          } else if (item.type === 'enum') {
            icon = isEditing ? iconEnumEdit : iconEnum
          } else {
            icon = iconEdit
          }
          return (
            <div
              className={clsx(styles.item, {
                [styles.active]: item.name === active?.name && item.type === active?.type
              })}
              key={index}
              onClick={() => onClick(item)}
            >
              <img className="mr-1" src={icon} alt="" />
              {item.name}
              {item.type && <span className={styles.label}>{item.type}</span>}
              <div
                className={styles.close}
                onClick={e => {
                  e.stopPropagation()
                  console.log()
                  const rest = list.filter((_, i) => i !== index)
                  setList(rest)
                  if (item.name === active.name && item.type === active.type) {
                    if (index > 0) {
                      onClick(rest[index - 1])
                    } else if (rest.length > 0) {
                      onClick(rest[0])
                    }
                  }
                }}
              >
                <img src={iconClose} alt="" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
