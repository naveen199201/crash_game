import crypto from 'crypto';

export function generateCrashPoint(seed, roundNumber) {
  const hash = crypto.createHash('sha256').update(seed + roundNumber).digest('hex');
  const intVal = parseInt(hash.substring(0, 8), 16);
  const maxCrash = 100;
  return 1 + (intVal % maxCrash) / 10;
}