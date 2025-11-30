
import * as fs from 'fs';
import * as path from 'path';

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Find the service account key file
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');

// Check if the service account key file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    'Service account key not found at serviceAccountKey.json. Please download it from your Firebase project settings and place it in the root directory.'
  );
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const seedReports = async () => {
  const reportsPath = path.join(process.cwd(), 'src', 'data', 'demo-reports.json');
  const reportsData = fs.readFileSync(reportsPath, 'utf-8');
  const reports = JSON.parse(reportsData);

  const reportsCollection = db.collection('reports');

  for (const report of reports) {
    await reportsCollection.doc(report.reportId).set(report);
    console.log(`Seeded report: ${report.reportId}`);
  }

  console.log('Seeding complete!');
  process.exit(0);
};

seedReports().catch(error => {
  console.error('Error seeding reports:', error);
  process.exit(1);
});
