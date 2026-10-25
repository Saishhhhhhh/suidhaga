const mongoose = require('mongoose');

const DEFAULT_MONGODB_URI =
  'mongodb://chavansaish11_db_user:1xfnTODX3ACjx9TL@ac-r83stfe-shard-00-00.nokowuu.mongodb.net:27017,ac-r83stfe-shard-00-01.nokowuu.mongodb.net:27017,ac-r83stfe-shard-00-02.nokowuu.mongodb.net:27017/suidhaga?ssl=true&replicaSet=atlas-ccjnrg-shard-0&authSource=admin';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      })
      .then((m) => {
        console.log(`🌿 MongoDB Connected: ${m.connection.host} / ${m.connection.name}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('⚠️ MongoDB Connection Error:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
};

module.exports = connectDB;

