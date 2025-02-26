import {Command, flags} from '../../lib/command'
import {FlagInput} from "@oclif/core/lib/interfaces/parser";
import {Args, ux} from "@oclif/core";
import {AppUtils} from "../../lib/app-utils";
import {Logger} from "../../lib/logger";

export default class Logs extends Command {
  static description = 'view application logs'

  static aliases = ['logs']

  static flags: FlagInput  = {
    id: flags.string({description: 'id of your application'}),
  }

  static args = {
    id: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Logs);
    const {flags, args} = context;

    const id = args.id || flags.id;
    if (!id) {
      throw new Error('No application id specified.\n' +
          'USAGE: smcli logs [id] OR smcli logs --id [id]');
    }

    const apps = await new AppUtils(this.mesh).appInfo(id);
    if (apps?.length) {
      const containerId = apps[0].containers?.[0].id;
      if (containerId) {
        await new Logger(this.mesh).start(id, containerId);
      } else {
        throw Error('Application has no container');
      }
    } else {
      ux.error(`Application with id ${id} was not found on your profile`);
    }
  }
}



