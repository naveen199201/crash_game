// routes/wallet.js
import express from 'express';
import Player from '../models/player.js';
import { getCryptoPrice } from '../services/priceService.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });

    const btcPrice = await getCryptoPrice('BTC');
    const ethPrice = await getCryptoPrice('ETH');

    res.json({
      BTC: {
        balance: player.wallets.BTC,
        usd: player.wallets.BTC * btcPrice
      },
      ETH: {
        balance: player.wallets.ETH,
        usd: player.wallets.ETH * ethPrice
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;