import {Command, flags} from '../../lib/command'
import {FlagInput} from '@oclif/core/lib/interfaces/parser'
import {Args, ux} from "@oclif/core";
import {AppUtils} from "../../lib/app-utils";
import {exists} from "../../lib/file";
import * as fs from "node:fs";

export default class Info extends Command {
  static description = 'copy files to and from app containers'

  static aliases = ['copy', 'cp']

  static flags: FlagInput  = {
    id: flags.string({description: 'id of your application', required: true}),
    cid: flags.string({description: 'id of your container'}),
    path: flags.string({description: 'path inside the container', required: true}),
  }

  static args = {
    localPath: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Info);
    const {flags, args} = context;

    if (args.localPath && !(await exists(args.localPath))) {
      throw new Error('File ' + args.localPath + ' was not found!');
    }

    const apps = await new AppUtils(this.mesh).appInfo(flags.id);
    if (apps?.length) {
      if (args.localPath) { // Upload
        const file = fs.createReadStream(args.localPath);
        ux.action.start('Uploading');
        await new AppUtils(this.mesh).uploadFile(file, flags.id, flags.path, flags.cid);
        ux.action.stop();
      } else { // Download
        ux.action.start('Downloading');
        await new AppUtils(this.mesh).downloadFile(flags.id, flags.path, flags.cid);
        ux.action.stop();
      }
    } else {
      ux.error(`Application with id ${flags.id} was not found on your profile`);
    }
  }
}