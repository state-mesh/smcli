import {Flags} from '@oclif/core'
import {error} from '@oclif/core/lib/errors'

import {configRemote, getGitRemotes} from '../git'

export const app = Flags.custom({
  char: 'a',
  description: 'app to run command against',
  default: async ({flags}) => {
    const envApp = process.env.SM_APP
    if (envApp) return envApp
    const gitRemotes = getGitRemotes(flags.remote || configRemote())
    if (gitRemotes.length === 1) return gitRemotes[0].app
    if (flags.remote && gitRemotes.length === 0) {
      error(`remote ${flags.remote} not found in git remotes`)
    }
  },
})

export const remote = Flags.custom({
  char: 'r',
  description: 'git remote of app to use',
})
