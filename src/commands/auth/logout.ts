import {Command} from '../../lib/command'
import {ux} from '@oclif/core'

export default class Logout extends Command {
  static description = 'clears local login credentials'

  static aliases = ['logout']

  async run() {
    ux.action.start('Logging out')
    await this.mesh.logout()
    ux.action.stop()
  }
}
