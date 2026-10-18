import mongoose from 'mongoose';
import { ENV } from './env';

export interface DatabaseState {
  isConnected: boolean;
  connectionString: string;
  error?: string;
}

export const dbState: DatabaseState = {
  isConnected: false,
  connectionString: ENV.MONGODB_URI,
};

export async function connectDB(): Promise<boolean> {
  const uri = ENV.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB Warning]: MONGODB_URI is not defined in environment variables.');
    dbState.error = 'MONGODB_URI is missing';
    return false;
  }

  // Safety check for placeholder strings
  if (uri.includes('<username>') || uri.includes('<password>')) {
    const errorMsg = '⚠️ [MongoDB Warning]: Your MONGODB_URI still contains placeholder "<username>" or "<password>". Please update server/.env with your real MongoDB Atlas credentials.';
    console.warn(errorMsg);
    dbState.error = errorMsg;
    return false;
  }

  try {
    console.log(`🔌 Attempting to connect to MongoDB...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    dbState.isConnected = true;
    dbState.error = undefined;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return true;
  } catch (error: any) {
    dbState.isConnected = false;
    dbState.error = error.message;

    console.error('❌ [MongoDB Connection Error]:', error.message);
    if (uri.includes('mongodb+srv://')) {
      console.error('\n📌 [MongoDB Atlas Cluster Troubleshooting Tips]:');
      console.error('1. Did you whitelist your IP address in Atlas (Security > Network Access -> 0.0.0.0/0)?');
      console.error('2. Is your Database User password correct and URL-encoded if it contains special characters (@, #, etc.)?');
      console.error('3. Verify your Database User in Atlas (Security > Database Access).\n');
    }
    return false;
  }
}
