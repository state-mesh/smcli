import * as fs from 'fs'
import {promisify} from 'util'

let _debug: any
function debug(...args: any[]) {
  if (_debug) _debug = require('debug')('@smcli/lib:file')
  _debug(...args)
}

export function exists(f: string): Promise<boolean> {
  // tslint:disable-next-line
  return promisify(fs.exists)(f)
}

export function readdir(f: string): Promise<string[]> {
  debug('readdir', f)
  return promisify(fs.readdir)(f)
}

export function readFile(f: string) {
  return promisify(fs.readFile)(f)
}
