import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const NotificationItemSchema = new mongoose.Schema(
  {
    id: String,
    text: String,
    isNew: { type: Boolean, default: true },
    time: { type: String, default: 'Just now' },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false, suppressReservedKeysWarning: true }
);

const ParentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'parent', enum: ['parent'] },
    avatar: String,
    tempPassword: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    notifications: {
      type: [NotificationItemSchema],
      default: []
    },
    login_attempts: { type: Number, default: 0 },
    lock_until: { type: Date, default: null },
    otp_code: { type: String, default: null },
    otp_expires_at: { type: Date, default: null },
    reset_otp_code: { type: String, default: null },
    reset_otp_expires_at: { type: Date, default: null },

    // Parent specific fields
    relationship: String,       // 'Mother' | 'Father' | 'Guardian'
    childName: String,
    childDob: Date,
    childStandard: String,      // 'Class 1' through 'Class 12'
    childSubjects: [String],
    childCity: String,
    childLocality: String,
    childAddress: String,
    childMatchingEligible: {
      type: Boolean,
      default: true
    },
    childTuitionMode: {
      type: String,
      enum: ['home', 'online', 'either']
    },
    linkedChildId: String
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Encrypt password before saving
ParentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (typeof next === 'function') next();
});

// Compare password
ParentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Parent = mongoose.model('Parent', ParentSchema);
export default Parent;
