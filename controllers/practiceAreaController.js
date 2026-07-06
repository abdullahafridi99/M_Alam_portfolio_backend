import PracticeArea from '../models/PracticeArea.js';
import { uploadImage } from '../services/cloudinary.js';

export const getPracticeAreas = async (req, res, next) => {
  try {
    const areas = await PracticeArea.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: areas.length, data: areas });
  } catch (error) {
    next(error);
  }
};

export const getPracticeAreaBySlug = async (req, res, next) => {
  try {
    const area = await PracticeArea.findOne({ slug: req.params.slug });
    if (!area) {
      return res.status(404).json({ success: false, message: 'Practice Area not found' });
    }
    res.status(200).json({ success: true, data: area });
  } catch (error) {
    next(error);
  }
};

export const createPracticeArea = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (typeof data.services === 'string') {
      data.services = JSON.parse(data.services);
    }
    if (typeof data.faqs === 'string') {
      data.faqs = JSON.parse(data.faqs);
    }
    if (req.file) {
      data.image = await uploadImage(req.file.path);
    }
    const area = await PracticeArea.create(data);
    res.status(201).json({ success: true, data: area });
  } catch (error) {
    next(error);
  }
};

export const updatePracticeArea = async (req, res, next) => {
  try {
    let area = await PracticeArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Practice Area not found' });
    }

    const data = { ...req.body };
    if (typeof data.services === 'string') {
      data.services = JSON.parse(data.services);
    }
    if (typeof data.faqs === 'string') {
      data.faqs = JSON.parse(data.faqs);
    }
    if (req.file) {
      data.image = await uploadImage(req.file.path);
    }

    area = await PracticeArea.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: area });
  } catch (error) {
    next(error);
  }
};

export const deletePracticeArea = async (req, res, next) => {
  try {
    const area = await PracticeArea.findById(req.params.id);
    if (!area) {
      return res.status(404).json({ success: false, message: 'Practice Area not found' });
    }
    await PracticeArea.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Practice Area deleted successfully' });
  } catch (error) {
    next(error);
  }
};
