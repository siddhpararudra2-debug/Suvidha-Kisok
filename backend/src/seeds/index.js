// File: /backend/src/seeds/index.js

import mongoose from 'mongoose';
import { seedCitizens } from './citizensSeed.js';
import { seedOfficials } from './officialsSeed.js';
import { seedSchemes } from './schemesSeed.js';
// import { seedBills } from './billsSeed.js';
// import { seedInfrastructure } from './infrastructureSeed.js';
// import { seedComplaints } from './complaintsSeed.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/suvidha';

const runAllSeeds = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Starting data seeding...\n');

    // Seed in order
    await seedCitizens();      // 30 citizens
    await seedOfficials();     // 30 officials
    await seedSchemes();       // 20 schemes
    // await seedBills();         // Bills for all citizens
    // await seedInfrastructure(); // Map infrastructure data
    // await seedComplaints();    // Sample complaints

    console.log('\n✅ ALL DATA SEEDED SUCCESSFULLY!');
    console.log('─'.repeat(50));
    console.log('📊 Summary:');
    console.log('   • Citizens: 30');
    console.log('   • Officials: 30');
    console.log('   • Schemes: 20');
    console.log('   • Bills: Generated for all citizens (Pending)');
    console.log('   • Infrastructure: Substations, CNG Stations, Water Tanks (Pending)');
    console.log('─'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeds
runAllSeeds();
