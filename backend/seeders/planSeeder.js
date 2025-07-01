#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Plan from '../models/Plan.js'; // Ensure Plan model is defined as ESM

// Prevent accidental production use
if (process.env.NODE_ENV === 'production') {
  console.error('❌ Seeder is disabled in production.');
  process.exit(1);
}

// Plan definitions
const plans = [
  {
    name: 'Free',
    slug: 'free',
    price: 0,
    features: ['Basic risk reports', 'Limited rental history lookup'],
  },
  {
    name: 'Pro',
    slug: 'pro',
    price: 49,
    features: ['Unlimited risk reports', 'Extended history lookup', 'Priority support'],
  },
  {
    name: 'Unlimited',
    slug: 'unlimited',
    price: 99,
    features: ['Everything in Pro', 'Team collaboration', 'Full API access'],
  },
];

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🔗 Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

async function seedPlans() {
  await connectDB();

  for (const plan of plans) {
    const exists = await Plan.findOne({ slug: plan.slug });
    if (exists) {
      console.log(`⚠️  Plan already exists: ${plan.name}`);
      continue;
    }

    await Plan.create(plan);
    console.log(`✅ Seeded plan: ${plan.name}`);
  }

  console.log('🎯 Plan seeding complete.');
  process.exit(0);
}

seedPlans();
