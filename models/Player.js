import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  wallets: {
    BTC: { type: Number, default: 0 },
    ETH: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);


