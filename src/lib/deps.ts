// remote
import oclif = require('@oclif/core')
import HTTP = require('@heroku/http-call')
import netrc = require('netrc-parser')

import apiClient = require('./api-client')
import file = require('./file')
import flags = require('./flags')
import git = require('./git')
import mutex = require('./mutex')

const {ux} = oclif

export const deps = {
  // remote
  get cli(): typeof ux {
    return fetch('@oclif/core').ux
  },
  get HTTP(): typeof HTTP {
    return fetch('@heroku/http-call')
  },
  get netrc(): typeof netrc.default {
    return fetch('netrc-parser').default
  },

  // local
  get Mutex(): typeof mutex.Mutex {
    return fetch('./mutex').Mutex
  },
  get APIClient(): typeof apiClient.APIClient {
    return fetch('./api-client').APIClient
  },
  get file(): typeof file {
    return fetch('./file')
  },
  get flags(): typeof flags {
    return fetch('./flags')
  },
  get Git(): typeof git.Git {
    return fetch('./git').Git
  },
}

const cache: any = {}

function fetch(s: string) {
  if (!cache[s]) {
    cache[s] = require(s)
  }

  return cache[s]
}

export default deps
