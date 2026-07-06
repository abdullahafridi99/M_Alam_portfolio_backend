import Setting from '../models/Setting.js';
import { uploadImage } from '../services/cloudinary.js';

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await Setting.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    const updateData = { ...req.body };

    // Handle files if uploaded
    if (req.files) {
      if (req.files.heroImage && req.files.heroImage[0]) {
        updateData.heroImage = await uploadImage(req.files.heroImage[0].path);
      }
      if (req.files.cvUrl && req.files.cvUrl[0]) {
        // CV can be uploaded to Cloudinary/local just like an image or static file
        updateData.cvUrl = await uploadImage(req.files.cvUrl[0].path);
      }
    }

    // Map nested socialLinks if they exist in body
    if (req.body.linkedin || req.body.twitter || req.body.facebook) {
      updateData.socialLinks = {
        linkedin: req.body.linkedin || settings.socialLinks.linkedin,
        twitter: req.body.twitter || settings.socialLinks.twitter,
        facebook: req.body.facebook || settings.socialLinks.facebook,
      };
    }

    settings = await Setting.findByIdAndUpdate(settings._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
