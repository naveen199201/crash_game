// models/GameRound.js
import mongoose from 'mongoose';

const gameRoundSchema = new mongoose.Schema({
  roundNumber: Number,
  startTime: Date,
  crashPoint: Number,
  bets: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      usdAmount: Number,
      cryptoAmount: Number,
      currency: String,
      multiplierAtCashout: Number,
      didCashout: Boolean
    }
  ]
}, { timestamps: true });

export default mongoose.model('GameRound', gameRoundSchema);
