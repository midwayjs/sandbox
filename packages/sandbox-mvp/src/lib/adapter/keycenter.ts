import { provide } from 'midway';

@provide('keycenter')
export class Keycenter {
  async encrypt(str, keyName, options) {
    return str;
  }
  async decrypt(str, keyName, options) {
    return str;
  }
}
