import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    const conn = await connectDB();
    if (!conn) {
      console.log('[ClearDB] MongoDB connection skipped or unavailable.');
      process.exit(0);
    }

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`[ClearDB] Cleared collection: ${collection.collectionName}`);
    }

    console.log('[ClearDB] Database successfully cleared! All collections are now empty.');
    process.exit(0);
  } catch (error) {
    console.error('[ClearDB] Error clearing database:', error.message);
    process.exit(0);
  }
};

clearDatabase();
