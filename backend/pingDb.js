import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.INGESTION_DB || 'rentfax_ingestion';

async function pingDb() {
  try {
    await mongoose.connect(MONGO_URI, {
  dbName: DB_NAME,
});
    console.log(`✅ Connected successfully to MongoDB: ${DB_NAME}`);
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    console.log('✅ Ping response:', result);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

pingDb();
