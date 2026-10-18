const mongoose = require('mongoose');

const connectDB = async () => {
  const tryConnect = async (retries = 5) => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
      });
      console.log(`🌿 MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);
    } catch (error) {
      console.error(`⚠️ MongoDB Connection Error (${retries} retries left): ${error.message}`);
      if (retries > 0) {
        setTimeout(() => tryConnect(retries - 1), 3000);
      }
    }
  };

  await tryConnect();
};

module.exports = connectDB;
