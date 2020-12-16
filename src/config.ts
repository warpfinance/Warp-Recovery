import moment from 'moment';
import { getLogger } from './lib/util';

require('dotenv').config();

const logger = getLogger('config');

export const infuraKey = process.env['INFURA_KEY'];
export const platformOpenDate = Date.parse('2020-12-9 18:16:00.000 GMT');
export const competitionStartDate = Date.parse('2020-12-10 18:00:00.000 GMT');
export const competitionEndDate = Date.parse('2020-12-16 18:00:00.000 GMT');

if (!infuraKey) {
  logger.error(`No infura key provided!`);
  throw Error(`No infura key`);
}
