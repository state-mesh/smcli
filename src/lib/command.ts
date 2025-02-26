import {Command as Base} from '@oclif/core'
import {ArgOutput, FlagOutput, Input, ParserOutput} from '@oclif/core/lib/interfaces/parser'
import {APIClient, IOptions} from './api-client'
import deps from './deps'
import * as flags from './flags'

export abstract class Command extends Base {
  _mesh!: APIClient

  get mesh(): APIClient {
    if (this._mesh) return this._mesh
    const options: IOptions = {}
    this._mesh = new deps.APIClient(this.config, options)
    return this._mesh
  }


  protected async parse<F extends FlagOutput, B extends FlagOutput, A extends ArgOutput>(options?: Input<F, B, A>, argv?: string[]): Promise<ParserOutput<F, B, A>> {
    return super.parse(options, argv)
  }
}

export {APIClient} from './api-client'
export {vars} from './vars'
export {flags}

export default Command