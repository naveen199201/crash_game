// services/gameEngine.js
import GameRound from '../models/GameRound.js';
import { generateCrashPoint } from '../utils/provablyFair.js';

let roundNumber = 0;

export function startGameEngine(io) {
  setInterval(async () => {
    roundNumber++;
    const startTime = new Date();
    const crashPoint = generateCrashPoint('server_seed', roundNumber);

    const newRound = await GameRound.create({
      roundNumber,
      startTime,
      crashPoint,
      bets: []
    });

    io.emit('roundStart', { roundNumber, startTime });

    let multiplier = 1;
    const growthFactor = 0.02;
    const interval = setInterval(() => {
      multiplier += multiplier * growthFactor;
      io.emit('multiplierUpdate', { roundNumber, multiplier });

      if (multiplier >= crashPoint) {
        clearInterval(interval);
        io.emit('roundCrash', { roundNumber, crashPoint });
      }
    }, 100);
  }, 10000);
}