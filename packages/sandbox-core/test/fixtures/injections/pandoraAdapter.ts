import { provide } from 'midway-web';
import { PandoraAdapter } from '../../../src/core/adapter/pandoraAdapter';

@provide('pandoraAdapter')
export class PandoraAdapterForTest extends PandoraAdapter {}
