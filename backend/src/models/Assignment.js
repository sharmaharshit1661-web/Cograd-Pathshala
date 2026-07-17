import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    student_id: {
      type: String, // Store custom student id
      required: true,
    },
    teacher_id: {
      type: String, // Store custom teacher id
      required: true,
    },
    subject: {
      type: String,
      default: 'Mathematics',
    },
    assigned_by: {
      type: String, // Store custom admin user id
      default: 'admin_1',
    },
    assigned_at: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['proposed', 'confirmed', 'active', 'ended', 'needs_review'],
      default: 'proposed',
    },
    needs_review: {
      type: Boolean,
      default: false,
    },
    review_reason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
