// server/seed/fixRivanAccount.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: 'rivan@gmail.com' });
    
    if (!user) {
      console.log('❌ User rivan@gmail.com NOT FOUND');
      process.exit(1);
    }

    console.log(`\n📝 Current Details:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.is_verified}`);

    // Update to admin
    user.role = 'admin';
    user.is_verified = true;
    user.name = 'Rivan'; // Fix capitalization
    
    // Reset password to "admin"
    user.password = await bcrypt.hash('admin', 10);
    
    await user.save();

    console.log(`\n✅ Updated to:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.is_verified}`);
    console.log(`   Password: admin`);

    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
