import mongoose from 'mongoose';

const TempOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  emailOtp: { type: String, required: true },
  phoneOtp: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-expires in 10 minutes
});

export default mongoose.model('TempOtp', TempOtpSchema);
