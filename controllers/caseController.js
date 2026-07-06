import Case from '../models/Case.js';
import { uploadImage } from '../services/cloudinary.js';

export const getCases = async (req, res, next) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    next(error);
  }
};

export const createCase = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = await uploadImage(req.file.path);
    }
    const newCase = await Case.create(data);
    res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    next(error);
  }
};

export const updateCase = async (req, res, next) => {
  try {
    let checkCase = await Case.findById(req.params.id);
    if (!checkCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const data = { ...req.body };
    if (req.file) {
      data.image = await uploadImage(req.file.path);
    }

    checkCase = await Case.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: checkCase });
  } catch (error) {
    next(error);
  }
};

export const deleteCase = async (req, res, next) => {
  try {
    const checkCase = await Case.findById(req.params.id);
    if (!checkCase) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }
    await Case.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Case deleted successfully' });
  } catch (error) {
    next(error);
  }
};
