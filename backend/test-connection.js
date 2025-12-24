#!/usr/bin/env node

import mongoose from 'mongoose';

const uri = "mongodb+srv://vinaynaidumopidevi:Vinay2006mongo@cluster0.guulvff.mongodb.net/carryalong?retryWrites=true&w=majority";

console.log('🔄 Testing MongoDB Atlas connection...\n');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ SUCCESS! MongoDB Connected');
  console.log('   Database:', mongoose.connection.db.databaseName);
  console.log('   Host:', mongoose.connection.host);
  process.exit(0);
})
.catch((err) => {
  console.log('❌ CONNECTION FAILED\n');
  console.log('Error:', err.message);
  console.log('\n📋 Troubleshooting:');
  
  if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
    console.log('  → Check your internet connection');
    console.log('  → Verify the cluster URL is correct');
  } else if (err.message.includes('Authentication failed')) {
    console.log('  → Wrong username or password');
    console.log('  → Go to MongoDB Atlas → Database Access');
    console.log('  → Verify user "vinaynaidumopidevi" exists');
  } else if (err.message.includes('IP') || err.message.includes('not allowed')) {
    console.log('  → Your IP is not whitelisted');
    console.log('  → Go to MongoDB Atlas → Network Access');
    console.log('  → Click "Add IP Address" → "Allow Access from Anywhere"');
  } else if (err.message.includes('timeout')) {
    console.log('  → Connection timeout - likely IP whitelist issue');
    console.log('  → Go to MongoDB Atlas → Network Access');
    console.log('  → Add 0.0.0.0/0 to allow all IPs');
  }
  
  process.exit(1);
});
