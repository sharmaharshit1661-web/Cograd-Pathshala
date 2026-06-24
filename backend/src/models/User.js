import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
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
      enum: ['student', 'teacher', 'parent', 'admin'],
      required: true,
    },
    // Student fields
    standard: String,
    subjects: [String],
    test_score: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    test_completed_at: Date,
    assigned_teacher_id: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: 'pending_test',
    },
    state: String,
    city: String,
    avatar: String,
    parentName: String,
    parentPhone: String,
    address: String,
    attendance: {
      type: String,
      default: '100%',
    },
    joinDate: String,
    tuitionSlot: String,

    // Teacher fields
    qualifications: String,
    experience: String,
    bio: String,
    subjects_taught: [String],
    grade_levels_qualified: [String],
    verification_status: {
      type: String,
      enum: ['Pending', 'Verified'],
      default: 'Pending',
    },
    current_student_count: {
      type: Number,
      default: 0,
    },
    max_student_capacity: {
      type: Number,
      default: 5,
    },
    teaching_style: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    hourly_rate: {
      type: String,
      default: '₹500/hr',
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    qualification: String,
    travelRange: {
      type: String,
      default: '5 km radius',
    },
    documents: [
      {
        id: Number,
        name: String,
        type: { type: String },
        status: { type: String, default: 'Under Review' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
