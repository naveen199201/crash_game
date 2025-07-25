// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Player from './models/player.js';
import connectDB from './config/db.js';

dotenv.config();

const players = [
  {
    username: 'alice',
    wallets: {
      BTC: 0.005,
      ETH: 0.1
    }
  },
  {
    username: 'bob',
    wallets: {
      BTC: 0.003,
      ETH: 0.2
    }
  },
  {
    username: 'charlie',
    wallets: {
      BTC: 0.01,
      ETH: 0.05
    }
  }
];

async function seedDB() {
  try {
    await connectDB();
    console.log('MongoDB connected');

    await Player.deleteMany({});
    console.log('Old players removed');

    const createdPlayers = await Player.insertMany(players);
    console.log('New players added:');
    createdPlayers.forEach(player => {
      console.log(`- ${player.username}: ${player._id}`);
    });

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seedDB();
