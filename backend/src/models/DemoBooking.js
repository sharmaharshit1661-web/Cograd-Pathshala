import mongoose from 'mongoose';

const DemoBookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
    },
    studentClass: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    preferredDate: {
      type: String,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    preferredDays: {
      type: [String],
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    villageArea: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
    },
    assigned_teacher_id: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending_admin_confirmation', 'pending_teacher_acceptance', 'confirmed', 'declined'],
      default: 'pending_admin_confirmation',
    },
  },
  {
    timestamps: true,
  }
);

const DemoBooking = mongoose.model('DemoBooking', DemoBookingSchema);
export default DemoBooking;
