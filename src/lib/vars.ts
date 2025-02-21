import * as url from 'url'

export class Vars {
  get host(): string {
    return this.envHost || 'api.eu-central-1.statemesh.net'
  }

  get apiUrl(): string {
    return this.host.startsWith('http') ? this.host : `https://${this.host}`
  }

  get apiHost(): string {
    if (this.host.startsWith('http')) {
      const u = url.parse(this.host)
      if (u.host) return u.host
    }

    return `${this.host}`
  }

  get envHost(): string | undefined {
    return process.env.SM_HOST
  }

  get envGitHost(): string | undefined {
    return process.env.SM_GIT_HOST
  }

  get gitHost(): string {
    if (this.envGitHost) return this.envGitHost
    if (this.host.startsWith('http')) {
      const u = url.parse(this.host)
      if (u.host) return u.host
    }

    return this.host
  }

  get httpGitHost(): string {
    if (this.envGitHost) return this.envGitHost
    if (this.host.startsWith('http')) {
      const u = url.parse(this.host)
      if (u.host) return u.host
    }

    return `git.${this.host}`
  }

  get gitPrefixes(): string[] {
    return [`git@${this.gitHost}:`, `ssh://git@${this.gitHost}/`, `https://${this.httpGitHost}/`]
  }
}

export const vars = new Vars()
