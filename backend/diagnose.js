#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n🔍 Testing Backend Configuration...\n');
console.log('Environment Variables:');
console.log('  PORT:', process.env.PORT);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL);

console.log('\n📡 Testing MongoDB Connection...');
console.log('Connection string:', process.env.MONGODB_URI?.substring(0, 50) + '...\n');

mongoose.connect(process.env.MONGODB_URI)
  .then((conn) => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('   Host:', conn.connection.host);
    console.log('   Database:', conn.connection.name);
    console.log('\n🎉 All tests passed! Your backend should work fine.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed!\n');
    console.error('Error:', error.message);
    console.error('\n💡 Common Fixes:');
    console.error('   1. Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)');
    console.error('   2. Verify username and password are correct');
    console.error('   3. Ensure database user has read/write permissions');
    console.error('   4. Check if password has special characters (needs URL encoding)');
    console.error('\n');
    process.exit(1);
  });
