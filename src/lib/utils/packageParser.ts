// @ts-ignore
const path = require('path')
import {exists} from "../file";

export async function appName() {
  const pjsonPath = path.join(process.env.PWD, 'package.json');
  if (await exists(pjsonPath)) {
    return require(pjsonPath).name;
  }
  return null;
}
