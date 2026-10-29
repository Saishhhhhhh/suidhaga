const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: 'Komal (Store Owner)',
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      default: 'admin@suidhaga.com',
    },
    password: {
      type: String,
      required: true,
      default: 'admin123',
    },
    phone: {
      type: String,
      default: '+91 87675 47514',
      trim: true,
    },
    role: {
      type: String,
      default: 'admin',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminUser', adminUserSchema);
