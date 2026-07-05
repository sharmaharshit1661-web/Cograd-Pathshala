import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    target: { type: String, default: 'All Students & Teachers' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export default Announcement;
