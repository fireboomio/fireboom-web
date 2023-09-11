import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'

type Case = {
  pattern: RegExp
  message: string
}
export type Validator = (value: string) => string | undefined

export function useValidate() {
  const intl = useIntl()
  const caseMap = useMemo(
    () => ({
      startWithAlphabet: {
        pattern: /^[a-zA-Z]/,
        message: intl.formatMessage({ defaultMessage: '必须以字母开头' })
      },
      startWithUpperCase: {
        pattern: /^[A-Z]/,
        message: intl.formatMessage({ defaultMessage: '必须以大写字母开头' })
      },
      baseChar: {
        pattern: /^[a-zA-Z0-9_]*$/,
        message: intl.formatMessage({ defaultMessage: '只能包含字母、数字和下划线' })
      },
      endWithAlphabetOrNumber: {
        pattern: /[a-zA-Z0-9]$/,
        message: intl.formatMessage({ defaultMessage: '必须以字母或数字结尾' })
      },
      notDoubleUnderscore: {
        pattern: /^(.(?!__))*$/,
        message: intl.formatMessage({ defaultMessage: '不能包含连续的两个下划线' })
      }
    }),
    [intl]
  )
  const ruleMap = useMemo(
    () => ({
      api: [
        // caseMap.startWithUpperCase,
        caseMap.startWithAlphabet,
        caseMap.baseChar,
        caseMap.endWithAlphabetOrNumber,
        caseMap.notDoubleUnderscore
      ],
      name: [
        caseMap.startWithAlphabet,
        caseMap.baseChar,
        caseMap.endWithAlphabetOrNumber,
        caseMap.notDoubleUnderscore
      ]
    }),
    [caseMap]
  )

  const runValidate = useCallback((rules: Case[], value: string) => {
    const errorCase = rules.find(item => {
      return !item.pattern.test(value)
    })
    return errorCase?.message
  }, [])

  return {
    ruleMap,
    validateAPI: (value: string) => {
      const rules = ruleMap.api
      return runValidate(rules, value)
    },
    validateName: (value: string) => {
      const rules = ruleMap.name
      return runValidate(rules, value)
    }
  }
}
