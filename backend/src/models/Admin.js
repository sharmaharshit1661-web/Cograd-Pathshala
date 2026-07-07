import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'admin',
    },
    login_attempts: {
      type: Number,
      default: 0,
    },
    lock_until: {
      type: Date,
      default: null,
    },
    otp_code: {
      type: String,
      default: null,
    },
    otp_expires_at: {
      type: Date,
      default: null,
    },
    reset_otp_code: {
      type: String,
      default: null,
    },
    reset_otp_expires_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (typeof next === 'function') next();
});

// Compare password
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
