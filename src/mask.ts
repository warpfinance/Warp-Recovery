
import * as fs from 'fs';

let data = JSON.parse(fs.readFileSync('./process.json').toString()) as {[account: string]: number}[]
console.log(data);

const res: {
  [account: string]: number
} = {};

for (const entry of data) {
  const account = Object.keys(entry)[0].toLowerCase();
  const mask = Object.values(entry)[0];

  let newValue = res[account];
  if (!newValue) {
    newValue = 0;
  } else {
    console.log(`multiple for ${account}`)
  }

  newValue = newValue | mask;

  res[account] = newValue;
}

fs.writeFileSync('out.json', JSON.stringify(res, undefined, 2));
