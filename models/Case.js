import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a case title'],
    trim: true,
  },
  clientType: {
    type: String,
    required: [true, 'Please add client type'],
    trim: true,
  },
  challenge: {
    type: String,
    required: [true, 'Please add a challenge description'],
  },
  strategy: {
    type: String,
    required: [true, 'Please add the strategy or solution applied'],
  },
  result: {
    type: String,
    required: [true, 'Please add the case result or outcome'],
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

export default mongoose.model('Case', CaseSchema);
