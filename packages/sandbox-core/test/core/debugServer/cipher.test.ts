import * as assert from 'assert';
import { getInstance } from '../../helper';
import { Cipher } from '../../../src/core/debugServer/cipher';

describe('/src/core/debugServer/cipher.ts', () => {

  let cipher: Cipher;

  before(async() => {
    cipher = await getInstance('cipher');
  });

  it('should encrypt/decrypt ok', () => {
    const plainText = 'hello world';
    const cipherText = cipher.encrypt(plainText);
    assert(plainText === cipher.decrypt(cipherText));
  });

  it('should throw error when pass null to encrypt/decrypt', () => {
    assert.throws(() => {
      cipher.decrypt(null);
    }, /value required/);
  });

  it('should throw error when secret is missing', async () => {
    const rawSecret = cipher.config.secret;
    cipher.config.secret = undefined;
    assert.throws(() => {
      cipher.encrypt('hello world');
    }, /secret config required/);
    cipher.config.secret = rawSecret;
  });

});
