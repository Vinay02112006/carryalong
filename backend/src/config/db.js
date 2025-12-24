import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    // Add connection options for better error handling
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    };
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // Provide helpful error messages
    if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Check your internet connection and MongoDB Atlas cluster URL');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Check your MongoDB username and password in .env file');
    } else if (error.message.includes('IP')) {
      console.error('💡 Add your IP address to MongoDB Atlas whitelist (Network Access)');
    }
    
    process.exit(1);
  }
};

export default connectDB;
