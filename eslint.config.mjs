import {includeIgnoreFile} from '@eslint/compat'
import oclif from 'eslint-config-oclif'
import prettier from 'eslint-config-prettier'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const gitignorePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.gitignore')

export default [
  includeIgnoreFile(gitignorePath),
  ...oclif,
  prettier,
  {
    rules: {
      // Turn off to support Node 18. You can remove this rule if you don't need to support Node 18.
      "camelcase":"off",
      "indent": ["error", 2, {"MemberExpression": 1}],
      "no-useless-constructor": "warn",
      "node/no-deprecated-api": "warn", // we should fix this
      "node/no-missing-import": "warn", // we should fix this
      "node/no-missing-require": "warn", // we should fix this
      "unicorn/consistent-function-scoping": "off",
      "unicorn/import-style": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-array-push-push": "warn",
      "unicorn/no-static-only-class": "off",
      "unicorn/numeric-separators-style":"off",
      "unicorn/prefer-array-some": "warn",
      "unicorn/prefer-node-protocol": "off"
    }
  }
]
