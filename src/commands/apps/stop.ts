import {Command, flags} from '../../lib/command'
import {FlagInput} from '@oclif/core/lib/interfaces/parser'
import {Args, ux} from "@oclif/core";
import {AppUtils} from "../../lib/app-utils";

export default class Stop extends Command {
  static description = 'stop an application'

  static aliases = ['stop']

  static flags: FlagInput  = {
    id: flags.string({description: 'id of your application'}),
  }

  static args = {
    id: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Stop);
    const {flags, args} = context;

    const id = args.id || flags.id;
    if (!id) {
      throw new Error('No application id specified.\n' +
          'USAGE: smcli stop [id] OR smcli stop --id [id]');
    }

    const apps = await new AppUtils(this.mesh).appInfo(id);
    if (apps?.length) {
      ux.action.start('Stopping');
      await new AppUtils(this.mesh).controlApp(id, 'stop');
      ux.info('Application has been stopped');
    } else {
      ux.error(`Application with id ${id} was not found on your profile`);
    }
  }
}