import { DeleteOutlined } from '@ant-design/icons'
import { Input, Col, Row, message, Form } from 'antd'
import { useContext } from 'react'
import { useImmer } from 'use-immer'

import type { Entity } from '@/interfaces'
import { EnumEntitiesContext } from '@/lib/modeling-context'

interface Props {
  enumEntity: Entity
}

export default function ModelEnumItem({ enumEntity }: Props) {
  const [isEditing, setIsEditing] = useImmer(enumEntity.isEditing)
  const { enumEntities, setEnumEntities } = useContext(EnumEntitiesContext)
  const [isHovering, setIsHovering] = useImmer(false)
  const [visible, setVisible] = useImmer(false)
  const [name, setName] = useImmer('')
  const [note, setNote] = useImmer('')

  function handleItemEdit(text: string) {
    if (text.trim() == '') {
      message.destroy()
      void message.error('输入内容不能为空，请重新输入', 1)
    } else {
      updateEntity({ ...enumEntity, name: name, note: note })
      setIsEditing(false)
    }
  }

  function leaveItem(MenuVisible: boolean) {
    if (MenuVisible == false) {
      setIsHovering(false)
      setVisible(false)
    }
  }

  function updateEntity(item: Entity) {
    setEnumEntities((draft) => {
      const enumEntity = draft.find((x) => x.id === item.id)
      if (enumEntity) {
        enumEntity.name = item.name
        enumEntity.note = item.note
      }
    })
  }

  function handleItemDelete(item: Entity) {
    setEnumEntities(enumEntities.filter((t) => t.id !== item.id))
  }

  return (
    <div>
      {isEditing ? (
        <Form>
          <Input.Group size="large">
            <Row gutter={8}>
              <Col span={5}>
                <Form.Item>
                  <Input
                    onPressEnter={() => handleItemEdit(name)}
                    className="font-normal leading-4  w-5/7 pl-1"
                    placeholder="请输入枚举类型"
                    autoFocus
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  <Input
                    onPressEnter={() => handleItemEdit(note)}
                    className=" font-normal leading-4  w-5/7 pl-1"
                    placeholder="请输入注释"
                    autoFocus
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value)
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Input.Group>
        </Form>
      ) : (
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => leaveItem(visible)}
          className="text-sm font-normal flex justify-between items-center py-1"
          style={isHovering ? { background: '#F8F8F9' } : {}}
        >
          <span className="w-20 block ">{enumEntity.name}</span>
          <span className="flex-grow ">{enumEntity.note}</span>

          <DeleteOutlined onClick={() => handleItemDelete(enumEntity)} />
        </div>
      )}
    </div>
  )
}
