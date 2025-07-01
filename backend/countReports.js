// backend/countReports.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // loads MONGODB_URI or MONGO_URI

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) {
  console.error('❌ No Mongo URI found in .env');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(uri);
    const count = await mongoose.connection.db
      .collection('reports')
      .countDocuments();
    console.log('📊 Report count:', count);
  } catch (err) {
    console.error('Error counting reports:', err);
  } finally {
    await mongoose.disconnect();
  }
})();
