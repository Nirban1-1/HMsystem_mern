import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanCorruptedMedicines = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_db');
    console.log('MongoDB connected');

    console.log('Scanning for corrupted medicine records...\n');

    let totalScanned = 0;
    let corruptedCount = 0;
    let deletedCount = 0;
    const corruptedIds = [];

    // Use cursor to process documents one by one
    const cursor = Medicine.find({}).cursor();

    for await (const doc of cursor) {
      totalScanned++;
      
      try {
        // Try to convert to object and validate critical fields
        const medicine = doc.toObject();
        
        // Check if drugName is a valid string
        if (!medicine.drugName || typeof medicine.drugName !== 'string') {
          throw new Error('Invalid drugName');
        }

        // Try to access and validate the drugName
        const testName = medicine.drugName.toString();
        if (testName.includes('\uFFFD') || testName.includes('�')) {
          throw new Error('Contains invalid UTF-8 characters');
        }

        // Log progress every 1000 documents
        if (totalScanned % 1000 === 0) {
          console.log(`Scanned ${totalScanned} documents... (${corruptedCount} corrupted found)`);
        }

      } catch (err) {
        corruptedCount++;
        console.log(`\n❌ Corrupted document found:`);
        console.log(`   ID: ${doc._id}`);
        console.log(`   Error: ${err.message}`);
        
        try {
          // Try to get the name if possible
          console.log(`   Attempted drugName: ${doc.drugName || 'N/A'}`);
        } catch {
          console.log(`   drugName: [Unable to read]`);
        }

        corruptedIds.push(doc._id);

        // Delete the corrupted document
        try {
          await Medicine.deleteOne({ _id: doc._id });
          deletedCount++;
          console.log(`   ✓ Deleted corrupted document`);
        } catch (deleteErr) {
          console.log(`   ✗ Failed to delete: ${deleteErr.message}`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('CLEANUP SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Total documents scanned: ${totalScanned}`);
    console.log(`Corrupted documents found: ${corruptedCount}`);
    console.log(`Corrupted documents deleted: ${deletedCount}`);
    console.log('='.repeat(60));

    if (corruptedCount === 0) {
      console.log('\n✅ No corrupted documents found! Database is clean.');
    } else if (deletedCount === corruptedCount) {
      console.log('\n✅ All corrupted documents have been removed!');
    } else {
      console.log('\n⚠️  Some corrupted documents could not be deleted.');
      console.log('You may need to manually remove them or restore from backup.');
    }

    mongoose.connection.close();
    console.log('\nDatabase connection closed.');

  } catch (error) {
    console.error('Error during cleanup:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the cleanup
cleanCorruptedMedicines();
