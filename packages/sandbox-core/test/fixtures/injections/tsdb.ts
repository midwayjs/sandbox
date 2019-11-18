import { provide } from 'midway-web';
import { TSDB } from '../../../src/core/dataSource/tsdb';

@provide('tsdb')
export class TSDBForTest extends TSDB {}
