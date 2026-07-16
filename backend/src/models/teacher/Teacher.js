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

const TeacherSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'teacher', enum: ['teacher'] },
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

    // Teacher specific fields
    qualifications: String,
    experience: String,
    bio: String,
    primarySubject: String,
    subjects_taught: [String],
    grade_levels_qualified: [String],
    verification_status: {
      type: String,
      enum: ['Onboarding', 'Pending', 'Verified'],
      default: 'Onboarding'
    },
    onboarding_progress: {
      current_step: { type: Number, default: 1 },
      step_1_identity: {
        status: { type: String, enum: ['Pending', 'Submitted', 'Verified', 'Rejected'], default: 'Pending' },
        aadhaarNumber: { type: String, default: '' },
        panNumber: { type: String, default: '' },
        selfieUrl: { type: String, default: '' },
        aadhaarFileUrl: { type: String, default: '' },
        panFileUrl: { type: String, default: '' },
        isMobileVerified: { type: Boolean, default: false },
        isEmailVerified: { type: Boolean, default: false },
        rejectionReason: { type: String, default: '' }
      },
      step_2_qualification: {
        status: { type: String, enum: ['Pending', 'Submitted', 'Verified', 'Rejected'], default: 'Pending' },
        degreeName: { type: String, default: '' },
        degreeUrl: { type: String, default: '' },
        professionalCertName: { type: String, default: '' },
        professionalCertUrl: { type: String, default: '' },
        universityName: { type: String, default: '' },
        graduationYear: { type: String, default: '' },
        rejectionReason: { type: String, default: '' }
      },
      step_3_competency: {
        status: { type: String, enum: ['Pending', 'Passed', 'Failed'], default: 'Pending' },
        testAttempts: [{
          subject: String,
          scorePercentage: Number,
          passed: Boolean,
          attemptedAt: { type: Date, default: Date.now }
        }]
      },
      step_4_demo: {
        status: { type: String, enum: ['Pending', 'Submitted', 'Approved', 'Rejected'], default: 'Pending' },
        targetGrade: { type: String, default: '' },
        topic: { type: String, default: '' },
        demoVideoUrl: { type: String, default: '' },
        feedback: { type: String, default: '' }
      }
    },
    // CoGrad Certification Program
    certification: {
      payment_status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
      payment_date: { type: Date, default: null },
      payment_transaction_id: { type: String, default: null },
      completed_lectures: { type: [Number], default: [] },
      test_attempts: [{
        score: Number,
        total: { type: Number, default: 100 },
        passed: Boolean,
        attemptedAt: { type: Date, default: Date.now }
      }],
      is_certified: { type: Boolean, default: false },
      certified_at: { type: Date, default: null }
    },

    current_student_count: { type: Number, default: 0 },
    max_student_capacity: { type: Number, default: 5 },
    teaching_style: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    hourly_rate: { type: String, default: '₹500/hr' },
    rating: { type: Number, default: 5.0 },
    qualification: String,
    travelRange: { type: String, default: '5 km radius' },
    documents: [
      {
        id: Number,
        name: String,
        type: { type: String },
        status: { type: String, default: 'Under Review' },
        fileUrl: { type: String, default: null },
        publicId: { type: String, default: null },
        mimetype: { type: String, default: null },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    free_slots: { type: [String], default: [] },
    timetable: { type: [mongoose.Schema.Types.Mixed], default: [] },
    daily_reports: { type: [mongoose.Schema.Types.Mixed], default: [] },
    assignments: { type: [mongoose.Schema.Types.Mixed], default: [] },
    content_schedule: { type: [mongoose.Schema.Types.Mixed], default: [] },
    submissions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    study_materials: { type: [mongoose.Schema.Types.Mixed], default: [] },
    earnings_log: { type: [mongoose.Schema.Types.Mixed], default: [] },
    reviews: { type: [mongoose.Schema.Types.Mixed], default: [] },
    tests: { type: [mongoose.Schema.Types.Mixed], default: [] }
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Encrypt password before saving
TeacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (typeof next === 'function') next();
});

// Compare password
TeacherSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Teacher = mongoose.model('Teacher', TeacherSchema);
export default Teacher;
