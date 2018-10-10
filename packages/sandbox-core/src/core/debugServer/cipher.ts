import crypto = require('crypto');
const secret = 'midway_sandbox';

export class Cipher {

  static encrypt(value: string) {
    if ('string' !== typeof value) {
      throw new Error('value required');
    }
    const cipher = crypto.createCipher('des', secret);
    return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
  }

  static decrypt(value: string) {
    if ('string' !== typeof value) {
      throw new Error('value required');
    }
    try {
      const decipher = crypto.createDecipher('des', secret);
      return decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
    } catch (e) {
      return '';
    }
  }

}
