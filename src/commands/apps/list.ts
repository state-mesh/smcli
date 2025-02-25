import {APIClient, Command} from '../../lib/command'
import {ux} from "@oclif/core";

export default class Info extends Command {
  static description = 'list applications'

  static aliases = ['list']

  async run() {
    const apps: any = await appInfo(this.mesh);
    if (apps?.length) {
      apps.forEach((app: any) => {
        ux.log(app.name + "   |   " + app.id);
      });
    } else {
      ux.error(`There was no application found on your profile`);
    }
  }
}

async function appInfo(mesh: APIClient) {
  const {body: appList} = await mesh.get<any>('/api/applications', {retryAuth: true})
  return appList;
}