// server/seed/checkAdmins.js
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

    const admins = await User.find({ role: 'admin' });
    console.log(`\nFound ${admins.length} admin accounts:\n`);
    
    for (const admin of admins) {
      console.log(`📧 Email: ${admin.email}`);
      console.log(`👤 Name: ${admin.name}`);
      console.log(`✓ Verified: ${admin.is_verified}`);
      
      // Test if password "admin" matches
      const isMatch = await bcrypt.compare('admin', admin.password);
      console.log(`🔑 Password "admin" works: ${isMatch ? '✅ YES' : '❌ NO'}`);
      console.log('---');
    }

    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
