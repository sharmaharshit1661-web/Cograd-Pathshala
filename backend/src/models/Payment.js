import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    amount: { type: String, required: true },
    method: { type: String, default: 'Cash / Manual' },
    status: { type: String, default: 'Paid' },
    date: { type: String, required: true },
    recordedBy: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
