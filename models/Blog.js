import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  author: {
    type: String,
    default: 'Advocate Mubashir Alam',
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create blog slug from the title before saving
BlogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.model('Blog', BlogSchema);
