import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    course: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    type: { type: String, enum: ['New', 'Follow-up', 'Enrolled'], default: 'New' },
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', EnquirySchema);
export default Enquiry;
