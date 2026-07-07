import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    isNew: { type: Boolean, default: true },
    time: { type: String, default: 'Just now' },
  },
  { 
    timestamps: true,
    suppressReservedKeysWarning: true
  }
);

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
