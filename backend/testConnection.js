const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  console.log("🔌 Connecting to MongoDB with URI:");
  console.log(process.env.MONGO_URI);

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Success! Connected to MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection FAILED:', err.message);
    process.exit(1);
  }
})();
