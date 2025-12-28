import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bed from '../models/Bed.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Bed.deleteMany({});

  await Bed.insertMany([
    { code: 'CAB-101', type: 'cabin', category: 'Standard' },
    { code: 'CAB-102', type: 'cabin', category: 'Deluxe' },
    { code: 'ICU-01', type: 'icu', category: 'Ventilated' },
    { code: 'ICU-02', type: 'icu', category: 'Non-ventilated' },
    { code: 'OT-01', type: 'ot', category: 'Minor' },
    { code: 'OT-02', type: 'ot', category: 'Major' },
  ]);

  console.log('Beds seeded');
  await mongoose.disconnect();
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
