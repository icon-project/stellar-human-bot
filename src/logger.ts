import * as fs from 'node:fs';
import * as path from 'node:path';

const date = new Date();

const LOG_FILE = path.resolve(__dirname, `../logs/operations-${date.toISOString().split('T')[0]}.log`);

export function logOperation(message: string) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}
