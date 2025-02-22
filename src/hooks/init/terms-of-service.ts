import {Hook, ux} from '@oclif/core'
import * as path from 'path'
import * as fs from 'fs-extra'

export function checkTos(options: any) {
  const tosPath: string = path.join(options.config.cacheDir, 'terms-of-service')
  const viewedBanner = fs.pathExistsSync(tosPath)
  const message = 'Our terms and conditions: https://www.statemesh.net/terms-of-use'

  if (!viewedBanner) {
    ux.warn(message)
    fs.createFile(tosPath)
  }
}

const hook: Hook.Init = async function (options) {
  checkTos(options)
}

export default hook
