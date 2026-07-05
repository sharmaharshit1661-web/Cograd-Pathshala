import mongoose from 'mongoose';

const AdminSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    centreName: { type: String, default: 'CoGrad' },
    contactEmail: { type: String, default: 'connect@cograd.in' },
    contactPhone: { type: String, default: '+91-9220253001' },
    address: { type: String, default: 'C-56A/28, Sector 62, Noida 201301' },
    session: { type: String, default: '2026-2027' },
    currency: { type: String, default: '₹ (INR)' },
    autoReminders: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    whatsappSync: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AdminSettings = mongoose.model('AdminSettings', AdminSettingsSchema);
export default AdminSettings;
