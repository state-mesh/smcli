import {Command} from '../../lib/command'

export default class AuthWhoami extends Command {
  static description = 'display the current logged in user'

  static aliases = ['whoami']

  async run() {
    if (process.env.SM_API_KEY) this.warn('SM_API_KEY is set')
    if (!this.mesh.auth) this.notloggedin()
    try {
      const {body: account} = await this.mesh.get<any>('/api/account', {retryAuth: false})
      this.log(account.login)
    } catch (error: any) {
      if (error.statusCode === 401) this.notloggedin()
      throw error
    }
  }

  notloggedin() {
    this.error('not logged in', {exit: 100})
  }
}
