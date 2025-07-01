// backend/seeders/reportSeeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Report from '../models/Report.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function seedReports(count = 5) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Grab existing user IDs
    const users = await User.find({}, '_id');
    if (users.length === 0) {
      console.error('❌ No users found in DB. Please seed users first.');
      process.exit(1);
    }

    const deleted = await Report.deleteMany({});
    console.log(`🗑 Cleared ${deleted.deletedCount} existing reports`);

    const samples = Array.from({ length: count }, () => {
      const randomUser = faker.helpers.arrayElement(users);

      return {
        name: faker.person.fullName(),
        dob: faker.date.past({ years: 40, refDate: new Date('2005-01-01') }),
        licenseNumber: faker.string.alphanumeric(8).toUpperCase(),
        createdBy: randomUser._id,
        status: faker.helpers.arrayElement(['pending', 'paid', 'flagged']),
        riskScore: faker.number.int({ min: 0, max: 100 }),
        createdAt: faker.date.past({ years: 1 }),
        flags: {
          lateReturns: faker.datatype.boolean(),
          damageIncidents: faker.datatype.boolean(),
          paymentIssues: faker.datatype.boolean(),
        }
      };
    });

    const docs = await Report.insertMany(samples);
    console.log(`🌱 Seeded ${docs.length} reports`);

    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeder error:', err);
    process.exit(1);
  }
}

const count = parseInt(process.argv[2], 10) || 5;
console.log(`⏳ Seeding ${count} reports with risk flags...`);
seedReports(count);
