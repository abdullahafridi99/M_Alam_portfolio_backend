import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please add client name'],
    trim: true,
  },
  designation: {
    type: String,
    default: 'Client',
    trim: true,
  },
  review: {
    type: String,
    required: [true, 'Please add a review'],
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5,
    default: 5,
  },
  image: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Testimonial', TestimonialSchema);
