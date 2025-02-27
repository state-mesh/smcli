import {Command} from '../../lib/command'
import {API_BASE} from "../../lib/utils/constants";

export default class Join extends Command {
  static description = 'add this device to StateMesh network and become a node operator'

  static aliases = ['join']

  async run() {
    const {body: reservation} = await this.mesh.get<any>('/api/node-reservation', {retryAuth: true});
    const {execSync: exec} = require('child_process');
    exec(`sudo sh -c 'curl -ksfLH "SM_ID: ${reservation.shortSmId}" ${API_BASE}/api/start | sh -'`,
        {
          encoding: 'utf8',
          stdio: 'inherit'
        }
    )
  }
}