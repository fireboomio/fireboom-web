import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import type { Enumerator } from '@mrleebo/prisma-ast'
import { Breadcrumb, Button, Col, Form, Input, Modal, Row } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import { useEffect } from 'react'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import NormalInputCell from '@/components/components/NormalInputCell'
import type { Enum } from '@/interfaces/modeling'
import { UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'

import styles from '../index.module.less'

interface Props {
  savedEnum: Enum
  saveEnum: (enumm: Enum) => void
  updateLocalstorage?: (enumm: Enum) => void
  isEditing: boolean
  setIsEditing?: Updater<boolean>
}

const EnumDesigner = ({
  savedEnum,
  saveEnum,
  updateLocalstorage,
  setIsEditing,
  isEditing
}: Props) => {
  const [currentEnum, setCurrentEnum] = useImmer<Enum>(savedEnum)

  const [enumNameModalVisible, setEnumNameModalVisible] = useImmer(false)

  const [invalidFieldIdx, setInvalidFieldIdx] = useImmer<number[]>([])

  useEffect(() => {
    setCurrentEnum(savedEnum)
  }, [savedEnum])

  useEffect(() => {
    updateLocalstorage && updateLocalstorage(currentEnum)
  }, [currentEnum])

  useEffect(() => {
    setIsEditing && setIsEditing(JSON.stringify(savedEnum) !== JSON.stringify(currentEnum))
  }, [savedEnum, currentEnum])

  const { name: currentEnumName, enumerators } = currentEnum

  const filteredEnumerators = enumerators?.filter(
    item => item.type === 'enumerator'
  ) as Enumerator[]

  const handleResetEnum = () => {
    setCurrentEnum(savedEnum)
  }

  const handleSaveEnum = () => {
    if (currentEnumName === UNTITLED_NEW_ENTITY) {
      setEnumNameModalVisible(true)
      return
    }
    saveEnum(currentEnum)
  }

  const handleUpdateEnumName = ({ enumName }: { enumName: string }) => {
    saveEnum({ ...currentEnum, name: enumName })
    setEnumNameModalVisible(false)
  }

  const handleAddNewEnumButtonClick = () => {
    const newEnum: Enum = {
      ...currentEnum,
      enumerators: [
        ...enumerators,
        {
          type: 'enumerator',
          name: '',
          comment: ''
        }
      ]
    }
    setCurrentEnum(newEnum)
  }

  const handleDeleteEnum = (enumerator: Enumerator) => () => {
    const newEnum = {
      ...currentEnum,
      enumerators: enumerators.filter(e => e.type !== 'enumerator' || e.name !== enumerator.name)
    }
    setCurrentEnum(newEnum)
  }

  const handleUpdateEnum = (originalEnumerator: Enumerator, newEnumerator: Enumerator) => {
    const newEnum = {
      ...currentEnum,
      enumerators: enumerators.map(e => {
        if (e.type === originalEnumerator.type && e.name === originalEnumerator.name) {
          return newEnumerator
        }
        return e
      })
    }
    setCurrentEnum(newEnum)
  }

  const handleNameBlur = (enumerator: Enumerator) => (name: string) => {
    if (!name) {
      const newEnum = {
        ...currentEnum,
        enumerators: enumerators.filter(e => e.type !== 'enumerator' || e.name !== enumerator.name)
      }
      setCurrentEnum(newEnum)
      return
    }
    const newEnumerator = {
      ...enumerator,
      name
    }
    handleUpdateEnum(enumerator, newEnumerator)
  }

  const handleCommentChange = (enumerator: Enumerator) => (comment: string) => {
    let commentValue = comment
    if (commentValue && !commentValue.startsWith('//')) {
      commentValue = `// ${commentValue}`
    }
    const newEnumerator = {
      ...enumerator,
      comment: commentValue
    }
    handleUpdateEnum(enumerator, newEnumerator)
  }

  const handleValidateEnumName = (originalEnumName: string, idx: number) => (enumName: string) => {
    const enumNameRegExp = new RegExp('^([A-Za-z0-9_]+)*$')
    const enumNameIsValid = enumNameRegExp.test(enumName)
    const enumNameExist =
      originalEnumName !== enumName &&
      filteredEnumerators.map(e => e.name).find(n => n === enumName)

    if (!enumNameIsValid) {
      if (invalidFieldIdx.indexOf(idx) === -1) {
        setInvalidFieldIdx(idxs => {
          idxs.push(idx)
        })
      }
      return { result: false, errorMessage: '枚举名不合法' }
    }
    if (enumNameExist) {
      if (invalidFieldIdx.indexOf(idx) === -1) {
        setInvalidFieldIdx(idxs => {
          idxs.push(idx)
        })
      }
      return { result: false, errorMessage: '枚举名已存在' }
    }
    if (invalidFieldIdx.indexOf(idx) !== -1) {
      setInvalidFieldIdx(idxs => {
        idxs.splice(idxs.indexOf(idx), 1)
      })
    }
    return { result: true }
  }

  return (
    <>
      <div className="flex justify-start items-center my-6">
        <Breadcrumb className="text-base flex-grow" separator=" ">
          <Breadcrumb.Item>{currentEnumName}</Breadcrumb.Item>
          <Breadcrumb.Item className="text-[#118AD1]">enum</Breadcrumb.Item>
        </Breadcrumb>
        <Button className="mr-3" onClick={handleResetEnum} disabled={!isEditing}>
          重置
        </Button>
        <Button
          className={`${styles['save-btn']} mr-3`}
          onClick={handleSaveEnum}
          disabled={!isEditing || invalidFieldIdx.length > 0}
        >
          保存
        </Button>
        <PlusCircleOutlined onClick={handleAddNewEnumButtonClick} />
      </div>
      {filteredEnumerators?.map((enumItem, idx) => (
        <Row
          justify="space-between"
          key={idx}
          className="my-1.5 text-sm font-normal leading-7"
          wrap={false}
        >
          <Col span={8}>
            <NormalInputCell
              data={enumItem.name}
              onBlur={handleNameBlur(enumItem)}
              placeholder="请填写枚举名"
              initialIsEditing={enumItem.name === ''}
              validation={handleValidateEnumName(enumItem.name, idx)}
            />
          </Col>
          <Col span={8}>
            <NormalInputCell
              data={enumItem.comment?.replace(/^\/\/\s+/, '') ?? ''}
              onBlur={handleCommentChange(enumItem)}
              className="max-w-250px text-color-[#5F626999]"
              placeholder="请填写枚举注释"
            />
          </Col>
          <DeleteOutlined onClick={handleDeleteEnum(enumItem)} />
        </Row>
      ))}
      <Modal
        title="新增枚举"
        visible={enumNameModalVisible}
        onCancel={() => setEnumNameModalVisible(false)}
        destroyOnClose
        footer={
          <ButtonGroup className="gap-2">
            <Button onClick={() => setEnumNameModalVisible(false)}>取消</Button>
            <Button
              key="submit"
              htmlType="submit"
              form="new_enum_name_form"
              className={`${styles['save-btn']} cursor-default p-0`}
            >
              保存
            </Button>
          </ButtonGroup>
        }
      >
        <Form onFinish={handleUpdateEnumName} name="new_enum_name_form">
          <Form.Item
            label="枚举名"
            name="enumName"
            initialValue={name}
            rules={[
              {
                pattern: new RegExp('^([A-Za-z][A-Za-z0-9_]*)*$'),
                required: true,
                message: '枚举名称不合法，pattern: [A-Za-z][A-Za-z0-9_]*'
              }
            ]}
          >
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EnumDesigner
