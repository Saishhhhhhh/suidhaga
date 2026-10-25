// Vercel Serverless Function entry point for Express API
const app = require('../server/index');
const connectDB = require('../server/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB connection error in serverless handler:', err.message);
  }
  return app(req, res);
};
