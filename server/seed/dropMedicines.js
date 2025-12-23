import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server directory
dotenv.config({ path: join(__dirname, '../.env') });

const dropMedicineCollection = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Drop the medicines collection completely
    await mongoose.connection.db.dropCollection('medicines');
    console.log('✅ Successfully dropped medicines collection');

    process.exit(0);
  } catch (error) {
    if (error.message.includes('ns not found')) {
      console.log('Collection does not exist, nothing to drop');
      process.exit(0);
    }
    console.error('Error dropping collection:', error);
    process.exit(1);
  }
};

dropMedicineCollection();
