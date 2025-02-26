import {Command, flags} from '../../lib/command'
import {FlagInput} from "@oclif/core/lib/interfaces/parser";
import {Args, ux} from "@oclif/core";
import {AppUtils} from "../../lib/app-utils";
import {Term} from "../../lib/term";

export default class Terminal extends Command {
  static description = 'connect to application terminal'

  static aliases = ['terminal']

  static flags: FlagInput  = {
    id: flags.string({description: 'id of your application'}),
  }

  static args = {
    id: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Terminal);
    const {flags, args} = context;

    const id = args.id || flags.id;
    if (!id) {
      throw new Error('No application id specified.\n' +
          'USAGE: smcli terminal [id] OR smcli terminal --id [id]');
    }

    const apps = await new AppUtils(this.mesh).appInfo(id);
    if (apps?.length) {
      if (apps[0].status !== 'DEPLOYED') {
        ux.error(`App ${apps[0].name} is not deployed yet`);
      }

      const containerId = apps[0].containers?.[0].id;
      if (containerId) {
        await new Term(this.mesh).connect(id, containerId);
      } else {
        throw Error('Application has no container');
      }
    } else {
      ux.error(`Application with id ${id} was not found on your profile`);
    }
  }
}



