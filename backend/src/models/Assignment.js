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
      enum: ['proposed', 'confirmed', 'active', 'ended'],
      default: 'proposed',
    },
  },
  {
    timestamps: true,
  }
);

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
