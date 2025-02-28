import {Command, flags} from '../../lib/command'
import {FlagInput} from '@oclif/core/lib/interfaces/parser'
import {Args, ux} from "@oclif/core";
import {AppUtils} from "../../lib/app-utils";

export default class Restart extends Command {
  static description = 'rolling restart an application'

  static aliases = ['restart']

  static flags: FlagInput  = {
    id: flags.string({description: 'id of your application'}),
  }

  static args = {
    id: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Restart);
    const {flags, args} = context;

    const id = args.id || flags.id;
    if (!id) {
      throw new Error('No application id specified.\n' +
          'USAGE: smcli restart [id] OR smcli restart --id [id]');
    }

    const apps = await new AppUtils(this.mesh).appInfo(id);
    if (apps?.length) {
      ux.action.start('Restarting');
      await new AppUtils(this.mesh).controlApp(id, 'restart');
      ux.info('Application has been restarted');
    } else {
      ux.error(`Application with id ${id} was not found on your profile`);
    }
  }
}