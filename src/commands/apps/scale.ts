import {Command, flags} from '../../lib/command'
import {FlagInput} from '@oclif/core/lib/interfaces/parser'
import {Args, ux} from "@oclif/core";
import {AppUtils} from "../../lib/app-utils";

export default class Scale extends Command {
  static description = 'scale an application'

  static aliases = ['scale']

  static flags: FlagInput  = {
    id: flags.string({description: 'id of your application'}),
    replicas: flags.integer({description: 'number of replicas [0-4]', required: true})
  }

  static args = {
    id: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Scale);
    const {flags, args} = context;

    const id = args.id || flags.id;
    if (!id) {
      throw new Error('No application id specified.\n' +
          'USAGE: smcli scale [id] --replicas [NUM_REPLICAS] OR smcli scale --id [id] --replicas [NUM_REPLICAS]');
    }

    if (flags.replicas < 0 || flags.replicas > 4) {
      ux.error('Replicas must be between 0 and 4');
    }

    const apps = await new AppUtils(this.mesh).appInfo(id);
    if (apps?.length) {
      ux.action.start('Scaling');
      await new AppUtils(this.mesh).controlApp(id, 'scale', flags.replicas);
      ux.info('Application has been scaled');
    } else {
      ux.error(`Application with id ${id} was not found on your profile`);
    }
  }
}