import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  heroHeadline: {
    type: String,
    default: 'Advocate Mubashir Alam',
  },
  heroSubtitle: {
    type: String,
    default: 'Justice Through Knowledge, Integrity, and Dedication.',
  },
  heroImage: {
    type: String,
    default: '',
  },
  officeAddress: {
    type: String,
    default: 'Chamber 12, District Courts Complex, Karachi, Pakistan',
  },
  officePhone: {
    type: String,
    default: '+92 300 1234567',
  },
  officeEmail: {
    type: String,
    default: 'mubashir.alam@legal.com',
  },
  whatsappNumber: {
    type: String,
    default: '923001234567', // Format without + or spaces
  },
  socialLinks: {
    linkedin: { type: String, default: 'https://linkedin.com' },
    twitter: { type: String, default: 'https://twitter.com' },
    facebook: { type: String, default: 'https://facebook.com' },
  },
  cvUrl: {
    type: String,
    default: '',
  },
  defaultSeoTitle: {
    type: String,
    default: 'Advocate Mubashir Alam | Legal Counsel & Advocate',
  },
  defaultSeoDescription: {
    type: String,
    default: 'Professional portfolio of Advocate Mubashir Alam, providing expert legal counsel in Civil, Criminal, Corporate, and Family Law.',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Setting', SettingSchema);
