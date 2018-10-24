import crypto = require('crypto');
import { provide, async, scope, ScopeEnum, config } from 'midway-mirror';

@scope(ScopeEnum.Singleton)
@async()
@provide()
export class Cipher {

  @config('cipher')
  config;

  encrypt(value: string) {
    this.paramCheck(value);
    const cipher = crypto.createCipher('des', this.config.secret);
    return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
  }

  decrypt(value: string) {
    this.paramCheck(value);
    try {
      const decipher = crypto.createDecipher('des', this.config.secret);
      return decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
    } catch (e) {
      return '';
    }
  }

  private paramCheck(value: string) {
    if ('string' !== typeof value) {
      throw new Error('value required');
    }
    // 必须 在 config 中配置 cipher.secret
    if (!this.config.secret) {
      throw new Error('cipher secret config required');
    }
  }

}
