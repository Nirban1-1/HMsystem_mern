import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import { data as sampleMedicins } from './medicine.js';
import dotenv from 'dotenv';

dotenv.config();

const seedMedicines = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for medicine seeding');

    // Clear existing medicines
    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    // Validate data before inserting
    console.log(`Attempting to insert ${sampleMedicins.length} medicines...`);
    
    // Insert medicines one by one to find problematic entries
    let successCount = 0;
    let failCount = 0;
    
    for (const med of sampleMedicins) {
      try {
        await Medicine.create(med);
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to insert medicine: ${med.drugName}`, error.message);
      }
    }

    console.log(`✅ Successfully seeded ${successCount} medicines to the database`);
    if (failCount > 0) {
      console.log(`⚠️  Failed to seed ${failCount} medicines`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding medicines:', error);
    process.exit(1);
  }
};

seedMedicines();
