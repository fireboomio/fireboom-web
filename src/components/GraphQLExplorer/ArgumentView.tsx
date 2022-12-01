import {
  ArgumentNode,
  GraphQLArgument,
  GraphQLField,
  GraphQLNonNull,
  GraphQLNullableType,
  isInputType,
  isNonNullType,
  isNullableType,
  isObjectType,
  Kind,
  ObjectFieldNode,
  ObjectValueNode,
  ValueNode
} from 'graphql'
import { isEnumType, isInputObjectType, isListType, isScalarType } from 'graphql'
import { useCallback, useMemo } from 'react'
import BaseView from './BaseView'
import { useExplorer } from './context'
import { arraySort, convertMapToArray } from './utils'

interface ArgumentViewProps {
  arg: GraphQLArgument | GraphQLField<any, any>
  selections?: (ArgumentNode | ObjectFieldNode)[]
  ensureSelection: () => void
}

const findSelectionIndex = (
  selections: (ArgumentNode | ObjectFieldNode)[],
  arg: GraphQLArgument | GraphQLField<any, any>
) => {
  return selections.findIndex(
    sel =>
      (sel.kind === Kind.ARGUMENT && sel.name.value === arg.name) ||
      (sel.kind === Kind.OBJECT_FIELD && sel.name.value === arg.name)
  )
}

const ArgumentView = ({ arg, selections, ensureSelection }: ArgumentViewProps) => {
  console.log(
    arg.name,
    'isListType',
    isListType(arg.type),
    'inInputList',
    isListType(arg.type) ? isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType) : '',
    'isEnumType',
    isEnumType(arg.type),
    'isNonNullType',
    isNonNullType(arg.type),
    'isInputType',
    isInputType(arg.type),
    'isInputObjectType',
    isInputObjectType(arg.type),
    'isObjectType',
    isObjectType(arg.type)
  )
  const { updateAST } = useExplorer()
  const selectable = useMemo(() => {
    // 基本类型
    return (
      isScalarType(arg.type) ||
      // 枚举
      isEnumType(arg.type) ||
      // 子类型是基本类型或枚举
      (isListType(arg.type) && (isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType)))
    )
  }, [arg.type])

  const currentSelection = useMemo(() => {
    if (selections) {
      const index = findSelectionIndex(selections, arg)
      if (index > -1) {
        return selections[index]
      }
    }
  }, [selections, arg])

  const getDefaultArgValue = useCallback<() => ValueNode>(() => {
    if (isScalarType(arg.type)) {
      switch (arg.type.name) {
        case 'Int':
          return { kind: Kind.INT, value: '10' }
        case 'String':
          return { kind: Kind.STRING, value: '' }
        case 'Boolean':
          return { kind: Kind.BOOLEAN, value: true }
      }
    } else if (isEnumType(arg.type)) {
      return { kind: Kind.ENUM, value: arg.type.getValues()[0].value }
    } else if (isListType(arg.type)) {
      if (isInputType(arg.type)) {
        return { kind: Kind.OBJECT, fields: [] }
      }
      return { kind: Kind.LIST, values: [] }
    }
    return { kind: Kind.OBJECT, fields: [] }
  }, [arg])

  const _ensureSelection = useCallback(() => {
    ensureSelection()
    if (!currentSelection) {
      selections!.push({
        kind: Kind.ARGUMENT,
        name: { kind: Kind.NAME, value: arg.name },
        value: getDefaultArgValue()
      })
    }
  }, [currentSelection, selections, ensureSelection, getDefaultArgValue])

  const onClick = useCallback(
    (expanded: boolean) => {
      if (expanded) {
        _ensureSelection()
        updateAST()
      } else {
        const index = selections ? findSelectionIndex(selections, arg) : -1
        if (index > -1) {
          selections!.splice(index, 1)
          updateAST()
        }
      }
    },
    [selections, _ensureSelection, updateAST]
  )

  const onCheck = useCallback(() => {
    const index = selections ? findSelectionIndex(selections, arg) : -1
    if (index > -1) {
      selections!.splice(index, 1)
    } else {
      _ensureSelection()
    }
    updateAST()
  }, [selections, _ensureSelection, updateAST])

  const child = useMemo(() => {
    if (isListType(arg.type)) {
      if (isScalarType(arg.type.ofType) || isEnumType(arg.type.ofType)) {
        return null
      }
      return (
        <TypedArgumentView
          type={arg.type.ofType}
          // @ts-ignore
          selections={(currentSelection?.value as ObjectValueNode).fields}
          ensureSelection={_ensureSelection}
        />
      )
    }
    if (isInputObjectType(arg.type)) {
      const fields = arg.type.getFields()
      return arraySort(convertMapToArray(fields)).map(field => (
        <ArgumentView
          key={field.name}
          arg={field}
          selections={[]}
          ensureSelection={_ensureSelection}
        />
      ))
    }
    if (isObjectType(arg.type)) {
      // return <ArgumentView arg={arg.type.ofType} />
      return <TypedArgumentView type={arg.type} />
    }
    return null
  }, [arg.type])

  return (
    <BaseView
      color="purple"
      name={arg.name}
      checked={!!currentSelection}
      selectable={selectable}
      onClick={onClick}
      onCheck={onCheck}
    >
      {child}
    </BaseView>
  )
}

export default ArgumentView

export const TypedArgumentView = ({
  type,
  selections,
  ensureSelection
}: {
  type: GraphQLNullableType
  selections?: ObjectFieldNode[]
  ensureSelection: () => void
}) => {
  if (isInputObjectType(type) || isObjectType(type)) {
    const fields = type.getFields()
    return (
      <>
        {(arraySort(convertMapToArray(fields)) as GraphQLField<any, any>[]).map(field => (
          <ArgumentView
            key={field.name}
            arg={field}
            selections={selections}
            ensureSelection={ensureSelection}
          />
        ))}
      </>
    )
  }
  return null
}
