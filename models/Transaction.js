// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  usdAmount: Number,
  cryptoAmount: Number,
  currency: { type: String, enum: ['BTC', 'ETH'] },
  transactionType: { type: String, enum: ['bet', 'cashout'] },
  transactionHash: String,
  priceAtTime: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);