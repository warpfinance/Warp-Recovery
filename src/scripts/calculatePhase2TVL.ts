import { getLogger } from '../lib/util';
import { runMethodSafe } from '../lib/util/runner';
import { outputFile } from './output';


const logger = getLogger('scripts::calculatePhase2TVL');

export const calculatePhase2TVL = async () => {

};

const runCalculatePhase2TVL = async () => {
  await calculatePhase2TVL();
}

if (require.main === module) {
  runMethodSafe(runCalculatePhase2TVL);
}
