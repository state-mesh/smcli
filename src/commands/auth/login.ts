import color from '@heroku-cli/color'
import {Command, flags} from '../../lib/command'
import {FlagInput} from '@oclif/core/lib/interfaces/parser'

export default class Login extends Command {
  static description = 'login with your StateMesh credentials'

  static aliases = ['login']

  static flags: FlagInput  = {
    browser: flags.string({description: 'browser to open Login with (example: "firefox", "safari")'}),
    interactive: flags.boolean({char: 'i', description: 'login with username/password'}),
    'expires-in': flags.integer({char: 'e', description: 'duration of token in seconds (default 30 days)'}),
  }

  async run() {
    const {flags} = await this.parse(Login)
    let method: 'interactive' | undefined
    if (flags.interactive) method = 'interactive'
    await this.mesh.login({method, expiresIn: flags['expires-in'], browser: flags.browser})
    const {body: account} = await this.mesh.get<any>('/api/account', {retryAuth: false})
    this.log(`Logged in as ${color.green(account.login!)}`)
    await this.config.runHook('recache', {type: 'login'})
  }
}
