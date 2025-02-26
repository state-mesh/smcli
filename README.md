smcli
=================

StateMesh CLI


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/smcli.svg)](https://npmjs.org/package/statemeshcli)
[![Downloads/week](https://img.shields.io/npm/dw/smcli.svg)](https://npmjs.org/package/statemeshcli)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g smcli
$ smcli COMMAND
running command...
$ smcli (--version)
smcli/1.0.0 linux-x64 node-v22.9.0
$ smcli --help [COMMAND]
USAGE
  $ smcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`smcli apps delete`](#smcli-apps-delete)
* [`smcli apps deploy`](#smcli-apps-deploy)
* [`smcli apps info`](#smcli-apps-info)
* [`smcli apps list`](#smcli-apps-list)
* [`smcli auth login`](#smcli-auth-login)
* [`smcli auth logout`](#smcli-auth-logout)
* [`smcli auth whoami`](#smcli-auth-whoami)
* [`smcli delete`](#smcli-delete)
* [`smcli deploy`](#smcli-deploy)
* [`smcli help [COMMAND]`](#smcli-help-command)
* [`smcli info`](#smcli-info)
* [`smcli list`](#smcli-list)
* [`smcli login`](#smcli-login)
* [`smcli logout`](#smcli-logout)
* [`smcli plugins`](#smcli-plugins)
* [`smcli plugins add PLUGIN`](#smcli-plugins-add-plugin)
* [`smcli plugins:inspect PLUGIN...`](#smcli-pluginsinspect-plugin)
* [`smcli plugins install PLUGIN`](#smcli-plugins-install-plugin)
* [`smcli plugins link PATH`](#smcli-plugins-link-path)
* [`smcli plugins remove [PLUGIN]`](#smcli-plugins-remove-plugin)
* [`smcli plugins reset`](#smcli-plugins-reset)
* [`smcli plugins uninstall [PLUGIN]`](#smcli-plugins-uninstall-plugin)
* [`smcli plugins unlink [PLUGIN]`](#smcli-plugins-unlink-plugin)
* [`smcli plugins update`](#smcli-plugins-update)
* [`smcli whoami`](#smcli-whoami)

## `smcli apps delete`

delete an application

```
USAGE
  $ smcli apps delete [ID] [--id <value>]

FLAGS
  --id=<value>  id of your application

DESCRIPTION
  delete an application

ALIASES
  $ smcli delete
```

_See code: [src/commands/apps/delete.ts](https://github.com/state-mesh/smcli/blob/v1.0.0/src/commands/apps/delete.ts)_

## `smcli apps deploy`

deploy to StateMesh

```
USAGE
  $ smcli apps deploy [APPNAME] [--appName <value>] [--port <value>] [--repository <value>] [--subPath <value>]

FLAGS
  --appName=<value>     name of your application
  --port=<value>        port exposed by your app for web ingress
  --repository=<value>  public github.com repository of your application
  --subPath=<value>     directory inside your repository to build

DESCRIPTION
  deploy to StateMesh

ALIASES
  $ smcli deploy
```

_See code: [src/commands/apps/deploy.ts](https://github.com/state-mesh/smcli/blob/v1.0.0/src/commands/apps/deploy.ts)_

## `smcli apps info`

information about an application

```
USAGE
  $ smcli apps info [ID] [--id <value>]

FLAGS
  --id=<value>  id of your application

DESCRIPTION
  information about an application

ALIASES
  $ smcli info
```

_See code: [src/commands/apps/info.ts](https://github.com/state-mesh/smcli/blob/v1.0.0/src/commands/apps/info.ts)_

## `smcli apps list`

list applications

```
USAGE
  $ smcli apps list

DESCRIPTION
  list applications

ALIASES
  $ smcli list
```

_See code: [src/commands/apps/list.ts](https://github.com/state-mesh/smcli/blob/v1.0.0/src/commands/apps/list.ts)_

## `smcli auth login`

login with your StateMesh credentials

```
USAGE
  $ smcli auth login [--browser <value>] [-i]

FLAGS
  -i, --interactive      login with username/password
      --browser=<value>  browser to open Login with (example: "firefox", "safari")

DESCRIPTION
  login with your StateMesh credentials

ALIASES
  $ smcli login
```

_See code: [src/commands/auth/login.ts](https://github.com/state-mesh/smcli/blob/v1.0.0/src/commands/auth/login.ts)_

## `smcli auth logout`

clears local login credentials

```
USAGE
  $ smcli auth logout

DESCRIPTION
  clears local login credentials

ALIASES
  $ smcli logout
```

_See code: [src/commands/auth/logout.ts](https://github.com/state-mesh/smcli/blob/v1.0.0/src/commands/auth/logout.ts)_

## `smcli auth whoami`

display the current logged in user

```
USAGE
  $ smcli auth whoami

DESCRIPTION
  display the current logged in user

ALIASES
  $ smcli whoami
```

_See code: [src/commands/auth/whoami.ts](https://github.com/state-mesh/smcli/blob/v1.0.0/src/commands/auth/whoami.ts)_

## `smcli delete`

delete an application

```
USAGE
  $ smcli delete [ID] [--id <value>]

FLAGS
  --id=<value>  id of your application

DESCRIPTION
  delete an application

ALIASES
  $ smcli delete
```

## `smcli deploy`

deploy to StateMesh

```
USAGE
  $ smcli deploy [APPNAME] [--appName <value>] [--port <value>] [--repository <value>] [--subPath <value>]

FLAGS
  --appName=<value>     name of your application
  --port=<value>        port exposed by your app for web ingress
  --repository=<value>  public github.com repository of your application
  --subPath=<value>     directory inside your repository to build

DESCRIPTION
  deploy to StateMesh

ALIASES
  $ smcli deploy
```

## `smcli help [COMMAND]`

Display help for smcli.

```
USAGE
  $ smcli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for smcli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.25/src/commands/help.ts)_

## `smcli info`

information about an application

```
USAGE
  $ smcli info [ID] [--id <value>]

FLAGS
  --id=<value>  id of your application

DESCRIPTION
  information about an application

ALIASES
  $ smcli info
```

## `smcli list`

list applications

```
USAGE
  $ smcli list

DESCRIPTION
  list applications

ALIASES
  $ smcli list
```

## `smcli login`

login with your StateMesh credentials

```
USAGE
  $ smcli login [--browser <value>] [-i]

FLAGS
  -i, --interactive      login with username/password
      --browser=<value>  browser to open Login with (example: "firefox", "safari")

DESCRIPTION
  login with your StateMesh credentials

ALIASES
  $ smcli login
```

## `smcli logout`

clears local login credentials

```
USAGE
  $ smcli logout

DESCRIPTION
  clears local login credentials

ALIASES
  $ smcli logout
```

## `smcli plugins`

List installed plugins.

```
USAGE
  $ smcli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ smcli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.33/src/commands/plugins/index.ts)_

## `smcli plugins add PLUGIN`

Installs a plugin into smcli.

```
USAGE
  $ smcli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into smcli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SMCLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SMCLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ smcli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ smcli plugins add myplugin

  Install a plugin from a github url.

    $ smcli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ smcli plugins add someuser/someplugin
```

## `smcli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ smcli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ smcli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.33/src/commands/plugins/inspect.ts)_

## `smcli plugins install PLUGIN`

Installs a plugin into smcli.

```
USAGE
  $ smcli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into smcli.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SMCLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SMCLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ smcli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ smcli plugins install myplugin

  Install a plugin from a github url.

    $ smcli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ smcli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.33/src/commands/plugins/install.ts)_

## `smcli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ smcli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ smcli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.33/src/commands/plugins/link.ts)_

## `smcli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ smcli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ smcli plugins unlink
  $ smcli plugins remove

EXAMPLES
  $ smcli plugins remove myplugin
```

## `smcli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ smcli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.33/src/commands/plugins/reset.ts)_

## `smcli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ smcli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ smcli plugins unlink
  $ smcli plugins remove

EXAMPLES
  $ smcli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.33/src/commands/plugins/uninstall.ts)_

## `smcli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ smcli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ smcli plugins unlink
  $ smcli plugins remove

EXAMPLES
  $ smcli plugins unlink myplugin
```

## `smcli plugins update`

Update installed plugins.

```
USAGE
  $ smcli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.33/src/commands/plugins/update.ts)_

## `smcli whoami`

display the current logged in user

```
USAGE
  $ smcli whoami

DESCRIPTION
  display the current logged in user

ALIASES
  $ smcli whoami
```
<!-- commandsstop -->
