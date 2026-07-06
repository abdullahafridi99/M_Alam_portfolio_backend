import mongoose from 'mongoose';

const PracticeAreaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a practice area title'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  icon: {
    type: String,
    default: 'Gavel', // Default React Icon string name
  },
  image: {
    type: String,
    default: '',
  },
  services: [String], // Sub-services associated with this area
  faqs: [
    {
      question: String,
      answer: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate slug
PracticeAreaSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('PracticeArea', PracticeAreaSchema);
