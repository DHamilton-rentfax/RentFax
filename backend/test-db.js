// test-db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
})();
