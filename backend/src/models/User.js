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
      enum: ['student', 'teacher', 'parent'],
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
    district: String,
    locality: {
      type: String,
      default: null,
    },
    medium: String,
    matching_eligible: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCode: {
      type: String,
      default: null,
    },
    emailVerificationExpires: {
      type: Date,
      default: null,
    },
    avatar: String,
    parentName: String,
    parentPhone: String,
    address: String,
    attendance: {
      type: String,
      default: 'N/A',
    },
    joinDate: String,
    tuitionSlot: String,
    syllabus_chapters: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    study_goals: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    video_notes: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    ai_chat_history: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    teacher_doubts: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    study_hours_log: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    attendance_log: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    xp: {
      type: Number,
      default: 0,
    },
    unlocked_rewards: {
      type: [String],
      default: [],
    },
    earned_certificates: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    flashcard_mastered: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    study_groups: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    mock_tests_log: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    parent_assigned_test: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    parent_assigned_test_result: {
      type: String,
      default: null,
    },
    homework_submissions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    feeDue: {
      type: Number,
      default: 3000,
    },
    feeDueDate: {
      type: String,
      default: '15 July',
    },
    feeStatus: {
      type: String,
      default: 'Unpaid',
    },
    activities: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    schedule: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    rank: {
      type: Number,
      default: 5,
    },
    totalInBatch: {
      type: Number,
      default: 25,
    },


    // Parent fields
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
      default: true,
    },
    childTuitionMode: {
      type: String,
      enum: ['home', 'online', 'either'],
    },
    linkedChildId: {            // ID of an existing student account linked to this parent
      type: String,
      default: null,
    },

    // Teacher fields
    qualifications: String,
    experience: String,
    bio: String,
    primarySubject: String,
    subjects_taught: [String],
    grade_levels_qualified: [String],
    verification_status: {
      type: String,
      enum: ['Onboarding', 'Pending', 'Verified'],
      default: 'Onboarding',
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
        id:         Number,
        name:       String,
        type:       { type: String },
        status:     { type: String, default: 'Under Review' },
        fileUrl:    { type: String, default: null },   // Cloudinary CDN URL (permanent)
        publicId:   { type: String, default: null },   // Cloudinary public_id (for deletion)
        mimetype:   { type: String, default: null },
        uploadedAt: { type: Date,   default: Date.now },
      },
    ],
    tempPassword: {
      type: String,
      default: null,
    },
    free_slots: {
      type: [String],
      default: [],
    },
    timetable: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    daily_reports: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    assignments: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    content_schedule: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    submissions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    study_materials: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    earnings_log: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    reviews: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    tests: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
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
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (typeof next === 'function') next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
