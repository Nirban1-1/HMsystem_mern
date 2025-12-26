// server/seed/createDemoAdmin.js
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

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

    const existing = await User.findOne({ email: 'demo@gmail.com' });

    if (existing) {
      console.log('⚠️  Admin already exists: demo@gmail.com');
      console.log(`   Name: ${existing.name}`);
      console.log(`   Role: ${existing.role}`);
      console.log(`   Verified: ${existing.is_verified}`);
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('admin', 10);
    await User.create({
      name: 'Demo Admin',
      email: 'demo@gmail.com',
      password: hashedPassword,
      phone: '01700000000',
      location: 'Demo Location',
      role: 'admin',
      is_verified: true
    });

    console.log('✅ Demo admin created successfully!');
    console.log('   Email: demo@gmail.com');
    console.log('   Password: admin');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating demo admin:', err.message);
    process.exit(1);
  }
};

run();
