import { useCallback, useMemo } from 'react'
import { useIntl } from 'react-intl'

type Case = {
  pattern: RegExp
  message: string
}

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
      }
    }),
    [intl]
  )
  const ruleMap = useMemo(
    () => ({
      api: [caseMap.startWithUpperCase, caseMap.baseChar, caseMap.endWithAlphabetOrNumber],
      name: [caseMap.startWithAlphabet, caseMap.baseChar, caseMap.endWithAlphabetOrNumber]
    }),
    [caseMap]
  )

  const runValidate = useCallback(
    (rules: Case[], value: string) => {
      const errorCase = rules.find(item => {
        return !item.pattern.test(value)
      })
      return errorCase?.message
    },
    [caseMap]
  )

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
