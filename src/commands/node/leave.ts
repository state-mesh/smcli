import {Command} from '../../lib/command'

export default class Join extends Command {
  static description = 'remove this device from StateMesh network'

  static aliases = ['leave']

  async run() {
    const {execSync: exec} = require('child_process');
    exec(`k3s-agent-uninstall.sh`,
        {
          encoding: 'utf8',
          stdio: 'inherit'
        }
    )
  }
}