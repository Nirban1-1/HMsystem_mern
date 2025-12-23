import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import { data as medicineData } from './medicine.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../.env') });

const seedMedicines = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for medicine seeding');

    // Clear existing medicines
    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    // Validate data before inserting
    console.log(`Attempting to insert ${medicineData.length} medicines from medicine.js...`);
    
    // Insert medicines one by one to find problematic entries
    let successCount = 0;
    let failCount = 0;
    
    for (const med of medicineData) {
      try {
        await Medicine.create(med);
        successCount++;
        if (successCount % 100 === 0) {
          console.log(`Progress: ${successCount} medicines inserted...`);
        }
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
