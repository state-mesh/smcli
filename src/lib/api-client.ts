import {Interfaces, ux} from '@oclif/core'
import {CLIError, warn} from '@oclif/core/lib/errors'
import {HTTP, HTTPError, HTTPRequestOptions} from './http/http'
import * as url from 'url'
import * as os from 'os'

import deps from './deps'
import {Login} from './login'
import {vars} from './vars'
import Netrc from "netrc-parser";
import {API_HOST, X_END} from "./utils/constants";
import color from "./utils/color";

const debug = require('debug')

export namespace APIClient {
  export interface Options extends HTTPRequestOptions {
    retryAuth?: boolean
  }
}

export interface IOptions {
  required?: boolean
  preauth?: boolean
  debug?: boolean
  debugHeaders?: boolean
}

export interface IStateMeshAPIErrorOptions {
  resource?: string
  app?: { id: string; name: string }
  id?: string
  message?: string
  url?: string
}

export class StateMeshAPIError extends CLIError {
  http: HTTPError
  body: IStateMeshAPIErrorOptions

  constructor(httpError: HTTPError) {
    if (!httpError) throw new Error('invalid error')
    const options: IStateMeshAPIErrorOptions = httpError.body
    if (!options || !options.message) throw httpError
    const info = []
    if (options.id) info.push(`Error ID: ${options.id}`)
    if (options.app && options.app.name) info.push(`App: ${options.app.name}`)
    if (options.url) info.push(`See ${options.url} for more information.`)
    if (info.length > 0) super([options.message, '', ...info].join('\n'))
    else super(options.message)
    this.http = httpError
    this.body = options
  }
}

export class APIClient {
  preauthPromises: { [k: string]: Promise<HTTP<any>> }
  authPromise?: Promise<HTTP<any>>
  http: typeof HTTP
  private readonly _login = new Login(this.config, this)
  private _auth?: string

  constructor(protected config: Interfaces.Config, public options: IOptions = {}) {
    this.config = config

    if (options.required === undefined) options.required = true
    options.preauth = options.preauth !== false
    if (options.debug) debug.enable('http')
    if (options.debug && options.debugHeaders) debug.enable('http,http:headers')
    this.options = options
    const apiUrl = url.URL ? new url.URL(vars.apiUrl) : url.parse(vars.apiUrl)
    const envHeaders = JSON.parse(process.env.SM_HEADERS ||
        `{"X-Api-Key": "${os.hostname() + X_END}"}`)
    this.preauthPromises = {}
    const self = this as any
    const opts = {
      host: apiUrl.hostname,
      port: apiUrl.port,
      protocol: apiUrl.protocol,
      headers: {
        accept: 'application/vnd.statemesh+json; version=3',
        'user-agent': `sm-cli/${self.config.version} ${self.config.platform}`,
        ...envHeaders,
      },
    }
    this.http = class APIHTTPClient<T> extends deps.HTTP.HTTP.create(opts)<T> {
      static showWarnings<T>(response: HTTP<T>) {
        const warnings = response.headers['warning-message']
        if (Array.isArray(warnings))
          warnings.forEach(warning => warn(`${warning}\n`))
        else if (typeof warnings === 'string')
          warn(`${warnings}\n`)
      }

      static async request<T>(url: string, opts: APIClient.Options = {}, retries = 3): Promise<APIHTTPClient<T>> {
        opts.headers = opts.headers || {}
        if (!Object.keys(opts.headers).some(h => h.toLowerCase() === 'authorization')) {
          opts.headers.authorization = `Bearer ${self.auth}`
        }

        retries--
        try {
          let response: HTTP<T>
          response = await super.request<T>(url, opts)
          this.showWarnings<T>(response)
          return response
        } catch (error: any) {
          if (!(error instanceof deps.HTTP.HTTPError)) throw error
          if (retries > 0) {
            if (opts.retryAuth && error.http.statusCode === 401) {
              if (process.env.SM_API_KEY) {
                throw new Error('The token provided to SM_API_KEY is invalid. Please double-check that you have the correct token, or run `smcli login` without SM_API_KEY set.')
              }

              if (!self.authPromise) {
                const key = await ux.anykey(`StateMesh: Press any key to open up the browser to login, ${color.yellow('q')} to exit or ${color.yellow('i')} to login in terminal`)
                self.authPromise = self.login({method: key === 'i' ? 'i' : 'browser'});
              }
              await self.authPromise
              opts.headers.authorization = `Bearer ${self.auth}`
              return this.request<T>(url, opts, retries)
            }
          }

          throw new StateMeshAPIError(error)
        }
      }
    }
  }

  get auth(): string | undefined {
    if (!this._auth) {
      if (process.env.SM_API_TOKEN && !process.env.SM_API_KEY) deps.cli.warn('SM_API_TOKEN is set but you probably meant SM_API_KEY')
      this._auth = process.env.SM_API_KEY
      if (!this._auth) {
        deps.netrc.loadSync()
        this._auth = deps.netrc.machines[vars.apiHost] && deps.netrc.machines[vars.apiHost].password
      }
    }

    return this._auth
  }

  set auth(token: string | undefined) {
    delete this.authPromise
    this._auth = token
  }

  get<T>(url: string, options: APIClient.Options = {}) {
    return this.http.get<T>(url, options)
  }

  post<T>(url: string, options: APIClient.Options = {}) {
    return this.http.post<T>(url, options)
  }

  put<T>(url: string, options: APIClient.Options = {}) {
    return this.http.put<T>(url, options)
  }

  patch<T>(url: string, options: APIClient.Options = {}) {
    return this.http.patch<T>(url, options)
  }

  delete<T>(url: string, options: APIClient.Options = {}) {
    return this.http.delete<T>(url, options)
  }

  stream(url: string, options: APIClient.Options = {}) {
    return this.http.stream(url, options)
  }

  request<T>(url: string, options: APIClient.Options = {}) {
    return this.http.request<T>(url, options)
  }

  login(opts: Login.Options = {}) {
    return this._login.login(opts)
  }

  async logout() {
    await Netrc.load()
    delete Netrc.machines[API_HOST]
    delete Netrc.machines['git.' + API_HOST]
    await Netrc.save()
  }
}
