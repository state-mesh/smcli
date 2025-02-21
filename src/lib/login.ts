import color from '@heroku-cli/color'
import * as Mesh from '@heroku-cli/schema'
import {Interfaces, ux} from '@oclif/core'
import HTTP from '@heroku/http-call'
import Netrc from 'netrc-parser'
import * as os from 'os'

import {APIClient, StateMeshAPIError} from './api-client'
import {vars} from './vars'
import open = require('open');

const debug = require('debug')('sm-cli-command')
const hostname = os.hostname()
const thirtyDays = 60 * 60 * 24 * 30

export namespace Login {
  export interface Options {
    expiresIn?: number
    method?: 'interactive' | 'sso' | 'browser'
    browser?: string
  }
}

interface NetrcEntry {
  login: string
  password: string
}

const headers = (token: string) => ({headers: {accept: 'application/vnd.statemesh+json; version=3', authorization: `Bearer ${token}`}})

export class Login {
  loginHost = process.env.SM_LOGIN_HOST || 'https://api.eu-central-1.statemesh.net'

  constructor(private readonly config: Interfaces.Config, private readonly mesh: APIClient) {}

  async login(opts: Login.Options = {}): Promise<void> {
    let loggedIn = false
    try {
      // timeout after 10 minutes
      setTimeout(() => {
        if (!loggedIn) ux.error('timed out')
      }, 1000 * 60 * 10).unref()

      if (process.env.SM_API_KEY) ux.error('Cannot log in with SM_API_KEY set')
      if (opts.expiresIn && opts.expiresIn > thirtyDays) ux.error('Cannot set an expiration longer than thirty days')

      await Netrc.load()
      const previousEntry = Netrc.machines['api.statemesh.com']
      let input: string | undefined = opts.method
      if (!input) {
        if (opts.expiresIn) {
          // can't use browser with --expires-in
          input = 'interactive'
        } else {
          await ux.anykey(`StateMesh: Press any key to open up the browser to login or ${color.yellow('q')} to exit`)
          input = 'browser'
        }
      }

      let auth
      switch (input) {
      case 'b':
      case 'browser':
        auth = await this.browser(opts.browser)
        break
      case 'i':
      case 'interactive':
        auth = await this.interactive(previousEntry && previousEntry.login, opts.expiresIn)
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
    const {body: urls} = await HTTP.post<{browser_url: string, token: string}>(`${this.loginHost}/api/precli`, {
      body: {},
    })
    const url = `${this.loginHost}${urls.browser_url}`

    process.stderr.write(`Opening browser to ${url}\n`)
    let urlDisplayed = false
    const showUrl = () => {
      if (!urlDisplayed) ux.warn('Cannot open browser.')
      urlDisplayed = true
    }

    const cp = await open(url, {wait: false, ...(browser ? {app: {name: browser}} : {})})
    cp.on('error', err => {
      ux.warn(err)
      showUrl()
    })
    cp.on('close', code => {
      if (code !== 0) showUrl()
    })
    ux.action.start('StateMesh: Waiting for login')
    const fetchAuth = async (retries = 3): Promise<{error?: string, access_token: string}> => {
      try {
        const {body: auth} = await HTTP.get<{error?: string, access_token: string}>(`${this.loginHost}/api/postcli`, {
          headers: {authorization: `Bearer ${urls.token}`},
        })
        return auth
      } catch (error: any) {
        if (retries > 0 && error.http && error.http.statusCode > 500) return fetchAuth(retries - 1)
        throw error
      }
    }

    const auth = await fetchAuth()
    if (auth.error) ux.error(auth.error)
    this.mesh.auth = auth.access_token
    ux.action.start('Logging in')
    const {body: account} = await HTTP.get<Mesh.Account>(`${vars.apiUrl}/account`, headers(auth.access_token))
    ux.action.stop()
    return {
      login: account.email!,
      password: auth.access_token,
    }
  }

  private async interactive(login?: string, expiresIn?: number): Promise<NetrcEntry> {
    process.stderr.write('StateMesh: Enter your login credentials\n')
    login = await ux.prompt('Email', {default: login})
    const password = await ux.prompt('Password', {type: 'hide'})

    let auth
    try {
      auth = await this.auth(login!, password, {expiresIn})
    } catch (error: any) {

      if (!error.body?.message) {
        throw error
      }
      ux.error(error.body.message)
    }

    this.mesh.auth = auth.password
    return auth
  }

  private async auth(username: string, password: string, opts: {expiresIn?: number, secondFactor?: string} = {}): Promise<NetrcEntry> {
    const headers: {[k: string]: string} = {
      accept: 'application/json, text/plain, */*',
      'X-Api-Key': '000e1f8f1a9d992f27bca2b25d0a8cc555c8c7bcda518d2d12872dedb9c809d7c781e4022ec43e12e592f94ec527248adeb04265e251ebd626bbb722cdc0e0b92532c700eb61cfec0de846b14df70dee953523d72548f0187795e945b69938e86bc46ba0bfe27a567e4bda93b6032512f931221555a2b04ddc56561b0c9c84739a7c214bb67413d3828bd31a5b7a4cffa096ce83ddab8196f042829d51be72224225ee41915bafb48434f8f089f6178a'
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
