import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../.env') });

const testFetchMedicines = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Try to fetch medicines
    const medicines = await Medicine.find({})
      .select('_id drugName manufacturer category price consumeType description')
      .limit(10)
      .sort({ drugName: 1 });

    console.log(`✅ Successfully fetched ${medicines.length} medicines`);
    console.log('Sample medicine:', JSON.stringify(medicines[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fetching medicines:', error);
    process.exit(1);
  }
};

testFetchMedicines();
