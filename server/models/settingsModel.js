import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema({
  // We will only ever have one document in this collection
  shippingFee: { type: Number, required: true, default: 120.0 },
  notificationEmail: {
    type: String,
    required: true,
    default: 'info@succulentfairygardens.co.za',
  },
  bankName: { type: String, default: 'FairyTale Bank (Dummy)' },
  accountHolder: { type: String, default: 'Succulent Fairy Gardens' },
  accountNumber: { type: String, default: '123456789' },
  branchCode: { type: String, default: '987654' },
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;