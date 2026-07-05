import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error('================================================================');
    console.error('DATABASE CONNECTION ERROR: Failed to connect to MongoDB!');
    console.error(`URI: ${process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:[^@]+@/, ':****@') : 'undefined'}`);
    console.error(`Error Details: ${error.message}`);
    console.error('----------------------------------------------------------------');
    console.error('Troubleshooting Steps:');
    if (process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv://')) {
      console.error('1. Check if your current IP address is whitelisted in MongoDB Atlas:');
      console.error('   https://www.mongodb.com/docs/atlas/security-whitelist/');
      console.error('2. Ensure your database username and password are correct in the .env file.');
    } else {
      console.error('1. Check if your local MongoDB service is running:');
      console.error('   Run: brew services start mongodb-community (on macOS) or net start MongoDB (on Windows)');
      console.error('2. Verify if MongoDB is running on port 27017.');
    }
    console.error('================================================================');
  }
};
