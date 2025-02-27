import color from "../lib/utils/color";
import {Interfaces, ux} from '@oclif/core'
import HTTP from './http/http'
import Netrc from 'netrc-parser'
import * as os from 'os'

import {APIClient, StateMeshAPIError} from './api-client'
import {vars} from './vars'
import {API_BASE, LOGIN_BASE, X_END} from "./utils/constants";
import open = require('open');

const hostname = os.hostname()

export namespace Login {
  export interface Options {
    method?: 'interactive' | 'browser'
    browser?: string
  }
}

interface NetrcEntry {
  login: string
  password: string
}

const headers = (token: string) => ({headers: {accept: 'application/vnd.statemesh+json; version=3', authorization: `Bearer ${token}`}})

export class Login {
  loginHost = process.env.SM_LOGIN_HOST || LOGIN_BASE;
  loginAPI = process.env.SM_LOGIN_API || API_BASE;

  constructor(private readonly config: Interfaces.Config, private readonly mesh: APIClient) {}

  async login(opts: Login.Options = {}): Promise<void> {
    let loggedIn = false
    try {
      // timeout after 10 minutes
      setTimeout(() => {
        if (!loggedIn) ux.error('timed out')
      }, 1000 * 60 * 10).unref()

      if (process.env.SM_API_KEY) ux.error('Cannot log in with SM_API_KEY set')

      await Netrc.load()
      const previousEntry = Netrc.machines['api.statemesh.com']
      let input: string | undefined = opts.method
      if (!input) {
        const key = await ux.anykey(`StateMesh: Press any key to open up the browser to login, ${color.yellow('q')} to exit or ${color.yellow('i')} to login in terminal`)
        input = key === 'i' ? 'i' : 'browser';
      }

      let auth
      switch (input) {
      case 'b':
      case 'browser':
        auth = await this.browser(opts.browser)
        break
      case 'i':
      case 'interactive':
        auth = await this.interactive(previousEntry && previousEntry.login)
        break
      default:
        return this.login(opts)
      }

      await this.saveToken(auth)
    } catch (error: any) {
      throw new StateMeshAPIError(error)
    } finally {
      loggedIn = true
    }
  }

  private async browser(browser?: string): Promise<NetrcEntry> {
    const {body: urls} = await HTTP.post<{browser_url: string, token: string}>(`${this.loginAPI}/api/cli/pre`, {
      body: {hostname},
      headers: {'X-Api-Key': `${hostname + X_END}`}
    })

    const url = `${this.loginHost}/login${urls.browser_url}`

    process.stderr.write(`Opening browser to ${url}\n`)
    let urlDisplayed = false
    const showUrl = () => {
      if (!urlDisplayed) ux.warn('Cannot open browser.')
      urlDisplayed = true
    }

    try {
      const cp = await open(url, {wait: true, ...(browser ? {app: {name: browser}} : {})})
      cp.on('error', err => {
        ux.warn(err)
        showUrl()
      })
      cp.on('close', code => {
        if (code !== 0) showUrl()
      })
    } catch(error) {
      ux.warn('Could not open browser. Falling back to interactive login');
      return await this.interactive();
    }

    ux.action.start('StateMesh: Waiting for login')
    const fetchAuth = async (): Promise<{error?: string, access_token: string}> => {
      try {
        const {body: auth} = await HTTP.get<{error?: string, access_token: string}>(`${this.loginAPI}/api/cli/post`, {
          headers: {
            authorization: `${urls.token}`,
            'X-Api-Key': `${hostname + X_END}`
          },
        });
        return auth
      } catch (error: any) {
        ux.error('Login failed')
      }
    }

    const auth = await fetchAuth();
    if (auth.error) ux.error(auth.error)
    if (!auth.access_token) ux.error('Login failed. Please close your browser window and try again.');

    this.mesh.auth = auth.access_token
    ux.action.start('Logging in')
    const {body: account} = await HTTP.get<any>(`${vars.apiUrl}/account`, headers(auth.access_token))
    ux.action.stop()
    return {
      login: account.email!,
      password: auth.access_token,
    }
  }

  private async interactive(login?: string): Promise<NetrcEntry> {
    process.stderr.write('StateMesh: Enter your login credentials\n')
    login = await ux.prompt('Email', {default: login})
    const password = await ux.prompt('Password', {type: 'hide'})

    let auth
    try {
      auth = await this.auth(login!, password, {})
    } catch (error: any) {

      if (!error.body?.message) {
        throw error
      }
      ux.error(error.body.message)
    }

    this.mesh.auth = auth.password
    return auth
  }

  private async auth(username: string, password: string, opts: {} = {}): Promise<NetrcEntry> {
    const headers: {[k: string]: string} = {
      accept: 'application/json, text/plain, */*',
      'X-Api-Key': `${hostname + X_END}`
    }

    const {body: auth} = await HTTP.post<any>(`${vars.apiUrl}/api/authenticate`, {
      headers,
      body: {
        username,
        password,
        rememberMe: false
      },
    })
    return {password: auth.id_token, login: auth.id_token}
  }

  private async saveToken(entry: NetrcEntry) {
    const hosts = [vars.apiHost, vars.httpGitHost]
    hosts.forEach(host => {
      if (!Netrc.machines[host]) Netrc.machines[host] = {}
      Netrc.machines[host].login = entry.login
      Netrc.machines[host].password = entry.password
      delete Netrc.machines[host].method
      delete Netrc.machines[host].org
    })

    if (Netrc.machines._tokens) {
      (Netrc.machines._tokens as any).forEach((token: any) => {
        if (hosts.includes(token.host)) {
          token.internalWhitespace = '\n  '
        }
      })
    }

    await Netrc.save()
  }
}
