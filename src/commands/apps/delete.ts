import {APIClient, Command, flags} from '../../lib/command'
import {FlagInput, ParserOutput} from '@oclif/core/lib/interfaces/parser'
import {Args, ux} from "@oclif/core";
import color from "../../lib/utils/color";

export default class Info extends Command {
  static description = 'delete an application'

  static aliases = ['delete']

  static flags: FlagInput  = {
    id: flags.string({description: 'id of your application'}),
  }

  static args = {
    id: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Info);
    const {flags, args} = context;

    const id = args.id || flags.id;
    if (!id) {
      throw new Error('No application id specified.\n' +
          'USAGE: smcli delete [id] OR smcli delete --id [id]');
    }


    const apps = await appInfo(context, this.mesh, id);
    if (apps?.length) {
      await ux.anykey(`Are you sure you want to delete app ${color.green(apps[0].name)}? \n` +
          `Press any key to continue or ${color.yellow('q')} to exit`);

      ux.action.start("Deleting")
      await deleteApp(context, this.mesh, id);
      ux.action.stop()
      ux.log(`Application ${apps[0].name} was deleted successfully.`);
    } else {
      ux.error(`Application with id ${id} was not found on your profile`);
    }
  }
}

async function appInfo(context: ParserOutput<Info>, mesh: APIClient, id: string) {
  const {body: appList} = await mesh.get<any>('/api/applications', {retryAuth: true})
  return appList ? appList.filter((app: any) => app.id === id) : [];
}

async function deleteApp(context: ParserOutput<Info>, mesh: APIClient, id: string) {
  await mesh.delete<any>(`/api/applications/${id}`)
}