/**
 *  Copyright (c) 2021 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import monaco from 'monaco-editor'

monaco.languages.register({ id: 'mySpecialLanguage' })
// 为该自定义语言基本的Token
monaco.languages.setMonarchTokensProvider('mySpecialLanguage', vLang)
// 为该语言注册一个语言提示器--联想
monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
  provideCompletionItems: () => {
    return { suggestions: console.log }
  }
})
