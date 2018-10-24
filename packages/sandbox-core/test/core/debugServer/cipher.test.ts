import * as assert from 'assert';
import { Cipher } from '../../../src/core/debugServer/cipher';

describe('/src/core/debugServer/cipher.ts', () => {

  it('should throw error when pass null to encrypt', () => {
    assert.throws(() => {
      Cipher.encrypt(null);
    }, Error);
  });

  it('should throw error when pass null to decrypt', () => {
    assert.throws(() => {
      Cipher.decrypt(null);
    }, Error);
  });

});
