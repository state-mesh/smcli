import color from "../../lib/utils/color";
import {APIClient, Command, flags} from '../../lib/command'
import {FlagInput, ParserOutput} from '@oclif/core/lib/interfaces/parser'
import {Git} from "../../lib/git";
import {Args, ux} from "@oclif/core";
import {appName} from "../../lib/utils/packageParser";

export default class Deploy extends Command {
  static description = 'deploy to StateMesh'

  static aliases = ['deploy']

  static flags: FlagInput  = {
    appName: flags.string({description: 'name of your application'}),
    port: flags.integer({description: 'port exposed by your app for web ingress'}),
    repository: flags.string({description: 'public github.com repository of your application'}),
    subPath: flags.string({description: 'directory inside your repository to build'})
  }

  static args = {
    appName: Args.string({hidden: true}),
  }

  async run() {
    const context = await this.parse(Deploy);
    const {flags, args} = context;

    const app = args.appName || flags.appName || await appName();
    if (!app) {
      throw new Error('No appName specified.\n' +
          'USAGE: smcli deploy my-app OR smcli deploy --appName my-app\n' +
          'If your application has a package.json then you can simply run: smcli deploy from the root of your application.');
    }

    let remote;
    try {
      remote = new Git().remotes;
    } catch (e: any) {
      ux.warn('GIT is not installed or this is not a .git repository.')
    }
    remote = flags.repository || remote?.[0]?.url;

    if (!remote) {
      ux.error('Could not determine remote .git repository for your application.\n' +
          'Please push your repo or specify a public github.com repository using --repository flag. (E.g. --repository https://github.com/state-mesh/starter-java.git');
    }

    ux.log(`Deploying application with name ${color.green(app)} from ${color.yellow(remote)} on StateMesh\n`);

    if (!flags.port) {
      await ux.anykey(`You didn't specify any port with the --port flag. \n` +
      `You must set the port your app listens on, or will assume ${color.green('80')} as default. Press any key to continue like this or ${color.yellow('q')} to exit`);
    }

    ux.action.start("Building")
    const deployed = await deployApp(context, this.mesh, app, remote)
    if (deployed?.id) {
      ux.action.stop(`Check building progress on https://console.cloud.statemesh.net or running: smcli logs ${deployed.id}`);
      if (deployed.ingressHostName) {
        ux.log(`When the application is fully deployed you can access it here: https://${color.green(deployed.ingressHostName)}`);
      }
    } else {
      ux.action.stop();
    }
  }
}

async function deployApp(context: ParserOutput<Deploy>, mesh: APIClient, name: string, remote: string) {
  const {flags} = context
  const params = {
    appName: name,
    referrer: await safeRemote(remote),
    port: flags.port,
    subPath: flags.subPath
  }

  const {body: app} = await mesh.post<any>('/api/external/deploy', {retryAuth: true, body: params})
  return app
}

async function safeRemote(remote: string): Promise<string> {
  if (remote.startsWith('http')) {
    return remote;
  }

  const parts = remote.split(':');
  return parts.length > 1 ? 'https://github.com/' + parts[1] : remote;
}