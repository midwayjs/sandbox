import {ApplicationCtrl} from '../../../src/app/controller/applicationCtrl';
import * as core from 'sandbox-core';
import * as assert from 'assert';
describe('applicationCtrl', () => {
  it('should inherit from sandbox-core', () => {
    const myApplicationCtrl = new ApplicationCtrl();
    assert(myApplicationCtrl instanceof core.ApplicationCtrl);
  });
});
