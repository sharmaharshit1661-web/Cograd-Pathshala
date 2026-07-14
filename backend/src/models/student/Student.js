import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const StudentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'student', enum: ['student'] },
    avatar: String,
    tempPassword: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    notifications: {
      type: [
        {
          id: String,
          text: String,
          isNew: { type: Boolean, default: true },
          time: { type: String, default: 'Just now' },
          createdAt: { type: Date, default: Date.now }
        }
      ],
      default: []
    },
    login_attempts: { type: Number, default: 0 },
    lock_until: { type: Date, default: null },
    otp_code: { type: String, default: null },
    otp_expires_at: { type: Date, default: null },
    reset_otp_code: { type: String, default: null },
    reset_otp_expires_at: { type: Date, default: null },

    // Student specific fields
    standard: String,
    subjects: [String],
    test_score: { type: mongoose.Schema.Types.Mixed, default: null },
    test_completed_at: Date,
    assigned_teacher_id: { type: String, default: null },
    status: { type: String, default: 'pending_test' },
    state: String,
    city: String,
    district: String,
    locality: { type: String, default: null },
    medium: String,
    matching_eligible: { type: Boolean, default: true },
    parentName: String,
    parentPhone: String,
    address: String,
    attendance: { type: String, default: 'N/A' },
    joinDate: String,
    tuitionSlot: String,
    syllabus_chapters: { type: [mongoose.Schema.Types.Mixed], default: [] },
    study_goals: { type: [mongoose.Schema.Types.Mixed], default: [] },
    video_notes: { type: [mongoose.Schema.Types.Mixed], default: [] },
    ai_chat_history: { type: [mongoose.Schema.Types.Mixed], default: [] },
    teacher_doubts: { type: [mongoose.Schema.Types.Mixed], default: [] },
    study_hours_log: { type: [mongoose.Schema.Types.Mixed], default: [] },
    attendance_log: { type: [mongoose.Schema.Types.Mixed], default: [] },
    xp: { type: Number, default: 0 },
    unlocked_rewards: { type: [String], default: [] },
    earned_certificates: { type: [mongoose.Schema.Types.Mixed], default: [] },
    flashcard_mastered: { type: mongoose.Schema.Types.Mixed, default: {} },
    study_groups: { type: [mongoose.Schema.Types.Mixed], default: [] },
    mock_tests_log: { type: [mongoose.Schema.Types.Mixed], default: [] },
    parent_assigned_test: { type: mongoose.Schema.Types.Mixed, default: null },
    parent_assigned_test_result: { type: String, default: null },
    homework_submissions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    feeDue: { type: Number, default: 3000 },
    feeDueDate: { type: String, default: '15 July' },
    feeStatus: { type: String, default: 'Unpaid' },
    activities: { type: [mongoose.Schema.Types.Mixed], default: [] },
    schedule: { type: [mongoose.Schema.Types.Mixed], default: [] },
    rank: { type: Number, default: 5 },
    totalInBatch: { type: Number, default: 25 }
  },
  { timestamps: true }
);

// Encrypt password before saving
StudentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (typeof next === 'function') next();
});

// Compare password
StudentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model('Student', StudentSchema);
export default Student;
