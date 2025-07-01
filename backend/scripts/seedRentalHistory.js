// backend/scripts/seedRentalHistory.js

/**
 * Standalone script to seed a RentalHistory document for testing.
 * Usage:
 *   cd backend
 *   node scripts/seedRentalHistory.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path     = require('path');

const RentalHistory = require(path.join(__dirname, '../models/RentalHistory'));

async function run() {
  // 1) Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  });

  // 2) The applicant ObjectId you want to seed history for:
  const applicantId = '681aaab000c568f778aa7486';
  // ⚠️ Construct with `new`
  const applicantObjectId = new mongoose.Types.ObjectId(applicantId);

  // 3) Sample history data
  const sampleHistory = {
    applicant: applicantObjectId,
    leases: [
      {
        property: '123 Main St',
        start:    '2024-01-01',
        end:      '2024-06-30',
        events: [
          {
            date:        '2024-03-15',
            type:        'incident',
            description: 'Late rent payment'
          },
          {
            date:        '2024-05-10',
            type:        'damage',
            description: 'Broken window'
          }
        ]
      },
      {
        property: '456 Elm Ave',
        start:    '2023-02-01',
        end:      '2023-11-30',
        events: [
          {
            date:        '2023-08-20',
            type:        'smoking',
            description: 'Reported cigarette smell'
          }
        ]
      }
    ]
  };

  // 4) Upsert (create or replace) the history
  await RentalHistory.findOneAndReplace(
    { applicant: applicantObjectId },
    sampleHistory,
    { upsert: true, new: true }
  );

  console.log(`✅ RentalHistory seeded for applicant ${applicantId}`);
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
