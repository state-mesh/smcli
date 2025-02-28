import {Command, flags} from '../../lib/command'
import {FlagInput} from '@oclif/core/lib/interfaces/parser'
import {Args, ux} from "@oclif/core";
import {AppUtils} from "../../lib/app-utils";

export default class Start extends Command {
  static description = 'start an application'

  static aliases = ['start']

  static flags: FlagInput  = {
    id: flags.string({description: 'id of your application'}),
  }

  static args = {
    id: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Start);
    const {flags, args} = context;

    const id = args.id || flags.id;
    if (!id) {
      throw new Error('No application id specified.\n' +
          'USAGE: smcli start [id] OR smcli start --id [id]');
    }

    const apps = await new AppUtils(this.mesh).appInfo(id);
    if (apps?.length) {
      ux.action.start('Starting');
      await new AppUtils(this.mesh).controlApp(id, 'start');
      ux.action.stop();
      ux.info('Application has been started');
    } else {
      ux.error(`Application with id ${id} was not found on your profile`);
    }
  }
}