import color from "../../lib/utils/color";
import {APIClient, Command, flags} from '../../lib/command'
import {FlagInput, ParserOutput} from '@oclif/core/lib/interfaces/parser'
import {Args, ux} from "@oclif/core";

export default class Install extends Command {
  static description = 'install DockerHub image to StateMesh'

  static aliases = ['install']

  static flags: FlagInput  = {
    appName: flags.string({description: 'name of your application'}),
    port: flags.integer({description: 'port exposed by your app for web ingress'}),
    image: flags.string({description: 'public DockerHub image of your application (Required)'}),
    tag: flags.string({description: 'tag of the image (default: latest)'})
  }

  static args = {
    appName: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Install);
    const {flags, args} = context;

    const app = args.appName || flags.appName;
    if (!app) {
      throw new Error('No appName specified.\n' +
          'USAGE: smcli install my-app --image [DockerHub image] OR smcli install --appName my-app --image [DockerHub image]');
    }

    if (!flags.image) {
      ux.error('Please specify a public DockerHub image to install using the --image flag');
    }

    ux.log(`Installing application with name ${color.green(app)} from ${color.yellow(flags.image)} on StateMesh\n`);

    if (!flags.port) {
      await ux.anykey(`You didn't specify any port with the --port flag. \n` +
      `You must set the port your app listens on, or will assume ${color.green('80')} as default. Press any key to continue like this or ${color.yellow('q')} to exit`);
    }
    if (!flags.tag) {
      await ux.anykey(`You didn't specify any tag with the --tag flag. \n` +
          `You must set the tag of your image, or will assume ${color.green('latest')} as default. Press any key to continue like this or ${color.yellow('q')} to exit`);
    }

    ux.action.start("Installing")
    const installed = await installApp(context, this.mesh, app)
    if (installed?.id) {
      ux.action.stop(`Check install progress on https://console.cloud.statemesh.net or running: smcli logs ${installed.id}`);
      if (installed.ingressHostName) {
        ux.log(`When the application is fully deployed you can access it here: https://${color.green(installed.ingressHostName)}`);
      }
    } else {
      ux.action.stop();
    }
  }
}

async function installApp(context: ParserOutput<Install>, mesh: APIClient, name: string) {
  const {flags} = context
  const params = {
    appName: name,
    port: flags.port,
    image: flags.image,
    tag: flags.tag ?? 'latest'
  }

  const {body: app} = await mesh.post<any>('/api/external/install', {retryAuth: true, body: params})
  return app
}