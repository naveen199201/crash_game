// sockets/gameSocket.js
import Player from '../models/player.js';
import GameRound from '../models/GameRound.js';
import Transaction from '../models/Transaction.js';
import { getCryptoPrice } from '../services/priceService.js';
import crypto from 'crypto';

export function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('cashout', async ({ playerId }) => {
      try {
        const player = await Player.findById(playerId);
        if (!player) return socket.emit('error', 'Player not found');

        const currentRound = await GameRound.findOne().sort({ createdAt: -1 });
        if (!currentRound) return socket.emit('error', 'No active round');

        const bet = currentRound.bets.find(
          b => b.playerId.toString() === playerId && !b.didCashout
        );

        if (!bet) return socket.emit('error', 'No active bet found or already cashed out');

        const timeElapsed = (Date.now() - new Date(currentRound.startTime).getTime()) / 1000;
        const growthFactor = 0.02;
        const multiplier = 1 + timeElapsed * growthFactor;

        const payout = bet.cryptoAmount * multiplier;
        player.wallets[bet.currency] += payout;
        await player.save();

        bet.didCashout = true;
        bet.multiplierAtCashout = multiplier;
        await currentRound.save();

        const price = await getCryptoPrice(bet.currency);
        const transaction = await Transaction.create({
          playerId,
          usdAmount: payout * price,
          cryptoAmount: payout,
          currency: bet.currency,
          transactionType: 'cashout',
          transactionHash: crypto.randomBytes(16).toString('hex'),
          priceAtTime: price
        });

        socket.emit('cashoutSuccess', { playerId, payout, multiplier });
        io.emit('playerCashout', {
          playerId,
          payout,
          multiplier,
          usdValue: payout * price
        });
      } catch (err) {
        console.error('Socket cashout error:', err.message);
        socket.emit('error', 'Cashout failed');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}


// Export gameSocket as part of the full app flow
