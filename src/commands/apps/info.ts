import {Command, flags} from '../../lib/command'
import {FlagInput} from '@oclif/core/lib/interfaces/parser'
import {Args, ux} from "@oclif/core";
import color from "../../lib/utils/color";
import {AppUtils} from "../../lib/app-utils";

export default class Info extends Command {
  static description = 'information about an application'

  static aliases = ['info']

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
          'USAGE: smcli info [id] OR smcli info --id [id]');
    }


    const apps = await new AppUtils(this.mesh).appInfo(id);
    if (apps?.length) {
      ux.log("Status: " + (apps[0].status ? apps[0].status : "-"));
      ux.log("Stage: " + (apps[0].stage ? apps[0].stage : "-"));
      ux.log("Public URL: " + (apps[0].ingressHostName ? `https://${color.green(apps[0].ingressHostName)}` : `-`));
    } else {
      ux.error(`Application with id ${id} was not found on your profile`);
    }
  }
}