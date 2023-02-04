import { DeleteOutlined } from '@ant-design/icons'
import type { Enumerator } from '@mrleebo/prisma-ast'
import { Button, Col, Form, Input, Modal, Row } from 'antd'
import ButtonGroup from 'antd/lib/button/button-group'
import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useIntl } from 'react-intl'
import type { Updater } from 'use-immer'
import { useImmer } from 'use-immer'

import type { Enum } from '@/interfaces/modeling'
import { UNTITLED_NEW_ENTITY } from '@/lib/constants/fireBoomConstants'
import NormalInputCell from '@/pages/workbench/modeling/components/NormalInputCell'

import styles from '../index.module.less'

interface Props {
  savedEnum: Enum
  saveEnum: (enumm: Enum) => void
  updateLocalstorage?: (enumm: Enum) => void
  saveModify?: (enumm: Enum) => void
  isEditing: boolean
  setIsEditing?: Updater<boolean>
}

const EnumDesigner = forwardRef(
  (
    { savedEnum, saveEnum, updateLocalstorage, setIsEditing, isEditing, saveModify }: Props,
    ref
  ) => {
    useImperativeHandle(ref, () => ({
      handleResetEnum,
      handleSaveEnum,
      handleAddNewEnumButtonClick
    }))
    const intl = useIntl()
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
      saveModify?.(newEnum)
      setCurrentEnum(newEnum)
    }

    const handleDeleteEnum = (enumerator: Enumerator) => () => {
      const newEnum = {
        ...currentEnum,
        enumerators: enumerators.filter(e => e.type !== 'enumerator' || e.name !== enumerator.name)
      }
      saveModify?.(newEnum)
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
      saveModify?.(newEnum)
      setCurrentEnum(newEnum)
    }

    const handleNameBlur = (enumerator: Enumerator) => (name: string) => {
      if (!name) {
        const newEnum = {
          ...currentEnum,
          enumerators: enumerators.filter(
            e => e.type !== 'enumerator' || e.name !== enumerator.name
          )
        }
        saveModify?.(newEnum)
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

    const handleValidateEnumName =
      (originalEnumName: string, idx: number) => (enumName: string) => {
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
          return {
            result: false,
            errorMessage: intl.formatMessage({ defaultMessage: '枚举名不合法' })
          }
        }
        if (enumNameExist) {
          if (invalidFieldIdx.indexOf(idx) === -1) {
            setInvalidFieldIdx(idxs => {
              idxs.push(idx)
            })
          }
          return {
            result: false,
            errorMessage: intl.formatMessage({ defaultMessage: '枚举名已存在' })
          }
        }
        if (invalidFieldIdx.indexOf(idx) !== -1) {
          setInvalidFieldIdx(idxs => {
            idxs.splice(idxs.indexOf(idx), 1)
          })
        }
        return { result: true }
      }

    return (
      <div className={currentEnum.id ? 'bg-white px-7 py-4 flex-1' : 'w-full'}>
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
                placeholder={intl.formatMessage({ defaultMessage: '请填写枚举名' })}
                initialIsEditing={enumItem.name === ''}
                validation={handleValidateEnumName(enumItem.name, idx)}
              />
            </Col>
            <Col span={8}>
              <NormalInputCell
                data={enumItem.comment?.replace(/^\/\/\s+/, '') ?? ''}
                onBlur={handleCommentChange(enumItem)}
                className="max-w-250px text-color-[#5F626999]"
                placeholder={intl.formatMessage({ defaultMessage: '请填写枚举注释' })}
              />
            </Col>
            <DeleteOutlined onClick={handleDeleteEnum(enumItem)} />
          </Row>
        ))}
        <Modal
          title={intl.formatMessage({ defaultMessage: '新增枚举' })}
          open={enumNameModalVisible}
          onCancel={() => setEnumNameModalVisible(false)}
          destroyOnClose
          footer={
            <ButtonGroup className="gap-2">
              <Button onClick={() => setEnumNameModalVisible(false)}>
                {intl.formatMessage({ defaultMessage: '取消' })}
              </Button>
              <Button
                key="submit"
                htmlType="submit"
                form="new_enum_name_form"
                className={`${styles['save-btn']} cursor-default p-0`}
              >
                {intl.formatMessage({ defaultMessage: '保存' })}
              </Button>
            </ButtonGroup>
          }
        >
          <Form onFinish={handleUpdateEnumName} name="new_enum_name_form">
            <Form.Item
              label={intl.formatMessage({ defaultMessage: '枚举名' })}
              name="enumName"
              initialValue={name}
              rules={[
                {
                  pattern: new RegExp('^([A-Za-z][A-Za-z0-9_]*)*$'),
                  required: true,
                  message: intl.formatMessage({
                    defaultMessage: '枚举名称不合法，pattern: [A-Za-z][A-Za-z0-9_]*'
                  })
                }
              ]}
            >
              <Input autoFocus />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
)
EnumDesigner.displayName = 'EnumDesigner'

export default EnumDesigner
