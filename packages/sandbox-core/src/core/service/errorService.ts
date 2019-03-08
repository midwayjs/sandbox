import { ErrorRecord, PaginationResult } from '../../interface/services/common';
import * as Interface from '../../interface/services/IErrorService';
import { provide, async, logger, inject } from 'midway-web';
import {ErrorManager} from '../manager/errorManager';

@async()
@provide('errorService')
export class ErrorService implements Interface.IErrorService {

  @logger()
  protected logger;

  @inject('errorManager')
  protected errorManager: ErrorManager;

  async queryErrors(options: Interface.QueryErrorOptions): Promise<PaginationResult<ErrorRecord>> {
    this.logger.info('[Service:API:queryErrors:params:]', options);
    return this.errorManager.findErrors(options).then((data) => {
      return data;
    });
  }

  async queryErrorTypes(
    options: Interface.QueryErrorOptions,
  ): Promise<Interface.QueryErrorTypes> {
    return this.errorManager.findErrorTypes(options).then((data) => {
      return data;
    });
  }

}
